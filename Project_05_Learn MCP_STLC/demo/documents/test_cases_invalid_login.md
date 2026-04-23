# Test Cases: VWO Negative Login Flow

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Author** | Antigravity AI |
| **Date** | 2026-04-20 |
| **Total Test Cases** | 5 |

---

## Test Case Format

Each test case follows this structure:

| Field | Description |
|-------|-------------|
| **TC ID** | Unique identifier (TC-001, TC-002, ...) |
| **Title** | Brief description of what is tested |
| **Preconditions** | What must be true before the test |
| **Steps** | Step-by-step instructions |
| **Expected Result** | What should happen |
| **Priority** | High / Medium / Low |
| **Category** | Smoke / Functional / Negative |
| **Spec File** | Corresponding Playwright spec file |

---

## Test Cases

### 1. TC-001: Invalid Dummy Credentials Login
| Field | Description |
|-------|-------------|
| **TC ID** | TC-001 |
| **Title** | Verify login fails with an unregistered dummy email and password |
| **Preconditions** | User is on the VWO Login page (`https://app.vwo.com/#/login`) |
| **Steps** | 1. Locate the "Work Email" input field (`#login-username`).<br>2. Enter a dummy email (e.g., `invaliduser123@dummy.com`).<br>3. Locate the "Password" input field (`#login-password`).<br>4. Enter a dummy password (e.g., `NotRealPassword!123`).<br>5. Click on the "Sign in" button (`#js-login-btn`). |
| **Expected Result** | An error notification should be displayed indicating incorrect credentials. The user should not be logged in. |
| **Priority** | High |
| **Category** | Negative |
| **Spec File** | `vwo_login_negative.spec.ts` |

### 2. TC-002: Blank Fields Submission
| Field | Description |
|-------|-------------|
| **TC ID** | TC-002 |
| **Title** | Verify login fails when both email and password fields are left blank |
| **Preconditions** | User is on the VWO Login page (`https://app.vwo.com/#/login`) |
| **Steps** | 1. Leave the "Work Email" input field blank.<br>2. Leave the "Password" input field blank.<br>3. Click on the "Sign in" button. |
| **Expected Result** | Validation errors should appear on the UI (e.g., "Please enter your email", "Please enter your password"). The form should not be submitted. |
| **Priority** | High |
| **Category** | Negative |
| **Spec File** | `vwo_login_negative.spec.ts` |

### 3. TC-003: Valid Email but Invalid Password
| Field | Description |
|-------|-------------|
| **TC ID** | TC-003 |
| **Title** | Verify login fails when a valid email format is provided but the password is incorrect |
| **Preconditions** | User is on the VWO Login page (`https://app.vwo.com/#/login`) |
| **Steps** | 1. Enter a valid formatted email address (e.g., `contact@vwo.com`).<br>2. Enter an incorrect password that does not match the account.<br>3. Click on the "Sign in" button. |
| **Expected Result** | Authentication should be rejected by the server, and a clear error message regarding incorrect credentials or account details should be returned. |
| **Priority** | High |
| **Category** | Negative |
| **Spec File** | `vwo_login_negative.spec.ts` |

### 4. TC-004: Invalid Login with Arabic Characters
| Field | Description |
|-------|-------------|
| **TC ID** | TC-004 |
| **Title** | Verify login handles and rejects Arabic characters in the email field |
| **Preconditions** | User is on the VWO Login page (`https://app.vwo.com/#/login`) |
| **Steps** | 1. Enter an email string containing Arabic characters (e.g., `مرحبا@domain.com` or `test@موقع.com`).<br>2. Enter a standard valid or dummy password.<br>3. Click on the "Sign in" button. |
| **Expected Result** | The application should elegantly handle the unsupported format. An inline validation error (e.g., "Please enter a valid email address") should occur, or the server should reject the request gracefully. |
| **Priority** | Medium |
| **Category** | Negative |
| **Spec File** | `vwo_login_negative.spec.ts` |

### 5. TC-005: Invalid Login with Chinese Characters
| Field | Description |
|-------|-------------|
| **TC ID** | TC-005 |
| **Title** | Verify login handles and rejects Chinese characters in the email/password fields |
| **Preconditions** | User is on the VWO Login page (`https://app.vwo.com/#/login`) |
| **Steps** | 1. Enter an email string using Chinese characters (e.g., `測試@domain.com`).<br>2. Enter a dummy password using standard or Chinese characters (e.g., `密碼123`).<br>3. Click on the "Sign in" button. |
| **Expected Result** | Similar to TC-004, an inline format validation error should appear indicating the email format is invalid, preventing form submission. Alternatively, the server should process and reject the login cleanly. |
| **Priority** | Medium |
| **Category** | Negative |
| **Spec File** | `vwo_login_negative.spec.ts` |

---

## Summary

| Priority | Count |
|----------|-------|
| High | 3 |
| Medium | 2 |
| Low | 0 |
| **Total** | **5** |

| Category | Count |
|----------|-------|
| Smoke | 0 |
| Functional | 0 |
| Negative | 5 |
