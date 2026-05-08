import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Wizard,
  WizardStep
} from '@patternfly/react-core';

interface BaseWizardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  steps: Array<{
    name: string;
    component: React.ComponentType<any>;
    props?: any;
  }>;
  onFinish: (data: any) => void;
  initialData?: any;
}

export const BaseWizard: React.FunctionComponent<BaseWizardProps> = ({
  isOpen,
  onClose,
  title,
  steps,
  onFinish,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);

  const handleDataChange = (stepData: any) => {
    setData({ ...data, ...stepData });
  };

  const handleFinish = () => {
    onFinish(data);
    onClose();
    setCurrentStep(1);
    setData(initialData);
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1);
    setData(initialData);
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
    >
      <div style={{ padding: '20px' }}>
        <Wizard>
          {steps.map((step, index) => {
            const StepComponent = step.component;
            return (
              <WizardStep
                key={step.name}
                id={index + 1}
                name={step.name}
              >
                <StepComponent
                  data={data}
                  onDataChange={handleDataChange}
                  {...step.props}
                />
              </WizardStep>
            );
          })}
        </Wizard>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button variant="primary" onClick={handleFinish}>
            Finish
          </Button>
          <Button variant="secondary" onClick={handleClose} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
