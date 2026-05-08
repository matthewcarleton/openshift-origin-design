/**
 * StandardModal
 * 
 * A standardized modal component with consistent layout and styling.
 * This modal follows the same pattern as the floating button modal.
 * 
 * @example
 * ```tsx
 * <StandardModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="My Modal Title"
 *   content="This is the modal content text."
 *   actionButtonLabel="Close"
 *   onAction={() => setIsOpen(false)}
 * />
 * ```
 */

import React from 'react';
import {
  Modal,
  ModalVariant,
  Title,
  Content,
  Button,
} from '@patternfly/react-core';

export interface StandardModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content text */
  content: string | React.ReactNode;
  /** Label for the action button (default: "Close") */
  actionButtonLabel?: string;
  /** Callback for action button click (default: calls onClose) */
  onAction?: () => void;
  /** Variant of the action button (default: "primary") */
  actionButtonVariant?: 'primary' | 'secondary' | 'danger';
  /** Position of the action button (default: "left") */
  buttonPosition?: 'left' | 'right';
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

export const StandardModal: React.FC<StandardModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  actionButtonLabel = 'Close',
  onAction,
  actionButtonVariant = 'primary',
  buttonPosition = 'left',
  className,
  ariaLabel,
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
      aria-label={ariaLabel || title}
      className={className}
    >
      <div style={{ padding: '24px' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
          {title}
        </Title>
        
        <Content component="p" style={{ 
          marginBottom: 'var(--pf-t--global--spacer--lg)',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          {content}
        </Content>

        <div style={{ 
          display: 'flex',
          justifyContent: buttonPosition === 'left' ? 'flex-start' : 'flex-end'
        }}>
          <Button variant={actionButtonVariant} onClick={handleAction}>
            {actionButtonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

