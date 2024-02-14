import { createContext, useContext, useState } from "react";
import Button from "./Button";

const StepperContext = createContext();

function Stepper({ steps, lastStepFn }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () =>
    setCurrentStepIndex((stepIndex) => {
      if (currentStepIndex >= steps.length - 1) return stepIndex;

      return stepIndex + 1;
    });

  const prev = () =>
    setCurrentStepIndex((stepIndex) => {
      if (currentStepIndex <= 0) return stepIndex;

      return stepIndex - 1;
    });

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  return (
    <StepperContext.Provider
      value={{
        next,
        prev,
        steps,
        currentStepIndex,
        isFirstStep,
        isLastStep,
        lastStepFn,
      }}
    >
      <Header />
      <Content />
      <Buttons />
    </StepperContext.Provider>
  );
}

function Header() {
  const { steps, currentStepIndex } = useContext(StepperContext);

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4"
          >
            <p
              className={`h-14 w-14 rounded-full text-center font-semibold leading-[3.5rem] ${
                currentStepIndex === index
                  ? "bg-green-500"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              {index + 1}
            </p>
            <p className="font-semibold">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function Content() {
  const { steps, currentStepIndex } = useContext(StepperContext);

  return steps[currentStepIndex].content;
}

function Buttons() {
  const {
    steps,
    currentStepIndex,
    next,
    prev,
    isFirstStep,
    isLastStep,
    lastStepFn,
  } = useContext(StepperContext);

  return (
    <div className="flex justify-center gap-6">
      {!isFirstStep && (
        <Button type="outline" component="button" onClick={prev}>
          Quay về
        </Button>
      )}
      {isLastStep ? (
        <Button type="success" component="button" onClick={lastStepFn}>
          Hoàn thành
        </Button>
      ) : (
        <Button type="success" component="button" onClick={next}>
          Tiếp tục
        </Button>
      )}
    </div>
  );
}
export default Stepper;
