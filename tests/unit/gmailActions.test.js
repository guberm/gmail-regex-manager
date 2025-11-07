// Tests for gmailActions.js retry + label fetching logic
const { readFileSync } = require('fs');
const path = require('path');

// Load source by evaluating in a VM-like scope to extract functions attached to self
let applyRuleActions, retryFetch, getLabelIds, createLabel;

beforeAll(() => {
  const code = readFileSync(path.join(__dirname, '../../gmailActions.js'), 'utf8');
  const sandbox = { self: {} , fetch: jest.fn() };
  // rudimentary eval (no require inside gmailActions.js)
  const fn = new Function('self','fetch', code + '\nreturn { applyRuleActions, retryFetch, getLabelIds, createLabel };');
  const exported = fn(sandbox.self, sandbox.fetch);
  applyRuleActions = exported.applyRuleActions;
  retryFetch = exported.retryFetch;
  getLabelIds = exported.getLabelIds;
  createLabel = exported.createLabel;
});

describe('retryFetch', () => {
  test('retries on 500 and succeeds', async () => {
    const responses = [ { ok:false, status:500 }, { ok:true, status:200, json: async () => ({}) } ];
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(responses[0])
      .mockResolvedValueOnce(responses[1]);
    const res = await retryFetch('https://example.com', {}, 2, fetchMock);
    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  test('fails after max attempts', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok:false, status:500 });
    await expect(retryFetch('https://example.com', {}, 2, fetchMock)).rejects.toThrow('Server error 500');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('getLabelIds', () => {
  test('returns existing label ids', async () => {
    const labels = [{ id:'LBL1', name:'Alpha' }, { id:'LBL2', name:'Beta' }];
    const fetchMock = jest.fn().mockResolvedValue({ ok:true, json: async () => ({ labels }) });
    const result = await getLabelIds(['Alpha'], 'token', fetchMock);
    expect(result).toEqual(['LBL1']);
  });
  test('creates missing label', async () => {
    const labels = [{ id:'LBL1', name:'Alpha' }];
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({ ok:true, json: async () => ({ labels }) }) // initial list
      .mockResolvedValueOnce({ ok:true, json: async () => ({ id:'NEW', name:'Beta' }) }); // creation
    const result = await getLabelIds(['Beta'], 'token', fetchMock);
    expect(result).toEqual(['NEW']);
  });
});
