/**
 * Full Page Wizard Page
 * 
 * This is a page component that displays the full-page wizard.
 * It's used as a route, not shown conditionally on the home page.
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FullPageWizard } from '../components/FullPageWizard';

export const FullPageWizardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  const handleFinish = (data: any) => {
    console.log('Full page wizard completed:', data);
    navigate('/');
  };

  return (
    <FullPageWizard
      onClose={handleClose}
      onFinish={handleFinish}
      title="Full Page Wizard"
      description="This is a full-page wizard that takes up the entire viewport. It includes breadcrumbs, a header section, and the wizard content."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Wizards' },
        { label: 'Full Page Wizard' },
      ]}
          steps={[
            {
              name: 'Step One',
              id: 'step-one',
              component: (
                <div style={{ maxWidth: '600px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
                    Step One
                  </h2>
                  <p>This is the first step of the full-page wizard.</p>
                  <p style={{ marginTop: '16px', color: '#6a6e73' }}>
                    Full-page wizards are useful for complex workflows that need more space and context.
                  </p>
                </div>
              ),
            },
            {
              name: 'Step Two',
              id: 'step-two',
              component: (
                <div style={{ maxWidth: '600px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
                    Step Two
                  </h2>
                  <p>This is the second step of the full-page wizard.</p>
                  <p style={{ marginTop: '16px', color: '#6a6e73' }}>
                    Notice how this wizard takes up the full viewport, unlike modal wizards.
                  </p>
                </div>
              ),
            },
            {
              name: 'Review',
              id: 'review-step',
              component: (
                <div style={{ maxWidth: '600px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
                    Review
                  </h2>
                  <p>Review your information before completing.</p>
                  <p style={{ marginTop: '16px', color: '#6a6e73' }}>
                    Click Finish to complete the wizard.
                  </p>
                </div>
              ),
            },
          ]}
    />
  );
};

