/**
 * Full Page Wizard Component
 * 
 * This is the STANDARD template for full-page wizards. It matches the CCLM CreateMigrationPlan pattern.
 * 
 * CRITICAL RULES:
 * 1. ALWAYS use this component for full-page wizards - DO NOT create custom layouts
 * 2. This component handles all padding, spacing, and layout correctly using CSS classes
 * 3. Step components should NOT have padding - only breadcrumbs and header have padding
 * 4. Step components should use maxWidth: '600px' for content width
 * 
 * USAGE:
 * ```typescript
 * <FullPageWizard
 *   onClose={() => navigate('/')}
 *   onFinish={(data) => console.log(data)}
 *   title="My Wizard"
 *   description="Wizard description"
 *   breadcrumbs={[
 *     { label: 'Home', path: '/' },
 *     { label: 'My Wizard' }
 *   ]}
 *   steps={[
 *     {
 *       name: 'Step One',
 *       id: 'step-one',
 *       component: <div style={{ maxWidth: '600px' }}>Content</div>
 *     }
 *   ]}
 * />
 * ```
 * 
 * See WIZARD_PATTERN.md for complete documentation.
 */

import * as React from 'react';
import {
  Wizard,
  WizardStep,
  useWizardContext,
  Button,
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';

interface FullPageWizardProps {
  onClose?: () => void;
  onFinish?: (data: any) => void;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  steps?: Array<{
    name: string;
    id: string;
    component: React.ReactNode;
  }>;
  finishButtonText?: string;
  finishButtonIcon?: React.ReactNode;
}

export const FullPageWizard: React.FunctionComponent<FullPageWizardProps> = ({
  onClose,
  onFinish,
  title = 'Full Page Wizard',
  description = 'This is a full-page wizard example.',
  breadcrumbs = [],
  steps = [],
  finishButtonText = 'Finish',
  finishButtonIcon,
}) => {
  const [wizardData, setWizardData] = React.useState<any>({});

  // Custom Footer Component (matches CCLM style)
  const CustomFooter = () => {
    try {
      const { activeStep, goToNextStep, goToPrevStep } = useWizardContext();
      const stepName = activeStep?.name || '';
      const isLastStep = steps.length > 0 && stepName === steps[steps.length - 1]?.name;
      const isFirstStep = steps.length > 0 && stepName === steps[0]?.name;

      const handleNext = () => {
        goToNextStep();
      };

      const handleBack = () => {
        goToPrevStep();
      };

      const handleFinish = () => {
        if (onFinish) {
          onFinish(wizardData);
        }
        if (onClose) {
          onClose();
        }
      };

      const handleCancel = () => {
        if (onClose) {
          onClose();
        }
      };

      if (isLastStep) {
        return (
          <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderTop: '1px solid #d2d2d2', backgroundColor: '#fff' }}>
            <Button variant="primary" onClick={handleFinish} icon={finishButtonIcon}>
              {finishButtonText}
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="link" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        );
      }

      return (
        <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderTop: '1px solid #d2d2d2', backgroundColor: '#fff' }}>
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
          {!isFirstStep && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button variant="link" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      );
    } catch (error) {
      console.error('Error in CustomFooter:', error);
      return null;
    }
  };

  return (
    <div className="observability-wizard-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <style>{`
        .observability-wizard-container .pf-v6-c-wizard__main-body,
        .observability-wizard-container div.pf-v6-c-wizard__main div.pf-v6-c-wizard__main-body,
        .observability-wizard-container .pf-v6-c-wizard__main .pf-v6-c-wizard__main-body {
          padding: 0 !important;
          padding-top: 0 !important;
          padding-right: 0 !important;
          padding-bottom: 0 !important;
          padding-left: 0 !important;
          margin-bottom: 24px !important;
        }
      `}</style>
      {/* Breadcrumb section - uses CSS class like CCLM to ensure padding isn't overridden */}
      {breadcrumbs.length > 0 && (
        <div className="create-policy-breadcrumb">
          <Breadcrumb>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem
                key={index}
                to={crumb.path || '#'}
                isActive={index === breadcrumbs.length - 1}
              >
                {crumb.label}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </div>
      )}

      {/* Page header with title and description - uses CSS class like CCLM to ensure padding isn't overridden */}
      <div className="create-policy-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <Title headingLevel="h1" size="2xl">
            {title}
          </Title>
        </div>
        <Content component="p" style={{ color: '#6a6e73' }}>
          {description}
        </Content>
      </div>

      {/* Wizard content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Wizard onClose={onClose} footer={<CustomFooter />}>
            {steps.map((step) => (
              <WizardStep key={step.id} name={step.name} id={step.id}>
                {step.component}
              </WizardStep>
            ))}
          </Wizard>
        </div>
      </div>
    </div>
  );
};

