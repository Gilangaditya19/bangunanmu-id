import React, { useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Stepper.css';

const Motion = motion;

export default function Stepper({
    children,
    initialStep = 1,
    onStepChange = () => { },
    onFinalStepCompleted = () => { },
    stepCircleContainerClassName = '',
    stepContainerClassName = '',
    contentClassName = '',
    footerClassName = '',
    backButtonProps = {},
    nextButtonProps = {},
    backButtonText = 'Kembali',
    nextButtonText = 'Lanjut',
    disableStepIndicators = false,
    renderStepIndicator,
    ...rest
}) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [direction, setDirection] = useState(0);
    const steps = Children.toArray(children);
    const totalSteps = steps.length;
    const isLastStep = currentStep === totalSteps;
    const isFirstStep = currentStep === 1;

    const goToNextStep = () => {
        if (isLastStep) {
            onFinalStepCompleted();
        } else {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
            onStepChange(currentStep + 1);
        }
    };

    const goToBackStep = () => {
        if (!isFirstStep) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
            onStepChange(currentStep - 1);
        }
    };

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
    };

    return (
        <div className={`stepper-container ${stepContainerClassName}`} {...rest}>
            {!disableStepIndicators && (
                <div className={`step-circle-container ${stepCircleContainerClassName}`}>
                    <div className="step-indicator-row">
                        {steps.map((_, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isActive = stepNumber === currentStep;

                            return (
                                <React.Fragment key={stepNumber}>
                                    <div
                                        className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''
                                            }`}
                                    >
                                        {renderStepIndicator ? (
                                            renderStepIndicator({
                                                step: stepNumber,
                                                isActive,
                                                isCompleted,
                                            })
                                        ) : (
                                            <span className="step-number">{isCompleted ? '✔' : stepNumber}</span>
                                        )}
                                    </div>
                                    {index < totalSteps - 1 && (
                                        <div
                                            className={`step-connector ${stepNumber < currentStep ? 'completed' : ''
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className={`step-content-default ${contentClassName}`}>
                <AnimatePresence mode="wait" custom={direction}>
                    <Motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="step-content"
                    >
                        {steps[currentStep - 1]}
                    </Motion.div>
                </AnimatePresence>
            </div>

            <div className={`footer-container ${footerClassName}`}>
                <button
                    onClick={goToBackStep}
                    disabled={isFirstStep}
                    className="back-button"
                    {...backButtonProps}
                >
                    {backButtonText}
                </button>
                <button
                    onClick={goToNextStep}
                    className="next-button"
                    {...nextButtonProps}
                >
                    {isLastStep ? 'Selesai' : nextButtonText}
                </button>
            </div>
        </div>
    );
}

export function Step({ children }) {
    return <div className="step-default">{children}</div>;
}
