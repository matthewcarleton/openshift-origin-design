import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RocketIcon } from '@patternfly/react-icons';
import { FullPageWizard } from '../components/FullPageWizard';
import { Step1InstallationDetails } from '../components/Step1InstallationDetails';
import { Step2ObservabilityComponents, WizardData } from '../components/Step2ObservabilityComponents';
import { Step3ReviewAndInstall } from '../components/Step3ReviewAndInstall';

const initialWizardData: WizardData = {
  // Step 1 defaults
  installationNamespace: 'recommended',
  selectedProject: '',
  installationMode: 'all-namespaces',
  updateChannel: 'stable',
  version: '1.3.1',
  updateApproval: 'manual',
  enableClusterMonitoring: true,
  // Step 2 defaults
  selectedPersona: null,
  activeGoals: [], // Goals selected by user (checkboxes)
  selectedCapabilities: ['metrics-alerting'], // Always required
  selectedNestedOptions: {},
  advancedMode: false,
  selectedUIPlugins: ['monitoring-ui'], // Default enabled
  selectedStorage: [], // Storage selection from Step 2
};

export const InstallationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);

  const handleDataChange = useCallback((data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  }, []);

  const handleFinish = (data: any) => {
    console.log('Wizard completed with data:', data);
    // In a real implementation, this would trigger the installation
    alert('Installation wizard completed! Check console for data.');
    navigate('/core/home');
  };

  const handleClose = () => {
    navigate('/core/home');
  };

  return (
    <FullPageWizard
      title="Install Cluster Observability Operator"
      description="Configure and install observability components for your cluster"
      breadcrumbs={[
        { label: 'Home', path: '/core/home' },
        { label: 'Operators', path: '/core/operators' },
        { label: 'OperatorHub', path: '/core/operators/operatorhub' },
        { label: 'Install Cluster Observability Operator' },
      ]}
      onClose={handleClose}
      onFinish={handleFinish}
      finishButtonText="Install"
      finishButtonIcon={<RocketIcon />}
      steps={[
        {
          name: 'Installation details',
          id: 'installation-details',
          component: (
            <Step1InstallationDetails
              data={wizardData}
              onDataChange={handleDataChange}
            />
          ),
        },
        {
          name: 'Components and configuration',
          id: 'observability-components',
          component: (
            <Step2ObservabilityComponents
              data={wizardData}
              onDataChange={handleDataChange}
            />
          ),
        },
        {
          name: 'Review and install',
          id: 'review-and-install',
          component: (
            <Step3ReviewAndInstall
              data={wizardData}
              onDataChange={handleDataChange}
            />
          ),
        },
      ]}
    />
  );
};

