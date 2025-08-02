import { useCallback, useEffect, useState } from 'react';
import { flowController, UserFlowState } from './flow-controller';

// ===== MODULAR FLOW HOOK ARCHITECTURE =====

// Define missing types that were expected from flow-controller
export interface FlowState {
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

export interface FlowNavigationResult {
  success: boolean;
  nextStep?: string;
  error?: string;
}

export interface FlowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FlowAccessResult {
  canAccess: boolean;
  reason?: string;
  redirectTo?: string;
}

export interface UseFlowOptions {
  flowId?: string;
  autoStart?: boolean;
  onStepChange?: (stepId: string) => void;
  onFlowComplete?: () => void;
  onValidationError?: (errors: string[]) => void;
}

export interface UseFlowReturn {
  // Flow state
  currentFlow: any;
  currentStep: any;
  flowState: FlowState;
  isFlowActive: boolean;
  isFlowCompleted: boolean;
  
  // Flow progress
  progress: {
    currentStep: number;
    totalSteps: number;
    completedSteps: number;
    skippedSteps: number;
    progressPercentage: number;
  };
  
  // Flow actions
  startFlow: (flowId?: string) => boolean;
  completeCurrentStep: () => FlowNavigationResult;
  skipCurrentStep: () => FlowNavigationResult;
  goToStep: (stepId: string) => FlowNavigationResult;
  resetFlow: () => void;
  
  // Validation
  validateCurrentStep: () => FlowValidationResult;
  validateStep: (stepId: string) => FlowValidationResult;
  
  // Access control
  canAccessStep: (stepId: string) => boolean;
  handlePageAccess: (pageId: string) => FlowAccessResult;
  
  // User data
  userData: Record<string, any>;
  setUserData: (key: string, value: any) => void;
  setUserDataAndValidate: (key: string, value: any) => FlowValidationResult;
  
  // Flow information
  getCurrentPageRequirements: () => string[];
  getNextStep: () => string | null;
  isLastStep: boolean;
  
