import React from 'react';
import { Card, CardBody } from '@patternfly/react-core';

interface TableLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const TableLayout: React.FunctionComponent<TableLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`table-content-card ${className}`}>
      <Card>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    </div>
  );
};
