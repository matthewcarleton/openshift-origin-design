import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  TextInput,
  Title,
  Content,
  Grid,
  GridItem,
  CodeBlock,
  CodeBlockCode,
  Switch,
  Flex,
  FlexItem,
  SearchInput,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

const AddLDAPProvider: React.FunctionComponent = () => {
  const navigate = useNavigate();
  useDocumentTitle('ACM | Add Identity Provider - LDAP');

  // Form state
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [bindDN, setBindDN] = React.useState('');
  const [bindPassword, setBindPassword] = React.useState('');
  const [idAttributes, setIdAttributes] = React.useState(['']);
  const [preferredUsernameAttributes, setPreferredUsernameAttributes] = React.useState(['']);
  const [nameAttributes, setNameAttributes] = React.useState(['']);
  const [emailAttributes, setEmailAttributes] = React.useState(['']);
  const [caFile, setCaFile] = React.useState('');
  const [isYAMLView, setIsYAMLView] = React.useState(false);
  const [selectedClusters, setSelectedClusters] = React.useState<Set<number>>(new Set());
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');

  // Mock clusters data
  const mockClusters = [
    { id: 1, name: 'local-cluster', status: 'Ready', provider: 'AWS' },
    { id: 2, name: 'dev-linux-a', status: 'Ready', provider: 'AWS' },
    { id: 3, name: 'dev-win-a', status: 'Ready', provider: 'Azure' },
    { id: 4, name: 'prod-cluster-1', status: 'Ready', provider: 'GCP' },
    { id: 5, name: 'prod-cluster-2', status: 'Ready', provider: 'AWS' },
  ];

  const filteredClusters = mockClusters.filter(cluster =>
    cluster.name.toLowerCase().includes(clusterSearchValue.toLowerCase())
  );

  const isAllClustersSelected = selectedClusters.size === filteredClusters.length && filteredClusters.length > 0;

  const handleSelectAllClusters = (isSelecting: boolean) => {
    if (isSelecting) {
      setSelectedClusters(new Set(filteredClusters.map(c => c.id)));
    } else {
      setSelectedClusters(new Set());
    }
  };

  const handleSelectCluster = (clusterId: number, isSelecting: boolean) => {
    const newSelected = new Set(selectedClusters);
    if (isSelecting) {
      newSelected.add(clusterId);
    } else {
      newSelected.delete(clusterId);
    }
    setSelectedClusters(newSelected);
  };

  const handleCancel = () => {
    navigate('/user-management/identity-providers');
  };

  const handleCreate = () => {
    console.log('Creating LDAP Identity Provider:', {
      name,
      url,
      bindDN,
      bindPassword,
      idAttributes,
      preferredUsernameAttributes,
      nameAttributes,
      emailAttributes,
      caFile,
      selectedClusters: Array.from(selectedClusters),
    });
    navigate('/user-management/identity-providers');
  };

  const addAttribute = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const updateAttribute = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const newAttributes = [...prev];
      newAttributes[index] = value;
      return newAttributes;
    });
  };

  // Generate YAML
  const generateYAML = () => {
    return `apiVersion: config.openshift.io/v1
kind: OAuth
metadata:
  name: cluster
spec:
  identityProviders:
  - name: ${name || 'ldap-provider'}
    mappingMethod: claim
    type: LDAP
    ldap:
      url: ${url || 'ldap://ldap.example.com:389'}
      bindDN: ${bindDN || 'cn=admin,dc=example,dc=com'}
      bindPassword:
        name: ${name || 'ldap-provider'}-bind-password
      insecure: false
      attributes:
        id:
${idAttributes.filter(a => a).map(attr => `        - ${attr}`).join('\n') || '        - dn'}
        preferredUsername:
${preferredUsernameAttributes.filter(a => a).map(attr => `        - ${attr}`).join('\n') || '        - uid'}
        name:
${nameAttributes.filter(a => a).map(attr => `        - ${attr}`).join('\n') || '        - cn'}
        email:
${emailAttributes.filter(a => a).map(attr => `        - ${attr}`).join('\n') || '        - mail'}${caFile ? `
      ca:
        name: ${name || 'ldap-provider'}-ca-cert` : ''}`;
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '24px' }}>
        <Breadcrumb style={{ marginBottom: '16px', paddingLeft: '24px', paddingRight: '24px' }}>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/user-management/identity-providers'); }}>
            Identity providers
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Add Identity provider: LDAP (Active directory)</BreadcrumbItem>
        </Breadcrumb>

        <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                Add Identity provider: LDAP (Active directory)
              </Title>
            </FlexItem>
            <FlexItem>
              <Switch
                id="yaml-toggle"
                label="YAML"
                isChecked={isYAMLView}
                onChange={(_event, checked) => setIsYAMLView(checked)}
              />
            </FlexItem>
          </Flex>

          <Content component="p" className="pf-v6-u-mt-sm pf-v6-u-color-200">
            Integrate with an LDAP identity provider. Configure the LDAP identity provider to validate user names and passwords against an LDAPv3 server, using simple bind authentication.
          </Content>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Grid hasGutter span={6}>
        <GridItem>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', height: '100%' }}>
            <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">
              LDAP Configuration
            </Title>
            
            <Form>
              <FormGroup label="Name" isRequired fieldId="name">
                <TextInput
                  isRequired
                  type="text"
                  id="name"
                  value={name}
                  onChange={(_event, value) => setName(value)}
                  placeholder="Input field"
                />
                <Content component="small" className="pf-v6-u-color-200">
                  Unique name of the new identity provider. This provider name is prefixed to the returned user ID to form an identity name. This cannot be changed later.
                </Content>
              </FormGroup>

              <FormGroup label="URL" isRequired fieldId="url">
                <TextInput
                  isRequired
                  type="text"
                  id="url"
                  value={url}
                  onChange={(_event, value) => setUrl(value)}
                  placeholder="Input field"
                />
                <Content component="small" className="pf-v6-u-color-200">
                  An RFC 2255 URL which specifies the LDAP search parameters to use.
                </Content>
              </FormGroup>

              <FormGroup label="Bind DN" fieldId="bind-dn">
                <TextInput
                  type="text"
                  id="bind-dn"
                  value={bindDN}
                  onChange={(_event, value) => setBindDN(value)}
                  placeholder="Input field"
                />
                <Content component="small" className="pf-v6-u-color-200">
                  DN to bind with during the search phase. Optional DN to use to bind during the search phase. Must be set if bindPassword is defined.
                </Content>
              </FormGroup>

              <FormGroup label="Bind password" fieldId="bind-password">
                <TextInput
                  type="password"
                  id="bind-password"
                  value={bindPassword}
                  onChange={(_event, value) => setBindPassword(value)}
                  placeholder="Input field"
                />
                <Content component="small" className="pf-v6-u-color-200">
                  Password to bind with during the search phase. Optional reference to an OpenShift Container Platform Secret object containing the bind password. Must be set if bindDN is defined.
                </Content>
              </FormGroup>

              <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-md">
                Attributes
              </Title>
              <Content component="p" className="pf-v6-u-mb-md pf-v6-u-color-200">
                Attributes map LDAP attributes to identities.
              </Content>

              <FormGroup label="ID" isRequired fieldId="id-attributes">
                {idAttributes.map((attr, index) => (
                  <TextInput
                    key={index}
                    type="text"
                    value={attr}
                    onChange={(_event, value) => updateAttribute(setIdAttributes, index, value)}
                    placeholder="Input field"
                    className="pf-v6-u-mb-sm"
                  />
                ))}
                <Button variant="link" isInline onClick={() => addAttribute(setIdAttributes)}>
                  + Add more
                </Button>
                <Content component="small" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mt-sm">
                  The list of attributes whose values should be used as the user ID. List of attributes to use as the identity. First non-empty attribute is used. At least one attribute is required. If none of the listed attribute have a value, authentication fails. Defined attributes are retrieved as raw UTF-8 strings.
                </Content>
              </FormGroup>

              <FormGroup label="Preferred username" fieldId="preferred-username">
                {preferredUsernameAttributes.map((attr, index) => (
                  <TextInput
                    key={index}
                    type="text"
                    value={attr}
                    onChange={(_event, value) => updateAttribute(setPreferredUsernameAttributes, index, value)}
                    placeholder="Input field"
                    className="pf-v6-u-mb-sm"
                  />
                ))}
                <Button variant="link" isInline onClick={() => addAttribute(setPreferredUsernameAttributes)}>
                  + Add more
                </Button>
                <Content component="small" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mt-sm">
                  The list of attributes whose values should be used as the preferred username. List of attributes to use as the preferred username when provisioning a user for this identity. First non-empty attribute is used.
                </Content>
              </FormGroup>

              <FormGroup label="Name" fieldId="name-attributes">
                {nameAttributes.map((attr, index) => (
                  <TextInput
                    key={index}
                    type="text"
                    value={attr}
                    onChange={(_event, value) => updateAttribute(setNameAttributes, index, value)}
                    placeholder="Input field"
                    className="pf-v6-u-mb-sm"
                  />
                ))}
                <Button variant="link" isInline onClick={() => addAttribute(setNameAttributes)}>
                  + Add more
                </Button>
                <Content component="small" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mt-sm">
                  The list of attributes whose values should be used as the display name. List of attributes to use as the display name. First non-empty attribute is used.
                </Content>
              </FormGroup>

              <FormGroup label="Email" fieldId="email-attributes">
                {emailAttributes.map((attr, index) => (
                  <TextInput
                    key={index}
                    type="text"
                    value={attr}
                    onChange={(_event, value) => updateAttribute(setEmailAttributes, index, value)}
                    placeholder="Input field"
                    className="pf-v6-u-mb-sm"
                  />
                ))}
                <Button variant="link" isInline onClick={() => addAttribute(setEmailAttributes)}>
                  + Add more
                </Button>
                <Content component="small" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mt-sm">
                  The list of attributes whose values should be used as the email address. List of attributes to use as the email address. First non-empty attribute is used.
                </Content>
              </FormGroup>

              <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-md">
                More options
              </Title>

              <FormGroup label="CA (Certificate authority) file" fieldId="ca-file">
                <Flex>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <TextInput
                      type="text"
                      id="ca-file"
                      value={caFile}
                      onChange={(_event, value) => setCaFile(value)}
                      placeholder="Browse..."
                      readOnly
                    />
                  </FlexItem>
                  <FlexItem>
                    <Button variant="secondary">Browse...</Button>
                  </FlexItem>
                </Flex>
                <Content component="small" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mt-sm">
                  Optional. Reference to an OpenShift Container Platform ConfigMap object containing the PEM-encoded certificate authority bundle to use in validating server certificates for the configured URL. Only used when insecure is false.
                </Content>
              </FormGroup>

              <Title headingLevel="h3" size="md" className="pf-v6-u-mt-lg pf-v6-u-mb-md">
                Apply to clusters
              </Title>
              <Content component="p" className="pf-v6-u-mb-md pf-v6-u-color-200">
                Select which clusters this LDAP identity provider will be applied to.
              </Content>

              <FormGroup fieldId="cluster-picker">
                <SearchInput
                  placeholder="Search clusters"
                  value={clusterSearchValue}
                  onChange={(_event, value) => setClusterSearchValue(value)}
                  onClear={() => setClusterSearchValue('')}
                  className="pf-v6-u-mb-md"
                />
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
                  <Table aria-label="Cluster selection table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th
                          select={{
                            onSelect: (_event, isSelecting) => handleSelectAllClusters(isSelecting),
                            isSelected: isAllClustersSelected,
                          }}
                        />
                        <Th>Cluster name</Th>
                        <Th>Status</Th>
                        <Th>Provider</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredClusters.map((cluster) => (
                        <Tr key={cluster.id}>
                          <Td
                            select={{
                              rowIndex: cluster.id,
                              onSelect: (_event, isSelecting) => handleSelectCluster(cluster.id, isSelecting),
                              isSelected: selectedClusters.has(cluster.id),
                            }}
                          />
                          <Td dataLabel="Cluster name">{cluster.name}</Td>
                          <Td dataLabel="Status">{cluster.status}</Td>
                          <Td dataLabel="Provider">{cluster.provider}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
                <Content component="small" className="pf-v6-u-color-200 pf-v6-u-display-block pf-v6-u-mt-sm">
                  {selectedClusters.size} cluster{selectedClusters.size !== 1 ? 's' : ''} selected
                </Content>
              </FormGroup>

              <div className="pf-v6-u-mt-lg">
                <Button variant="primary" onClick={handleCreate}>
                  Add
                </Button>{' '}
                <Button variant="link" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </GridItem>

        <GridItem>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', height: '100%' }}>
            <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">
              Live YAML
            </Title>
            <CodeBlock>
              <CodeBlockCode>{generateYAML()}</CodeBlockCode>
            </CodeBlock>
          </div>
        </GridItem>
      </Grid>
      </div>
    </div>
  );
};

export { AddLDAPProvider };

