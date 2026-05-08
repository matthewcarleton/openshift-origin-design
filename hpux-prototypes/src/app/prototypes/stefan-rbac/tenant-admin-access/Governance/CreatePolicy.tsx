import * as React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Content,
  Checkbox,
  Radio,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  ToggleGroup,
  ToggleGroupItem,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

const CreatePolicy: React.FunctionComponent = () => {
  useDocumentTitle('ACM RBAC | Create Policy');
  const navigate = useNavigate();

  const [policyName, setPolicyName] = React.useState('');
  const [policyDescription, setPolicyDescription] = React.useState('');
  const [projectSelector, setProjectSelector] = React.useState('');
  const [disablePolicy, setDisablePolicy] = React.useState(false);
  const [remediation, setRemediation] = React.useState('inform');
  const [isAddTemplateDropdownOpen, setIsAddTemplateDropdownOpen] = React.useState(false);
  const [placementType, setPlacementType] = React.useState('no-placement');
  const [clusterSelector, setClusterSelector] = React.useState('');
  const [labelSelector, setLabelSelector] = React.useState('');
  const [annotations, setAnnotations] = React.useState('');
  const [labels, setLabels] = React.useState('');

  const onClose = () => {
    navigate('/governance');
  };

  const onSave = () => {
    console.log('Creating policy:', {
      policyName,
      policyDescription,
      projectSelector,
      disablePolicy,
      remediation,
      placementType,
      clusterSelector,
      labelSelector,
      annotations,
      labels,
    });
    navigate('/governance');
  };

  // Step 1: Details
  const renderDetailsStep = () => (
    <Form>
      <FormGroup label="Name" isRequired fieldId="policy-name">
        <TextInput
          isRequired
          type="text"
          id="policy-name"
          name="policy-name"
          value={policyName}
          onChange={(_event, value) => setPolicyName(value)}
        />
      </FormGroup>
      <FormGroup label="Description" fieldId="policy-description">
        <TextArea
          type="text"
          id="policy-description"
          name="policy-description"
          value={policyDescription}
          onChange={(_event, value) => setPolicyDescription(value)}
          rows={4}
        />
      </FormGroup>
      <FormGroup label="Project selector" isRequired fieldId="project-selector">
        <TextInput
          isRequired
          type="text"
          id="project-selector"
          name="project-selector"
          value={projectSelector}
          onChange={(_event, value) => setProjectSelector(value)}
          placeholder="Select a project"
        />
      </FormGroup>
      <FormGroup fieldId="disable-policy">
        <Checkbox
          id="disable-policy"
          label="Disable policy"
          isChecked={disablePolicy}
          onChange={(_event, checked) => setDisablePolicy(checked)}
          description="Select to disable the policy from being propagated to managed clusters"
        />
      </FormGroup>
    </Form>
  );

  // Step 2: Policy templates
  const renderPolicyTemplatesStep = () => (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '8px' }}>
        Templates
      </Title>
      <Content component="p" style={{ marginBottom: '24px', color: '#6a6e73' }}>
        A policy contains policy templates that create policies on managed clusters.
      </Content>

      <Form>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
          Remediations
        </Title>
        <FormGroup fieldId="remediation">
          <Radio
            id="remediation-inform"
            name="remediation"
            label="Inform"
            description="Reports the violation, which requires manual remediation."
            isChecked={remediation === 'inform'}
            onChange={() => setRemediation('inform')}
            style={{ marginBottom: '12px' }}
          />
          <Radio
            id="remediation-enforce"
            name="remediation"
            label="Enforce"
            description="Automatically runs remediation action that is defined in the source, if the feature is supported."
            isChecked={remediation === 'enforce'}
            onChange={() => setRemediation('enforce')}
            style={{ marginBottom: '12px' }}
          />
          <Radio
            id="remediation-template"
            name="remediation"
            label="Use policy template remediation"
            description="Remediation action will be determined by what is set in the policy template definitions."
            isChecked={remediation === 'template'}
            onChange={() => setRemediation('template')}
          />
        </FormGroup>

        <div style={{ marginTop: '32px' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
            Policy templates
          </Title>
          <Dropdown
            isOpen={isAddTemplateDropdownOpen}
            onSelect={() => setIsAddTemplateDropdownOpen(false)}
            onOpenChange={(isOpen) => setIsAddTemplateDropdownOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsAddTemplateDropdownOpen(!isAddTemplateDropdownOpen)}
                isExpanded={isAddTemplateDropdownOpen}
                variant="plain"
                style={{ color: 'var(--pf-t--global--color--brand--default)', textDecoration: 'none' }}
              >
                <PlusIcon style={{ marginRight: '8px' }} />
                Add policy template
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem key="template-1">Template option 1</DropdownItem>
              <DropdownItem key="template-2">Template option 2</DropdownItem>
              <DropdownItem key="template-3">Template option 3</DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>
      </Form>
    </div>
  );

  // Step 3: Placement
  const renderPlacementStep = () => (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '8px' }}>
        Placement
      </Title>
      <Content component="p" style={{ marginBottom: '24px', color: '#6a6e73' }}>
        Use Placement resources to select clusters from the cluster sets that you have bound to the
        resource namespace. An empty Placement returns all available clusters from all bound cluster sets.
      </Content>

      <div style={{ marginBottom: '16px' }}>
        <Content component="p" style={{ marginBottom: '12px', fontWeight: 600 }}>
          How do you want to select clusters?
        </Content>
        <ToggleGroup aria-label="Placement type selection">
          <ToggleGroupItem
            text="New placement"
            buttonId="new-placement"
            isSelected={placementType === 'new-placement'}
            onChange={() => setPlacementType('new-placement')}
          />
          <ToggleGroupItem
            text="Existing placement"
            buttonId="existing-placement"
            isSelected={placementType === 'existing-placement'}
            onChange={() => setPlacementType('existing-placement')}
          />
          <ToggleGroupItem
            text="No placement"
            buttonId="no-placement"
            isSelected={placementType === 'no-placement'}
            onChange={() => setPlacementType('no-placement')}
          />
        </ToggleGroup>
      </div>

      {placementType === 'no-placement' && (
        <Content component="p" style={{ marginTop: '16px', color: '#6a6e73' }}>
          Do not add a placement if you want to place this policy using policy set placement.
        </Content>
      )}
    </div>
  );

  // Step 4: Policy annotations
  const renderPolicyAnnotationsStep = () => (
    <Form>
      <FormGroup label="Annotations" fieldId="annotations">
        <TextArea
          id="annotations"
          name="annotations"
          value={annotations}
          onChange={(_event, value) => setAnnotations(value)}
          rows={4}
          placeholder="key: value"
        />
      </FormGroup>
      <FormGroup label="Labels" fieldId="labels">
        <TextArea
          id="labels"
          name="labels"
          value={labels}
          onChange={(_event, value) => setLabels(value)}
          rows={4}
          placeholder="key: value"
        />
      </FormGroup>
    </Form>
  );

  // Step 5: Review
  const renderReviewStep = () => (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
        Review policy
      </Title>
      <Content component="p" style={{ marginBottom: '24px', color: '#6a6e73' }}>
        Review the policy configuration before creating it.
      </Content>

      <div style={{ marginBottom: '24px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '8px' }}>
          Details
        </Title>
        <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', fontSize: '14px' }}>
          <dt style={{ fontWeight: 600 }}>Name:</dt>
          <dd>{policyName || '—'}</dd>
          <dt style={{ fontWeight: 600 }}>Description:</dt>
          <dd>{policyDescription || '—'}</dd>
          <dt style={{ fontWeight: 600 }}>Project selector:</dt>
          <dd>{projectSelector || '—'}</dd>
          <dt style={{ fontWeight: 600 }}>Disable policy:</dt>
          <dd>{disablePolicy ? 'Yes' : 'No'}</dd>
        </dl>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '8px' }}>
          Policy templates
        </Title>
        <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', fontSize: '14px' }}>
          <dt style={{ fontWeight: 600 }}>Remediation:</dt>
          <dd>
            {remediation === 'inform' && 'Inform'}
            {remediation === 'enforce' && 'Enforce'}
            {remediation === 'template' && 'Use policy template remediation'}
          </dd>
        </dl>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '8px' }}>
          Placement
        </Title>
        <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', fontSize: '14px' }}>
          <dt style={{ fontWeight: 600 }}>Placement type:</dt>
          <dd>
            {placementType === 'new-placement' && 'New placement'}
            {placementType === 'existing-placement' && 'Existing placement'}
            {placementType === 'no-placement' && 'No placement'}
          </dd>
        </dl>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '8px' }}>
          Policy annotations
        </Title>
        <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', fontSize: '14px' }}>
          <dt style={{ fontWeight: 600 }}>Annotations:</dt>
          <dd>{annotations || '—'}</dd>
          <dt style={{ fontWeight: 600 }}>Labels:</dt>
          <dd>{labels || '—'}</dd>
        </dl>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Breadcrumb section */}
      <div className="create-policy-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/governance'); }}>
            Governance
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/governance'); }}>
            Policies
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Create policy</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Page header with title and description */}
      <div className="create-policy-header">
        <Title headingLevel="h1" size="2xl">
          Create policy
        </Title>
        <Content component="p" style={{ marginTop: '8px', color: '#6a6e73' }}>
          A policy generates reports and validates cluster violations based on specified security standards, categories, and controls.
        </Content>
      </div>

      {/* Wizard content */}
      <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#ffffff' }}>
        <Wizard onClose={onClose} onSave={onSave}>
          <WizardStep name="Details" id="details-step">
            {renderDetailsStep()}
          </WizardStep>
          <WizardStep name="Policy templates" id="policy-templates-step">
            {renderPolicyTemplatesStep()}
          </WizardStep>
          <WizardStep name="Placement" id="placement-step">
            {renderPlacementStep()}
          </WizardStep>
          <WizardStep name="Policy annotations" id="policy-annotations-step">
            {renderPolicyAnnotationsStep()}
          </WizardStep>
          <WizardStep name="Review" id="review-step">
            {renderReviewStep()}
          </WizardStep>
        </Wizard>
      </div>
    </div>
  );
};

export { CreatePolicy };
