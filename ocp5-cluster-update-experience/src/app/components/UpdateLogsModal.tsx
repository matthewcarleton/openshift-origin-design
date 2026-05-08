import type { CSSProperties } from "react";
import {
  Button,
  Content,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";

interface UpdateLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const logPanelStyle: CSSProperties = {
  maxHeight: "min(60vh, var(--pf-v6-c-modal-box--MaxHeight, 70vh))",
  overflowY: "auto",
  padding: "var(--pf-t--global--spacer--md)",
  fontFamily: "var(--pf-t--global--FontFamily--text)",
  fontSize: "var(--pf-t--global--FontSize--sm)",
  backgroundColor: "var(--pf-t--global--BackgroundColor--dark-300)",
  color: "var(--pf-t--global--text--Color--inverse)",
  borderRadius: "var(--pf-t--global--border--radius--small)",
};

const timestampStyle: CSSProperties = {
  color: "var(--pf-t--global--text--Color--disabled)",
  flexShrink: 0,
};

function levelStyle(level: string): CSSProperties {
  const base: CSSProperties = { flexShrink: 0, fontWeight: 600 };
  if (level === "WARN") {
    return { ...base, color: "var(--pf-t--global--palette--gold--40)" };
  }
  if (level === "ERROR") {
    return { ...base, color: "var(--pf-t--global--danger-color--100)" };
  }
  return { ...base, color: "var(--pf-t--global--palette--blue--40)" };
}

export default function UpdateLogsModal({ isOpen, onClose }: UpdateLogsModalProps) {
  const logs = [
    { timestamp: "2026-03-17 14:32:15", level: "INFO", message: "Starting cluster update process" },
    { timestamp: "2026-03-17 14:32:18", level: "INFO", message: "Validating update prerequisites" },
    { timestamp: "2026-03-17 14:32:25", level: "INFO", message: "Downloading update images" },
    { timestamp: "2026-03-17 14:33:42", level: "INFO", message: "Updating operator Abot Operator-v3.0.0" },
    { timestamp: "2026-03-17 14:34:15", level: "INFO", message: "Operator Abot Operator-v3.0.0 updated successfully" },
    { timestamp: "2026-03-17 14:34:18", level: "INFO", message: "Updating operator Airflow Helm Operator" },
    { timestamp: "2026-03-17 14:35:02", level: "INFO", message: "Operator Airflow Helm Operator updated successfully" },
    { timestamp: "2026-03-17 14:35:05", level: "INFO", message: "Updating operator Ansible Automation Platform" },
    { timestamp: "2026-03-17 14:36:21", level: "INFO", message: "Operator Ansible Automation Platform updated successfully" },
    { timestamp: "2026-03-17 14:36:24", level: "INFO", message: "Starting control plane update" },
    { timestamp: "2026-03-17 14:37:45", level: "INFO", message: "Control plane master-0 updated successfully" },
    { timestamp: "2026-03-17 14:39:12", level: "INFO", message: "Control plane master-1 updated successfully" },
    { timestamp: "2026-03-17 14:40:38", level: "INFO", message: "Control plane master-2 updated successfully" },
    { timestamp: "2026-03-17 14:40:42", level: "INFO", message: "Starting worker nodes update" },
    { timestamp: "2026-03-17 14:41:15", level: "INFO", message: "Worker node worker-east-01 draining..." },
    { timestamp: "2026-03-17 14:42:30", level: "INFO", message: "Worker node worker-east-01 drained" },
    { timestamp: "2026-03-17 14:42:35", level: "INFO", message: "Updating worker node worker-east-01..." },
  ];

  return (
    <Modal
      variant="large"
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="update-logs-modal-title"
      aria-describedby="update-logs-modal-description"
    >
      <ModalHeader
        labelId="update-logs-modal-title"
        descriptorId="update-logs-modal-description"
        title="Cluster Update Logs"
        description="Live-style log output from the simulated cluster update."
      />
      <ModalBody>
        <div style={logPanelStyle}>
          <Flex direction={{ default: "column" }} gap={{ default: "gapXs" }}>
            {logs.map((log, index) => (
              <Flex
                key={index}
                flexWrap={{ default: "nowrap" }}
                gap={{ default: "gapMd" }}
                alignItems={{ default: "alignItemsFlexStart" }}
              >
                <Content component="span" style={timestampStyle}>
                  {log.timestamp}
                </Content>
                <Content component="span" style={levelStyle(log.level)}>
                  [{log.level}]
                </Content>
                <Content component="span" style={{ wordBreak: "break-word" }}>
                  {log.message}
                </Content>
              </Flex>
            ))}
            <Flex
              flexWrap={{ default: "nowrap" }}
              gap={{ default: "gapMd" }}
              alignItems={{ default: "alignItemsCenter" }}
            >
              <Content component="span" style={timestampStyle}>
                2026-03-17 14:43:15
              </Content>
              <Content component="span" style={levelStyle("INFO")}>
                [INFO]
              </Content>
              <Content component="span">Updating…</Content>
            </Flex>
          </Flex>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
