# Contributing to Gmail Regex Rules Manager

Thanks for your interest in contributing! This project helps automate Gmail organization using regex-based rules.

## Ways to Contribute
- Report bugs via GitHub Issues
- Suggest enhancements / new rule actions
- Improve documentation (README, examples)
- Add tests (planned future test harness)

## Getting Started
1. Fork the repo
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/short-description`
4. Make your changes (follow style guidelines below)
5. Commit with a conventional message (see below)
6. Push and open a Pull Request (PR)

## Issue Guidelines
Before filing:
- Search existing issues
- Provide clear reproduction steps if bug
- Include screenshots for UI problems
- Label suggestions with `enhancement`

## Pull Request Checklist
- Description of change & motivation
- Screenshots if UI affected
- Updated docs if behavior changes
- No unrelated formatting changes

## Commit Message Convention
Use Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `chore:` repo maintenance
- `refactor:` code change without behavior change
- `perf:` performance improvement
- `test:` adding or fixing tests

Example: `feat: add rule testing panel`

## Coding Style
- JavaScript: prefer modern ES features supported by Chrome
- Keep functions small and focused
- Use descriptive variable names
- Avoid introducing a build step unless necessary

## Icons & Assets
If changing icons, regenerate PNGs using `icons/generate-png.ps1` and ensure manifest references correct files.

## Security & Privacy
- Do not log sensitive email content
- Avoid storing OAuth tokens beyond what Chrome identity API manages

## Release Process
1. Merge PRs
2. Update version in `manifest.json` and `package.json` when feature-level changes occur
3. Tag release: `git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z`

## Questions?
Open a discussion or issue. Thanks for helping make Gmail management better!
