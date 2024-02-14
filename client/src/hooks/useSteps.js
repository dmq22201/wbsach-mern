import { useState } from "react";

function useSteps(steps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex((currentStepIndex) => {
      if (currentStepIndex >= steps.length - 1) return currentStepIndex;
      return currentStepIndex + 1;
    });
  };

  const prev = () => {
    setCurrentStepIndex((currentStepIndex) => {
      if (currentStepIndex === 0) return currentStepIndex;
      return currentStepIndex - 1;
    });
  };

  const goto = (step) => {
    setCurrentStepIndex(step);
  };

  return {
    next,
    prev,
    step: steps[currentStepIndex],
    currentStepIndex,
    goto,
  };
}

export default useSteps;
