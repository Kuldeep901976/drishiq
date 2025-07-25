# DrishiQ Modular Architecture Documentation

## 🏗️ Overview

The DrishiQ application has been restructured using a comprehensive modular architecture that separates concerns and provides a scalable, maintainable foundation.

## 🎨 UI Layer - Global CSS System

### Location: `app/globals.css`

The UI layer is managed entirely through a global CSS system with the following components:

#### 1. CSS Variables & Themes
```css
:root {
  /* Light Theme Colors */
  --drishiq-bg-primary: #F5FAF6;
  --drishiq-bg-secondary: #ffffff;
  --drishiq-text-primary: #0B4422;
  --drishiq-accent: #0B4422;
  
  /* Status Colors */
  --drishiq-success: #10b981;
  --drishiq-warning: #f59e0b;
  --drishiq-error: #ef4444;
  --drishiq-info: #3b82f6;
  
  /* Spacing System */
  --drishiq-spacing-xs: 0.25rem;
  --drishiq-spacing-sm: 0.5rem;
  --drishiq-spacing-md: 1rem;
  --drishiq-spacing-lg: 1.5rem;
  --drishiq-spacing-xl: 2rem;
  --drishiq-spacing-2xl: 3rem;
}
```

#### 2. Layout Components
- `.drishiq-container` - Main container with max-width
- `.drishiq-section` - Section wrapper with padding
- `.drishiq-grid-2/3/4` - Responsive grid layouts
- `.drishiq-flex` - Flexbox utilities

#### 3. UI Components
- `.drishiq-card` - Card components with header/body/footer
- `.drishiq-btn` - Button variants (primary, secondary, success, warning, error, info)
- `.drishiq-input` - Form inputs with validation states
- `.drishiq-table` - Styled tables with hover effects
- `.drishiq-badge` - Status badges
- `.drishiq-modal` - Modal system
- `.drishiq-nav-tabs` - Tab navigation

#### 4. Utility Classes
- Spacing: `.drishiq-mt-*`, `.drishiq-mb-*`, `.drishiq-p-*`
- Text: `.drishiq-text-center`, `.drishiq-text-left`, `.drishiq-text-right`
- Display: `.drishiq-hidden`, `.drishiq-block`, `.drishiq-inline-block`

## 🔄 Flow Layer - Flow Controller

### Location: `lib/flow-controller.ts`

The flow controller manages all user journeys and state transitions:

#### 1. Core Features
- **Flow Registration**: Register flows with unique IDs
- **Step Validation**: Custom validation functions per step
- **Requirements**: Step dependencies and prerequisites
- **Skip Logic**: Optional steps and skip functionality
- **Backtracking**: Configurable flow navigation
- **Event System**: Event-driven architecture

#### 2. Flow State Management
```typescript
interface FlowState {
  currentFlowId: string | null;
  currentStepId: string | null;
  completedSteps: string[];
  skippedSteps: string[];
  failedSteps: string[];
  userData: Record<string, any>;
  stepAttempts: Record<string, number>;
  flowStartTime: number | null;
  lastActivityTime: number | null;
}
```

#### 3. Predefined Flows
- **First Time Invitation Flow**: Landing → Invitation → Submit → Success
- **User Onboarding Flow**: Welcome → Profile → Preferences → Verification → Completion

#### 4. Flow Controller Methods
```typescript
// Flow Management
registerFlow(flow: Flow): boolean
startFlow(flowId: string): boolean
getCurrentFlow(): Flow | null
getCurrentStep(): FlowStep | null

// Step Navigation
completeCurrentStep(): FlowNavigationResult
skipCurrentStep(): FlowNavigationResult
goToStep(stepId: string): FlowNavigationResult

// Validation
validateCurrentStep(): FlowValidationResult
validateStep(stepId: string): FlowValidationResult

// Access Control
canAccessStep(stepId: string): boolean
handlePageAccess(pageId: string): FlowAccessResult

// User Data
getUserData(): Record<string, any>
setUserData(key: string, value: any): void
setUserDataAndValidate(key: string, value: any): FlowValidationResult

// Analytics
getFlowProgress(): FlowProgress
getFlowStats(): FlowStats
```

