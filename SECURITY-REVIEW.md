# Security Review

**Date:** 2026-10-10  
**Scope:** Admin authentication and authorization for publication/news management  
**Status:** Findings documented; fixes have not been applied.

## Findings

### HIGH — Forged admin session and hard-coded admin credential

**Affected files:**

- `app/actions.ts` (lines 11–12, 26–27, 55–56, 84–85)
- `middleware.ts` (lines 5–9)

The admin password is hard-coded in the server actions. On successful login, the
application sets the `admin_session` cookie to a fixed, predictable value.
Middleware and mutating server actions authorize requests by comparing the
cookie against that same value, without validating a signature or checking a
server-side session.

An unauthenticated visitor can set the expected cookie value themselves and
gain admin access. The affected actions allow the visitor to add or delete
publications and news. Changing or hashing the hard-coded password alone would
not address the forgeable-session issue.

**Recommended remediation:**

1. Remove the hard-coded password. Load the administrator credential from a
   protected environment secret, and store/verify it with a password-hashing
   algorithm such as Argon2id or bcrypt.
2. Replace the predictable cookie with a cryptographically secure session:
   use an opaque random token backed by server-side session storage, or a
   correctly signed and validated session token.
3. Validate the session in every mutating server action as well as middleware.
   Set cookies with `HttpOnly`, `Secure` in production, and an appropriate
   `SameSite` policy; expire and rotate sessions safely.

**Confidence:** 10/10
