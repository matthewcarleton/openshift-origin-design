import React from 'react';
import {
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  Title,
  Content,
  Button,
  Label,
  Divider,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
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
        {designNotes?.overview && (
          <Content
            component="p"
            style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
          >
            {designNotes.overview}
          </Content>
        )}

        {designNotes?.pages && designNotes.pages.length > 0 && (
          <div>
            {designNotes.pages.map((page, index) => (
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
                  <Title headingLevel="h3" size="md">
                    {page.name}
                  </Title>
                  {page.path && (
                    <Label isCompact variant="outline" color="blue">
                      <code style={{ fontSize: '11px' }}>{page.path}</code>
                    </Label>
                  )}
                </div>
                <Content
                  component="p"
                  style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
                >
                  {page.notes}
                </Content>
                {index < designNotes.pages!.length - 1 && (
                  <Divider
                    style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {(designNotes?.figmaUrl || designNotes?.jiraUrl) && (
          <div
            style={{
              marginTop: 'var(--pf-t--global--spacer--lg)',
              paddingTop: 'var(--pf-t--global--spacer--md)',
              borderTop:
                '1px solid var(--pf-t--global--border--color--default)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pf-t--global--spacer--xs)',
            }}
          >
            {designNotes.figmaUrl && (
              <Button
                component="a"
                href={designNotes.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="link"
                isInline
                icon={<ExternalLinkAltIcon />}
                iconPosition="end"
              >
                View in Figma
              </Button>
            )}
            {designNotes.jiraUrl && (
              <Button
                component="a"
                href={designNotes.jiraUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="link"
                isInline
                icon={<ExternalLinkAltIcon />}
                iconPosition="end"
              >
                View Jira Epic
              </Button>
            )}
          </div>
        )}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};
