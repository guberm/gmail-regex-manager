# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0] - 2025-11-07
### Added
- Initial public release of Gmail Regex Rules Manager
- Core rule engine (regex matching for from, to, subject, body snippet)
- Actions: label add/remove, mark read/unread, star, archive, importance toggle, trash
- OAuth2 integration (placeholder client ID)
- Popup UI for creating/testing/enabling rules
- Background service worker for processing emails
- SVG and PNG icons with generation script
- GitHub Actions workflow for manifest & icon validation
- Documentation: README, SETUP, TROUBLESHOOTING, EXAMPLES
- LICENSE (MIT), CONTRIBUTING guidelines

### Notes
- Body matching currently uses snippet not full message payload
- Performance tuned for <= 100 rules

[v1.0.0]: https://github.com/guberm/gmail-regex-manager/releases/tag/v1.0.0
