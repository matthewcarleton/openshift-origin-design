import * as React from 'react';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { FilterIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';
import { getAllNamespaces, getClusterById, getVirtualMachinesByNamespace } from '@app/data/queries';

// Hub cluster ID - the cluster where ACM is installed
const HUB_CLUSTER_ID = 'cluster-hub';

interface Project {
  id: string;
  name: string;
  displayName: string;
  status: string;
  requester: string;
  memory: string;
  cpu: string;
  created: string;
  type: string;
}

// Transform namespace data into project format
const createProjectsFromNamespaces = () => {
  const namespaces = getAllNamespaces();
  
  // Filter to only show namespaces from the hub cluster
  const hubNamespaces = namespaces.filter(ns => ns.clusterId === HUB_CLUSTER_ID);
  
  return hubNamespaces.map((namespace, index) => {
    const cluster = getClusterById(namespace.clusterId);
    const vms = getVirtualMachinesByNamespace(namespace.id);
    
    // Calculate total memory and CPU from VMs
    const totalMemory = vms.reduce((sum, vm) => {
      const memMatch = vm.memory.match(/(\d+)/);
      return sum + (memMatch ? parseInt(memMatch[1]) : 0);
    }, 0);
    
    const totalCpu = vms.reduce((sum, vm) => sum + vm.cpu, 0);
    
    // Generate a created date
    const createdDate = new Date(2024, 0, 15 + index);
    
    return {
      id: namespace.id,
      name: namespace.name,
      displayName: namespace.labels.app ? `${namespace.labels.app} project` : 'No display name',
      status: cluster?.status === 'Ready' ? 'Active' : 'Unknown',
      requester: namespace.labels.team || namespace.labels.env || 'system',
      memory: totalMemory > 0 ? `${totalMemory} GiB` : '-',
      cpu: totalCpu > 0 ? `${totalCpu} cores` : '-',
      created: createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      type: namespace.type,
    };
  });
};

const mockProjects: Project[] = createProjectsFromNamespaces();

const Projects: React.FunctionComponent = () => {
  useDocumentTitle('Projects');
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedProjects, setSelectedProjects] = React.useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const paginatedProjects = mockProjects.slice((page - 1) * perPage, page * perPage);

  const isAllSelected = paginatedProjects.length > 0 && paginatedProjects.every(project => selectedProjects.has(project.id));

  const handleSelectAll = (isSelecting: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (isSelecting) {
      paginatedProjects.forEach(project => newSelected.add(project.id));
    } else {
      paginatedProjects.forEach(project => newSelected.delete(project.id));
    }
    setSelectedProjects(newSelected);
  };

  const handleSelectProject = (projectId: string, isSelecting: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (isSelecting) {
      newSelected.add(projectId);
    } else {
      newSelected.delete(projectId);
    }
    setSelectedProjects(newSelected);
  };

  return (
    <>
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Dropdown
                isOpen={isFilterOpen}
                onSelect={() => setIsFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="default"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    isExpanded={isFilterOpen}
                  >
                    <FilterIcon /> Project
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="all">All projects</DropdownItem>
                  <DropdownItem key="infrastructure">Infrastructure</DropdownItem>
                  <DropdownItem key="application">Application</DropdownItem>
                  <DropdownItem key="development">Development</DropdownItem>
                  <DropdownItem key="monitoring">Monitoring</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search projects"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary">Create project</Button>
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={mockProjects.length}
                perPage={perPage}
                page={page}
                onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                onPerPageSelect={(_event, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
                variant={PaginationVariant.top}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Projects table" variant="compact">
          <Thead>
            <Tr>
              <Th
                select={{
                  onSelect: (_event, isSelecting) => handleSelectAll(isSelecting),
                  isSelected: isAllSelected,
                }}
              />
              <Th width={25}>Name</Th>
              <Th width={20}>Display name</Th>
              <Th width={10}>Status</Th>
              <Th width={10}>Type</Th>
              <Th width={15}>Requester</Th>
              <Th width={10}>Memory</Th>
              <Th width={10}>CPU</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProjects.map((project, index) => (
              <Tr key={project.id}>
                <Td
                  select={{
                    rowIndex: index,
                    onSelect: (_event, isSelecting) => handleSelectProject(project.id, isSelecting),
                    isSelected: selectedProjects.has(project.id),
                  }}
                />
                <Td dataLabel="Name" width={25} style={{ textAlign: 'left' }}>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => navigate(`/core/home/projects/${project.name}`)}
                    style={{ paddingLeft: 0 }}
                  >
                    {project.name}
                  </Button>
                </Td>
                <Td dataLabel="Display name" width={20}>
                  {project.displayName}
                </Td>
                <Td dataLabel="Status" width={10}>
                  <Label color={project.status === 'Active' ? 'green' : 'grey'}>{project.status}</Label>
                </Td>
                <Td dataLabel="Type" width={10}>
                  <Label color="blue">{project.type.charAt(0).toUpperCase() + project.type.slice(1)}</Label>
                </Td>
                <Td dataLabel="Requester" width={15}>{project.requester}</Td>
                <Td dataLabel="Memory" width={10}>{project.memory}</Td>
                <Td dataLabel="CPU" width={10}>{project.cpu}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div style={{ padding: '16px' }}>
          <Pagination
            itemCount={mockProjects.length}
            perPage={perPage}
            page={page}
            onSetPage={(_event, pageNumber) => setPage(pageNumber)}
            onPerPageSelect={(_event, newPerPage) => {
              setPerPage(newPerPage);
              setPage(1);
            }}
            variant={PaginationVariant.bottom}
          />
        </div>
      </div>
    </>
  );
};

export { Projects };
