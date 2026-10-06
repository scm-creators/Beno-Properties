# Beno Properties Security Specification

## 1. Data Invariants
1. **User Identity & Isolation**: A user can only write to their own profile document (`/users/{userId}`) where `userId == request.auth.uid`. A non-admin cannot alter another user's profile.
2. **Verified Accounts**: Non-anonymous write operations require `request.auth.token.email_verified == true`.
3. **Role Elevation Prevention**: Regular users cannot elevate their role to `admin` or modify sensitive role fields unless authorized.
4. **Bootstrapped Admin**: The administrator account `strcoderecords@gmail.com` and records in `/admins/{adminId}` hold administrative permissions.
5. **Property Catalog Integrity**: Properties in `/properties/{propertyId}` are readable by all users (public catalog). They can only be created or modified by authenticated verified agents or admins.
6. **Appointment Integrity**: Appointments can only be booked/modified by the client involved (`clientId == request.auth.uid`), the assigned agent (`agentId == request.auth.uid`), or an admin.
7. **Client Invitation Isolation**: Invitations can only be created/managed by agents or admins, or marked as accepted by the intended recipient.
8. **Inquiries / Leads Guard**: Leads can be created by any authenticated or public user submitting an inquiry, but can only be updated/read by assigned agents, admins, or the submitting user.
9. **Tenant Application Privacy**: Tenant applications contain sensitive PII / financial disclosures; they are strictly readable only by the applicant, the assigned agent, or an admin.
10. **Test Connection Path**: `/test/{testId}` is open for connection probing read by authenticated or public clients.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Identity Spoofing in User Profile)**: Authenticated user A attempts to write to `/users/{userB}` with `request.auth.uid = userA`. Expected: PERMISSION_DENIED.
2. **Payload 2 (Unverified Email Write)**: Attacker attempts to create a property listing with `email_verified = false`. Expected: PERMISSION_DENIED.
3. **Payload 3 (Self-Promotion to Admin)**: Client user attempts to update their own `role` from `"client"` to `"admin"`. Expected: PERMISSION_DENIED.
4. **Payload 4 (Ghost Field Injection / Shadow Update)**: Client attempts to update their user profile with extra unallowed fields like `{ "isSystemAdmin": true }`. Expected: PERMISSION_DENIED.
5. **Payload 5 (ID Poisoning Attack)**: Attacker attempts to create a document with a 2KB junk character ID `users/{junk_id_1000_chars}`. Expected: PERMISSION_DENIED.
6. **Payload 6 (Client Overwriting Agent Appointment)**: Client A attempts to change the assigned agent or client ID on an appointment owned by Client B. Expected: PERMISSION_DENIED.
7. **Payload 7 (Arbitrary Property Deletion)**: Regular client attempts to delete a luxury property listing `/properties/BENO-1024`. Expected: PERMISSION_DENIED.
8. **Payload 8 (Tenant Application PII Snooping)**: Unrelated user C attempts to read `/tenantApplications/TAPP-2026-001` belonging to User A. Expected: PERMISSION_DENIED.
9. **Payload 9 (Client Invitation Hijack)**: Regular user attempts to forge a client invitation from an agent with a malicious target link. Expected: PERMISSION_DENIED.
10. **Payload 10 (Admin Collection Write)**: Non-admin user attempts to write into `/admins/{attackerUid}` to grant themselves admin privileges. Expected: PERMISSION_DENIED.
11. **Payload 11 (Oversized Field / Denial of Wallet)**: Attacker submits an inquiry with a 500,000 character string in `notes`. Expected: PERMISSION_DENIED.
12. **Payload 12 (Blanket List Query Scraping)**: Unauthenticated scraper attempts to dump all `/users` or `/tenantApplications` documents. Expected: PERMISSION_DENIED.

## 3. Test Runner Invariant Checks
All 12 dirty payloads are guarded by strict boolean functions, `isValidId`, `hasOnly` key constraints, `.size()` checks, `email_verified` validation, and role-based / ownership checks.
