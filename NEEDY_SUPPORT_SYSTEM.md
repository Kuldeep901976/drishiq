# Needy Support System

## Overview

The Needy Support System is a comprehensive solution that links support credits from donors/supporters to needy individuals, enabling the platform to send invitations (investment management, stories, testimonials) to those in need using allocated support credits.

## Key Features

### 1. Needy Individual Management
- **Comprehensive Profiles**: Track detailed information about needy individuals including demographics, financial status, and support needs
- **Priority Scoring**: Automatic calculation of priority scores based on urgency, income level, employment status, and education
- **Status Tracking**: Monitor individuals through various stages (active, contacted, enrolled, completed)
- **Verification System**: Mark individuals as verified with admin oversight

### 2. Support Credit Allocations
- **Credit Pooling**: Supporters can allocate credits to specific needy individuals
- **Purpose-Based Allocation**: Credits can be allocated for general use or specific purposes (education, healthcare, employment, housing)
- **Invitation Type Restrictions**: Limit credit usage to specific invitation types
- **Validity Management**: Set expiration dates for credit allocations
- **FIFO Credit Usage**: Credits are consumed in first-in-first-out order

### 3. Invitation Request System
- **Automated Processing**: Needy individuals can request invitations based on their needs
- **Credit Verification**: System checks for available support credits before processing
- **Priority Queue**: Requests are processed based on urgency and priority scores
- **Admin Oversight**: Admins can review and manually process requests

### 4. Bulk Upload Functionality
- **CSV Import**: Upload large numbers of needy individuals via CSV files
- **Template Download**: Pre-formatted CSV template with all required fields
- **Error Handling**: Detailed error reporting for failed imports
- **Progress Tracking**: Real-time upload status and completion reporting

### 5. Admin Integration
- **Unified Dashboard**: Integrated into the main invitation management system
- **Cross-Platform Access**: Available from all invitation type management pages
- **Real-time Updates**: Automatic refresh of invitation lists after sending from support credits

## Database Schema

### Core Tables

#### `needy_individuals`
- Comprehensive profile information
- Demographics, financial status, support needs
- Priority scoring and verification status
- Contact preferences and location data

#### `support_credit_allocations`
- Links supporters to needy individuals
- Credit amounts and usage tracking
- Purpose and restriction management
- Validity and expiration handling

#### `support_credit_transactions`
- Detailed transaction history
- Credit usage tracking
- Invitation linkage
- Audit trail for all credit movements

#### `needy_invitation_requests`
- Request management system
- Priority and status tracking
- Credit allocation linkage
- Processing history

#### `needy_bulk_uploads`
- Upload tracking and management
- Progress monitoring
- Error collection and reporting

## API Endpoints

### Main Needy Support API
- `GET /api/admin/needy-support?action=stats` - Get system statistics
- `GET /api/admin/needy-support?action=supporter-impact` - Get supporter impact data
- `GET /api/admin/needy-support?action=needy-list` - List needy individuals with filters
- `POST /api/admin/needy-support` - CRUD operations for needy individuals and allocations

### Bulk Upload API
- `POST /api/admin/needy-support/bulk-upload` - Upload CSV file
- `GET /api/admin/needy-support/bulk-upload?action=status&uploadId=...` - Get upload status
- `GET /api/admin/needy-support/bulk-upload?action=errors&uploadId=...` - Get upload errors

## Admin Interface

### Needy Support Dashboard (`/admin/needy-support`)
- **Overview Tab**: System statistics and key metrics
- **Needy Individuals Tab**: Manage individual profiles with search and filters
- **Credit Allocations Tab**: View and manage support credit allocations
- **Invitation Requests Tab**: Process pending invitation requests
- **Bulk Upload Tab**: Upload CSV files with template download

### Integration with Invitation Management
- **Investment Management**: Send investment invitations from support credits
- **Story Invitations**: Send story invitations from support credits
- **Testimonial Invitations**: Send testimonial invitations from support credits

## Usage Workflow

### 1. Adding Needy Individuals
**Option A: Manual Entry**
1. Navigate to `/admin/needy-support`
2. Go to "Needy Individuals" tab
3. Click "Add New Individual"
4. Fill in required information
5. Save the profile

**Option B: Bulk Upload**
1. Download the CSV template from the bulk upload page
2. Fill in the template with needy individual data
3. Upload the completed CSV file
4. Review any errors and fix if needed
5. Confirm successful upload

### 2. Allocating Support Credits
1. Navigate to a needy individual's profile
2. Click "Allocate Credits"
3. Select supporter and credit amount
4. Set purpose and restrictions
5. Set validity period
6. Save allocation

