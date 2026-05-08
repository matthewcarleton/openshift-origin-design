import React from 'react';
import { Title, Tabs, Tab, TabTitleText, Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { Policies } from '../../Governance/Policies';

export const GovernancePage: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(2); // Policies tab

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div className="governance-page-container">
      <div className="page-header-section">
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Title headingLevel="h1" size="lg">
              Governance
            </Title>
          </FlexItem>
          <FlexItem>
            <Tooltip content="Governance policies help ensure compliance and security across clusters">
              <HelpIcon style={{ color: '#6a6e73' }} />
            </Tooltip>
          </FlexItem>
        </Flex>

        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Governance tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Policy sets</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>Policies</TabTitleText>} />
          <Tab eventKey={3} title={<TabTitleText>Discovered policies</TabTitleText>} />
        </Tabs>
      </div>
      
      <div className="page-content-section">
        {activeTabKey === 2 && <Policies />}
      </div>
    </div>
  );
};

