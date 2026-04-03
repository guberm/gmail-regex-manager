# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

## v1.3.0 - 2026-04-03

### Added

- **Side panel**: Extension now opens as a Chrome side panel instead of a popup — stays open while you browse Gmail
- **Gmail API email fetching**: Replaced fragile DOM-based email extraction with direct Gmail API calls — correct message IDs, accurate headers, works even when Gmail is not the active tab
- **▶ Run Now button**: Manually trigger a rule check instantly from the panel header without waiting for the next alarm
- **Log tab**: Persistent activity log (up to 300 entries) showing every check, rule match, API result, and error — color-coded by severity with Refresh/Clear controls
- **Label autocomplete**: Clicking "Add Labels" or "Remove Labels" now fetches your existing Gmail labels and shows a filtered dropdown as you type
- **Create label from UI**: Typing a label that doesn't exist shows a "+ Create" option; confirming opens a dialog that creates the label in Gmail immediately, with an option to make it a sub-label of an existing one
- **Apply to already-read emails** (per rule): New checkbox on each rule — when enabled, the rule scans the last 30 days of inbox mail (not just new arrivals) and uses per-rule dedup to avoid re-labeling

### Fixed

- **Critical: helper scripts never loaded** — `logger.js`, `perf.js`, and `gmailActions.js` were not imported into the service worker via `importScripts()`, so logging, performance tracking, and all rule actions silently did nothing
- **Emails skipped when already read** — query was filtered to `is:unread`; switched to time-windowed fetch (`after:lastChecked`) so rules apply regardless of read status
- **Wrong message IDs** — DOM extraction used `data-thread-id` (a thread ID) instead of a real message ID, causing Gmail API `modify` calls to silently fail

### Changed

- `content.js` simplified to only detect inbox row count changes and signal the background; all email data is now fetched via Gmail API in the background worker

## v1.2.0 - 2026-04-03

### Added

- **In-popup OAuth setup**: Click ⚙️ → upload the `client_secret_*.json` downloaded from Google Cloud Console — Client ID is saved automatically and used on next Sign In, no `manifest.json` editing or extension reload required

### Fixed

- Remove `export` keyword from `shortcuts.js` — caused `SyntaxError: Unexpected token 'export'` when loaded as a regular script in the popup
- Replace inline `onclick` attributes in rule list with event delegation — resolves Content Security Policy violations in Manifest V3

## v1.1.1 - 2026-04-03

### Fixed

- Remove `export` keyword from `shortcuts.js` — caused `SyntaxError: Unexpected token 'export'` when loaded as a regular script in the popup
- Replace inline `onclick` attributes in rule list with event delegation — resolves Content Security Policy violations in Manifest V3

## [v1.1.0] - 2025-11-07

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

- Modularized codebase: extracted `gmailActions.js`, `perf.js`, `logger.js`, `rules.js`
- Dynamic alarm rescheduling based on interval setting
- Settings stored in structured object with persistence
- Performance retention now configurable (was fixed at 50)
- Moved tests from `__tests__/` to `tests/unit/` (Chrome extension compatibility)

### Fixed

- Resolved Chrome extension loader issue with test directory naming
- Fixed test mocking for browser globals (self, console)
- Improved error handling in Gmail API operations

### Documentation

- Updated README with all new features
- Added QUICKSTART.md for faster onboarding
- Added `examples/rules-comprehensive.json`
- Enhanced inline tooltips and help text

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

[v1.1.0]: https://github.com/guberm/gmail-regex-manager/releases/tag/v1.1.0
[v1.0.0]: https://github.com/guberm/gmail-regex-manager/releases/tag/v1.0.0
