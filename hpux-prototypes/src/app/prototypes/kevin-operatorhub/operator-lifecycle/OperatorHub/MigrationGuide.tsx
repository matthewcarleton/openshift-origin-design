import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Title,
  List,
  ListItem,
  Alert,
  Tabs,
  Tab,
  TabTitleText,
  CodeBlock,
  CodeBlockCode,
  Flex,
  FlexItem,
  Card,
  CardBody,
  CardTitle,
  Label,
  LabelGroup,
} from '@patternfly/react-core';
import {
  InfoCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@patternfly/react-icons';

interface MigrationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MigrationGuide: React.FunctionComponent<MigrationGuideProps> = ({ isOpen, onClose }) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const olmV0Example = `apiVersion: operators.coreos.com/v1alpha1
kind: ClusterServiceVersion
metadata:
  name: my-operator.v1.0.0
spec:
  displayName: "My Operator"
  version: 1.0.0
  replaces: my-operator.v0.9.0
  installModes:
  - type: OwnNamespace
    supported: true
  - type: SingleNamespace
    supported: true
  - type: MultiNamespace
    supported: false
  - type: AllNamespaces
    supported: false`;

  const olmV1Example = `apiVersion: operators.operatorframework.io/v1alpha1
kind: ClusterExtension
metadata:
  name: my-operator
spec:
  packageName: my-operator
  version: "1.0.0"
  installNamespace: my-operator-system
  serviceAccount:
    name: my-operator-controller-manager`;

  return (
    <Modal
      variant={ModalVariant.large}
      title="OLM Migration Guide"
      isOpen={isOpen}
      onClose={onClose}
    >

      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>}>
          <div style={{ padding: '48px 32px' }}>
            <Alert
              variant="info"
              title="Important Migration Information"
              style={{ marginBottom: '48px' }}
            >
              <div style={{ fontSize: '16px', lineHeight: '1.8', padding: '16px 0' }}>
                OLM v1 represents a significant evolution in operator lifecycle management with
                improved APIs, simplified installation, and better resource management.
              </div>
            </Alert>

            <div style={{ margin: '48px 0 32px 0' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                Key Differences
              </Title>
              <p style={{ fontSize: '16px', color: 'var(--pf-v6-global--Color--200)', lineHeight: '1.6' }}>
                Understanding these fundamental changes will help you plan your migration strategy.
              </p>
            </div>

            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
              <FlexItem>
                <Card>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Label color="blue">OLM v0</Label>
                      </FlexItem>
                      <FlexItem>
                        <ArrowRightIcon />
                      </FlexItem>
                      <FlexItem>
                        <Label color="green">OLM v1</Label>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody style={{ padding: '40px' }}>
                    <List>
                      <ListItem style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.8', padding: '8px 0' }}>
                        <strong>API:</strong> ClusterServiceVersion (CSV) → ClusterExtension
                      </ListItem>
                      <ListItem style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.8', padding: '8px 0' }}>
                        <strong>Installation:</strong> Subscription-based → Direct package installation
                      </ListItem>
                      <ListItem style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.8', padding: '8px 0' }}>
                        <strong>Dependencies:</strong> Manual resolution → Automatic dependency management
                      </ListItem>
                      <ListItem style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.8', padding: '8px 0' }}>
                        <strong>Updates:</strong> Channel-based → Version constraints
                      </ListItem>
                      <ListItem style={{ fontSize: '16px', lineHeight: '1.8', padding: '8px 0' }}>
                        <strong>Namespace:</strong> Complex scoping → Simplified namespace model
                      </ListItem>
                    </List>
                  </CardBody>
                </Card>
              </FlexItem>
            </Flex>
          </div>
        </Tab>

        <Tab eventKey={1} title={<TabTitleText>Compatibility Matrix</TabTitleText>}>
          <div style={{ padding: '48px 32px' }}>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                Operator Compatibility Status
              </Title>
              <p style={{ marginTop: '16px', fontSize: '16px', color: 'var(--pf-v6-global--Color--200)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                Understanding the compatibility status helps you plan your migration strategy effectively.
              </p>
            </div>

            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
              <FlexItem>
                <Card style={{ marginBottom: '24px' }}>
                  <CardBody style={{ padding: '40px' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXl' }}>
                      <FlexItem>
                        <div style={{ fontSize: '32px', padding: '8px' }}>
                          <CheckCircleIcon color="green" />
                        </div>
                      </FlexItem>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <div>
                          <h4 style={{ marginBottom: '12px', fontSize: '20px' }}>Compatible</h4>
                          <div style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--pf-v6-global--Color--200)' }}>
                            Operators that work seamlessly with both OLM v0 and v1
                          </div>
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <LabelGroup>
                          <Label color="green" style={{ fontSize: '14px', padding: '8px 12px' }}>No action required</Label>
                        </LabelGroup>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </FlexItem>

              <FlexItem>
                <Card style={{ marginBottom: '24px' }}>
                  <CardBody style={{ padding: '40px' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXl' }}>
                      <FlexItem>
                        <div style={{ fontSize: '32px', padding: '8px' }}>
                          <ExclamationTriangleIcon color="orange" />
                        </div>
                      </FlexItem>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <div>
                          <h4 style={{ marginBottom: '12px', fontSize: '20px' }}>Migration Required</h4>
                          <div style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--pf-v6-global--Color--200)' }}>
                            Operators that need updates to work with OLM v1
                          </div>
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <LabelGroup>
                          <Label color="orange" style={{ fontSize: '14px', padding: '8px 12px' }}>Action needed</Label>
                        </LabelGroup>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </FlexItem>

              <FlexItem>
                <Card style={{ marginBottom: '24px' }}>
                  <CardBody style={{ padding: '40px' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXl' }}>
                      <FlexItem>
                        <div style={{ fontSize: '32px', padding: '8px' }}>
                          <ExclamationTriangleIcon color="red" />
                        </div>
                      </FlexItem>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <div>
                          <h4 style={{ marginBottom: '12px', fontSize: '20px' }}>Deprecated</h4>
                          <div style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--pf-v6-global--Color--200)' }}>
                            Operators that are no longer maintained or supported
                          </div>
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <LabelGroup>
                          <Label color="red" style={{ fontSize: '14px', padding: '8px 12px' }}>Find alternative</Label>
                        </LabelGroup>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </FlexItem>
            </Flex>
          </div>
        </Tab>

        <Tab eventKey={2} title={<TabTitleText>Code Examples</TabTitleText>}>
          <div style={{ padding: '24px 0' }}>
            <div style={{ marginBottom: '32px' }}>
              <Title headingLevel="h3" size="lg">
                API Comparison
              </Title>
              <p style={{ marginTop: '8px', fontSize: '15px', color: 'var(--pf-v6-global--Color--200)', lineHeight: '1.5' }}>
                Compare the key differences between OLM v0 and v1 API definitions.
              </p>
            </div>

            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXl' }}>
              <FlexItem>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>OLM v0 (ClusterServiceVersion)</h4>
                  <p style={{ fontSize: '14px', color: 'var(--pf-v6-global--Color--200)', marginBottom: '16px' }}>
                    Traditional operator definition using ClusterServiceVersion with complex configuration.
                  </p>
                </div>
                <CodeBlock>
                  <CodeBlockCode>{olmV0Example}</CodeBlockCode>
                </CodeBlock>
              </FlexItem>

              <FlexItem>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>OLM v1 (ClusterExtension)</h4>
                  <p style={{ fontSize: '14px', color: 'var(--pf-v6-global--Color--200)', marginBottom: '16px' }}>
                    Simplified operator definition using ClusterExtension with streamlined configuration.
                  </p>
                </div>
                <CodeBlock>
                  <CodeBlockCode>{olmV1Example}</CodeBlockCode>
                </CodeBlock>
              </FlexItem>
            </Flex>

            <div style={{ margin: '40px 0 32px 0' }}>
              <Alert variant="warning" title="Migration Tips">
                <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                  <List>
                    <ListItem style={{ marginBottom: '8px' }}>
                      Review your operator's install modes and namespace requirements
                    </ListItem>
                    <ListItem style={{ marginBottom: '8px' }}>
                      Update your CI/CD pipelines to use the new ClusterExtension API
                    </ListItem>
                    <ListItem style={{ marginBottom: '8px' }}>
                      Test thoroughly in a development environment before production migration
                    </ListItem>
                    <ListItem>
                      Consider using the compatibility layers during transition period
                    </ListItem>
                  </List>
                </div>
              </Alert>
            </div>
          </div>
        </Tab>

        <Tab eventKey={3} title={<TabTitleText>Migration Steps</TabTitleText>}>
          <div style={{ padding: '24px 0' }}>
            <div style={{ marginBottom: '32px' }}>
              <Title headingLevel="h3" size="lg">
                Step-by-Step Migration Process
              </Title>
              <p style={{ marginTop: '8px', fontSize: '15px', color: 'var(--pf-v6-global--Color--200)', lineHeight: '1.5' }}>
                Follow these systematic steps to ensure a smooth migration from OLM v0 to v1.
              </p>
            </div>

            <List isPlain style={{ fontSize: '15px' }}>
              <ListItem style={{ marginBottom: '24px' }}>
                <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Label color="blue" style={{ fontSize: '16px', padding: '8px 12px' }}>1</Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <div>
                      <h5 style={{ marginBottom: '8px', fontSize: '18px' }}>Assessment</h5>
                      <div style={{ fontSize: '15px', lineHeight: '1.5', color: 'var(--pf-v6-global--Color--200)' }}>
                        Identify all installed operators and their compatibility status using the unified catalog view
                      </div>
                    </div>
                  </FlexItem>
                </Flex>
              </ListItem>

              <ListItem style={{ marginBottom: '24px' }}>
                <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Label color="blue" style={{ fontSize: '16px', padding: '8px 12px' }}>2</Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <div>
                      <h5 style={{ marginBottom: '8px', fontSize: '18px' }}>Planning</h5>
                      <div style={{ fontSize: '15px', lineHeight: '1.5', color: 'var(--pf-v6-global--Color--200)' }}>
                        Create a comprehensive migration plan with timelines, dependencies, and rollback procedures
                      </div>
                    </div>
                  </FlexItem>
                </Flex>
              </ListItem>

              <ListItem style={{ marginBottom: '24px' }}>
                <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Label color="blue" style={{ fontSize: '16px', padding: '8px 12px' }}>3</Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <div>
                      <h5 style={{ marginBottom: '8px', fontSize: '18px' }}>Testing</h5>
                      <div style={{ fontSize: '15px', lineHeight: '1.5', color: 'var(--pf-v6-global--Color--200)' }}>
                        Test operator functionality thoroughly in a non-production environment using OLM v1 APIs
                      </div>
                    </div>
                  </FlexItem>
                </Flex>
              </ListItem>

              <ListItem style={{ marginBottom: '24px' }}>
                <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Label color="blue" style={{ fontSize: '16px', padding: '8px 12px' }}>4</Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <div>
                      <h5 style={{ marginBottom: '8px', fontSize: '18px' }}>Migration</h5>
                      <div style={{ fontSize: '15px', lineHeight: '1.5', color: 'var(--pf-v6-global--Color--200)' }}>
                        Execute the migration following your planned timeline, starting with non-critical operators
                      </div>
                    </div>
                  </FlexItem>
                </Flex>
              </ListItem>

              <ListItem>
                <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Label color="green" style={{ fontSize: '16px', padding: '8px 12px' }}>5</Label>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <div>
                      <h5 style={{ marginBottom: '8px', fontSize: '18px' }}>Validation</h5>
                      <div style={{ fontSize: '15px', lineHeight: '1.5', color: 'var(--pf-v6-global--Color--200)' }}>
                        Verify all operators are functioning correctly post-migration and monitor for any issues
                      </div>
                    </div>
                  </FlexItem>
                </Flex>
              </ListItem>
            </List>
          </div>
        </Tab>
      </Tabs>
    </Modal>
  );
};

export { MigrationGuide };