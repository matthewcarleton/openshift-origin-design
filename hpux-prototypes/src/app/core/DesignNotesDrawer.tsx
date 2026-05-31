import React from 'react';
import {
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  Title,
  Content,
  Label,
  Divider,
} from '@patternfly/react-core';
import { PrototypeModule } from './types';

interface DesignNotesDrawerPanelProps {
  prototype: PrototypeModule;
  onClose: () => void;
}

export const DesignNotesDrawerPanel: React.FC<DesignNotesDrawerPanelProps> = ({
  prototype,
  onClose,
}) => {
  const { designNotes, name } = prototype.config;

  return (
    <DrawerPanelContent defaultSize="420px" minSize="350px">
      <DrawerHead>
        <div>
          <Title headingLevel="h2" size="xl">
            Design Notes
          </Title>
          <Content
            component="small"
            style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
          >
            {name}
          </Content>
        </div>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} />
        </DrawerActions>
      </DrawerHead>

      <DrawerPanelBody>
        {designNotes?.summary && (
          <Content
            component="p"
            style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
          >
            {designNotes.summary}
          </Content>
        )}

        {designNotes?.pagesToReview && designNotes.pagesToReview.length > 0 && (
          <div>
            <Title
              headingLevel="h3"
              size="md"
              style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
            >
              Pages to review
            </Title>
            {designNotes.pagesToReview.map((page, index) => (
              <div
                key={index}
                style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--pf-t--global--spacer--sm)',
                    marginBottom: 'var(--pf-t--global--spacer--xs)',
                  }}
                >
                  <strong>{page.name}</strong>
                  {page.path && (
                    <Label isCompact variant="outline" color="blue">
                      <code style={{ fontSize: '11px' }}>{page.path}</code>
                    </Label>
                  )}
                </div>
                {page.description && (
                  <Content
                    component="p"
                    style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
                  >
                    {page.description}
                  </Content>
                )}
                {index < designNotes.pagesToReview!.length - 1 && (
                  <Divider
                    style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};
