/**
 * Example Wizard Component
 * 
 * This is an isolated wizard component that matches the CCLM wizard style exactly.
 * It's completely self-contained and can be used as a reference for creating wizards.
 */

import * as React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Title,
  Content,
  Form,
  FormGroup,
  TextInput,
  TextArea,
} from '@patternfly/react-core';

interface ExampleWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish?: (data: any) => void;
}

interface WizardData {
  name: string;
  description: string;
  setting: string;
}

export const ExampleWizard: React.FunctionComponent<ExampleWizardProps> = ({
  isOpen,
  onClose,
  onFinish,
}) => {
  const [activeStep, setActiveStep] = React.useState(1);
  const [wizardData, setWizardData] = React.useState<WizardData>({
    name: '',
    description: '',
    setting: '',
  });

  const handleFinish = () => {
    if (onFinish) {
      onFinish(wizardData);
    }
    onClose();
    // Reset wizard data
    setWizardData({
      name: '',
      description: '',
      setting: '',
    });
    setActiveStep(1);
  };

  const handleCancel = () => {
    onClose();
    // Reset wizard data
    setWizardData({
      name: '',
      description: '',
      setting: '',
    });
    setActiveStep(1);
  };

  // Step 1: Basic Information
  const renderBasicInformationStep = () => (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
        Basic Information
      </Title>
      
      <Form>
        <FormGroup label="Name" fieldId="name">
          <TextInput
            type="text"
            id="name"
            value={wizardData.name}
            onChange={(_event, value) => setWizardData({ ...wizardData, name: value })}
            placeholder="Enter name"
          />
          <Content component="p" style={{ 
            marginTop: '8px', 
            fontSize: '14px',
            color: '#6a6e73' 
          }}>
            Enter a name for your item.
          </Content>
        </FormGroup>

        <FormGroup label="Description" fieldId="description" style={{ marginTop: '24px' }}>
          <TextArea
            id="description"
            value={wizardData.description}
            onChange={(_event, value) => setWizardData({ ...wizardData, description: value })}
            placeholder="Enter description"
            rows={4}
          />
        </FormGroup>
      </Form>
    </div>
  );

  // Step 2: Configuration
  const renderConfigurationStep = () => (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
        Configuration
      </Title>
      
      <Form>
        <FormGroup label="Setting" fieldId="setting">
          <TextInput
            type="text"
            id="setting"
            value={wizardData.setting}
            onChange={(_event, value) => setWizardData({ ...wizardData, setting: value })}
            placeholder="Enter setting value"
          />
          <Content component="p" style={{ 
            marginTop: '8px', 
            fontSize: '14px',
            color: '#6a6e73' 
          }}>
            Configure the settings for your item.
          </Content>
        </FormGroup>
      </Form>
    </div>
  );

  // Step 3: Review
  const renderReviewStep = () => (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
        Review
      </Title>
      
      <Content component="p" style={{ marginBottom: '24px' }}>
        Review your information before completing.
      </Content>

      <div style={{ 
        backgroundColor: '#fafafa',
        padding: '24px',
        borderRadius: '4px',
        border: '1px solid #d2d2d2'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '150px 1fr', 
          gap: '16px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold' }}>Name:</div>
          <div>{wizardData.name || 'Not set'}</div>
          
          <div style={{ fontWeight: 'bold' }}>Description:</div>
          <div>{wizardData.description || 'Not set'}</div>
          
          <div style={{ fontWeight: 'bold' }}>Setting:</div>
          <div>{wizardData.setting || 'Not set'}</div>
        </div>
      </div>
    </div>
  );

  const getCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return renderBasicInformationStep();
      case 2:
        return renderConfigurationStep();
      case 3:
        return renderReviewStep();
      default:
        return renderBasicInformationStep();
    }
  };

  const isReviewStep = activeStep === 3;
  const isFirstStep = activeStep === 1;

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={handleCancel}
      aria-labelledby="example-wizard-title"
      style={{ 
        '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
        '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
        '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
        '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header Section */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '1.5rem', 
          borderBottom: '1px solid #d2d2d2',
          flexShrink: 0
        }}>
          <Title headingLevel="h1" size="2xl" id="example-wizard-title">
            Example Wizard
          </Title>
          <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
            This is an example wizard that matches the CCLM wizard style.
          </Content>
        </div>

        {/* Body with Steps Navigation and Content */}
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          minHeight: 0, 
          alignItems: 'stretch', 
          overflow: 'hidden',
          margin: 0,
          padding: 0
        }}>
          {/* Left Navigation Panel */}
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
            <div
              onClick={() => setActiveStep(1)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                backgroundColor: activeStep === 1 ? '#fafafa' : 'transparent',
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
                backgroundColor: activeStep === 1 ? '#0066cc' : '#d2d2d2',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                1
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                Basic Information
              </span>
            </div>
            <div
              onClick={() => setActiveStep(2)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                backgroundColor: activeStep === 2 ? '#fafafa' : 'transparent',
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
                backgroundColor: activeStep === 2 ? '#0066cc' : '#d2d2d2',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                2
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                Configuration
              </span>
            </div>
            <div
              onClick={() => setActiveStep(3)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                backgroundColor: activeStep === 3 ? '#fafafa' : 'transparent',
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
                backgroundColor: activeStep === 3 ? '#0066cc' : '#d2d2d2',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                3
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                Review
              </span>
            </div>
          </div>
          
          {/* Right Content Area with Footer */}
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
            
            {/* Footer with Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              padding: '16px 24px', 
              borderTop: '1px solid #d2d2d2', 
              backgroundColor: '#fff',
              flexShrink: 0
            }}>
              {isReviewStep ? (
                <>
                  <Button variant="primary" onClick={handleFinish}>
                    Finish
                  </Button>
                  <Button variant="secondary" onClick={() => setActiveStep(2)}>
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
