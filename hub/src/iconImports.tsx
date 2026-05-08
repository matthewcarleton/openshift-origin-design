import AngleDoubleUpIcon from "@patternfly/react-icons/dist/js/icons/angle-double-up-icon";
import CloudIcon from "@patternfly/react-icons/dist/js/icons/cloud-icon";
import CubesIcon from "@patternfly/react-icons/dist/js/icons/cubes-icon";
import DownloadIcon from "@patternfly/react-icons/dist/js/icons/download-icon";
import LockedIcon from "@patternfly/react-icons/dist/js/icons/locked-icon";
import MigrationIcon from "@patternfly/react-icons/dist/js/icons/migration-icon";
import MonitoringIcon from "@patternfly/react-icons/dist/js/icons/monitoring-icon";
import MulticlusterIcon from "@patternfly/react-icons/dist/js/icons/multicluster-icon";
import OpenshiftIcon from "@patternfly/react-icons/dist/js/icons/openshift-icon";
import OptimizeIcon from "@patternfly/react-icons/dist/js/icons/optimize-icon";
import ProcessAutomationIcon from "@patternfly/react-icons/dist/js/icons/process-automation-icon";
import SecurityIcon from "@patternfly/react-icons/dist/js/icons/security-icon";
import UsersIcon from "@patternfly/react-icons/dist/js/icons/users-icon";
import VirtualMachineIcon from "@patternfly/react-icons/dist/js/icons/virtual-machine-icon";

import type { SVGIconProps } from "@patternfly/react-icons/dist/js/createIcon";
import type { ComponentClass } from "react";

/** Keys map to glyphs from `@patternfly/react-icons`; see manifest `icon` fields. */
export type IconKey =
  | "security"
  | "multicluster"
  | "virtual_machine"
  | "openshift"
  | "locked"
  | "migration"
  | "optimize"
  | "monitoring"
  | "hosted_cloud"
  | "users"
  | "upgrade"
  | "automation"
  | "download";

export type PfIconComponent = ComponentClass<SVGIconProps>;

export const teamIconByKey: Record<IconKey, PfIconComponent> = {
  security: SecurityIcon,
  multicluster: MulticlusterIcon,
  virtual_machine: VirtualMachineIcon,
  openshift: OpenshiftIcon,
  locked: LockedIcon,
  migration: MigrationIcon,
  optimize: OptimizeIcon,
  monitoring: MonitoringIcon,
  hosted_cloud: CloudIcon,

  users: UsersIcon,
  upgrade: AngleDoubleUpIcon,
  automation: ProcessAutomationIcon,
  download: DownloadIcon,
};

export function pfIcon(icon: IconKey): PfIconComponent {
  return teamIconByKey[icon] ?? CubesIcon;
}