### 3. Sending Invitations from Support Credits
1. Navigate to any invitation management page (investment, stories, testimonials)
2. Click "Send from Support Credits" button
3. Select eligible needy individuals (those with available credits)
4. Choose invitation type
5. Review and confirm
6. System automatically processes and sends invitations

### 4. Processing Invitation Requests
1. Navigate to "Invitation Requests" tab
2. Review pending requests
3. Check available credits for each request
4. Approve or reject requests
5. System automatically sends invitations for approved requests

## CSV Template Fields

| Field | Required | Description | Valid Values |
|-------|----------|-------------|--------------|
| full_name | Yes | Full name of the individual | Any text |
| email | No | Email address | Valid email format |
| phone | No | Phone number | Any text |
| age | No | Age in years | 1-120 |
| gender | No | Gender identity | male, female, other, prefer_not_to_say |
| country | No | Country name | Any text |
| state | No | State/province | Any text |
| city | No | City name | Any text |
| postal_code | No | Postal/ZIP code | Any text |
| language | No | Preferred language | en, es, fr, etc. |
| income_level | No | Income category | very_low, low, medium, high, very_high |
| employment_status | No | Employment status | unemployed, part_time, full_time, student, retired, disabled |
| education_level | No | Education level | none, primary, secondary, bachelor, master, phd |
| support_needs | No | Support needs | Semicolon-separated: education;healthcare;employment;housing |
| preferred_invitation_types | No | Preferred invitations | Semicolon-separated: investment_management;story;testimonial |
| urgency_level | No | Urgency level | low, medium, high, critical |
| contact_preference | No | Contact method | email, phone, sms, whatsapp |
| contact_time | No | Preferred contact time | morning, afternoon, evening, anytime |
| notes | No | Additional notes | Any text |

## Priority Scoring Algorithm

The system automatically calculates priority scores based on:

1. **Urgency Level** (0-100 points)
   - Critical: 100 points
   - High: 75 points
   - Medium: 50 points
   - Low: 25 points

2. **Income Level** (0-50 points)
   - Very Low: 50 points
   - Low: 40 points
   - Medium: 30 points
   - High: 20 points
   - Very High: 10 points

3. **Employment Status** (0-35 points)
   - Unemployed: 35 points
   - Disabled: 35 points
   - Student: 25 points
   - Part-time: 20 points
   - Retired: 15 points
   - Full-time: 10 points

4. **Education Level** (0-40 points)
   - None: 40 points
   - Primary: 30 points
   - Secondary: 20 points
   - Bachelor: 10 points
   - Master: 5 points
   - PhD: 0 points

5. **Bonus Points**
   - Verified individual: +10 points
   - Recent activity (within 30 days): +15 points

## Security and Access Control

- **Admin-only Access**: All needy support functionality requires admin privileges
- **Row Level Security**: Database-level security policies protect sensitive data
- **Audit Trail**: All credit transactions and admin actions are logged
- **Input Validation**: Comprehensive validation for all user inputs
- **File Upload Security**: File type and size restrictions for CSV uploads

## Monitoring and Reporting

### Key Metrics
- Total needy individuals
- Active needy individuals
- Total credit allocations
- Credits allocated vs. used
- Pending invitation requests
- Supporter impact statistics

### Views and Reports
- `needy_support_summary`: Comprehensive summary of all needy individuals
- `supporter_impact_summary`: Impact metrics for supporters
- Credit transaction history
- Bulk upload status and error reports

## Future Enhancements

1. **Automated Matching**: AI-powered matching of needy individuals with appropriate supporters
2. **Mobile App**: Mobile interface for field workers to add needy individuals
3. **Integration APIs**: APIs for third-party organizations to submit needy individuals
4. **Advanced Analytics**: Detailed analytics and reporting dashboard
5. **Multi-language Support**: Full internationalization support
6. **SMS Integration**: Direct SMS notifications for needy individuals
7. **Geographic Mapping**: Visual mapping of needy individuals by location

## Support and Maintenance

### Regular Tasks
- Monitor credit expiration dates
- Review and process pending requests
- Validate and verify needy individual data
- Clean up expired or invalid records
- Generate monthly impact reports

### Troubleshooting
- Check credit allocation balances
- Verify needy individual status
- Review bulk upload errors
- Monitor system performance
- Audit transaction logs

This system provides a comprehensive solution for managing support credit allocations and ensuring that invitations reach those who need them most, while maintaining full transparency and accountability throughout the process. 