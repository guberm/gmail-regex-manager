# Security Policy

## Reporting a Vulnerability
If you discover a security vulnerability in Gmail Regex Rules Manager:

1. Do NOT open a public issue describing the vulnerability in detail.
2. Email Michael Guber (GitHub: @guberm) with:
   - Description of the issue
   - Steps to reproduce
   - Potential impact
   - Suggested remediation (if any)
3. Allow up to 7 days for initial acknowledgement.

## Scope
Security concerns specific to:
- Unauthorized Gmail actions or label manipulation
- Leaking OAuth tokens
- Exposing private email content

Out of scope:
- General regex performance issues
- Gmail API rate limiting

## Handling
Valid reports will be reviewed and fixed promptly; a patched release will be tagged and noted in the `CHANGELOG.md`.

## Best Practices for Users
- Revoke extension access if no longer used (Google Account settings)
- Avoid creating extremely broad destructive rules (e.g., trashing all emails)
- Keep Chrome updated for latest security patches
