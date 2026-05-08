// Hub Cluster Virtual Machines - Core Platforms Perspective
// This component shows ONLY virtual machines from the hub cluster where ACM is installed

import * as React from 'react';
import { VirtualMachines } from '../VirtualMachines/VirtualMachines';

export const HubVirtualMachines: React.FunctionComponent = () => {
  // Pass hubClusterOnly and showProjectsOnly props to filter to hub cluster only
  // and show only projects (no cluster sets or clusters in tree view)
  return <VirtualMachines hubClusterOnly={true} showProjectsOnly={true} />;
};