## 🧩 React Components - UI System

### Location: `components/ui/DrishiqUI.tsx`

A comprehensive React component system that uses the global CSS:

#### 1. Layout Components
```typescript
<Container fluid={false}>
  <Section variant="primary">
    <Grid cols={3} gap="lg">
      {/* Content */}
    </Grid>
  </Section>
</Container>
```

#### 2. Card Components
```typescript
<Card hover={true}>
  <CardHeader>Header Content</CardHeader>
  <CardBody>Body Content</CardBody>
  <CardFooter>Footer Content</CardFooter>
</Card>
```

#### 3. Form Components
```typescript
<Input 
  label="Name"
  error="Name is required"
  helperText="Enter your full name"
/>
<Select 
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>
<TextArea 
  label="Description"
  placeholder="Enter description"
/>
```

#### 4. Button Components
```typescript
<Button variant="primary" size="md" loading={false}>
  Submit
</Button>
```

#### 5. Table Components
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableCell header>Name</TableCell>
      <TableCell header>Status</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>
        <Badge variant="success">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### 6. Modal Components
```typescript
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <ModalHeader onClose={() => setIsModalOpen(false)}>
    Modal Title
  </ModalHeader>
  <ModalBody>
    Modal content
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Submit
    </Button>
  </ModalFooter>
</Modal>
```

## 🎣 React Hooks - Flow Integration

### Location: `lib/use-flow.ts`

React hooks that integrate the flow controller with React components:

#### 1. Main Flow Hook
```typescript
const {
  currentFlow,
  currentStep,
  isFlowActive,
  isFlowCompleted,
  progress,
  startFlow,
  completeCurrentStep,
  skipCurrentStep,
  goToStep,
  resetFlow,
  validateCurrentStep,
  canAccessStep,
  handlePageAccess,
  userData,
  setUserData,
  setUserDataAndValidate
} = useFlow({
  flowId: 'user-onboarding',
  autoStart: true,
  onStepChange: (stepId) => console.log('Step changed:', stepId),
  onFlowComplete: () => console.log('Flow completed'),
  onValidationError: (errors) => console.log('Validation errors:', errors)
});
```

#### 2. Specialized Hooks
```typescript
// Page Access Control
const { canAccess, reason, redirectTo } = usePageAccess('profile-setup');

// Step Validation
const { validationResult, runValidation, isValid, errors } = useStepValidation();

// Flow Progress
const { progressPercentage, currentStep, totalSteps } = useFlowProgress();

// User Data Management
const { userData, setUserData, hasData } = useFlowUserData();
```

## 📱 Component Usage Examples

### 1. Invitation Management Page
```typescript
export default function AdminInvitationsPage() {
  return (
    <Container>
      <Section>
        {/* Header */}
        <div className="drishiq-flex-between drishiq-mb-lg">
          <h1>Invitation Management</h1>
          <Button variant="primary">View Dashboard</Button>
        </div>

        {/* Alert */}
        {alert && (
          <Alert variant={alert.type} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid cols={5} className="drishiq-mb-lg">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Invitations</div>
            </CardBody>
          </Card>
        </Grid>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Name</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map(invitation => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invitation.status)}>
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="drishiq-flex gap-2">
                      <Button variant="info" size="sm">View</Button>
                      <Button variant="error" size="sm">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>
    </Container>
  );
}
```

