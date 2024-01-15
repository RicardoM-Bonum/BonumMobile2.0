import { useState, useEffect } from 'react';

export const useSteps = (props) => {
  const {
    initialStep = 0,
    stepsCount,
    activeBarStep,
    validationStep = 3,
    userRole = 'coachee',
    validation,
    onLastStep
  } = props;

  const [activeStep, setActiveStep] = useState(initialStep);
  const [errors, setErrors] = useState(null);
  const [barActive, setBarActive] = useState(activeStep >= activeBarStep);

  useEffect(() => {
    setBarActive(activeStep >= activeBarStep);
    // Disabled because of infinite loop
  }, [activeStep]);

  const nextStep = async () => {
    // if (activeStep === validationStep && validation) {
    //   if (userRole === 'coachee') {
    //     const FormErrors = await validation;
    //     if (FormErrors) {
    //       setErrors(FormErrors);
    //       return;
    //     }
    //   }

    //   if (userRole === 'coach') {
    //     const FormErrors = await validation;
    //     console.log({FormErrors});
    //     if (FormErrors) {
    //       setErrors(FormErrors);
    //       return;
    //     }
    //   }
    // }
    if (activeStep === stepsCount - 1) {
      if (onLastStep) {
        onLastStep();
      }
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (activeStep < 1) return;
    setActiveStep((prev) => prev - 1);
  };

  const reset = () => {
    setActiveStep(initialStep);
  };

  const setStep = (step = 0) => {
    if (step > stepsCount) return;
    setActiveStep(step);
  };

  return {
    nextStep,
    prevStep,
    reset,
    setStep,
    activeStep,
    errors,
    barActive,
    activeBarStep
  };
};
