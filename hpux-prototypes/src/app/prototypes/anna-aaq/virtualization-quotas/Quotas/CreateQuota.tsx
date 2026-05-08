import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Content,
  Form,
  FormGroup,
  TextInput,
  Radio,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Button,
  Checkbox,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Select,
  SelectOption,
  SelectList,
  NumberInput,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useQuotas } from '@app/shared/contexts/QuotasContext';

export const CreateQuota: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addQuota } = useQuotas();
  const { editMode = false, quotaData = null } = (location.state as any) || {};
  
  useDocumentTitle(editMode ? 'Edit Quota' : 'Create Quota');

  const [configView, setConfigView] = React.useState<'form' | 'yaml'>('form');
  const [scopeType, setScopeType] = React.useState<'cluster' | 'project'>(
    quotaData?.scope === 'Project-scoped' ? 'project' : 'cluster'
  );
  const [isProjectsOpen, setIsProjectsOpen] = React.useState(false);
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>(
    quotaData?.project ? [quotaData.project] : ['open-cluster-management']
  );
  const [useLabelSelectors, setUseLabelSelectors] = React.useState(
    quotaData?.labelSelector && quotaData.labelSelector !== 'No labels'
  );
  const [labelSelectors, setLabelSelectors] = React.useState<Array<{ label: string; selector: string }>>([{ label: '', selector: '' }]);
  const [quotaName, setQuotaName] = React.useState(quotaData?.name || '');
  const [isResourceTypeOpen, setIsResourceTypeOpen] = React.useState(false);
  const [resourceType, setResourceType] = React.useState('');
  const [cpuLimits, setCpuLimits] = React.useState<number>(quotaData?.cpuTotal || 0);
  const [memoryLimits, setMemoryLimits] = React.useState<number>(quotaData?.memoryTotal || 0);
  const [vmLimits, setVmLimits] = React.useState<number>(quotaData?.vmTotal || 0);

  // Check if all required fields are filled
  const isFormValid = React.useMemo(() => {
    return (
      quotaName.trim() !== '' &&
      cpuLimits > 0 &&
      memoryLimits > 0 &&
      vmLimits > 0
    );
  }, [quotaName, cpuLimits, memoryLimits, vmLimits]);

  const projects = [
    'open-cluster-management',
    'open-cluster-management-global-set',
    'open-cluster-management-hub',
    'openshift',
    'openshift-apiserver',
    'openshift-apiserver-operator',
  ];

  const resourceTypes = [
    {
      value: 'VirtualResources',
      label: 'VirtualResources',
      description: 'Applies only to VM specific resources, excluding pod overhead from the calculations.',
    },
    {
      value: 'PodsResources',
      label: 'PodsResources',
      description: 'Applies to pods that run VM workloads. Resource usage includes both VM and pod overhead.',
    },
    {
      value: 'BesideVirtualResources',
      label: 'BesideVirtualResources',
      description: 'Applies to both VMs and their associated pods, tracking quota usage separately for each resource type.',
    },
  ];

  const handleCreateQuota = () => {
    if (!editMode) {
      // Add new quota
      const newQuotaName = quotaName || `quota-${Date.now()}`;
      addQuota({
        name: newQuotaName,
        scope: scopeType === 'project' && selectedProjects.length > 0 
          ? selectedProjects[0] 
          : 'Cluster-scoped',
        cpuTotal: cpuLimits,
        memoryTotal: memoryLimits,
        vmTotal: vmLimits,
      });
      
      // Navigate with success state
      navigate('/core/virtualization/quotas', {
        state: {
          newQuota: { name: newQuotaName },
          showSuccessAlert: true,
        },
      });
    } else {
      // In edit mode, we would call updateQuota here
      const currentQuotaName = quotaName || 'quota';
      
      // Navigate with edit success state
      navigate('/core/virtualization/quotas', {
        state: {
          editedQuota: { name: currentQuotaName },
          showEditSuccessAlert: true,
        },
      });
    }
  };

  const handleCancel = () => {
    navigate('/core/virtualization/quotas');
  };

  const handleProjectToggle = (project: string) => {
    setSelectedProjects((prev) =>
      prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]
    );
  };

  const addLabelSelector = () => {
    setLabelSelectors([...labelSelectors, { label: '', selector: '' }]);
  };

  const removeLabelSelector = (index: number) => {
    setLabelSelectors(labelSelectors.filter((_, i) => i !== index));
  };

  const updateLabelSelector = (index: number, field: 'label' | 'selector', value: string) => {
    const updated = [...labelSelectors];
    updated[index][field] = value;
    setLabelSelectors(updated);
  };

  return (
    <div className="quotas-page-container create-quota-page">
      <div className="page-header-section">
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/core/virtualization/quotas'); }}>
            Quotas
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{editMode ? 'Edit quota' : 'Create quota'}</BreadcrumbItem>
        </Breadcrumb>

        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '8px' }}>
          {editMode ? 'Edit virtualization quota' : 'Create virtualization quota'}
        </Title>

        <Content component="p" style={{ color: '#6a6e73', marginBottom: '8px' }}>
          Define virtualization-specific resource limits and thresholds managed by the Application Aware Quota (AAQ) Operator.
        </Content>

        <a href="#" style={{ color: '#0066cc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          Learn more about configuring virtualization quotas via AAQ <ExternalLinkAltIcon />
        </a>

        {/* Configure via */}
        <div style={{ 
          marginTop: '24px',
          marginLeft: '-24px',
          marginRight: '-24px',
          paddingTop: '24px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '0',
          borderTop: '1px solid #d2d2d2',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{ fontWeight: 600 }}>Configure via:</span>
          <Radio
            isChecked={configView === 'form'}
            name="config-view"
            onChange={() => setConfigView('form')}
            label="Form view"
            id="form-view"
            style={{ display: 'inline-flex' }}
          />
          <Radio
            isChecked={configView === 'yaml'}
            name="config-view"
            onChange={() => setConfigView('yaml')}
            label="YAML view"
            id="yaml-view"
            style={{ display: 'inline-flex' }}
          />
        </div>
      </div>

      <div className="page-content-section">
        <Form>

          {configView === 'form' ? (
            <>
              {/* Scope type */}
              <FormGroup
                label={
                  <span>
                    Scope type <InfoCircleIcon style={{ marginLeft: '4px', color: '#6a6e73', fontSize: '14px' }} />
                  </span>
                }
                isRequired
              >
                <Radio
                  isChecked={scopeType === 'cluster'}
                  name="scope-type"
                  onChange={() => setScopeType('cluster')}
                  label="Cluster scoped"
                  description="Create virtualization quota at the cluster level and all projects"
                  id="cluster-scoped"
                />
                <Radio
                  isChecked={scopeType === 'project'}
                  name="scope-type"
                  onChange={() => setScopeType('project')}
                  label="Project scoped"
                  description="Create virtualization quota in one or more projects"
                  id="project-scoped"
                />
              </FormGroup>

              {/* Projects dropdown - only shown when Project scoped is selected */}
              {scopeType === 'project' && (
                <>
                  <FormGroup label="Project(s)" isRequired>
                    <Select
                      isOpen={isProjectsOpen}
                      selected={selectedProjects}
                      onSelect={(_event, selection) => {
                        handleProjectToggle(selection as string);
                      }}
                      onOpenChange={(isOpen) => setIsProjectsOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle ref={toggleRef} onClick={() => setIsProjectsOpen(!isProjectsOpen)} isExpanded={isProjectsOpen} style={{ width: '400px' }}>
                          {selectedProjects.length > 0 ? selectedProjects.join(', ') : 'Select projects'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <div style={{ padding: '8px' }}>
                          <TextInput
                            type="search"
                            placeholder="Search"
                            aria-label="Search projects"
                            style={{ marginBottom: '8px' }}
                          />
                        </div>
                        {projects.map((project) => (
                          <SelectOption
                            key={project}
                            value={project}
                            hasCheckbox
                            isSelected={selectedProjects.includes(project)}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                backgroundColor: '#3e8635', 
                                color: '#ffffff', 
                                padding: '2px 8px', 
                                borderRadius: '3px',
                                fontSize: '11px',
                                fontWeight: 600
                              }}>
                                PR
                              </span>
                              {project}
                            </span>
                          </SelectOption>
                        ))}
                      </SelectList>
                    </Select>
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>Applies the quota to the selected project projects</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  </FormGroup>

                  {/* Use label selectors checkbox */}
                  <FormGroup>
                    <Checkbox
                      id="use-label-selectors"
                      label="Use label selectors to target specific namespaces"
                      isChecked={useLabelSelectors}
                      onChange={(_event, checked) => setUseLabelSelectors(checked)}
                    />
                  </FormGroup>

                  {/* Label selectors */}
                  {useLabelSelectors && (
                    <>
                      {labelSelectors.map((selector, index) => (
                        <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                          <FormGroup label={index === 0 ? 'Label' : undefined} isRequired style={{ flex: 1 }}>
                            <TextInput
                              type="text"
                              value={selector.label}
                              onChange={(_event, value) => updateLabelSelector(index, 'label', value)}
                              placeholder="Label"
                              aria-label="Label"
                            />
                          </FormGroup>
                          <FormGroup label={index === 0 ? 'Selector' : undefined} isRequired style={{ flex: 1 }}>
                            <TextInput
                              type="text"
                              value={selector.selector}
                              onChange={(_event, value) => updateLabelSelector(index, 'selector', value)}
                              placeholder="Selector"
                              aria-label="Selector"
                            />
                          </FormGroup>
                          {labelSelectors.length > 1 && (
                            <div style={{ paddingTop: index === 0 ? '32px' : '0' }}>
                              <Button variant="plain" onClick={() => removeLabelSelector(index)} aria-label="Remove label selector">
                                -
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button variant="link" onClick={addLabelSelector}>
                        + Add value
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Name */}
              <FormGroup label="Name" isRequired>
                <div style={{ width: '400px' }}>
                  <TextInput
                    type="text"
                    value={quotaName}
                    onChange={(_event, value) => setQuotaName(value)}
                    placeholder="Virtualization quota name"
                    aria-label="Quota name"
                  />
                </div>
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>A unique name for the virtualization quota</HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              {/* Resource type */}
              <FormGroup label="Resource type" isRequired>
                <Dropdown
                  isOpen={isResourceTypeOpen}
                  onSelect={(_event, value) => {
                    setResourceType(value as string);
                    setIsResourceTypeOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsResourceTypeOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsResourceTypeOpen(!isResourceTypeOpen)}
                      isExpanded={isResourceTypeOpen}
                      style={{ width: '400px' }}
                    >
                      {resourceType || 'Resource type'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    {resourceTypes.map((type) => (
                      <DropdownItem key={type.value} value={type.value}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{type.label}</div>
                          <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                            {type.description}
                          </div>
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>Determines how compute and memory usage are calculated for virtualized workloads.</HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              {/* Resource limits */}
              <div style={{ display: 'flex', gap: '32px', marginTop: '24px' }}>
                {/* CPU limits */}
                <FormGroup label="CPU limits" isRequired style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <NumberInput
                      value={cpuLimits}
                      onMinus={() => setCpuLimits(Math.max(0, cpuLimits - 1))}
                      onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        const value = Number((event.target as HTMLInputElement).value);
                        setCpuLimits(isNaN(value) ? 0 : value);
                      }}
                      onPlus={() => setCpuLimits(cpuLimits + 1)}
                      inputName="cpu-limits"
                      inputAriaLabel="CPU limits"
                      minusBtnAriaLabel="Decrease CPU limits"
                      plusBtnAriaLabel="Increase CPU limits"
                      widthChars={10}
                    />
                    <span style={{ marginLeft: '8px', color: '#6a6e73' }}>cores</span>
                  </div>
                </FormGroup>

                {/* Memory limits */}
                <FormGroup label="Memory limits" isRequired style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <NumberInput
                      value={memoryLimits}
                      onMinus={() => setMemoryLimits(Math.max(0, memoryLimits - 1))}
                      onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        const value = Number((event.target as HTMLInputElement).value);
                        setMemoryLimits(isNaN(value) ? 0 : value);
                      }}
                      onPlus={() => setMemoryLimits(memoryLimits + 1)}
                      inputName="memory-limits"
                      inputAriaLabel="Memory limits"
                      minusBtnAriaLabel="Decrease memory limits"
                      plusBtnAriaLabel="Increase memory limits"
                      widthChars={10}
                    />
                    <span style={{ marginLeft: '8px', color: '#6a6e73' }}>Gi</span>
                  </div>
                </FormGroup>

                {/* VM limits */}
                <FormGroup label="VM limits" isRequired style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <NumberInput
                      value={vmLimits}
                      onMinus={() => setVmLimits(Math.max(0, vmLimits - 1))}
                      onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        const value = Number((event.target as HTMLInputElement).value);
                        setVmLimits(isNaN(value) ? 0 : value);
                      }}
                      onPlus={() => setVmLimits(vmLimits + 1)}
                      inputName="vm-limits"
                      inputAriaLabel="VM limits"
                      minusBtnAriaLabel="Decrease VM limits"
                      plusBtnAriaLabel="Increase VM limits"
                      widthChars={10}
                    />
                    <span style={{ marginLeft: '8px', color: '#6a6e73' }}>VMs</span>
                  </div>
                </FormGroup>
              </div>

              {/* Actions */}
              <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                <Button variant="primary" onClick={handleCreateQuota} isDisabled={!isFormValid}>
                  {editMode ? 'Save changes' : 'Create quota'}
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '14px', backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
              <pre>
                {`apiVersion: quota.openshift.io/v1
kind: ApplicationAwareClusterResourceQuota
metadata:
  name: ${quotaName || 'quota-name'}
spec:
  quota:
    hard:
      cpu: "${cpuLimits}"
      memory: "${memoryLimits}Gi"
      vms: "${vmLimits}"`}
              </pre>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

