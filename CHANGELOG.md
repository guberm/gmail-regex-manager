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

## v1.1.0 - 2025-11-07

### Added
- **Settings Controls**: Configurable processing interval (1-60 min) and performance retention (5-500 entries)
- **Live Regex Helper**: Real-time pattern testing with visual feedback in Create Rule tab
- **Rule Ordering**: Drag & drop rules to set priority/execution order
- **Per-Rule Statistics**: Track match count and last matched timestamp for each rule
- **Keyboard Shortcuts**: Ctrl+N (new rule), Ctrl+T (test), Ctrl+S (save), Esc (cancel)
- **Copy Stats**: Export performance metrics to clipboard (tab-separated format)
- **Structured Logging**: Adjustable log levels (error/warn/info/debug)
- **Retry Logic**: Exponential backoff for Gmail API calls (resilience)
- **Comprehensive Tests**: Jest tests for regex helper, performance tracking, and retry logic
- **CI Pipeline**: Automated testing and linting on push/PR
- **ESLint**: Code quality enforcement
- **Visual Polish**: Tooltips, animations, enhanced styling for better UX
- **Example Rules**: Comprehensive rules file with 10 common patterns
- **Quick Start Guide**: Step-by-step getting started documentation

### Changed
- Modularized codebase: extracted gmailActions.js, perf.js, logger.js, rules.js
- Dynamic alarm rescheduling based on interval setting
- Settings stored in structured object with persistence
- Performance retention now configurable (was fixed at 50)
- Moved tests from __tests__/ to tests/unit/ (Chrome extension compatibility)

### Fixed
- Resolved Chrome extension loader issue with test directory naming
- Fixed test mocking for browser globals (self, console)
- Improved error handling in Gmail API operations

### Documentation
- Updated README with all new features
- Added QUICKSTART.md for faster onboarding
- Added examples/rules-comprehensive.json
- Enhanced inline tooltips and help text

[v1.1.0]: https://github.com/guberm/gmail-regex-manager/releases/tag/v1.1.0
