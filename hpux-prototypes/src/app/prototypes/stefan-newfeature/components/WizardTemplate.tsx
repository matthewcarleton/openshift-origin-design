/**
 * Wizard Template Component
 * 
 * This is a template for creating CCLM-style wizards.
 * Copy this file and customize it for your needs.
 * 
 * RULE: All modal wizards MUST use this structure.
 */

import * as React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Title,
  Content,
} from '@patternfly/react-core';

interface WizardTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish?: (data: any) => void;
  title?: string;
  description?: string;
  steps?: Array<{
    number: number;
    name: string;
    component: React.ReactNode;
  }>;
}

export const WizardTemplate: React.FunctionComponent<WizardTemplateProps> = ({
  isOpen,
  onClose,
  onFinish,
  title = 'Wizard Title',
  description = 'Wizard description',
  steps = [],
}) => {
  const [activeStep, setActiveStep] = React.useState(1);

  const handleFinish = () => {
    if (onFinish) {
      onFinish({});
    }
    onClose();
    setActiveStep(1);
  };

  const handleCancel = () => {
    onClose();
    setActiveStep(1);
  };

  const getCurrentStep = () => {
    const step = steps.find(s => s.number === activeStep);
    return step ? step.component : null;
  };

  const isLastStep = activeStep === steps.length;
  const isFirstStep = activeStep === 1;

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={handleCancel}
      aria-labelledby="wizard-template-title"
      style={{ 
        '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
        '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
        '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
        '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header Section - REQUIRED */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '1.5rem', 
          borderBottom: '1px solid #d2d2d2',
          flexShrink: 0
        }}>
          <Title headingLevel="h1" size="2xl" id="wizard-template-title">
            {title}
          </Title>
          <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
            {description}
          </Content>
        </div>

        {/* Body with Steps Navigation and Content - REQUIRED */}
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          minHeight: 0, 
          alignItems: 'stretch', 
          overflow: 'hidden',
          margin: 0,
          padding: 0
        }}>
          {/* Left Navigation Panel - REQUIRED: 300px */}
          <div style={{ 
            width: '300px', 
            padding: '1.5rem 1rem',
            borderRight: '1px solid #d2d2d2',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            margin: 0
          }}>
            {steps.map((step) => (
              <div
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === step.number ? '#fafafa' : 'transparent',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeStep === step.number ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {step.number}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Right Content Area with Footer - REQUIRED */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: 0, 
            overflow: 'hidden',
            margin: 0,
            padding: 0
          }}>
            {/* Content Area - scrollable */}
            <div style={{ 
              flex: '1 1 0',
              padding: '1.5rem', 
              backgroundColor: '#ffffff',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {getCurrentStep()}
            </div>
            
            {/* Footer with Buttons - REQUIRED */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              padding: '16px 24px', 
              borderTop: '1px solid #d2d2d2', 
              backgroundColor: '#fff',
              flexShrink: 0
            }}>
              {isLastStep ? (
                <>
                  <Button variant="primary" onClick={handleFinish}>
                    Finish
                  </Button>
                  <Button variant="secondary" onClick={() => setActiveStep(activeStep - 1)}>
                    Back
                  </Button>
                  <Button variant="link" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => setActiveStep(activeStep + 1)}>
                    Next
                  </Button>
                  {!isFirstStep && (
                    <Button variant="secondary" onClick={() => setActiveStep(activeStep - 1)}>
                      Back
                    </Button>
                  )}
                  <Button variant="link" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

