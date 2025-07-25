# DrishiQ Development Rulebook

## 0. Model Initialization Protocol

### Required Initial Checks
1. Review Current State
   - Check DAILY_LOG.md for recent activities and token usage
   - Review PROGRESS.md for project status and known issues
   - Verify REQUIREMENTS.md for current specifications
   - Understand existing implementation from codebase

2. Environment Verification
   - Check for port conflicts (3000-3004)
   - Verify Next.js cache status
   - Review PWA support status
   - Check for build warnings/errors

3. Documentation Status
   - Verify latest updates in documentation files
   - Review token consumption metrics
   - Check task categorization and progress
   - Note any pending issues or blockers

4. Before Making Changes
   - Document intended changes in DAILY_LOG.md
   - Update token usage tracking
   - Verify changes align with requirements
   - Plan systematic approach to avoid rework

### Handoff Protocol
- Record all actions in DAILY_LOG.md
- Update token consumption metrics
- Document any new issues encountered
- Plan next steps for other models

## 1. Development Standards

### Code Organization
- Use Next.js 14.1.0 app router structure
- Follow component-based architecture
- Keep components modular and reusable
- Use TypeScript for type safety

### Styling Guidelines
- Maintain DrishiQ base color consistency across components
- Manage button colors and styles through stylesheets
- Handle position and size adjustments inline
- Follow responsive design principles

### State Management
- Use appropriate state management based on scope:
  - Local state: useState
  - Complex state: Context API
  - Server state: React Query/SWR
- Avoid prop drilling

### Performance
- Implement proper code splitting
- Use dynamic imports for large components
- Optimize images and assets
- Monitor and fix build warnings

## 2. Development Process

### Environment Setup
1. Clear cache before major changes
2. Verify port availability (3000-3004)
3. Check for environment variables
4. Ensure PWA configuration is correct

### Issue Resolution
1. Document the issue with full context
2. Identify root cause
3. Create minimal reproduction
4. Test solution thoroughly
5. Document the fix

### Code Review Standards
- All changes must be reviewed
- Test coverage required
- No linting errors
- Performance impact considered
- Security implications checked

## 3. Project Structure

### Core Directories
```
/app                 # Next.js app router pages
/components         # Reusable components
/lib                # Utility functions
/public            # Static assets
/styles            # Global styles
```

### Documentation
- Keep documentation up to date
- Follow daily reporting schedule
- Update PROGRESS.md for major changes
- Maintain DAILY_LOG.md with:
  - Token Usage Tracking
    * Daily total tokens consumed
    * Input/Output token breakdown
    * Task category distribution
    * Visual token consumption graphs
  - Daily Activity Logs
    * Morning/Afternoon sessions
    * Issues and resolutions
    * Metrics and performance data
  - Task Categories Breakdown
    * Environment Setup
    * Debug & Fixes
    * Feature Development
    * Documentation
  - Daily Summary
    * Total tokens used
    * Tasks completed
    * Success metrics
    * Next day planning

## 4. Branding Guidelines

### Identity
- Slogan: "Redefining Clarity "
- Subtext: "Intelligence of Perception"
- Maintain consistent branding across all pages

### UI/UX Standards
- Follow accessibility guidelines
- Maintain responsive design
- Use consistent color scheme
- Follow established component patterns

## 5. Testing Standards

### Unit Testing
- Test all utility functions
- Test component rendering
- Test state changes
- Test error handling

### Integration Testing
- Test component interactions
- Test data flow
- Test routing
- Test error boundaries

### E2E Testing
- Test critical user flows
- Test form submissions
- Test authentication
- Test error scenarios

## 6. Deployment Process

### Pre-deployment Checklist
- All tests passing
- No build warnings
- Environment variables verified
- Performance metrics checked
- Security audit passed

### Post-deployment Verification
- Verify all routes
- Check all API endpoints
- Verify static assets
- Monitor error logs
- Check analytics

## 7. Security Guidelines

### Code Security
- No sensitive data in code
- Use environment variables
- Implement proper validation
- Follow security best practices

### Data Security
- Encrypt sensitive data
- Implement proper authentication
- Use secure connections
- Regular security audits 