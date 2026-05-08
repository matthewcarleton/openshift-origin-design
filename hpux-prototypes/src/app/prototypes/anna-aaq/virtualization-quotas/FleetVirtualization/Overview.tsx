import React, { useState, useMemo } from 'react';
import {
  Title,
  Card,
  CardBody,
  Grid,
  GridItem,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  ExpandableSection,
  Content,
  Divider,
} from '@patternfly/react-core';
import {
  RocketIcon,
  BullhornIcon,
  CubesIcon,
  ExclamationCircleIcon,
  OffIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  AngleRightIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { getAllVirtualMachines } from '@app/data/queries';
import { useImpersonation } from '@app/contexts/ImpersonationContext';

const Overview: React.FunctionComponent = () => {
  const { impersonatingUser, impersonatingGroups } = useImpersonation();
  const [isHealthAlertsOpen, setIsHealthAlertsOpen] = useState(false);
  const [isVMResourceOpen, setIsVMResourceOpen] = useState(false);
  const [isAdditionalStatusesExpanded, setIsAdditionalStatusesExpanded] = useState(false);

  // Check if impersonating dev-team-alpha group
  const isImpersonatingDevTeam = impersonatingGroups.includes('dev-team-alpha');

  // Get all VMs from the database and filter based on impersonation
  const allVMs = useMemo(() => {
    const vms = getAllVirtualMachines();
    
    if (isImpersonatingDevTeam) {
      // Only show VMs from dev-team-a-cluster and dev-team-b-cluster
      return vms.filter(vm => 
        vm.clusterId === 'cluster-dev-team-a' || vm.clusterId === 'cluster-dev-team-b'
      );
    }
    
    return vms;
  }, [isImpersonatingDevTeam]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalVMs = allVMs.length;
    const totalVCPUs = allVMs.reduce((sum, vm) => sum + vm.cpu, 0);
    const totalMemoryMiB = allVMs.reduce((sum, vm) => {
      const memoryGiB = parseInt(vm.memory.split(' ')[0]); // Extract number from "8 GiB"
      return sum + (memoryGiB * 1024); // Convert GiB to MiB
    }, 0);
    const totalStorageGiB = allVMs.reduce((sum, vm) => {
      const storageGiB = parseInt(vm.storage.split(' ')[0]); // Extract number from "50 GiB"
      return sum + storageGiB;
    }, 0);

    // Count VM statuses
    const statusCounts = {
      running: allVMs.filter(vm => vm.status === 'Running').length,
      stopped: allVMs.filter(vm => vm.status === 'Stopped').length,
      error: allVMs.filter(vm => vm.status === 'Error').length,
      paused: allVMs.filter(vm => vm.status === 'Paused').length,
      starting: allVMs.filter(vm => vm.status === 'Starting').length,
      stopping: allVMs.filter(vm => vm.status === 'Stopping').length,
    };

    // Group VMs by OS (since we don't have template field)
    const vmsByTemplate: { [key: string]: number } = {};
    allVMs.forEach(vm => {
      const os = vm.os || 'unknown';
      vmsByTemplate[os] = (vmsByTemplate[os] || 0) + 1;
    });

    // Group VMs by cluster
    const vmsByCluster: { [key: string]: number } = {};
    allVMs.forEach(vm => {
      const cluster = vm.clusterId;
      vmsByCluster[cluster] = (vmsByCluster[cluster] || 0) + 1;
    });

    // Group VMs by project (namespace)
    const vmsByProject: { [key: string]: number } = {};
    allVMs.forEach(vm => {
      const project = vm.namespaceId;
      vmsByProject[project] = (vmsByProject[project] || 0) + 1;
    });

    return {
      totalVMs,
      totalVCPUs,
      totalMemoryMiB,
      totalStorageGiB,
      statusCounts,
      vmsByTemplate,
      vmsByCluster,
      vmsByProject,
    };
  }, [allVMs]);

  // State for resource grouping selection
  const [resourceGrouping, setResourceGrouping] = useState<'templates' | 'clusters' | 'projects'>('templates');

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      {/* Getting started resources */}
      <ExpandableSection
        toggleText="Getting started resources"
        isExpanded={true}
        displaySize="lg"
      >
        <Grid hasGutter style={{ marginTop: '16px' }}>
          <GridItem span={4}>
            <Card isFullHeight>
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <RocketIcon style={{ fontSize: '20px', color: 'var(--pf-t--global--icon--color--brand--default)' }} />
                  <Title headingLevel="h3" size="lg">Quick Starts</Title>
                </div>
                <Content style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Learn how to create, import, and run virtual machines on OpenShift with step-by-step instructions and tasks.
                </Content>
                <div style={{ marginBottom: '12px' }}>
                  <Button variant="link" isInline>
                    Create a virtual machine from a volume
                  </Button>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <Button variant="link" isInline>
                  View all quick starts
                </Button>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card isFullHeight>
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <BullhornIcon style={{ fontSize: '20px', color: 'var(--pf-t--global--icon--color--brand--default)' }} />
                  <Title headingLevel="h3" size="lg">Feature highlights</Title>
                </div>
                <Content style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Read about the latest information and key virtualization features on the Virtualization highlights.
                </Content>
                <div style={{ marginBottom: '12px' }}>
                  <Button variant="link" isInline>
                    Save memory with OpenShift Virtualization using Free Page Reporting
                  </Button>
                  <span style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginLeft: '8px' }}>
                    • 8 min read
                  </span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Button variant="link" isInline>
                    OpenShift Virtualization 4.20 Highlights
                  </Button>
                  <span style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginLeft: '8px' }}>
                    • 5 min read
                  </span>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <Button variant="link" isInline>
                  Visit the blog
                </Button>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card isFullHeight>
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CubesIcon style={{ fontSize: '20px', color: 'var(--pf-t--global--icon--color--brand--default)' }} />
                  <Title headingLevel="h3" size="lg">Related operators</Title>
                </div>
                <Content style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Ease operational complexity with virtualization by using Operators.
                </Content>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 500 }}>Kubernetes NMState Operator</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 500 }}>OpenShift Data Foundation</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 500 }}>Migration Toolkit for Virtualization</div>
                  <Content style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Migrate multiple virtual machine workloads to OpenShift Virtualization.
                  </Content>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <Button variant="link" isInline>
                  Learn more about Operators
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </ExpandableSection>

      {/* Metric Cards */}
      <Grid hasGutter style={{ marginTop: '24px' }}>
        <GridItem span={3}>
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="2xl" style={{ textAlign: 'center', marginBottom: '8px' }}>
                {metrics.totalVMs}
              </Title>
              <Content style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                VirtualMachines
              </Content>
              <Content style={{ textAlign: 'center', fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>
                Last 8 days' trend
              </Content>
              <div style={{ height: '100px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  {Math.ceil(metrics.totalVMs * 1.2)} VMs
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  0 VMs
                </div>
                <div style={{ position: 'absolute', bottom: -20, right: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Oct 17
                </div>
                <svg width="100%" height="100" viewBox="0 0 280 100" style={{ marginLeft: '30px' }}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#d2d2d2" strokeWidth="1" />
                  ))}
                  {/* Area chart */}
                  <path
                    d="M 0 60 L 35 60 L 70 58 L 105 55 L 140 52 L 175 50 L 210 48 L 245 45 L 245 100 L 0 100 Z"
                    fill="rgba(6, 153, 220, 0.2)"
                    stroke="#0699dc"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="2xl" style={{ textAlign: 'center', marginBottom: '8px' }}>
                {metrics.totalVCPUs}
              </Title>
              <Content style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                vCPU usage
              </Content>
              <Content style={{ textAlign: 'center', fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>
                Last 8 days' trend
              </Content>
              <div style={{ height: '100px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  {Math.ceil(metrics.totalVCPUs * 1.1)} vCPU
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  0 vCPU
                </div>
                <div style={{ position: 'absolute', bottom: -20, right: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Oct 17
                </div>
                <svg width="100%" height="100" viewBox="0 0 280 100" style={{ marginLeft: '30px' }}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#d2d2d2" strokeWidth="1" />
                  ))}
                  {/* Area chart */}
                  <path
                    d="M 0 40 L 35 40 L 70 38 L 105 37 L 140 37 L 175 36 L 210 35 L 245 35 L 245 100 L 0 100 Z"
                    fill="rgba(6, 153, 220, 0.2)"
                    stroke="#0699dc"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="2xl" style={{ textAlign: 'center', marginBottom: '8px' }}>
                {(metrics.totalMemoryMiB / 1024).toFixed(1)}
              </Title>
              <Content style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                Memory (GiB)
              </Content>
              <Content style={{ textAlign: 'center', fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>
                Last 8 days' trend
              </Content>
              <div style={{ height: '100px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  {((metrics.totalMemoryMiB / 1024) * 1.1).toFixed(1)} GiB
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  0 GiB
                </div>
                <div style={{ position: 'absolute', bottom: -20, right: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Oct 17
                </div>
                <svg width="100%" height="100" viewBox="0 0 280 100" style={{ marginLeft: '30px' }}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#d2d2d2" strokeWidth="1" />
                  ))}
                  {/* Area chart */}
                  <path
                    d="M 0 20 L 35 20 L 70 18 L 105 18 L 140 17 L 175 15 L 210 15 L 245 15 L 245 100 L 0 100 Z"
                    fill="rgba(6, 153, 220, 0.2)"
                    stroke="#0699dc"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="2xl" style={{ textAlign: 'center', marginBottom: '8px' }}>
                {metrics.totalStorageGiB.toFixed(1)}
              </Title>
              <Content style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                Storage (GiB)
              </Content>
              <Content style={{ textAlign: 'center', fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>
                Last 8 days' trend
              </Content>
              <div style={{ height: '100px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  {(metrics.totalStorageGiB * 1.1).toFixed(1)} GiB
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  0 GiB
                </div>
                <div style={{ position: 'absolute', bottom: -20, right: 0, fontSize: '10px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Oct 17
                </div>
                <svg width="100%" height="100" viewBox="0 0 280 100" style={{ marginLeft: '30px' }}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#d2d2d2" strokeWidth="1" />
                  ))}
                  {/* Area chart */}
                  <path
                    d="M 0 12 L 35 12 L 70 11 L 105 11 L 140 10 L 175 10 L 210 10 L 245 10 L 245 100 L 0 100 Z"
                    fill="rgba(6, 153, 220, 0.2)"
                    stroke="#0699dc"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Alerts */}
      <Card style={{ marginTop: '24px' }}>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title headingLevel="h3" size="lg">Alerts (0)</Title>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="link">View all</Button>
              <Dropdown
                isOpen={isHealthAlertsOpen}
                onSelect={() => setIsHealthAlertsOpen(false)}
                onOpenChange={(isOpen) => setIsHealthAlertsOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsHealthAlertsOpen(!isHealthAlertsOpen)}
                    isExpanded={isHealthAlertsOpen}
                  >
                    Show virtualization health alerts
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="all">All alerts</DropdownItem>
                  <DropdownItem key="critical">Critical alerts only</DropdownItem>
                  <DropdownItem key="warning">Warning alerts only</DropdownItem>
                </DropdownList>
              </Dropdown>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bottom section: VM statuses and VMs per resource */}
      <Grid hasGutter style={{ marginTop: '24px' }}>
        <GridItem span={6}>
          <Card isFullHeight>
            <CardBody>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>
                VirtualMachine statuses
              </Title>
              <Grid hasGutter>
                <GridItem span={3}>
                  <div style={{ textAlign: 'center' }}>
                    <ExclamationCircleIcon style={{ fontSize: '24px', color: 'var(--pf-t--global--icon--color--status--danger--default)', marginBottom: '8px' }} />
                    <Title headingLevel="h2" size="xl">{metrics.statusCounts.error}</Title>
                    <Content style={{ fontSize: '14px' }}>Error</Content>
                  </div>
                </GridItem>
                <GridItem span={3}>
                  <div style={{ textAlign: 'center' }}>
                    <CheckCircleIcon style={{ fontSize: '24px', color: 'var(--pf-t--global--icon--color--status--success--default)', marginBottom: '8px' }} />
                    <Title headingLevel="h2" size="xl">{metrics.statusCounts.running}</Title>
                    <Content style={{ fontSize: '14px' }}>Running</Content>
                  </div>
                </GridItem>
                <GridItem span={3}>
                  <div style={{ textAlign: 'center' }}>
                    <OffIcon style={{ fontSize: '24px', color: 'var(--pf-t--global--icon--color--subtle)', marginBottom: '8px' }} />
                    <Title headingLevel="h2" size="xl">{metrics.statusCounts.stopped}</Title>
                    <Content style={{ fontSize: '14px' }}>Stopped</Content>
                  </div>
                </GridItem>
                <GridItem span={3}>
                  <div style={{ textAlign: 'center' }}>
                    <PauseCircleIcon style={{ fontSize: '24px', color: 'var(--pf-t--global--icon--color--subtle)', marginBottom: '8px' }} />
                    <Title headingLevel="h2" size="xl">{metrics.statusCounts.paused}</Title>
                    <Content style={{ fontSize: '14px' }}>Paused</Content>
                  </div>
                </GridItem>
              </Grid>
              <Divider style={{ margin: '24px 0' }} />
              <ExpandableSection
                toggleText={`Additional statuses (${metrics.statusCounts.starting + metrics.statusCounts.stopping})`}
                isExpanded={isAdditionalStatusesExpanded}
                onToggle={(_event, isExpanded) => setIsAdditionalStatusesExpanded(isExpanded)}
              >
                <div style={{ paddingTop: '16px' }}>
                  <Grid hasGutter>
                    {metrics.statusCounts.starting > 0 && (
                      <GridItem span={6}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                          <Content style={{ fontSize: '14px' }}>Starting</Content>
                          <Title headingLevel="h4" size="md">{metrics.statusCounts.starting}</Title>
                        </div>
                      </GridItem>
                    )}
                    {metrics.statusCounts.stopping > 0 && (
                      <GridItem span={6}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                          <Content style={{ fontSize: '14px' }}>Stopping</Content>
                          <Title headingLevel="h4" size="md">{metrics.statusCounts.stopping}</Title>
                        </div>
                      </GridItem>
                    )}
                  </Grid>
                </div>
              </ExpandableSection>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={6}>
          <Card isFullHeight>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title headingLevel="h3" size="lg">
                  VirtualMachines per resource
                </Title>
                <Dropdown
                  isOpen={isVMResourceOpen}
                  onSelect={() => setIsVMResourceOpen(false)}
                  onOpenChange={(isOpen) => setIsVMResourceOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsVMResourceOpen(!isVMResourceOpen)}
                      isExpanded={isVMResourceOpen}
                    >
                      Show VirtualMachine per {resourceGrouping === 'templates' ? 'OS' : resourceGrouping === 'clusters' ? 'Clusters' : 'Projects'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="templates" onClick={() => { setResourceGrouping('templates'); setIsVMResourceOpen(false); }}>
                      Show VirtualMachine per OS
                    </DropdownItem>
                    <DropdownItem key="clusters" onClick={() => { setResourceGrouping('clusters'); setIsVMResourceOpen(false); }}>
                      Show VirtualMachine per Clusters
                    </DropdownItem>
                    <DropdownItem key="projects" onClick={() => { setResourceGrouping('projects'); setIsVMResourceOpen(false); }}>
                      Show VirtualMachine per Projects
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                {/* Donut chart */}
                {(() => {
                  const dataSource = resourceGrouping === 'templates' ? metrics.vmsByTemplate :
                                    resourceGrouping === 'clusters' ? metrics.vmsByCluster :
                                    metrics.vmsByProject;
                  
                  const entries = Object.entries(dataSource);
                  const colors = ['#06c', '#73bcf7', '#009596', '#f0ab00', '#c9190b', '#a18fff', '#f4c145', '#92d400'];
                  
                  // Calculate total circumference and segments
                  const totalVMs = metrics.totalVMs;
                  const circumference = 2 * Math.PI * 70; // radius = 70
                  let currentOffset = 0;

                  return (
                    <>
                      <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '24px' }}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          {entries.map(([name, count], index) => {
                            const percentage = count / totalVMs;
                            const segmentLength = percentage * circumference;
                            const offset = currentOffset;
                            currentOffset += segmentLength;
                            
                            return (
                              <circle
                                key={name}
                                cx="100"
                                cy="100"
                                r="70"
                                fill="none"
                                stroke={colors[index % colors.length]}
                                strokeWidth="40"
                                strokeDasharray={`${segmentLength} ${circumference}`}
                                strokeDashoffset={-offset}
                                transform="rotate(-90 100 100)"
                              />
                            );
                          })}
                        </svg>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <Title headingLevel="h2" size="2xl">{totalVMs}</Title>
                          <Content style={{ fontSize: '16px' }}>VMs</Content>
                        </div>
                      </div>
                      {/* Legend */}
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
                        {entries.map(([name, count], index) => (
                          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: colors[index % colors.length], borderRadius: '2px', flexShrink: 0 }}></div>
                            <Content style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{count} {name}</Content>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Overview;

