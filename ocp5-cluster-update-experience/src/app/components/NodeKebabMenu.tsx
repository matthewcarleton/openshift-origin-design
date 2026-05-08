import { useState } from "react";
import { Eye, Droplet, RotateCw, Trash2 } from "@/lib/pfIcons";
import { useNavigate } from "react-router";
import {
  Dropdown,
  DropdownItem,
  Divider,
  MenuToggle,
} from "@patternfly/react-core";
import EllipsisVIcon from "@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon";

interface NodeKebabMenuProps {
  nodeName: string;
  onDrain?: () => void;
  onRestart?: () => void;
  onDelete?: () => void;
}

export default function NodeKebabMenu({
  nodeName,
  onDrain,
  onRestart,
  onDelete,
}: NodeKebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    setIsOpen(false);
    navigate(`/compute/nodes/${encodeURIComponent(nodeName)}`);
  };

  const handleDrain = () => {
    setIsOpen(false);
    onDrain?.();
  };

  const handleRestart = () => {
    setIsOpen(false);
    onRestart?.();
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete?.();
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      popperProps={{ position: "right-end" }}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          variant="plain"
          aria-label="Node actions"
          icon={<EllipsisVIcon />}
          onClick={() => setIsOpen((o) => !o)}
          isExpanded={isOpen}
        />
      )}
      onSelect={() => setIsOpen(false)}
    >
      <DropdownItem
        itemId="view"
        icon={<Eye className="h-4 w-4" />}
        onClick={handleViewDetails}
      >
        View node details
      </DropdownItem>
      <DropdownItem
        itemId="drain"
        icon={<Droplet className="h-4 w-4" />}
        onClick={handleDrain}
      >
        Drain node
      </DropdownItem>
      <DropdownItem
        itemId="restart"
        icon={<RotateCw className="h-4 w-4" />}
        onClick={handleRestart}
      >
        Restart node
      </DropdownItem>
      <Divider component="li" />
      <DropdownItem
        itemId="delete"
        icon={<Trash2 className="h-4 w-4" />}
        isDanger
        onClick={handleDelete}
      >
        Delete node
      </DropdownItem>
    </Dropdown>
  );
}
