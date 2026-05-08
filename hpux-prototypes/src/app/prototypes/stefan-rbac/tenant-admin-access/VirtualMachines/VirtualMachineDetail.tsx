import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Flex,
  FlexItem,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Tabs,
  Tab,
  TabTitleText,
  Label,
  Card,
  CardBody,
  Grid,
  GridItem,
  Content,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
} from '@patternfly/react-core';
import { SyncAltIcon, PauseCircleIcon, CaretDownIcon } from '@patternfly/react-icons';
import { getAllVirtualMachines } from '@app/data';

export const VirtualMachineDetail: React.FunctionComponent = () => {
  const { vmId } = useParams<{ vmId: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);

  // Get VM data
  const vm = React.useMemo(() => {
    return getAllVirtualMachines().find(v => v.id === vmId);
  }, [vmId]);

  if (!vm) {
    return <div style={{ padding: '24px' }}>VM not found (ID: {vmId})</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '-16px', marginLeft: '0', backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
      {/* Breadcrumb and Title Section */}
      <div style={{ padding: '24px', backgroundColor: 'var(--pf-t--global--background--color--primary--default)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <BreadcrumbItem>
            <Button variant="link" onClick={() => navigate('/virtualization/virtual-machines')} style={{ padding: 0 }}>
              VirtualMachines
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>VirtualMachine details</BreadcrumbItem>
        </Breadcrumb>

        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: 'var(--pf-t--global--color--brand--default)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '18px'
            }}>
              VM
            </div>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">{vm.name}</Title>
          </FlexItem>
          <FlexItem>
            <Label color={vm.status === 'Running' ? 'green' : vm.status === 'Error' ? 'red' : 'grey'} icon={<SyncAltIcon />}>
              {vm.status}
            </Label>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }} />
          <FlexItem>
            <Button variant="plain" aria-label="Refresh">
              <SyncAltIcon />
            </Button>
          </FlexItem>
          <FlexItem>
            <Button variant="plain" aria-label="Pause">
              <PauseCircleIcon />
            </Button>
          </FlexItem>
          <FlexItem>
            <Button variant="secondary">Start</Button>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={isActionsOpen}
              onSelect={() => setIsActionsOpen(false)}
              onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  isExpanded={isActionsOpen}
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="stop">Stop</DropdownItem>
                <DropdownItem key="restart">Restart</DropdownItem>
                <DropdownItem key="migrate">Migrate</DropdownItem>
                <DropdownItem key="clone">Clone</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
          style={{ paddingLeft: '24px' }}
        >
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Metrics</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>YAML</TabTitleText>} />
          <Tab eventKey={3} title={<TabTitleText>Configuration</TabTitleText>} />
          <Tab eventKey={4} title={<TabTitleText>Events</TabTitleText>} />
          <Tab eventKey={5} title={<TabTitleText>Console</TabTitleText>} />
          <Tab eventKey={6} title={<TabTitleText>Snapshots</TabTitleText>} />
          <Tab eventKey={7} title={<TabTitleText>Diagnostics</TabTitleText>} />
        </Tabs>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <Grid hasGutter>
          <GridItem span={5}>
            <Card>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Details</Title>
                <Divider style={{ marginBottom: '16px' }} />
                <DescriptionList isCompact>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Name</DescriptionListTerm>
                    <DescriptionListDescription>{vm.name}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color={vm.status === 'Running' ? 'green' : vm.status === 'Error' ? 'red' : 'grey'} icon={<SyncAltIcon />}>
                        {vm.status}
                      </Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Created</DescriptionListTerm>
                    <DescriptionListDescription>
                      22 Oct 2025, 10:07
                      <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>(10 days ago)</div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Operating system</DescriptionListTerm>
                    <DescriptionListDescription>
                      {vm.os}
                      <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>(Cloud Edition)</div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>CPU | Memory</DescriptionListTerm>
                    <DescriptionListDescription>{vm.cpu} CPU | {vm.memory} Memory</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Time zone</DescriptionListTerm>
                    <DescriptionListDescription>UTC</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>InstanceType</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color="blue" isCompact>CR</Label> u1.medium
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Preference</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color="blue" isCompact>CR</Label> {vm.os.toLowerCase()}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Hostname</DescriptionListTerm>
                    <DescriptionListDescription>{vm.name}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card style={{ height: '100%' }}>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>VNC console</Title>
                <Button variant="link" isInline style={{ padding: 0, marginBottom: '16px' }}>
                  Open web console
                </Button>
                <div style={{ 
                  backgroundColor: '#000', 
                  height: '300px', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'var(--pf-t--global--font--family--mono)'
                }}>
                  [Console Preview]
                </div>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={3}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Card>
                <CardBody>
                  <Title headingLevel="h3" size="md">Alerts (0)</Title>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>General</Title>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Namespace</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Label color="green" isCompact>NS</Label> {vm.namespaceId}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Node</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Label color="purple" isCompact>N</Label> ip-10-0-27...
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>VirtualMachineInstance</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Label color="blue" isCompact>VMI</Label> {vm.name.substring(0, 10)}...
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Pod</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Label color="teal" isCompact>P</Label> virt-launcher...
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Owner</DescriptionListTerm>
                      <DescriptionListDescription>No owner</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="md">Snapshots (0)</Title>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="link" isInline style={{ padding: 0 }}>Take snapshot</Button>
                    </FlexItem>
                  </Flex>
                  <Content>No snapshots found</Content>
                </CardBody>
              </Card>
            </div>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};

