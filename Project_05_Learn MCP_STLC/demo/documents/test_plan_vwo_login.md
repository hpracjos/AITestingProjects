# Test Plan: VWO Login Page

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Author** | QA Team |
| **Date** | 2026-04-20 |
| **Environment** | Production (app.vwo.com) / Staging |
| **Browser** | Chrome, Firefox, Safari, Edge |

---

## 1. Introduction

This test plan describes the testing approach for **VWO Login Page (app.vwo.com)**. It outlines the scope, test strategy, resources, schedule, and deliverables for the testing effort.

## 2. Objectives

- Verify core functionality works as expected
- Identify defects before production release
- Ensure user flows are complete and error-free
- Validate UI elements and navigation

## 3. Scope

### In Scope
- Email & Password login functionality
- "Remember me" checkbox functionality
- "Forgot Password" workflow and reset email triggering
- Single Sign-On (SSO) login flow
- Sign in with Google (OAuth) flow
- Sign in with Passkey feature
- Form validations (empty fields, invalid email format, incorrect password)
- Cross-browser compatibility
- UI and layout rendering matching the design

### Out of Scope
- Post-login dashboard operations and settings
- Account creation ("Start a FREE TRIAL") backend process
- Backend database testing and database integrity

## 4. Test Strategy

### Test Approach
- **Automation Tool:** Playwright with @playwright/test
- **Test Type:** End-to-end functional testing
- **Browser:** Chrome, Firefox, Safari, Edge
- **Environment:** Production (app.vwo.com) / Staging

### Test Levels
- Smoke Testing (critical paths)
- Functional Testing (all features)
- Negative Testing (invalid inputs, error handling)

## 5. Test Environment

| Component | Details |
|-----------|---------|
| Application URL | https://app.vwo.com/#/login |
| Browser | Chrome, Firefox, Safari, Edge |
| OS | Cross-platform (Node.js) |
| Framework | Playwright v1.58+ |
| Reporter | HTML + JSON |

## 6. Entry Criteria

- Application is deployed and accessible
- Test environment is configured
- Test data is available (Valid/Invalid accounts, SSO test accounts)
- Test cases are reviewed and approved

## 7. Exit Criteria

- All planned test cases executed
- All critical/high priority defects resolved
- Test report generated and reviewed
- No open blockers

## 8. Test Cases Summary

1. **TC01_Valid_Login**: Verify successful login with valid email and password.
2. **TC02_Invalid_Login**: Verify appropriate error messages appear upon submitting invalid credentials.
3. **TC03_Empty_Fields**: Verify validation messages appear when attempting to login with empty email or password fields.
4. **TC04_Remember_Me**: Verify user session persists when "Remember me" is checked.
5. **TC05_SSO_Login**: Verify successful redirection and authentication using the "Sign in using SSO" option.
6. **TC06_Google_Login**: Verify Google OAuth flow opens and successfully authenticates using "Sign in with Google".
7. **TC07_Passkey_Login**: Verify the system prompts for biometric/passkey authentication upon selecting "Sign in with Passkey".
8. **TC08_Forgot_Password**: Verify that submitting a valid email in the "Forgot Password" section triggers a recovery email.

## 9. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Application downtime | High | Use stable test environment |
| Flaky tests (e.g. Captcha, Passkeys) | Medium | Implement proper waits, disable Captcha in staging if possible |
| Environment differences | Medium | Use consistent browser versions and data |

## 10. Schedule

| Phase | Duration |
|-------|----------|
| Test Planning | 1 day |
| Test Case Design | 1 day |
| Test Execution | 1 day |
| Defect Reporting | Ongoing |
| Test Closure | 1 day |

## 11. Deliverables

- [x] Test Plan (this document)
- [ ] Test Cases Document
- [ ] Test Execution Report (HTML)
- [ ] Defect Reports (Jira tickets)
- [ ] Test Summary Report