### 2. Flow-Controlled Page
```typescript
export default function ProfileSetupPage() {
  const {
    currentStep,
    isFlowActive,
    userData,
    setUserData,
    completeCurrentStep,
    validateCurrentStep
  } = useFlow({
    flowId: 'user-onboarding',
    onValidationError: (errors) => {
      // Handle validation errors
    }
  });

  const handleSubmit = () => {
    const validation = validateCurrentStep();
    if (validation.isValid) {
      const result = completeCurrentStep();
      if (result.success) {
        // Navigate to next step
      }
    }
  };

  if (!isFlowActive) {
    return <div>No active flow</div>;
  }

  return (
    <Container>
      <Section>
        <Card>
          <CardHeader>
            <h1>{currentStep?.name}</h1>
            <p>{currentStep?.description}</p>
          </CardHeader>
          <CardBody>
            <Input
              label="Full Name"
              value={userData.fullName || ''}
              onChange={(e) => setUserData('fullName', e.target.value)}
            />
            <Select
              label="Preferred Language"
              value={userData.preferredLanguage || ''}
              onChange={(e) => setUserData('preferredLanguage', e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' }
              ]}
            />
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleSubmit}>
              Continue
            </Button>
          </CardFooter>
        </Card>
      </Section>
    </Container>
  );
}
```

## 🔧 Configuration & Customization

### 1. Adding New UI Components
1. Add CSS classes to `app/globals.css`
2. Create React component in `components/ui/DrishiqUI.tsx`
3. Export from the component file
4. Use in your pages

### 2. Creating New Flows
1. Define flow structure with steps and validation
2. Register flow in `lib/flow-controller.ts`
3. Use `useFlow` hook in your components
4. Implement step validation and navigation logic

### 3. Theme Customization
1. Modify CSS variables in `app/globals.css`
2. Add new theme variants
3. Update component variants as needed

## 🚀 Benefits of Modular Architecture

### 1. Separation of Concerns
- **UI Layer**: Global CSS manages all styling
- **Flow Layer**: Flow controller manages all user journeys
- **Component Layer**: React components provide reusable UI elements
- **Hook Layer**: React hooks integrate flow with components

### 2. Consistency
- **Design System**: Unified visual language across the application
- **Component Reusability**: Standardized components for common patterns
- **Theme Support**: Easy theme switching and customization

### 3. Maintainability
- **Centralized Styling**: All styles in one place
- **Flow Management**: Centralized user journey control
- **Easy Updates**: Changes propagate across the entire application

### 4. Scalability
- **New Components**: Easy to add new UI components
- **New Flows**: Simple flow registration and management
- **Theme Extensions**: Easy to add new themes or variants

## 📋 Best Practices

### 1. CSS Classes
- Always use `drishiq-` prefix for custom classes
- Use CSS variables for colors, spacing, and other design tokens
- Keep classes semantic and descriptive

### 2. Flow Management
- Always validate steps before completion
- Use proper error handling for validation failures
- Implement proper access control for pages

### 3. Component Usage
- Use the provided UI components instead of custom styling
- Follow the established patterns for layouts and interactions
- Maintain consistency across similar components

### 4. State Management
- Use the flow controller for flow-related state
- Use React state for component-specific state
- Avoid mixing flow state with component state

## 🔍 Troubleshooting

### Common Issues

1. **CSS Classes Not Working**
   - Ensure classes are properly defined in `app/globals.css`
   - Check for typos in class names
   - Verify CSS variables are defined

2. **Flow Not Working**
   - Check if flow is properly registered
   - Verify step validation logic
   - Ensure proper event handling

3. **Components Not Rendering**
   - Check import statements
   - Verify component props
   - Ensure proper TypeScript types

### Debug Tools

1. **Flow Controller Debug**
   ```typescript
   console.log('Current Flow:', flowController.getCurrentFlow());
   console.log('Current Step:', flowController.getCurrentStep());
   console.log('Flow Progress:', flowController.getFlowProgress());
   ```

2. **CSS Debug**
   - Use browser dev tools to inspect CSS classes
   - Check CSS variable values
   - Verify responsive breakpoints

This modular architecture provides a solid foundation for building scalable, maintainable applications with clear separation of concerns and consistent design patterns. 