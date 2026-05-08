import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Title,
  Content,
  EmptyState,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

const Migrations: React.FunctionComponent = () => {
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 5 minutes');

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Card>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title headingLevel="h3" size="lg">
              VirtualMachineInstanceMigrations information
            </Title>
            <Dropdown
              isOpen={timeRangeOpen}
              onSelect={() => setTimeRangeOpen(false)}
              onOpenChange={(isOpen) => setTimeRangeOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setTimeRangeOpen(!timeRangeOpen)}
                  isExpanded={timeRangeOpen}
                >
                  {selectedTimeRange}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="5min" onClick={() => setSelectedTimeRange('Last 5 minutes')}>
                  Last 5 minutes
                </DropdownItem>
                <DropdownItem key="30min" onClick={() => setSelectedTimeRange('Last 30 minutes')}>
                  Last 30 minutes
                </DropdownItem>
                <DropdownItem key="1hour" onClick={() => setSelectedTimeRange('Last 1 hour')}>
                  Last 1 hour
                </DropdownItem>
                <DropdownItem key="6hours" onClick={() => setSelectedTimeRange('Last 6 hours')}>
                  Last 6 hours
                </DropdownItem>
                <DropdownItem key="24hours" onClick={() => setSelectedTimeRange('Last 24 hours')}>
                  Last 24 hours
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </div>

          {/* Empty state */}
          <EmptyState>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              <SearchIcon style={{ fontSize: '80px', color: '#6a6e73', marginBottom: '24px' }} />
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                No results found
              </Title>
              <Content style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center' }}>
                Migrate a VirtualMachine to a different Node or change the selected time range.
              </Content>
            </div>
          </EmptyState>
        </CardBody>
      </Card>
    </div>
  );
};

export default Migrations;

