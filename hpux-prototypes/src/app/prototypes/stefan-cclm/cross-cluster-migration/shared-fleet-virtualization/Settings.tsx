import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Content,
  Button,
  ExpandableSection,
  Label,
  Switch,
  Radio,
  TextInput,
  Checkbox,
  Dropdown,
  MenuToggle,
  DropdownList,
  DropdownItem,
  type MenuToggleElement,
} from '@patternfly/react-core';
import { CheckCircleIcon, AngleRightIcon, ExternalLinkAltIcon, InfoCircleIcon } from '@patternfly/react-icons';

const Settings: React.FunctionComponent = () => {
  const [activeSection, setActiveSection] = useState('Cluster');
  const [virtualizationFeaturesExpanded, setVirtualizationFeaturesExpanded] = useState(false);
  const [loadBalanceExpanded, setLoadBalanceExpanded] = useState(false);
  const [generalSettingsExpanded, setGeneralSettingsExpanded] = useState(false);
  const [guestManagementExpanded, setGuestManagementExpanded] = useState(false);
  const [resourceManagementExpanded, setResourceManagementExpanded] = useState(false);
  const [scsiExpanded, setScsiExpanded] = useState(false);
  
  // Load balance states
  const [loadBalanceLevel, setLoadBalanceLevel] = useState('Medium');
  
  // General settings substeps
  const [liveMigrationExpanded, setLiveMigrationExpanded] = useState(false);
  const [memoryDensityExpanded, setMemoryDensityExpanded] = useState(false);
  const [sshConfigExpanded, setSshConfigExpanded] = useState(false);
  const [templatesManagementExpanded, setTemplatesManagementExpanded] = useState(false);
  const [vmActionsExpanded, setVmActionsExpanded] = useState(false);
  
  // Live migration states
  const [maxMigrationsPerCluster, setMaxMigrationsPerCluster] = useState(5);
  const [maxMigrationsPerNode, setMaxMigrationsPerNode] = useState(2);
  const [liveMigrationNetworkOpen, setLiveMigrationNetworkOpen] = useState(false);
  const [liveMigrationNetwork, setLiveMigrationNetwork] = useState('Primary live migration network');
  
  // Memory density state
  const [memoryDensityEnabled, setMemoryDensityEnabled] = useState(false);
  
  // SSH configuration states
  const [sshLoadBalancerEnabled, setSshLoadBalancerEnabled] = useState(true);
  const [sshNodePortEnabled, setSshNodePortEnabled] = useState(false);
  const [nodeAddress, setNodeAddress] = useState('');
  
  // Templates and images management states
  const [autoImagesDownloadExpanded, setAutoImagesDownloadExpanded] = useState(false);
  const [bootableVolumesExpanded, setBootableVolumesExpanded] = useState(false);
  const [templateProjectExpanded, setTemplateProjectExpanded] = useState(false);
  const [autoImagesDownloadEnabled, setAutoImagesDownloadEnabled] = useState(true);
  const [imageToggles, setImageToggles] = useState({
    'centos-stream10-image-cron': true,
    'centos-stream9-image-cron': true,
    'fedora-image-cron': true,
    'rhel10-image-cron': true,
    'rhel8-image-cron': true,
    'rhel9-image-cron': true,
  });
  const [bootableVolumeProjectOpen, setBootableVolumeProjectOpen] = useState(false);
  const [bootableVolumeProject, setBootableVolumeProject] = useState('openshift-virtualization-os-images');
  const [templateProjectOpen, setTemplateProjectOpen] = useState(false);
  const [templateProject, setTemplateProject] = useState('openshift');
  
  // VM actions confirmation state
  const [confirmVmActions, setConfirmVmActions] = useState(false);
  
  // Guest management states
  const [guestSystemLogEnabled, setGuestSystemLogEnabled] = useState(false);
  const [autoSubscriptionExpanded, setAutoSubscriptionExpanded] = useState(false);
  const [subscriptionTypeOpen, setSubscriptionTypeOpen] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('Monitor and manage subscriptions');
  const [activationKey, setActivationKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [autoUpdatesEnabled, setAutoUpdatesEnabled] = useState(false);
  const [customRegistrationServer, setCustomRegistrationServer] = useState(false);
  
  // Resource management states
  const [autoCpuMemory, setAutoCpuMemory] = useState(false);
  const [ksmEnabled, setKsmEnabled] = useState(false);
  
  // SCSI states
  const [scsiPersistentEnabled, setScsiPersistentEnabled] = useState(false);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Grid hasGutter>
        {/* Left sidebar */}
        <GridItem span={2}>
          <Card>
            <CardBody style={{ padding: 0 }}>
              <div
                onClick={() => setActiveSection('Cluster')}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'Cluster' ? 'var(--pf-t--global--background--color--primary--clicked)' : 'transparent',
                  borderLeft: activeSection === 'Cluster' ? '3px solid var(--pf-t--global--color--brand--default)' : '3px solid transparent',
                  fontWeight: activeSection === 'Cluster' ? 500 : 400,
                }}
              >
                Cluster
              </div>
              <div
                onClick={() => setActiveSection('User')}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'User' ? 'var(--pf-t--global--background--color--primary--clicked)' : 'transparent',
                  borderLeft: activeSection === 'User' ? '3px solid var(--pf-t--global--color--brand--default)' : '3px solid transparent',
                  fontWeight: activeSection === 'User' ? 500 : 400,
                }}
              >
                User
              </div>
              <div
                onClick={() => setActiveSection('Preview features')}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'Preview features' ? 'var(--pf-t--global--background--color--primary--clicked)' : 'transparent',
                  borderLeft: activeSection === 'Preview features' ? '3px solid var(--pf-t--global--color--brand--default)' : '3px solid transparent',
                  fontWeight: activeSection === 'Preview features' ? 500 : 400,
                }}
              >
                Preview features
              </div>
            </CardBody>
          </Card>
        </GridItem>

        {/* Main content area */}
        <GridItem span={10}>
          <Card>
            <CardBody>
              {activeSection === 'Cluster' && (
                <>
                  {/* Version information */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      padding: '24px',
                      marginBottom: '24px',
                    }}
                  >
                    <Grid hasGutter>
                      <GridItem span={4}>
                        <Content style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                          Installed version
                        </Content>
                        <Content style={{ fontSize: '16px' }}>4.20.0-194</Content>
                      </GridItem>
                      <GridItem span={4}>
                        <Content style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                          Update status
                        </Content>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                          <Content style={{ fontSize: '16px' }}>Up to date</Content>
                        </div>
                      </GridItem>
                      <GridItem span={4}>
                        <Content style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                          Channel
                        </Content>
                        <Content style={{ fontSize: '16px' }}>
                          <a
                            href="#"
                            style={{
                              color: 'var(--pf-t--global--color--brand--default)',
                              textDecoration: 'underline',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            stable
                            <ExternalLinkAltIcon style={{ fontSize: '12px' }} />
                          </a>
                        </Content>
                      </GridItem>
                    </Grid>
                  </div>

                  {/* Virtualization features */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      onClick={() => setVirtualizationFeaturesExpanded(!virtualizationFeaturesExpanded)}
                      style={{
                        padding: '16px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AngleRightIcon
                          style={{
                            transform: virtualizationFeaturesExpanded ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        />
                        <Title headingLevel="h3" size="md">
                          Virtualization features
                        </Title>
                      </div>
                      <Button variant="primary">Configure features</Button>
                    </div>
                    {virtualizationFeaturesExpanded && (
                      <div style={{ padding: '0 24px 24px 56px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <Content>Network observability</Content>
                          <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <Content>Host network management (NMState)</Content>
                          <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Content>High availability</Content>
                          <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Load balance */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      onClick={() => setLoadBalanceExpanded(!loadBalanceExpanded)}
                      style={{
                        padding: '16px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <AngleRightIcon
                        style={{
                          transform: loadBalanceExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                      <Title headingLevel="h3" size="md">
                        Load balance
                      </Title>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        style={{
                          color: 'var(--pf-t--global--color--brand--default)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          marginLeft: '8px',
                        }}
                      >
                        View in Operator hub
                        <ExternalLinkAltIcon style={{ fontSize: '12px' }} />
                      </a>
                      <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px', marginLeft: 'auto' }} />
                    </div>
                    {loadBalanceExpanded && (
                      <div style={{ padding: '0 24px 24px 56px' }}>
                        <Title headingLevel="h4" size="md" style={{ marginBottom: '16px' }}>
                          Kube Descheduler
                        </Title>
                        <Content style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--regular)' }}>
                          The Kube Descheduler Operator provides the ability to evict a running Pod so that the Pod can be rescheduled onto a more suitable Node.
                        </Content>
                        <Content style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          You can set a target balance level to guide the process.
                        </Content>
                        <div style={{ display: 'flex', gap: '24px', marginLeft: '24px' }}>
                          <Radio
                            id="load-balance-low"
                            name="load-balance"
                            label="Low"
                            isChecked={loadBalanceLevel === 'Low'}
                            onChange={() => setLoadBalanceLevel('Low')}
                          />
                          <Radio
                            id="load-balance-medium"
                            name="load-balance"
                            label="Medium"
                            isChecked={loadBalanceLevel === 'Medium'}
                            onChange={() => setLoadBalanceLevel('Medium')}
                          />
                          <Radio
                            id="load-balance-high"
                            name="load-balance"
                            label="High"
                            isChecked={loadBalanceLevel === 'High'}
                            onChange={() => setLoadBalanceLevel('High')}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General settings */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      onClick={() => setGeneralSettingsExpanded(!generalSettingsExpanded)}
                      style={{
                        padding: '16px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <AngleRightIcon
                        style={{
                          transform: generalSettingsExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                      <Title headingLevel="h3" size="md">
                        General settings
                      </Title>
                    </div>
                    {generalSettingsExpanded && (
                      <div style={{ padding: '0 24px 24px 56px' }}>
                        {/* Live migration */}
                        <div
                          onClick={() => setLiveMigrationExpanded(!liveMigrationExpanded)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '12px 0',
                            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
                          }}
                        >
                          <AngleRightIcon
                            style={{
                              transform: liveMigrationExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                              fontSize: '14px',
                            }}
                          />
                          <Content>Live migration</Content>
                        </div>
                        {liveMigrationExpanded && (
                          <div style={{ padding: '16px 0 16px 24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                            {/* Set live migration limits */}
                            <Content style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                              Set live migration limits
                            </Content>
                            <Grid hasGutter style={{ marginBottom: '24px' }}>
                              <GridItem span={6}>
                                <Content style={{ marginBottom: '8px', fontWeight: 500 }}>Max. migrations per cluster</Content>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <Button
                                    variant="control"
                                    onClick={() => setMaxMigrationsPerCluster(Math.max(0, maxMigrationsPerCluster - 1))}
                                    aria-label="Decrease migrations per cluster"
                                  >
                                    −
                                  </Button>
                                  <TextInput
                                    type="number"
                                    value={maxMigrationsPerCluster}
                                    onChange={(_event, value) => setMaxMigrationsPerCluster(parseInt(value) || 0)}
                                    style={{ width: '100px', textAlign: 'center' }}
                                  />
                                  <Button
                                    variant="control"
                                    onClick={() => setMaxMigrationsPerCluster(maxMigrationsPerCluster + 1)}
                                    aria-label="Increase migrations per cluster"
                                  >
                                    +
                                  </Button>
                                </div>
                              </GridItem>
                              <GridItem span={6}>
                                <Content style={{ marginBottom: '8px', fontWeight: 500 }}>Max. migrations per node</Content>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <Button
                                    variant="control"
                                    onClick={() => setMaxMigrationsPerNode(Math.max(0, maxMigrationsPerNode - 1))}
                                    aria-label="Decrease migrations per node"
                                  >
                                    −
                                  </Button>
                                  <TextInput
                                    type="number"
                                    value={maxMigrationsPerNode}
                                    onChange={(_event, value) => setMaxMigrationsPerNode(parseInt(value) || 0)}
                                    style={{ width: '100px', textAlign: 'center' }}
                                  />
                                  <Button
                                    variant="control"
                                    onClick={() => setMaxMigrationsPerNode(maxMigrationsPerNode + 1)}
                                    aria-label="Increase migrations per node"
                                  >
                                    +
                                  </Button>
                                </div>
                              </GridItem>
                            </Grid>

                            {/* Set live migration network */}
                            <Content style={{ marginBottom: '8px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                              Set live migration network
                            </Content>
                            <div style={{ marginBottom: '16px' }}>
                              <Content style={{ marginBottom: '8px', fontWeight: 500 }}>Live migration network</Content>
                              <Dropdown
                                isOpen={liveMigrationNetworkOpen}
                                onSelect={() => setLiveMigrationNetworkOpen(false)}
                                onOpenChange={(isOpen) => setLiveMigrationNetworkOpen(isOpen)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setLiveMigrationNetworkOpen(!liveMigrationNetworkOpen)}
                                    isExpanded={liveMigrationNetworkOpen}
                                    style={{ width: '100%', maxWidth: '400px' }}
                                  >
                                    {liveMigrationNetwork}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem
                                    key="primary"
                                    onClick={() => setLiveMigrationNetwork('Primary live migration network')}
                                  >
                                    Primary live migration network
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </div>
                          </div>
                        )}

                        {/* Memory density */}
                        <div
                          onClick={() => setMemoryDensityExpanded(!memoryDensityExpanded)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '12px 0',
                            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
                          }}
                        >
                          <AngleRightIcon
                            style={{
                              transform: memoryDensityExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                              fontSize: '14px',
                            }}
                          />
                          <Content>Memory density</Content>
                        </div>
                        {memoryDensityExpanded && (
                          <div style={{ padding: '16px 0 16px 24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Content>Enable memory density</Content>
                                <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                              </div>
                              <Switch
                                id="memory-density-switch"
                                aria-label="Enable memory density"
                                isChecked={memoryDensityEnabled}
                                onChange={(_event, checked) => setMemoryDensityEnabled(checked)}
                              />
                            </div>
                          </div>
                        )}

                        {/* SSH configurations */}
                        <div
                          onClick={() => setSshConfigExpanded(!sshConfigExpanded)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '12px 0',
                            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
                          }}
                        >
                          <AngleRightIcon
                            style={{
                              transform: sshConfigExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                              fontSize: '14px',
                            }}
                          />
                          <Content>SSH configurations</Content>
                        </div>
                        {sshConfigExpanded && (
                          <div style={{ padding: '16px 0 16px 24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                            {/* SSH over LoadBalancer service */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Content>SSH over LoadBalancer service</Content>
                                <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                              </div>
                              <Switch
                                id="ssh-loadbalancer-switch"
                                aria-label="SSH over LoadBalancer service"
                                isChecked={sshLoadBalancerEnabled}
                                onChange={(_event, checked) => setSshLoadBalancerEnabled(checked)}
                              />
                            </div>

                            {/* SSH over NodePort service */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Content>SSH over NodePort service</Content>
                                <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                              </div>
                              <Switch
                                id="ssh-nodeport-switch"
                                aria-label="SSH over NodePort service"
                                isChecked={sshNodePortEnabled}
                                onChange={(_event, checked) => setSshNodePortEnabled(checked)}
                              />
                            </div>

                            {/* Node address input */}
                            <TextInput
                              type="text"
                              value={nodeAddress}
                              onChange={(_event, value) => setNodeAddress(value)}
                              placeholder="Enter node address"
                              style={{ maxWidth: '400px' }}
                            />
                          </div>
                        )}

                        {/* Templates and images management */}
                        <div
                          onClick={() => setTemplatesManagementExpanded(!templatesManagementExpanded)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '12px 0',
                            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
                          }}
                        >
                          <AngleRightIcon
                            style={{
                              transform: templatesManagementExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                              fontSize: '14px',
                            }}
                          />
                          <Content>Templates and images management</Content>
                        </div>
                        {templatesManagementExpanded && (
                          <div style={{ padding: '16px 0 16px 24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                            {/* Automatic images download */}
                            <div
                              style={{
                                border: '1px solid var(--pf-t--global--border--color--default)',
                                borderRadius: 'var(--pf-t--global--border--radius--small)',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAutoImagesDownloadExpanded(!autoImagesDownloadExpanded);
                                }}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <AngleRightIcon
                                  style={{
                                    transform: autoImagesDownloadExpanded ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.2s',
                                    fontSize: '14px',
                                  }}
                                />
                                <Content>Automatic images download</Content>
                              </div>
                              {autoImagesDownloadExpanded && (
                                <div style={{ padding: '0 16px 16px 40px' }}>
                                  {/* Main toggle */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Content>Automatic images download</Content>
                                      <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                                    </div>
                                    <Switch
                                      id="auto-images-download-switch"
                                      aria-label="Automatic images download"
                                      isChecked={autoImagesDownloadEnabled}
                                      onChange={(_event, checked) => setAutoImagesDownloadEnabled(checked)}
                                    />
                                  </div>

                                  {/* Individual image toggles */}
                                  {Object.keys(imageToggles).map((imageName) => (
                                    <div
                                      key={imageName}
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}
                                    >
                                      <Content>{imageName}</Content>
                                      <Switch
                                        id={`${imageName}-switch`}
                                        aria-label={imageName}
                                        isChecked={imageToggles[imageName as keyof typeof imageToggles]}
                                        onChange={(_event, checked) =>
                                          setImageToggles({ ...imageToggles, [imageName]: checked })
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Bootable volumes project */}
                            <div
                              style={{
                                border: '1px solid var(--pf-t--global--border--color--default)',
                                borderRadius: 'var(--pf-t--global--border--radius--small)',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBootableVolumesExpanded(!bootableVolumesExpanded);
                                }}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <AngleRightIcon
                                  style={{
                                    transform: bootableVolumesExpanded ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.2s',
                                    fontSize: '14px',
                                  }}
                                />
                                <Content>Bootable volumes project</Content>
                              </div>
                              {bootableVolumesExpanded && (
                                <div style={{ padding: '0 16px 16px 40px' }}>
                                  <Content style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)', fontSize: '14px' }}>
                                    Select a project for Red Hat bootable volumes. The default project is 'openshift-virtualization-os-images'.
                                  </Content>
                                  <div>
                                    <Content style={{ marginBottom: '8px', fontWeight: 500 }}>Project</Content>
                                    <Dropdown
                                      isOpen={bootableVolumeProjectOpen}
                                      onSelect={() => setBootableVolumeProjectOpen(false)}
                                      onOpenChange={(isOpen) => setBootableVolumeProjectOpen(isOpen)}
                                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle
                                          ref={toggleRef}
                                          onClick={() => setBootableVolumeProjectOpen(!bootableVolumeProjectOpen)}
                                          isExpanded={bootableVolumeProjectOpen}
                                          style={{ width: '100%', maxWidth: '400px' }}
                                        >
                                          <Label color="green">PR</Label> {bootableVolumeProject}
                                        </MenuToggle>
                                      )}
                                    >
                                      <DropdownList>
                                        <DropdownItem
                                          key="os-images"
                                          onClick={() => setBootableVolumeProject('openshift-virtualization-os-images')}
                                        >
                                          openshift-virtualization-os-images
                                        </DropdownItem>
                                      </DropdownList>
                                    </Dropdown>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Template project */}
                            <div
                              style={{
                                border: '1px solid var(--pf-t--global--border--color--default)',
                                borderRadius: 'var(--pf-t--global--border--radius--small)',
                              }}
                            >
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTemplateProjectExpanded(!templateProjectExpanded);
                                }}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <AngleRightIcon
                                  style={{
                                    transform: templateProjectExpanded ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.2s',
                                    fontSize: '14px',
                                  }}
                                />
                                <Content>Template project</Content>
                              </div>
                              {templateProjectExpanded && (
                                <div style={{ padding: '0 16px 16px 40px' }}>
                                  <Content style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)', fontSize: '14px' }}>
                                    Select a project for Red Hat templates. The default project is 'openshift'. If you want to store Red Hat templates in multiple projects, you must clone the Red Hat template by selecting <strong>Clone template</strong> from the template action menu and then selecting another project for the cloned template.
                                  </Content>
                                  <div>
                                    <Content style={{ marginBottom: '8px', fontWeight: 500 }}>Project</Content>
                                    <Dropdown
                                      isOpen={templateProjectOpen}
                                      onSelect={() => setTemplateProjectOpen(false)}
                                      onOpenChange={(isOpen) => setTemplateProjectOpen(isOpen)}
                                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle
                                          ref={toggleRef}
                                          onClick={() => setTemplateProjectOpen(!templateProjectOpen)}
                                          isExpanded={templateProjectOpen}
                                          style={{ width: '100%', maxWidth: '400px' }}
                                        >
                                          <Label color="green">PR</Label> {templateProject}
                                        </MenuToggle>
                                      )}
                                    >
                                      <DropdownList>
                                        <DropdownItem key="openshift" onClick={() => setTemplateProject('openshift')}>
                                          openshift
                                        </DropdownItem>
                                      </DropdownList>
                                    </Dropdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* VirtualMachine actions confirmation */}
                        <div
                          onClick={() => setVmActionsExpanded(!vmActionsExpanded)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '12px 0',
                          }}
                        >
                          <AngleRightIcon
                            style={{
                              transform: vmActionsExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                              fontSize: '14px',
                            }}
                          />
                          <Content>VirtualMachine actions confirmation</Content>
                        </div>
                        {vmActionsExpanded && (
                          <div style={{ padding: '16px 0 16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Content>Confirm VirtualMachine actions</Content>
                                <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                              </div>
                              <Switch
                                id="confirm-vm-actions-switch"
                                aria-label="Confirm VirtualMachine actions"
                                isChecked={confirmVmActions}
                                onChange={(_event, checked) => setConfirmVmActions(checked)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Guest management */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      onClick={() => setGuestManagementExpanded(!guestManagementExpanded)}
                      style={{
                        padding: '16px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <AngleRightIcon
                        style={{
                          transform: guestManagementExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                      <Title headingLevel="h3" size="md">
                        Guest management
                      </Title>
                    </div>
                    {guestManagementExpanded && (
                      <div style={{ padding: '0 24px 24px 56px' }}>
                        {/* Enable guest system log access */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Content>Enable guest system log access</Content>
                            <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                          </div>
                          <Switch
                            id="guest-system-log-switch"
                            aria-label="Enable guest system log access"
                            isChecked={guestSystemLogEnabled}
                            onChange={(_event, checked) => setGuestSystemLogEnabled(checked)}
                          />
                        </div>

                        {/* Automatic subscription of new RHEL VirtualMachines */}
                        <div
                          style={{
                            border: '1px solid var(--pf-t--global--border--color--default)',
                            borderRadius: 'var(--pf-t--global--border--radius--small)',
                          }}
                        >
                          <div
                            onClick={() => setAutoSubscriptionExpanded(!autoSubscriptionExpanded)}
                            style={{
                              padding: '16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <AngleRightIcon
                              style={{
                                transform: autoSubscriptionExpanded ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                                fontSize: '14px',
                              }}
                            />
                            <Content>Automatic subscription of new RHEL VirtualMachines</Content>
                          </div>
                          {autoSubscriptionExpanded && (
                            <div style={{ padding: '0 16px 16px 40px' }}>
                              <Content style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                Enable automatic subscription for Red Hat Enterprise Linux VirtualMachines.
                              </Content>

                              {/* Subscription type */}
                              <div style={{ marginBottom: '16px' }}>
                                <Content style={{ marginBottom: '8px', fontWeight: 500 }}>Subscription type</Content>
                                <Dropdown
                                  isOpen={subscriptionTypeOpen}
                                  onSelect={() => setSubscriptionTypeOpen(false)}
                                  onOpenChange={(isOpen) => setSubscriptionTypeOpen(isOpen)}
                                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                    <MenuToggle
                                      ref={toggleRef}
                                      onClick={() => setSubscriptionTypeOpen(!subscriptionTypeOpen)}
                                      isExpanded={subscriptionTypeOpen}
                                      style={{ width: '100%' }}
                                    >
                                      {subscriptionType}
                                    </MenuToggle>
                                  )}
                                >
                                  <DropdownList>
                                    <DropdownItem
                                      key="monitor"
                                      onClick={() => setSubscriptionType('Monitor and manage subscriptions')}
                                    >
                                      Monitor and manage subscriptions
                                    </DropdownItem>
                                  </DropdownList>
                                </Dropdown>
                              </div>

                              {/* Activation key */}
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <Content style={{ fontWeight: 500 }}>Activation key</Content>
                                  <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                                </div>
                                <TextInput
                                  type="text"
                                  value={activationKey}
                                  onChange={(_event, value) => setActivationKey(value)}
                                  placeholder="Enter activation key"
                                />
                              </div>

                              {/* Organization ID */}
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <Content style={{ fontWeight: 500 }}>Organization ID</Content>
                                  <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                                </div>
                                <TextInput
                                  type="text"
                                  value={organizationId}
                                  onChange={(_event, value) => setOrganizationId(value)}
                                  placeholder="Enter organization ID"
                                />
                              </div>

                              {/* Enable auto updates */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Content>Enable auto updates for RHEL VirtualMachines</Content>
                                  <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                                </div>
                                <Switch
                                  id="auto-updates-switch"
                                  aria-label="Enable auto updates for RHEL VirtualMachines"
                                  isChecked={autoUpdatesEnabled}
                                  onChange={(_event, checked) => setAutoUpdatesEnabled(checked)}
                                />
                              </div>

                              {/* Use custom registration server */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Checkbox
                                  id="custom-registration-server"
                                  label="Use custom registration server url"
                                  isChecked={customRegistrationServer}
                                  onChange={(_event, checked) => setCustomRegistrationServer(checked)}
                                />
                                <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resource management */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      onClick={() => setResourceManagementExpanded(!resourceManagementExpanded)}
                      style={{
                        padding: '16px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <AngleRightIcon
                        style={{
                          transform: resourceManagementExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                      <Title headingLevel="h3" size="md">
                        Resource management
                      </Title>
                    </div>
                    {resourceManagementExpanded && (
                      <div style={{ padding: '0 24px 24px 56px' }}>
                        {/* Auto-compute CPU and memory limits */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <Content>Auto-compute CPU and memory limits</Content>
                          <Switch
                            id="auto-cpu-memory-switch"
                            aria-label="Auto-compute CPU and memory limits"
                            isChecked={autoCpuMemory}
                            onChange={(_event, checked) => setAutoCpuMemory(checked)}
                          />
                        </div>

                        {/* Kernel Samepage Merging (KSM) */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Content>Kernel Samepage Merging (KSM)</Content>
                            <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                          </div>
                          <Switch
                            id="ksm-switch"
                            aria-label="Kernel Samepage Merging (KSM)"
                            isChecked={ksmEnabled}
                            onChange={(_event, checked) => setKsmEnabled(checked)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SCSI persistent reservation */}
                  <div
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                    }}
                  >
                    <div
                      onClick={() => setScsiExpanded(!scsiExpanded)}
                      style={{
                        padding: '16px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <AngleRightIcon
                        style={{
                          transform: scsiExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                      <Title headingLevel="h3" size="md">
                        SCSI persistent reservation
                      </Title>
                    </div>
                    {scsiExpanded && (
                      <div style={{ padding: '0 24px 24px 56px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Content>Enable persistent reservation</Content>
                            <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '14px' }} />
                          </div>
                          <Switch
                            id="scsi-persistent-switch"
                            aria-label="Enable persistent reservation"
                            isChecked={scsiPersistentEnabled}
                            onChange={(_event, checked) => setScsiPersistentEnabled(checked)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === 'User' && (
                <div style={{ padding: '24px' }}>
                  <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                    User Settings
                  </Title>
                  <Content>User settings content coming soon...</Content>
                </div>
              )}

              {activeSection === 'Preview features' && (
                <div style={{ padding: '24px' }}>
                  <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                    Preview Features
                  </Title>
                  <Content>Preview features content coming soon...</Content>
                </div>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Settings;

