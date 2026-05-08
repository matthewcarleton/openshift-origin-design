import { Content, Page, PageSection, Title } from '@patternfly/react-core'

/**
 * Shown when there is no `?entry=…` deep link (the old four-tile role landing was removed).
 * Personas are opened from the OpenShift UX prototype hub — Sovereign Cloud area.
 */
export function OsacHubEntryStub() {
  return (
    <Page aria-label="OSAC entry">
      <PageSection>
        <Title headingLevel="h1" size="3xl">
          Red Hat OSAC Prototypes
        </Title>
        <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--md)', maxWidth: '40rem' }}>
          This build is opened via a persona deep link. Choose a role on the <strong>Sovereign Cloud</strong> team page in
          the OpenShift UX prototype hub (Infra Admin, Provider Admin, Tenant Admin, or Tenant User).
        </Content>
      </PageSection>
    </Page>
  )
}
