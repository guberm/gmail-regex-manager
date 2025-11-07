#!/usr/bin/env node
/**
 * Test harness for Gmail Regex Rules Manager.
 * Allows evaluating rule definitions against sample emails outside the extension UI.
 *
 * Usage:
 *   node scripts/test-rules.js --rules examples/rules-sample.json --emails examples/emails-sample.json
 *   node scripts/test-rules.js --rules examples/rules-sample.json --email '{"from":"a@b.com","subject":"Invoice 123"}'
 *
 * Options:
 *   --rules <path>   JSON file containing an array of rule objects (same shape as extension storage)
 *   --emails <path>  JSON file containing an array of email objects {from,to,subject,body}
 *   --email <json>   Single inline email JSON (overrides --emails if provided)
 *   --compact        Output compact match summary only
 *
 * Exit codes:
 *   0 success
 *   1 bad arguments / file missing / parse error
 */
const fs = require('fs');

function parseArgs(argv){
  const args={};
  for(let i=2;i<argv.length;i++){
    const a=argv[i];
    if(a.startsWith('--')){
      const key=a.replace(/^--/,'');
      if(['compact'].includes(key)){ args[key]=true; continue; }
      const val=argv[i+1];
      if(!val || val.startsWith('--')){ console.error(`Missing value for ${a}`); process.exit(1);} 
      args[key]=val; i++; 
    }
  }
  return args;
}

const args=parseArgs(process.argv);
if(!args.rules){ console.error('Missing --rules <path>'); process.exit(1); }

function readJson(path){
  try { return JSON.parse(fs.readFileSync(path,'utf8')); } catch(e){
    console.error('Failed reading',path, e.message); process.exit(1);
  }
}

const rules=readJson(args.rules);
if(!Array.isArray(rules)) { console.error('Rules file must contain an array'); process.exit(1); }

let emails=[];
if(args.email){
  try { emails=[JSON.parse(args.email)]; } catch(e){ console.error('Failed to parse --email JSON', e.message); process.exit(1);} 
} else if(args.emails){
  const tmp=readJson(args.emails); if(!Array.isArray(tmp)){ console.error('Emails file must contain an array'); process.exit(1);} emails=tmp; 
} else {
  console.error('Provide --emails <file> or --email <json>'); process.exit(1);
}

// Matching logic (mirrors background.js matchesRule)
function matchesRule(email, rule){
  try {
    const patterns = {
      from: rule.fromPattern ? new RegExp(rule.fromPattern,'i') : null,
      to: rule.toPattern ? new RegExp(rule.toPattern,'i') : null,
      subject: rule.subjectPattern ? new RegExp(rule.subjectPattern,'i') : null,
      body: rule.bodyPattern ? new RegExp(rule.bodyPattern,'i') : null
    };
    if(patterns.from && !patterns.from.test(email.from||'')) return false;
    if(patterns.to && !patterns.to.test(email.to||'')) return false;
    if(patterns.subject && !patterns.subject.test(email.subject||'')) return false;
    if(patterns.body && !patterns.body.test(email.body||email.snippet||'')) return false;
    return true;
  } catch(e){ return false; }
}

function summarizeActions(actions={}){
  const out=[];
  if(actions.addLabels?.length) out.push('Add:'+actions.addLabels.join(','));
  if(actions.removeLabels?.length) out.push('Remove:'+actions.removeLabels.join(','));
  ['markAsRead','markAsImportant','star','archive','trash'].forEach(flag=>{ if(actions[flag]) out.push(flag); });
  return out.join('; ');
}

const results=[];
for(const email of emails){
  const matched=[];
  for(const rule of rules){
    if(rule.enabled===false) continue;
    if(matchesRule(email, rule)){
      matched.push({rule, actions: summarizeActions(rule.actions)});
    }
  }
  results.push({email, matched});
}

if(args.compact){
  for(const r of results){
    const id=(r.email.subject||r.email.from||'email').slice(0,60);
    console.log(`Email: ${id}`);
    if(r.matched.length===0) console.log('  (no matches)');
    else r.matched.forEach(m=> console.log(`  - ${m.rule.name}: ${m.actions}`));
  }
} else {
  console.log(JSON.stringify(results,null,2));
}

console.error(`Processed ${emails.length} email(s); ${results.reduce((a,r)=>a+r.matched.length,0)} total rule matches.`);