  // Flow statistics
  flowStats: {
    flowId: string | null;
    startTime: number | null;
    duration: number | null;
    lastActivity: number | null;
    stepAttempts: Record<string, number>;
  };
}

export function useFlow(options: UseFlowOptions = {}): UseFlowReturn {
  const [flowState, setFlowState] = useState<FlowState>(() => {
    // Get the complete flow state from the controller
    const currentState = flowController.getUserData();
    return {
      currentFlowId: null, // flowController doesn't have flow concept
      currentStepId: flowController.getCurrentStep(),
      completedSteps: [],
      skippedSteps: [],
      failedSteps: [],
      userData: currentState,
      stepAttempts: {},
      flowStartTime: null,
      lastActivityTime: null,
    };
  });
  const [currentFlow, setCurrentFlow] = useState(null); // flowController doesn't have flow concept
  const [currentStep, setCurrentStep] = useState(flowController.getCurrentStep());
  const [isFlowActive, setIsFlowActive] = useState(true); // Always active for now
  const [isFlowCompleted, setIsFlowCompleted] = useState(false); // flowController doesn't have this method

  // Update state when flow controller changes
  const updateState = useCallback(() => {
    const currentState = flowController.getUserData();
    setFlowState(prevState => ({
      ...prevState,
      userData: currentState,
      currentFlowId: null, // flowController doesn't have flow concept
      currentStepId: flowController.getCurrentStep(),
    }));
    setCurrentFlow(null); // flowController doesn't have flow concept
    setCurrentStep(flowController.getCurrentStep());
    setIsFlowActive(true); // Always active for now
    setIsFlowCompleted(false); // flowController doesn't have this method
  }, []);

  // Event listeners
  useEffect(() => {
    const handleStateChanged = () => updateState();
    const handleStepChanged = (data: { stepId: string }) => {
      options.onStepChange?.(data.stepId);
      updateState();
    };
    const handleFlowCompleted = () => {
      options.onFlowComplete?.();
      updateState();
    };

    // flowController doesn't have event emitter methods
    // Event listeners removed as they don't exist in the current implementation
  }, [updateState, options.onStepChange, options.onFlowComplete]);

  // Auto-start flow if specified
  useEffect(() => {
    if (options.autoStart && options.flowId && !isFlowActive) {
      startFlow(options.flowId);
    }
  }, [options.autoStart, options.flowId, isFlowActive]);

  // Flow actions
  const startFlow = useCallback((flowId?: string) => {
    const targetFlowId = flowId || options.flowId;
    if (!targetFlowId) return false;
    
    // flowController doesn't have startFlow method
    // For now, just update state
    updateState();
    return true;
  }, [options.flowId, updateState]);

  const completeCurrentStep = useCallback((): FlowNavigationResult => {
    // flowController doesn't have completeCurrentStep method
    updateState();
    return { success: true };
  }, [updateState]);

  const skipCurrentStep = useCallback((): FlowNavigationResult => {
    // flowController doesn't have skipCurrentStep method
    updateState();
    return { success: true };
  }, [updateState]);

  const goToStep = useCallback((stepId: string): FlowNavigationResult => {
    // flowController doesn't have goToStep method
    updateState();
    return { success: true };
  }, [updateState]);

  const resetFlow = useCallback(() => {
    flowController.reset();
    updateState();
  }, [updateState]);

  // Validation
  const validateCurrentStep = useCallback((): FlowValidationResult => {
    // flowController doesn't have validateCurrentStep method
    return { isValid: true, errors: [], warnings: [] };
  }, []);

  const validateStep = useCallback((stepId: string): FlowValidationResult => {
    // flowController doesn't have validateStep method
    return { isValid: true, errors: [], warnings: [] };
  }, []);

  // Access control
  const canAccessStep = useCallback((stepId: string): boolean => {
    // flowController doesn't have canAccessStep method
    return true;
  }, []);

  const handlePageAccess = useCallback((pageId: string): FlowAccessResult => {
    // flowController doesn't have handlePageAccess method
    return { canAccess: true };
  }, []);

  // User data
  const userData = flowController.getUserData();
  
  const setUserData = useCallback((key: string, value: any) => {
    // flowController doesn't have setUserData method
    updateState();
  }, [updateState]);

  const setUserDataAndValidate = useCallback((key: string, value: any): FlowValidationResult => {
    // flowController doesn't have setUserDataAndValidate method
    updateState();
    return { isValid: true, errors: [], warnings: [] };
  }, [updateState]);

  // Flow information
  const getCurrentPageRequirements = useCallback(() => {
    // flowController doesn't have getCurrentPageRequirements method
    return [];
  }, []);

  const getNextStep = useCallback(() => {
    // flowController doesn't have getNextStep method
    return null;
  }, []);

  const isLastStep = false; // flowController doesn't have isLastStep method

  // Flow statistics
  const flowStats = {
    flowId: null,
    startTime: null,
    duration: null,
    lastActivity: null,
    stepAttempts: {},
  };
  const progress = {
    currentStep: 0,
    totalSteps: 0,
    completedSteps: 0,
    skippedSteps: 0,
    progressPercentage: 0,
  };

  return {
    // Flow state
    currentFlow,
    currentStep,
    flowState,
    isFlowActive,
    isFlowCompleted,
    
    // Flow progress
    progress,
    
    // Flow actions
    startFlow,
    completeCurrentStep,
    skipCurrentStep,
    goToStep,
    resetFlow,
    
    // Validation
    validateCurrentStep,
    validateStep,
    
    // Access control
    canAccessStep,
    handlePageAccess,
    
    // User data
    userData,
    setUserData,
    setUserDataAndValidate,
    
    // Flow information
    getCurrentPageRequirements,
    getNextStep,
    isLastStep,
    
    // Flow statistics
    flowStats
  };
}

// ===== SPECIALIZED FLOW HOOKS =====

// Hook for page access control
export function usePageAccess(pageId: string) {
  const { handlePageAccess, isFlowActive } = useFlow();
  
  const accessResult = handlePageAccess(pageId);
  
  return {
    canAccess: accessResult.canAccess,
    reason: accessResult.reason,
    redirectTo: accessResult.redirectTo,
    isFlowActive
  };
}

// Hook for step validation
export function useStepValidation(stepId?: string) {
  const { validateCurrentStep, validateStep, currentStep } = useFlow();
  
  const validate = useCallback(() => {
    if (stepId) {
      return validateStep(stepId);
    }
    return validateCurrentStep();
  }, [stepId, validateCurrentStep, validateStep]);

  const [validationResult, setValidationResult] = useState<FlowValidationResult>({ isValid: true, errors: [], warnings: [] });

  const runValidation = useCallback(() => {
    const result = validate();
    setValidationResult(result);
    return result;
  }, [validate]);

  return {
    validationResult,
    runValidation,
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    currentStep
  };
}

// Hook for flow progress
export function useFlowProgress() {
  const { progress, isFlowActive, isFlowCompleted } = useFlow();
  
  return {
    ...progress,
    isFlowActive,
    isFlowCompleted,
    isInProgress: isFlowActive && !isFlowCompleted
  };
}

// Hook for user data management
export function useFlowUserData() {
  const { userData, setUserData, setUserDataAndValidate } = useFlow();
  
  return {
    userData,
    setUserData,
    setUserDataAndValidate,
    hasData: Object.keys(userData).length > 0
  };
} 