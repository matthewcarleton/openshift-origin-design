import * as React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Content,
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Title,
} from '@patternfly/react-core';

interface MigrateVMsWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVMs: number[];
}

export const MigrateVMsWizard: React.FunctionComponent<MigrateVMsWizardProps> = ({
  isOpen,
  onClose,
  selectedVMs,
}) => {
  const [migrationName, setMigrationName] = React.useState('');
  const [migrationReason, setMigrationReason] = React.useState('not-stated');
  const [showProgress, setShowProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showProgress && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          // Increment by random amount between 1-5% every 200ms
          return Math.min(prev + Math.random() * 5 + 1, 100);
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showProgress, progress]);

  const handleClose = () => {
    // Reset form
    setMigrationName('');
    setMigrationReason('not-stated');
    setShowProgress(false);
    setProgress(0);
    onClose();
  };

  const handleMigrateNow = () => {
    console.log('Migration plan created:', {
      name: migrationName,
      reason: migrationReason,
      vms: selectedVMs,
    });
    setShowProgress(true);
    setProgress(0);
  };

  const handleSave = () => {
    console.log('Migration plan saved for later:', {
      name: migrationName,
      reason: migrationReason,
      vms: selectedVMs,
    });
    handleClose();
  };

  const handleCancelMigration = () => {
    console.log('Migration cancelled');
    handleClose();
  };

  const generalInformationStep = (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
        General information
      </Title>
      
      <Form>
        <FormGroup label="Name" isRequired>
          <TextInput
            type="text"
            id="migration-name"
            name="migration-name"
            value={migrationName}
            onChange={(_event, value) => setMigrationName(value)}
            placeholder="Random-generated-name-with-a-date"
          />
          <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
            If you don't create a name, we'll generate a migration plan name for you
          </div>
        </FormGroup>

        <FormGroup label="Migration reason (optional)">
          <FormSelect
            value={migrationReason}
            onChange={(_event, value) => setMigrationReason(value as string)}
            id="migration-reason"
            name="migration-reason"
          >
            <FormSelectOption value="not-stated" label="Not stated" />
            <FormSelectOption value="hardware-maintenance" label="Hardware maintenance" />
            <FormSelectOption value="load-balancing" label="Load balancing" />
            <FormSelectOption value="disaster-recovery" label="Disaster recovery" />
            <FormSelectOption value="resource-optimization" label="Resource optimization" />
            <FormSelectOption value="other" label="Other" />
          </FormSelect>
          <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
            Select a reason for migration
          </div>
        </FormGroup>
      </Form>
    </div>
  );

  const [targetCluster, setTargetCluster] = React.useState('');
  const [targetProject, setTargetProject] = React.useState('');

  const targetPlacementStep = (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-md">
        Target placement
      </Title>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {/* Source Section */}
        <div style={{ 
          flex: 1, 
          border: '1px solid var(--pf-t--global--border--color--default)', 
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Source</h3>
          
          <FormGroup label="Cluster">
            <TextInput
              type="text"
              value="test-west-eu"
              isDisabled
              aria-label="Source cluster"
            />
          </FormGroup>

          <FormGroup label="Project">
            <TextInput
              type="text"
              value="test"
              isDisabled
              aria-label="Source project"
            />
          </FormGroup>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
          →
        </div>

        {/* Target Section */}
        <div style={{ 
          flex: 1, 
          border: '1px solid var(--pf-t--global--border--color--default)', 
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Target *</h3>
            <Button 
              variant="link" 
              onClick={() => {
                setTargetCluster('');
                setTargetProject('');
              }}
              style={{ padding: 0, fontSize: '0.875rem' }}
            >
              Clear all
            </Button>
          </div>
          
          <FormGroup label="Cluster">
            <FormSelect
              value={targetCluster}
              onChange={(_event, value) => {
                setTargetCluster(value as string);
                setTargetProject(''); // Reset project when cluster changes
              }}
              aria-label="Target cluster"
            >
              <FormSelectOption value="" label="Select Cluster" />
              <FormSelectOption value="test-south-eu" label="test-south-eu" />
              <FormSelectOption value="test-north-eu" label="test-north-eu" />
              <FormSelectOption value="test-central-eu" label="test-central-eu" />
            </FormSelect>
          </FormGroup>

          <FormGroup label="Project">
            <FormSelect
              value={targetProject}
              onChange={(_event, value) => setTargetProject(value as string)}
              isDisabled={!targetCluster}
              aria-label="Target project"
            >
              <FormSelectOption 
                value="" 
                label={targetCluster ? "Select project" : "To select a project, pick a cluster"} 
              />
              {targetCluster && (
                <>
                  <FormSelectOption value="test" label="test" />
                  <FormSelectOption value="production" label="production" />
                  <FormSelectOption value="staging" label="staging" />
                  <FormSelectOption value="development" label="development" />
                </>
              )}
            </FormSelect>
          </FormGroup>
        </div>
      </div>
    </div>
  );

  const [selectedCheck, setSelectedCheck] = React.useState<string>('network');

  const renderCheckDetail = () => {
    switch (selectedCheck) {
      case 'network':
        return (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Network mapping</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Source network</div>
                <div>network1</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Target network</div>
                <div>network1</div>
              </div>
              <Button variant="link" style={{ marginLeft: 'auto', padding: 0 }}>
                Edit
              </Button>
            </div>
          </div>
        );
      case 'storage':
        return (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Storage mapping</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Source storage</div>
                <div>storage1</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Target storage</div>
                <div>storage1</div>
              </div>
              <Button variant="link" style={{ marginLeft: 'auto', padding: 0 }}>
                Edit
              </Button>
            </div>
          </div>
        );
      case 'compute':
        return (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Compute compatibility</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Source cluster compute</div>
                <div>Compute1</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Target cluster compute</div>
                <div>Compute1</div>
              </div>
            </div>
          </div>
        );
      case 'version':
        return (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>Version compatibility</h3>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>OpenShift version</div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.875rem' }}>Source cluster</div>
                  <div>4.20</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.875rem' }}>Target cluster</div>
                  <div>4.20</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Virtualization operator version</div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.875rm' }}>Source cluster</div>
                  <div>4.19</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.875rem' }}>Target cluster</div>
                  <div>4.19</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'resource':
        return (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>Resource capacity</h3>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'var(--pf-t--global--color--brand--default)',
                  borderRadius: '2px'
                }}></span>
                Source size
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                <div>Storage XXX GB</div>
                <div>Memory XXX GB</div>
                <div>CPU XXX cores</div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '16px' }}>Target cluster capacity (test-south-eu)</div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Storage: 238 GB</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    width: '46%', 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--color--brand--default)'
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                  <span>■ 111 GB used</span>
                  <span>□ 121 GB free</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Memory: 40 GB</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    width: '75%', 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--color--brand--default)'
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                  <span>■ 30 GB used</span>
                  <span>□ 10 GB free</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>CPU: 15 cores</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    width: '66%', 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--color--brand--default)'
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                  <span>■ 10 cores</span>
                  <span>□ 5 cores</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const migrationReadinessStep = (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Title headingLevel="h2" size="xl">
          Migration readiness
        </Title>
        <Button variant="link" style={{ padding: 0 }}>Run again</Button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '12px 16px',
        backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
        <span style={{ fontWeight: 'bold' }}>Ready to migrate</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
          5 successful checks
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: '24px' }}>
        {/* Left sidebar with checks */}
        <div style={{ width: '200px', borderRight: '1px solid var(--pf-t--global--border--color--default)', paddingRight: '16px' }}>
          <div
            onClick={() => setSelectedCheck('network')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'network' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
            Network mapping
          </div>
          <div
            onClick={() => setSelectedCheck('storage')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'storage' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
            Storage mapping
          </div>
          <div
            onClick={() => setSelectedCheck('compute')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'compute' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
            Compute compatibility
          </div>
          <div
            onClick={() => setSelectedCheck('version')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'version' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
            Version compatibility
          </div>
          <div
            onClick={() => setSelectedCheck('resource')}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'resource' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
            Resource capacity
          </div>
        </div>

        {/* Right panel with details */}
        <div style={{ flex: 1 }}>
          {renderCheckDetail()}
        </div>
      </div>
    </div>
  );

  const reviewStep = (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-lg">
        Review
      </Title>
      
      {/* General information section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>General information</h3>
          <Button variant="link" onClick={() => setActiveStep(1)} style={{ padding: 0 }}>
            Edit step
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 'bold' }}>Name</div>
          <div>test-west-eu</div>
          <div style={{ fontWeight: 'bold' }}>Migration reason</div>
          <div>Evacuating</div>
        </div>
      </div>

      {/* Placement section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Placement</h3>
          <Button variant="link" onClick={() => setActiveStep(2)} style={{ padding: 0 }}>
            Edit step
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 40px 200px 1fr', gap: '12px', fontSize: '0.875rem', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>Source cluster</div>
          <div>test-west-eu</div>
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
          <div style={{ fontWeight: 'bold' }}>Target cluster</div>
          <div>test-south-eu</div>
          
          <div style={{ fontWeight: 'bold' }}>Source project</div>
          <div>test</div>
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
          <div style={{ fontWeight: 'bold' }}>Target project</div>
          <div>test</div>
        </div>
      </div>

      {/* Migration readiness section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Migration readiness</h3>
          <Button variant="link" onClick={() => setActiveStep(3)} style={{ padding: 0 }}>
            Edit step
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 'bold' }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--pf-t--global--icon--color--status--success)' }}>✓</span>
            Ready to migrate
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        border: '1px solid var(--pf-t--global--border--color--default)',
        borderRadius: '8px',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '1.25rem', color: 'var(--pf-t--global--icon--color--status--info)' }}>ℹ</span>
        <span>During migration, VMs will be processed and moved in groups of 5.</span>
      </div>
    </div>
  );

  const [activeStep, setActiveStep] = React.useState(1);

  const onNext = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else {
      handleSave();
    }
  };

  const onBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const getCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return generalInformationStep;
      case 2:
        return targetPlacementStep;
      case 3:
        return migrationReadinessStep;
      case 4:
        return reviewStep;
      default:
        return generalInformationStep;
    }
  };

  const getStepName = () => {
    switch (activeStep) {
      case 1:
        return 'General information';
      case 2:
        return 'Target placement';
      case 3:
        return 'Migration readiness';
      case 4:
        return 'Review';
      default:
        return '';
    }
  };

  const progressScreen = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '400px',
      padding: '48px'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '24px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--pf-t--global--icon--color--subtle)' }}>
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
        Migration in progress
      </h2>
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '8px' }}>
        <div style={{ 
          width: '100%', 
          height: '24px', 
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: 'var(--pf-t--global--color--brand--default)',
            transition: 'width 0.2s ease-in-out'
          }}></div>
        </div>
      </div>
      <div style={{ marginBottom: '24px', fontSize: '0.875rem', fontWeight: 'bold' }}>
        {Math.round(progress)}%
      </div>
      <div style={{ marginBottom: '32px', color: 'var(--pf-t--global--text--color--subtle)' }}>
        The migration will continue if you close this popup
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Button variant="primary">View migration plan</Button>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </div>
      <Button variant="link" onClick={handleCancelMigration} style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
        Cancel migration process
      </Button>
    </div>
  );

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={handleClose}
      aria-labelledby="migrate-vms-wizard-title"
      style={{ 
        '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
        '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
        '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
        '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
      } as React.CSSProperties}
    >
      {showProgress ? progressScreen : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header Section */}
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '1.5rem', 
            borderBottom: '1px solid #d2d2d2',
            flexShrink: 0
          }}>
            <Title headingLevel="h1" size="2xl" id="migrate-vms-wizard-title">
              Migrate virtual machines
            </Title>
            <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
              Choose the target location for your VMs, then adjust your migration plan if necessary.
            </Content>
          </div>

          {/* Body with Steps Navigation and Content */}
          <div style={{ 
            display: 'flex', 
            flex: 1, 
            minHeight: 0, 
            alignItems: 'stretch', 
            overflow: 'hidden',
            margin: 0,
            padding: 0
          }}>
            {/* Left Navigation Panel */}
            <div style={{ 
              width: '300px', 
              padding: '1.5rem 1rem',
              borderRight: '1px solid #d2d2d2',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              margin: 0
            }}>
              <div
                onClick={() => setActiveStep(1)}
                style={{
                  padding: '0.75rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 1 ? '#e7f1fa' : 'transparent',
                  borderLeft: activeStep === 1 ? '4px solid #0066cc' : '4px solid transparent',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '-1rem',
                  paddingLeft: 'calc(0.75rem + 4px)',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: activeStep >= 1 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  1
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: activeStep === 1 ? '600' : '400' }}>
                  General information
                </span>
              </div>
              <div
                onClick={() => setActiveStep(2)}
                style={{
                  padding: '0.75rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 2 ? '#e7f1fa' : 'transparent',
                  borderLeft: activeStep === 2 ? '4px solid #0066cc' : '4px solid transparent',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '-1rem',
                  paddingLeft: 'calc(0.75rem + 4px)',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: activeStep >= 2 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  2
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: activeStep === 2 ? '600' : '400' }}>
                  Target placement
                </span>
              </div>
              <div
                onClick={() => setActiveStep(3)}
                style={{
                  padding: '0.75rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 3 ? '#e7f1fa' : 'transparent',
                  borderLeft: activeStep === 3 ? '4px solid #0066cc' : '4px solid transparent',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '-1rem',
                  paddingLeft: 'calc(0.75rem + 4px)',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: activeStep >= 3 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  3
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: activeStep === 3 ? '600' : '400' }}>
                  Migration readiness
                </span>
              </div>
              <div
                onClick={() => setActiveStep(4)}
                style={{
                  padding: '0.75rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 4 ? '#e7f1fa' : 'transparent',
                  borderLeft: activeStep === 4 ? '4px solid #0066cc' : '4px solid transparent',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '-1rem',
                  paddingLeft: 'calc(0.75rem + 4px)',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: activeStep >= 4 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  4
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: activeStep === 4 ? '600' : '400' }}>
                  Review
                </span>
              </div>
            </div>
            
            {/* Right Content Area with Footer */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: 0, 
              overflow: 'hidden',
              margin: 0,
              padding: 0
            }}>
              {/* Content Area - scrollable */}
              <div style={{ 
                flex: '1 1 0',
                padding: '1.5rem', 
                backgroundColor: '#ffffff',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                {getCurrentStep()}
              </div>
              
              {/* Footer with Buttons */}
              <div style={{ 
                borderTop: '1px solid #d2d2d2', 
                padding: '1rem 1.5rem', 
                backgroundColor: '#ffffff',
                flexShrink: 0
              }}>
              <Button variant="secondary" onClick={onBack} isDisabled={activeStep === 1}>
                Back
              </Button>
              {activeStep === 4 ? (
                <>
                  <Button variant="primary" onClick={handleMigrateNow}>
                    Migrate now
                  </Button>
                  <Button variant="secondary" onClick={handleSave}>
                    Save and migrate later
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={onNext}>
                  Next
                </Button>
              )}
              {' '}
              <Button variant="link" onClick={handleClose}>
                Cancel
              </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

