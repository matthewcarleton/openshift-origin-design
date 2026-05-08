import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Button,
  Flex,
  FlexItem,
  Content,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface ImpersonateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImpersonate: (user: User) => void;
}

export default function ImpersonateUserModal({
  isOpen,
  onClose,
  onImpersonate,
}: ImpersonateUserModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const users: User[] = [
    { id: "1", name: "Sarah Chen", email: "sarah.chen@redhat.com", role: "Developer", department: "Engineering" },
    { id: "2", name: "Michael Rodriguez", email: "michael.rodriguez@redhat.com", role: "DevOps Engineer", department: "Operations" },
    { id: "3", name: "Emily Watson", email: "emily.watson@redhat.com", role: "Product Manager", department: "Product" },
    { id: "4", name: "David Kim", email: "david.kim@redhat.com", role: "Security Analyst", department: "Security" },
    { id: "5", name: "Lisa Anderson", email: "lisa.anderson@redhat.com", role: "QA Engineer", department: "Quality Assurance" },
    { id: "6", name: "James Wilson", email: "james.wilson@redhat.com", role: "Site Reliability Engineer", department: "Operations" },
    { id: "7", name: "Maria Garcia", email: "maria.garcia@redhat.com", role: "Frontend Developer", department: "Engineering" },
    { id: "8", name: "Robert Taylor", email: "robert.taylor@redhat.com", role: "Backend Developer", department: "Engineering" },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImpersonate = (user: User) => {
    onImpersonate(user);
    onClose();
  };

  return (
    <Modal
      variant="medium"
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="impersonate-modal-title"
      aria-describedby="impersonate-modal-description"
    >
      <ModalHeader
        labelId="impersonate-modal-title"
        descriptorId="impersonate-modal-description"
        title="Impersonate User"
        description="Select a user to view the console from their perspective"
      />
      <ModalBody>
        <Flex direction={{ default: "column" }} gap={{ default: "gapMd" }}>
          <FlexItem>
            <TextInput
              id="impersonate-search"
              type="search"
              customIcon={<SearchIcon />}
              placeholder="Search by name, email, role, or department..."
              value={searchQuery}
              onChange={(_e, value) => setSearchQuery(value)}
              aria-label="Search users"
            />
          </FlexItem>
          <FlexItem>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {filteredUsers.length === 0 ? (
                <Content>
                  <p>No users found matching &quot;{searchQuery}&quot;</p>
                </Content>
              ) : (
                <Flex direction={{ default: "column" }} gap={{ default: "gapSm" }}>
                  {filteredUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="plain"
                      isBlock
                      onClick={() => handleImpersonate(user)}
                      style={{ justifyContent: "flex-start", height: "auto", padding: "var(--pf-t--global--spacer--md)" }}
                    >
                      <Flex flexWrap={{ default: "nowrap" }} alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }} style={{ width: "100%", textAlign: "left" }}>
                        <FlexItem>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "var(--pf-t--global--background--color--secondary--default)",
                              fontWeight: 600,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}
                          >
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        </FlexItem>
                        <FlexItem grow={{ default: "grow" }} style={{ minWidth: 0 }}>
                          <Content>
                            <strong>{user.name}</strong>
                            <div>
                              <small>{user.email}</small>
                            </div>
                          </Content>
                        </FlexItem>
                        <FlexItem style={{ textAlign: "right", flexShrink: 0 }}>
                          <Content>
                            <strong style={{ fontSize: "12px" }}>{user.role}</strong>
                            <div>
                              <small>{user.department}</small>
                            </div>
                          </Content>
                        </FlexItem>
                      </Flex>
                    </Button>
                  ))}
                </Flex>
              )}
            </div>
          </FlexItem>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Content component="p" style={{ fontSize: "12px", margin: 0 }}>
          You will see the console from the selected user&apos;s perspective. All actions will be logged under your admin account.
        </Content>
      </ModalFooter>
    </Modal>
  );
}
