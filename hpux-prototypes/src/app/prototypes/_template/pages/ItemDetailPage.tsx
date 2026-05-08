import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Card,
  CardBody,
} from '@patternfly/react-core';

/**
 * Item Detail Page
 * 
 * This is a detail page for viewing a single item.
 * It follows the Standard Page Template Pattern:
 * - Breadcrumbs Section (16px padding)
 * - Heading Section (24px padding)
 * - Content Area (24px padding)
 */
export const ItemDetailPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch the item data based on itemId
  // For this example, we'll use mock data
  const itemData = {
    id: itemId || '1',
    name: 'Item 1',
    status: 'Active',
    created: '2024-01-15',
    description: 'This is a detailed view of Item 1. You can see all the information about this item here.',
    type: 'Resource',
    owner: 'admin@example.com',
    lastModified: '2024-01-20',
  };

  return (
    <>
      {/* Breadcrumbs Section - 16px padding */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/new-page')}>
            New Page
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{itemData.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section - 24px padding (Title + Description) */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          {itemData.name}
        </Title>
        <Content>
          <p>{itemData.description}</p>
        </Content>
      </div>

      {/* Content Area - 24px padding */}
      <div className="template-page-content">
        {/* Card with item details */}
        <Card>
          <CardBody>
            <DescriptionList columnModifier={{ default: '2Col' }}>
              <DescriptionListGroup>
                <DescriptionListTerm>ID</DescriptionListTerm>
                <DescriptionListDescription>{itemData.id}</DescriptionListDescription>
              </DescriptionListGroup>
              
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>{itemData.name}</DescriptionListDescription>
              </DescriptionListGroup>
              
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>{itemData.status}</DescriptionListDescription>
              </DescriptionListGroup>
              
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>{itemData.type}</DescriptionListDescription>
              </DescriptionListGroup>
              
              <DescriptionListGroup>
                <DescriptionListTerm>Created</DescriptionListTerm>
                <DescriptionListDescription>{itemData.created}</DescriptionListDescription>
              </DescriptionListGroup>
              
              <DescriptionListGroup>
                <DescriptionListTerm>Last Modified</DescriptionListTerm>
                <DescriptionListDescription>{itemData.lastModified}</DescriptionListDescription>
              </DescriptionListGroup>
              
              <DescriptionListGroup>
                <DescriptionListTerm>Owner</DescriptionListTerm>
                <DescriptionListDescription>{itemData.owner}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

