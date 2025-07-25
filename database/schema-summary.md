# Database Schema Summary: Invitations Table

This summary is based on the latest migration files in `supabase/migrations/`.

## Table: Invitations

| Column Name           | Data Type                | Nullable | Default     | Description                                      |
|----------------------|-------------------------|----------|-------------|--------------------------------------------------|
| id                   | UUID (Primary Key)      | No       | gen_random_uuid() | Unique identifier for each invitation           |
| name                 | TEXT                    | No       |             | Name of the invitee                              |
| email                | TEXT                    | No       |             | Email address of the invitee                     |
| phone                | TEXT                    | Yes      |             | Phone number of the invitee                      |
| language             | TEXT                    | Yes      |             | Preferred language                               |
| location             | TEXT                    | Yes      |             | City, state, or country                          |
| invitation_category  | TEXT                    | Yes      |             | Type of invitation: Trial access or Need Support |
| domain_of_life       | TEXT                    | Yes      |             | Domain of life selected by user                  |
| type_of_challenge    | TEXT                    | Yes      |             | Type of challenge within the domain              |
| specific_issue       | TEXT                    | Yes      |             | Specific issue within the challenge type         |
| challenge_description| TEXT                    | Yes      |             | User description of their biggest challenge (required for need_support, optional for trial_access) |
| challenge            | TEXT                    | Yes      |             | (Legacy/other challenge field)                   |
| share_challenge      | TEXT                    | Yes      |             | Free text challenge field                        |
| invitation_type      | TEXT                    | Yes      | 'general'   | Invitation type (e.g., regular, trial, needy)    |
| category             | invitation_category     | Yes      | 'general'   | Invitation category: general (Trial Access), need_support, testimonial |
| metadata             | JSONB                   | Yes      | '{}'        | Additional form data and context                 |
| token                | TEXT (Unique)           | Yes      |             | Unique invitation token for access               |
| expires_at           | TIMESTAMP WITH TIME ZONE| Yes      |             | Invitation expiration timestamp                  |
| created_by           | UUID                    | Yes      |             | User who created the invitation                  |
| created_at           | TIMESTAMP WITH TIME ZONE| No       | now()        | Creation timestamp                               |
| updated_at           | TIMESTAMP WITH TIME ZONE| No       | now()        | Last update timestamp                            |
| status               | TEXT                    | Yes      |             | Status of the invitation                         |
| country_code         | TEXT                    | Yes      | '+91'       | Country code for phone number                    |

---

**Note:**
- Some fields may be optional or only required for certain invitation types (e.g., `challenge_description` is required for "need support" but optional for "trial access").
- For full details, see the migration files in `supabase/migrations/`. 