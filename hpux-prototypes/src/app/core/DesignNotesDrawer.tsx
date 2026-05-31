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
        {designNotes?.designerNotes && (
          <div style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
            <Title
              headingLevel="h3"
              size="md"
              style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
            >
              Designer Notes
            </Title>
            <Content component="p">
              {designNotes.designerNotes}
            </Content>
          </div>
        )}

        {designNotes?.navigationGuide && designNotes.navigationGuide.length > 0 && (
          <div>
            <Title
              headingLevel="h3"
              size="md"
              style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
            >
              Where to navigate
            </Title>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {designNotes.navigationGuide.map((entry, index) => (
                <li
                  key={index}
                  style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 'var(--pf-t--global--spacer--sm)',
                      marginBottom: entry.notes ? 'var(--pf-t--global--spacer--xs)' : 0,
                    }}
                  >
                    <span style={{ minWidth: '1.25rem', fontWeight: 700, color: 'var(--pf-t--global--text--color--subtle)' }}>
                      {index + 1}.
                    </span>
                    <strong>{entry.page}</strong>
                    <Label isCompact variant="outline" color="blue">
                      <code style={{ fontSize: '11px' }}>{entry.path}</code>
                    </Label>
                  </div>
                  {entry.notes && (
                    <Content
                      component="p"
                      style={{
                        color: 'var(--pf-t--global--text--color--subtle)',
                        paddingLeft: '1.75rem',
                      }}
                    >
                      {entry.notes}
                    </Content>
                  )}
                  {index < designNotes.navigationGuide!.length - 1 && (
                    <Divider
                      style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};
