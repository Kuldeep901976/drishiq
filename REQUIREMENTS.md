# DrishiQ Requirements (Updated)

## Invitation Flow (2025-07-11)

### 1. Invitation Request
- User fills out the invitation form (name, email, country code + phone, language, location, terms).
- **Video field is removed.**
- **Phone number is split into country code dropdown and number input.**

### 2. Phone Authentication
- After submitting the form, user must verify their phone number via OTP (SMS).
- Only after successful OTP verification does the process continue.

### 3. Invitation Email
- After phone verification, generate a unique invitation token.
- Store the invitation in the database with the token and mark as "pending" or "sent".
- Send an email to the user with an invitation link:
  - `https://yourdomain.com/invite/accept?token=UNIQUE_TOKEN`

### 4. Invitation Acceptance
- When the user clicks the invitation link, they are taken to `/invite/accept`.
- The page verifies the token.
- If valid, the user is redirected to the sign-in page (optionally pre-filling their email or auto-signing in).

### 5. Additional Notes
- The country code dropdown uses an exhaustive, alphabetically sorted list of all countries and their calling codes.
- All major CTAs on the home page now lead to the invitation page, except for "Support us" (which leads to the support section on the pricing page), "Read more blog articles" (which leads to the blog), and "Want to share it" (which leads to testimonials).

---

*Last updated: 2025-07-11* 