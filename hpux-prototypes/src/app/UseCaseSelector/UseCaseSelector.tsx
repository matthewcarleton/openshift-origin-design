import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Title,
  Content,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleAction,
} from '@patternfly/react-core';
import { useUseCaseContext } from '@app/shared/contexts/UseCaseContext';

export const UseCaseSelector: React.FC = () => {
  const navigate = useNavigate();
  const { setUseCase } = useUseCaseContext();
  const [isUseCase1DropdownOpen, setIsUseCase1DropdownOpen] = React.useState(false);
  const [isAAQDropdownOpen, setIsAAQDropdownOpen] = React.useState(false);

  const handleUseCaseSelect = (useCaseId: 'use-case-1' | 'use-case-2' | 'use-case-aaq' | 'use-case-cclm' | 'use-case-empty-states' | 'use-case-aaq-empty-states' | 'use-case-operator-lifecycle') => {
    setUseCase(useCaseId);
    // Navigate to appropriate starting page based on use case
    if (useCaseId === 'use-case-aaq') {
      navigate('/core/virtualization/overview');
    } else if (useCaseId === 'use-case-aaq-empty-states') {
      navigate('/core/virtualization/quotas');
    } else if (useCaseId === 'use-case-cclm') {
      navigate('/virtualization/virtual-machines');
    } else if (useCaseId === 'use-case-empty-states') {
      // For RBAC empty states, go to Identities page with User management navigation expanded
      navigate('/user-management/identities');
    } else if (useCaseId === 'use-case-operator-lifecycle') {
      // For operator lifecycle, go to software catalog
      navigate('/ecosystem/softwarecatalog');
    } else {
      // For use-case-1 and use-case-2, go to clusters
      navigate('/clusters');
    }
  };

  const onUseCase1DropdownToggle = () => {
    setIsUseCase1DropdownOpen(!isUseCase1DropdownOpen);
  };

  const onUseCase1DropdownSelect = () => {
    setIsUseCase1DropdownOpen(false);
  };

  const onAAQDropdownToggle = () => {
    setIsAAQDropdownOpen(!isAAQDropdownOpen);
  };

  const onAAQDropdownSelect = () => {
    setIsAAQDropdownOpen(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '40px 64px',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ textAlign: 'left', marginBottom: '48px' }}>
          <Title headingLevel="h1" size="4xl" style={{ color: '#000000', marginBottom: '16px' }}>
            Welcome to UX prototypes
          </Title>
          <Content component="p" style={{ color: '#000000', fontSize: '18px', maxWidth: '700px' }}>
            Select a prototype to explore
          </Content>
        </div>

        <Grid hasGutter>
          <GridItem span={6}>
            <Title headingLevel="h2" size="xl" style={{ color: '#000000', marginBottom: '24px' }}>
              ACM RBAC
            </Title>
            <Grid hasGutter>
              <GridItem span={12}>
            <Card
              isCompact
              style={{
                maxWidth: '600px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
              }}
            >
              <CardBody>
                <Flex alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Title headingLevel="h3" size="xl" style={{ marginBottom: '8px' }}>
                      ACM RBAC Prototype
                    </Title>
                    <Content component="p" style={{ color: '#6a6e73', fontSize: '16px', margin: 0 }}>
                      Granting permissions experience
                    </Content>
                  </FlexItem>
                  <FlexItem style={{ marginLeft: '16px', display: 'flex', gap: '0' }}>
                    <Button
                      variant="primary"
                      onClick={() => handleUseCaseSelect('use-case-1')}
                      style={{ 
                        borderTopRightRadius: 0, 
                        borderBottomRightRadius: 0,
                        borderRight: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Use case 1
                    </Button>
                    <Dropdown
                      isOpen={isUseCase1DropdownOpen}
                      onSelect={onUseCase1DropdownSelect}
                      onOpenChange={(isOpen) => setIsUseCase1DropdownOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="primary"
                          isExpanded={isUseCase1DropdownOpen}
                          onClick={onUseCase1DropdownToggle}
                          style={{ 
                            borderTopLeftRadius: 0, 
                            borderBottomLeftRadius: 0,
                            minWidth: '44px'
                          }}
                        />
                      )}
                    >
                      <DropdownList>
                        <DropdownItem
                          key="use-case-1"
                          onClick={() => {
                            handleUseCaseSelect('use-case-1');
                          }}
                          description="Fleet admin → Tenant delegation"
                        >
                          Use case 1
                        </DropdownItem>
                        <DropdownItem
                          key="use-case-2"
                          onClick={() => {
                            handleUseCaseSelect('use-case-2');
                          }}
                          description="Tenant admin → Project access"
                        >
                          Use case 2
                        </DropdownItem>
                        <DropdownItem
                          key="empty-states"
                          onClick={() => {
                            handleUseCaseSelect('use-case-empty-states');
                          }}
                          description="ACM RBAC empty state designs"
                        >
                          Empty states
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem span={6}>
            <Title headingLevel="h2" size="xl" style={{ color: '#000000', marginBottom: '24px' }}>
              Application Aware Quota
            </Title>
            <Grid hasGutter>
              <GridItem span={12}>
                <Card
                  isCompact
                  style={{
                    maxWidth: '600px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <CardBody>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <Title headingLevel="h3" size="xl" style={{ marginBottom: '8px' }}>
                          AAQ
                        </Title>
                        <Content component="p" style={{ color: '#6a6e73', fontSize: '16px', margin: 0 }}>
                          AAQ operator quota management experience
                        </Content>
                      </FlexItem>
                  <FlexItem style={{ marginLeft: '16px', display: 'flex', gap: '0' }}>
                    <Button
                      variant="primary"
                      onClick={() => handleUseCaseSelect('use-case-aaq')}
                      style={{ 
                        borderTopRightRadius: 0, 
                        borderBottomRightRadius: 0,
                        borderRight: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Explore
                    </Button>
                    <Dropdown
                      isOpen={isAAQDropdownOpen}
                      onSelect={onAAQDropdownSelect}
                      onOpenChange={(isOpen) => setIsAAQDropdownOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="primary"
                          isExpanded={isAAQDropdownOpen}
                          onClick={onAAQDropdownToggle}
                          style={{ 
                            borderTopLeftRadius: 0, 
                            borderBottomLeftRadius: 0,
                            minWidth: '44px'
                          }}
                        />
                      )}
                    >
                      <DropdownList>
                        <DropdownItem
                          key="aaq"
                          onClick={() => {
                            handleUseCaseSelect('use-case-aaq');
                          }}
                          description="Create virtualization quota"
                        >
                          Explore
                        </DropdownItem>
                        <DropdownItem
                          key="aaq-empty-states"
                          onClick={() => {
                            handleUseCaseSelect('use-case-aaq-empty-states');
                          }}
                          description="AAQ empty state designs"
                        >
                          AAQ Empty states
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        {/* ACM Cross cluster live migration section */}
        <Grid hasGutter style={{ marginTop: '48px' }}>
          <GridItem span={6}>
            <Title headingLevel="h2" size="xl" style={{ color: '#000000', marginBottom: '24px' }}>
              ACM Cross cluster live migration
            </Title>
            <Grid hasGutter>
              <GridItem span={12}>
                <Card
                  isCompact
                  style={{
                    maxWidth: '600px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <CardBody>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <Title headingLevel="h3" size="xl" style={{ marginBottom: '8px' }}>
                          Cross cluster live migration
                        </Title>
                        <Content component="p" style={{ color: '#6a6e73', fontSize: '16px', margin: 0 }}>
                          Live migrate VMs across clusters
                        </Content>
                      </FlexItem>
                      <FlexItem style={{ marginLeft: '16px' }}>
                        <Button
                          variant="primary"
                          onClick={() => handleUseCaseSelect('use-case-cclm')}
                        >
                          Explore
                        </Button>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        {/* OpenShift Operator Lifecycle section */}
        <Grid hasGutter style={{ marginTop: '48px' }}>
          <GridItem span={6}>
            <Title headingLevel="h2" size="xl" style={{ color: '#000000', marginBottom: '24px' }}>
              OpenShift Operator Lifecycle
            </Title>
            <Grid hasGutter>
              <GridItem span={12}>
                <Card
                  isCompact
                  style={{
                    maxWidth: '600px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <CardBody>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <Title headingLevel="h3" size="xl" style={{ marginBottom: '8px' }}>
                          OpenShift operator updates
                        </Title>
                        <Content component="p" style={{ color: '#6a6e73', fontSize: '16px', margin: 0 }}>
                          Unified software catalog for discovering operators
                        </Content>
                      </FlexItem>
                      <FlexItem style={{ marginLeft: '16px' }}>
                        <Button
                          variant="primary"
                          onClick={() => handleUseCaseSelect('use-case-operator-lifecycle')}
                        >
                          Explore v1
                        </Button>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};

