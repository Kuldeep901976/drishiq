import { useCallback, useEffect, useState } from 'react';
import { FlowAccessResult, flowController, FlowNavigationResult, FlowState, FlowValidationResult } from './flow-controller';

// ===== MODULAR FLOW HOOK ARCHITECTURE =====

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
      currentFlowId: flowController.getCurrentFlow()?.id || null,
      currentStepId: flowController.getCurrentStep()?.id || null,
      completedSteps: [],
      skippedSteps: [],
      failedSteps: [],
      userData: currentState,
      stepAttempts: {},
      flowStartTime: null,
      lastActivityTime: null,
    };
  });
  const [currentFlow, setCurrentFlow] = useState(flowController.getCurrentFlow());
  const [currentStep, setCurrentStep] = useState(flowController.getCurrentStep());
  const [isFlowActive, setIsFlowActive] = useState(!!flowController.getCurrentFlow());
  const [isFlowCompleted, setIsFlowCompleted] = useState(flowController.isFlowCompleted());

  // Update state when flow controller changes
  const updateState = useCallback(() => {
    const currentState = flowController.getUserData();
    setFlowState(prevState => ({
      ...prevState,
      userData: currentState,
      currentFlowId: flowController.getCurrentFlow()?.id || null,
      currentStepId: flowController.getCurrentStep()?.id || null,
    }));
    setCurrentFlow(flowController.getCurrentFlow());
    setCurrentStep(flowController.getCurrentStep());
    setIsFlowActive(!!flowController.getCurrentFlow());
    setIsFlowCompleted(flowController.isFlowCompleted());
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

    flowController.on('stateChanged', handleStateChanged);
    flowController.on('stepChanged', handleStepChanged);
    flowController.on('flowCompleted', handleFlowCompleted);

    return () => {
      flowController.off('stateChanged', handleStateChanged);
      flowController.off('stepChanged', handleStepChanged);
      flowController.off('flowCompleted', handleFlowCompleted);
    };
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
    
    const success = flowController.startFlow(targetFlowId);
    if (success) {
      updateState();
    }
    return success;
  }, [options.flowId, updateState]);

  const completeCurrentStep = useCallback((): FlowNavigationResult => {
    const result = flowController.completeCurrentStep();
    
    if (!result.success && result.message.includes('Validation failed')) {
      const validation = flowController.validateCurrentStep();
      options.onValidationError?.(validation.errors);
    }
    
    updateState();
    return result;
  }, [updateState, options.onValidationError]);

  const skipCurrentStep = useCallback((): FlowNavigationResult => {
    const result = flowController.skipCurrentStep();
    updateState();
    return result;
  }, [updateState]);

  const goToStep = useCallback((stepId: string): FlowNavigationResult => {
    const result = flowController.goToStep(stepId);
    updateState();
    return result;
  }, [updateState]);

  const resetFlow = useCallback(() => {
    flowController.resetCurrentFlow();
    updateState();
  }, [updateState]);

  // Validation
  const validateCurrentStep = useCallback((): FlowValidationResult => {
    return flowController.validateCurrentStep();
  }, []);

  const validateStep = useCallback((stepId: string): FlowValidationResult => {
    return flowController.validateStep(stepId);
  }, []);

  // Access control
  const canAccessStep = useCallback((stepId: string): boolean => {
    return flowController.canAccessStep(stepId);
  }, []);

  const handlePageAccess = useCallback((pageId: string): FlowAccessResult => {
    return flowController.handlePageAccess(pageId);
  }, []);

  // User data
  const userData = flowController.getUserData();
  
  const setUserData = useCallback((key: string, value: any) => {
    flowController.setUserData(key, value);
    updateState();
  }, [updateState]);

  const setUserDataAndValidate = useCallback((key: string, value: any): FlowValidationResult => {
    const result = flowController.setUserDataAndValidate(key, value);
    updateState();
    return result;
  }, [updateState]);

  // Flow information
  const getCurrentPageRequirements = useCallback(() => {
    return flowController.getCurrentPageRequirements();
  }, []);

  const getNextStep = useCallback(() => {
    return flowController.getNextStep();
  }, []);

  const isLastStep = flowController.isLastStep();

  // Flow statistics
  const flowStats = flowController.getFlowStats();
  const progress = flowController.getFlowProgress();

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