import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
} from '@patternfly/react-core';
import { FullPageWizard } from '../components/FullPageWizard';
import { OperatorsStep } from '../components/OperatorsStep';

interface WizardData {
  selectedBundles: string[];
  selectedOperators: string[];
  selectedPersonas: string[];
}

/**
 * Cluster List Page
 * 
 * Page for displaying the Assisted Installer wizard for installing OpenShift clusters.
 */
export const ClusterListPage: React.FC = () => {
  const navigate = useNavigate();
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedBundles: [],
    selectedOperators: ['core-observability'], // Core Observability is required and selected by default
    selectedPersonas: [], // No persona selected by default - user must choose
  });

  const handleFinish = (data: any) => {
    console.log('Wizard completed with data:', data);
    // In a real implementation, this would trigger the cluster installation
    alert('Cluster installation wizard completed! Check console for data.');
    navigate('/core/operators/cluster-list');
  };

  const handleClose = () => {
    navigate('/core/operators/cluster-list');
  };

  // Placeholder components for other steps
  const ClusterDetailsStep = () => (
    <div style={{ maxWidth: '800px' }}>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
        Cluster details
      </Title>
      <Content style={{ color: '#6a6e73' }}>
        Configure cluster name, base domain, and other cluster details.
      </Content>
    </div>
  );

  const HostDiscoveryStep = () => (
    <div style={{ maxWidth: '800px' }}>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
        Host discovery
      </Title>
      <Content style={{ color: '#6a6e73' }}>
        Discover and configure hosts for the cluster installation.
      </Content>
    </div>
  );

  const StorageStep = () => (
    <div style={{ maxWidth: '800px' }}>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
        Storage
      </Title>
      <Content style={{ color: '#6a6e73' }}>
        Configure storage settings for the cluster.
      </Content>
    </div>
  );

  const NetworkingStep = () => (
    <div style={{ maxWidth: '800px' }}>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
        Networking
      </Title>
      <Content style={{ color: '#6a6e73' }}>
        Configure network settings for the cluster.
      </Content>
    </div>
  );

  const ReviewAndCreateStep = () => (
    <div style={{ maxWidth: '800px' }}>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
        Review and create
      </Title>
      <Content style={{ color: '#6a6e73', marginBottom: '24px' }}>
        Review your configuration before creating the cluster.
      </Content>
      <div style={{ marginTop: '24px' }}>
        <Title headingLevel="h3" size="lg" style={{ marginBottom: '12px' }}>
          Selected Bundles
        </Title>
        <ul>
          {wizardData.selectedBundles.map((bundle) => (
            <li key={bundle}>{bundle}</li>
          ))}
        </ul>
        <Title headingLevel="h3" size="lg" style={{ marginTop: '24px', marginBottom: '12px' }}>
          Selected Operators ({wizardData.selectedOperators.length})
        </Title>
        <ul>
          {wizardData.selectedOperators.map((operator) => (
            <li key={operator}>{operator}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <FullPageWizard
      title="Install OpenShift with the Assisted Installer"
      description="Configure and install an OpenShift cluster. Assisted Installer documentation"
      breadcrumbs={[
        { label: 'Cluster List', path: '/core/operators/cluster-list' },
        { label: 'Assisted Clusters', path: '/core/operators/cluster-list' },
        { label: 'thisismynewcluster' },
      ]}
      onClose={handleClose}
      onFinish={handleFinish}
      steps={[
        {
          name: 'Cluster details',
          id: 'cluster-details',
          component: <ClusterDetailsStep />,
        },
        {
          name: 'Operators',
          id: 'operators',
          component: (
            <OperatorsStep
              selectedBundles={wizardData.selectedBundles}
              selectedOperators={wizardData.selectedOperators}
              onBundlesChange={(bundles) => setWizardData((prev) => ({ ...prev, selectedBundles: bundles }))}
              onOperatorsChange={(operators) => setWizardData((prev) => ({ ...prev, selectedOperators: operators }))}
              selectedPersonas={wizardData.selectedPersonas}
              onPersonasChange={(personas) => setWizardData((prev) => ({ ...prev, selectedPersonas: personas }))}
            />
          ),
        },
        {
          name: 'Host discovery',
          id: 'host-discovery',
          component: <HostDiscoveryStep />,
        },
        {
          name: 'Storage',
          id: 'storage',
          component: <StorageStep />,
        },
        {
          name: 'Networking',
          id: 'networking',
          component: <NetworkingStep />,
        },
        {
          name: 'Review and create',
          id: 'review-and-create',
          component: <ReviewAndCreateStep />,
        },
      ]}
    />
  );
};
