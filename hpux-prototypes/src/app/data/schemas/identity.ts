// Identity Schema Types

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Active' | 'Inactive';
  groupIds: string[];
  identityProviderId: string; // Which identity provider the user authenticates through
  created: string; // ISO date string
  lastLogin: string; // ISO date string
}

export interface Group {
  id: string;
  name: string;
  description: string;
  userIds: string[];
  type: 'team' | 'department' | 'project' | 'regional';
}

export interface ServiceAccount {
  id: string;
  name: string;
  namespace: string;
  description: string;
  created: string;
}

export interface IdentityProvider {
  id: string;
  name: string;
  type: 'LDAP' | 'SAML' | 'OpenID Connect' | 'GitHub' | 'Google';
  status: 'Active' | 'Inactive';
  description: string;
  clusterIds: string[]; // Which clusters this identity provider is configured for
}

