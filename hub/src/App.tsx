import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Link,
  matchPath,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";

import ExternalLinkAltIcon from "@patternfly/react-icons/dist/js/icons/external-link-alt-icon";
import OutlinedStickyNoteIcon from "@patternfly/react-icons/dist/js/icons/outlined-sticky-note-icon";

import manifestRaw from "./data/prototypes.manifest.json";
import { pfIcon, type PfIconComponent } from "./iconImports";

import type { IconKey } from "./iconImports";
import type { ManifestCrossProductEntry, ManifestPrototypeEntry, ManifestTeamEntry, PrototypesManifest } from "./manifest.types";
import {
  isPublicManifestEntry,
  manifestPrototypeEntryMatchesSearchQuery,
  privateManifestEntryMatchesSearchQuery,
  resolvePrivatePrototypeContact,
} from "./manifestVisibility";
import { PrivatePrototypeCard } from "./PrivatePrototypeCard";
import { PrototypeEntryCard } from "./PrototypeEntryCard";

import {
  Breadcrumb,
  BreadcrumbItem,
  Brand,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Content,
  ContentVariants,
  Divider,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  Label,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSection,
  TextInput,
  Title,
} from "@patternfly/react-core";

const manifest = manifestRaw as unknown as PrototypesManifest;

/** Design notes payload received via postMessage from the hpux-prototypes iframe. */
interface HpuxDesignNotesData {
  designerNotes: string;
  navigationGuide?: Array<{ page: string; path: string; notes?: string }>;
  ownerName?: string;
  ownerSlack?: string;
  personaName?: string;
  jiraUrl?: string;
  recordingUrl?: string;
  designDocUrl?: string;
}

const TEAM_BY_ID = new Map(manifest.teams.map((item) => [item.id, item]));

const CROSS_PRODUCT_BY_ID = new Map(manifest.crossProducts.map((item) => [item.id, item]));

interface TeamPrototypeBucket {
  public: ManifestPrototypeEntry[];
  private: ManifestPrototypeEntry[];
}

const PROTOTYPES_BY_TEAM = (() => {
  const map = new Map<string, TeamPrototypeBucket>();
  for (const p of manifest.prototypes) {
    const bucket = map.get(p.teamId) ?? { public: [], private: [] };
    if (isPublicManifestEntry(p)) bucket.public.push(p);
    else bucket.private.push(p);
    map.set(p.teamId, bucket);
  }
  return map;
})();

function teamPrototypeBucket(teamId: string): TeamPrototypeBucket {
  return PROTOTYPES_BY_TEAM.get(teamId) ?? { public: [], private: [] };
}

function areaMaintainerForTeamId(teamId: string): string | undefined {
  return TEAM_BY_ID.get(teamId)?.maintainer ?? CROSS_PRODUCT_BY_ID.get(teamId)?.maintainer;
}

/** Cross-product lanes that list hub prototypes use the same detail UI as product teams. */
function crossProductToTeamEntry(item: ManifestCrossProductEntry): ManifestTeamEntry {
  return {
    id: item.id,
    name: item.name,
    icon: item.icon,
    lastUpdated: "2026-05-05",
    maintainer: item.maintainer,
  };
}

const openshiftMarkSrc = `${import.meta.env.BASE_URL}openshift-mark.png`;

interface HubOutletContextType {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

function formatDisplayedDate(raw: string) {
  const d = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function useEmbedFullscreenChrome() {
  useEffect(() => {
    document.documentElement.classList.add("ops-hub-embed-fullscreen-active");
    document.body.classList.add("ops-hub-embed-fullscreen-active");
    return () => {
      document.documentElement.classList.remove("ops-hub-embed-fullscreen-active");
      document.body.classList.remove("ops-hub-embed-fullscreen-active");
    };
  }, []);
}

interface EmbedVersionOption {
  id: string;
  label: string;
}

function EmbedVersionSwitcher({
  options,
  value,
  onChange,
  ariaLabel = "Prototype version",
}: {
  options: EmbedVersionOption[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}) {
  if (options.length <= 1) {
    return (
      <span className="ops-hub-embed-version-readonly" aria-label={ariaLabel}>
        Latest version
      </span>
    );
  }
  const coerced = options.some((o) => o.id === value) ? value : (options[0]?.id ?? value);
  return (
    <select
      className="ops-hub-embed-version-select"
      value={coerced}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

type StatusBadgeColor = "blue" | "green" | "grey" | "orange";

function statusBadgeColor(status: string): { color: StatusBadgeColor; variant?: "outline" | "filled" } {
  switch (status) {
    case "in-progress": return { color: "blue" };
    case "draft":       return { color: "grey" };
    case "done":        return { color: "green" };
    case "archived":    return { color: "grey", variant: "outline" };
    case "paused":      return { color: "orange" };
    default:            return { color: "grey" };
  }
}

function EmbedFullscreenTopBar({
  backTo,
  backLabel,
  versionOptions,
  versionValue,
  onVersionChange,
  versionAriaLabel,
  statusBadge,
  extraActions,
}: {
  backTo: string;
  backLabel: string;
  versionOptions: EmbedVersionOption[];
  versionValue: string;
  onVersionChange: (id: string) => void;
  versionAriaLabel?: string;
  /** When present, renders a status Label beside the version selector. */
  statusBadge?: string;
  /** Optional extra controls rendered beside the version switcher (e.g. Design Notes button). */
  extraActions?: React.ReactNode;
}) {
  const badgeProps = statusBadge ? statusBadgeColor(statusBadge) : null;
  return (
    <header className="ops-hub-embed-top-bar">
      <Link to={backTo} className="ops-hub-embed-top-bar__link">
        {backLabel}
      </Link>
      <div className="ops-hub-embed-top-bar__trailing">
        <div className="ops-hub-embed-top-bar__trailing-inner">
          <EmbedVersionSwitcher
            options={versionOptions}
            value={versionValue}
            onChange={onVersionChange}
            ariaLabel={versionAriaLabel}
          />
          {badgeProps ? (
            <Label className="ops-hub-embed-status-badge" color={badgeProps.color} variant={badgeProps.variant ?? "filled"}>
              {statusBadge}
            </Label>
          ) : null}
          {extraActions ?? null}
        </div>
      </div>
    </header>
  );
}

function TeamPfIcon({
  iconKey,
  status,
}: {
  iconKey: IconKey;
  status?: "custom" | "info";
}) {
  const IconComponent = pfIcon(iconKey);
  const statusProp = status ?? "custom";
  return (
    <Icon size="headingMd" iconSize="headingLg" status={statusProp} isInline>
      <IconComponent />
    </Icon>
  );
}

function TeamListingCard({
  team,
  publicCount,
  privateCount,
}: {
  team: ManifestTeamEntry;
  publicCount: number;
  privateCount: number;
}) {
  return (
    <Card isCompact isFullHeight ouiaSafe isClickable>
      <CardHeader>
        <Flex gap={{ default: "gapMd" }}>
          <FlexItem>
            <TeamPfIcon iconKey={team.icon} status="info" />
          </FlexItem>
          <FlexItem grow={{ default: "grow" }}>
            <CardTitle>{team.name}</CardTitle>
            <Content component={ContentVariants.small}>
              {publicCount === 1 ? "1 prototype" : `${publicCount} prototypes`}
            </Content>
            {privateCount > 0 ? (
              <Content component={ContentVariants.small}>
                {privateCount === 1 ? "1 private prototype" : `${privateCount} private prototypes`}
              </Content>
            ) : null}
            <Content component={ContentVariants.small}>Last updated {formatDisplayedDate(team.lastUpdated)}</Content>
            <Content component={ContentVariants.small}>
              Maintainer: {team.maintainer}
            </Content>
          </FlexItem>
        </Flex>
      </CardHeader>
    </Card>
  );
}

function CrossProductCard({ item }: { item: ManifestCrossProductEntry }) {
  const bucket = teamPrototypeBucket(item.id);
  const hubListed = bucket.public.length;
  const hubPrivate = bucket.private.length;
  const IconStyle: PfIconComponent = pfIcon(item.icon);

  return (
    <Link
      to={`/cross-product/${item.id}`}
      className="ops-hub-team-card-link"
      aria-label={`Open ${item.name} cross-product prototypes`}
    >
      <Card isCompact isFullHeight ouiaSafe isClickable>
        <CardHeader>
          <Flex gap={{ default: "gapMd" }} alignItems={{ default: "alignItemsFlexStart" }}>
            <FlexItem>
              <Icon size="headingMd" iconSize="headingLg" status="info" isInline>
                <IconStyle />
              </Icon>
            </FlexItem>
            <FlexItem grow={{ default: "grow" }}>
              <CardTitle>{item.name}</CardTitle>
              <Content component={ContentVariants.p}>{item.description}</Content>
              <Content component={ContentVariants.small}>
                {hubListed === 1 ? "1 prototype" : `${hubListed} prototypes`}
              </Content>
              {hubPrivate > 0 ? (
                <Content component={ContentVariants.small}>
                  {hubPrivate === 1 ? "1 private prototype" : `${hubPrivate} private prototypes`}
                </Content>
              ) : null}
              <Content component={ContentVariants.small}>Maintainer: {item.maintainer}</Content>
            </FlexItem>
          </Flex>
        </CardHeader>
      </Card>
    </Link>
  );
}

function HubMasthead({
  isHomeView,
  isContributingView,
  teamConfluenceUrl,
  demosUrl,
  onResetSearchWhenHome,
  query,
  onQueryChange,
  searchAriaLabel,
  searchPlaceholder,
}: {
  isHomeView: boolean;
  isContributingView: boolean;
  teamConfluenceUrl: string | null | undefined;
  demosUrl: string | null | undefined;
  onResetSearchWhenHome: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  searchAriaLabel: string;
  searchPlaceholder: string;
}) {
  const hasTeam = typeof teamConfluenceUrl === "string" && teamConfluenceUrl.trim();
  const hasDemos = typeof demosUrl === "string" && demosUrl.trim();

  return (
    <Masthead inset={{ default: "insetMd" }} aria-label="OpenShift UX" className="ops-hub-masthead">
      <MastheadMain>
        <MastheadBrand className="ops-hub-brand">
          <Flex gap={{ default: "gapMd" }} alignItems={{ default: "alignItemsCenter" }}>
            <FlexItem>
              <Brand
                src={openshiftMarkSrc}
                alt="Red Hat OpenShift"
                heights={{ default: "36px", md: "36px", lg: "36px" }}
                className="ops-hub-brand-logo"
              />
            </FlexItem>
            <FlexItem>
              <Content component={ContentVariants.small}>
                OpenShift UX
              </Content>
            </FlexItem>
          </Flex>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent className="ops-hub-masthead__tools">
        <Flex
          alignItems={{ default: "alignItemsCenter" }}
          gap={{ default: "gapMd", lg: "gapLg" }}
          flexWrap={{ default: "wrap" }}
          justifyContent={{ default: "justifyContentFlexEnd" }}
          style={{ flex: 1, minWidth: 0 }}
        >
          <FlexItem>
            <Nav variant="horizontal" aria-label="Primary navigation" ouiaId="OpsUxHubTopNav" className="ops-hub-nav-inline">
              <NavList>
                <NavItem itemId="hub-home" isActive={isHomeView} to="/" onClick={() => onResetSearchWhenHome()}>
                  <Link to="/">Home</Link>
                </NavItem>
                <NavItem itemId="hub-contributing" isActive={isContributingView} to="/contributing">
                  <Link to="/contributing">Contributor guide</Link>
                </NavItem>
                {hasTeam ? (
                  <NavItem
                    className="ops-hub-nav__item--external"
                    component="a"
                    itemId="hub-team-confluence"
                    to={teamConfluenceUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon aria-hidden />}
                  >
                    Team
                  </NavItem>
                ) : null}
                {hasDemos ? (
                  <NavItem
                    className="ops-hub-nav__item--external"
                    component="a"
                    itemId="hub-demos"
                    to={demosUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon aria-hidden />}
                  >
                    Demos
                  </NavItem>
                ) : null}
              </NavList>
            </Nav>
          </FlexItem>
          <FlexItem>
            <TextInput
              type="search"
              value={query}
              onChange={(_evt, value) => onQueryChange(value)}
              aria-label={searchAriaLabel}
              placeholder={searchPlaceholder}
              style={{ width: "100%", maxWidth: 296, minWidth: 200 }}
            />
          </FlexItem>
        </Flex>
      </MastheadContent>
    </Masthead>
  );
}

function TeamDetailView({
  team,
  publicEntries,
  privateEntries,
  onNavigateHome,
  query,
}: {
  team: ManifestTeamEntry;
  publicEntries: ManifestPrototypeEntry[];
  privateEntries: ManifestPrototypeEntry[];
  onNavigateHome: () => void;
  query: string;
}) {
  const q = query.trim().toLowerCase();

  const filteredPublic = useMemo(() => {
    if (!q) return publicEntries;
    return publicEntries.filter((p) => manifestPrototypeEntryMatchesSearchQuery(p, q));
  }, [publicEntries, q]);

  const filteredPrivate = useMemo(() => {
    if (!q) return privateEntries;
    return privateEntries.filter((p) => privateManifestEntryMatchesSearchQuery(p, team.maintainer, q));
  }, [privateEntries, q, team.maintainer]);

  const totalListed = publicEntries.length + privateEntries.length;
  const visibleCount = filteredPublic.length + filteredPrivate.length;

  return (
    <>
      <PageSection variant="default" isWidthLimited className="ops-hub-team-header">
        <Breadcrumb aria-label={`${team.name} navigation`}>
          <BreadcrumbItem
            render={({ className }) => (
              <Link
                to="/"
                className={className}
                onClick={() => onNavigateHome()}
                aria-label="Home"
              >
                Home
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{team.name}</BreadcrumbItem>
        </Breadcrumb>

        <Title headingLevel="h2" size="3xl">
          {team.name} prototypes
        </Title>
        <Content component={ContentVariants.p}>
          {visibleCount} of {totalListed}{" "}
          {totalListed === 1 ? "entry listed" : "entries listed"} for this area (use masthead search to filter).
          {privateEntries.length > 0 ? (
            <>
              {" "}
              {privateEntries.length === 1 ? "1 is a private prototype" : `${privateEntries.length} are private prototypes`}
              {" "}
              (restricted on the public hub).
            </>
          ) : null}
        </Content>
      </PageSection>

      <PageSection variant="default" isWidthLimited>
        {visibleCount === 0 ? (
          <Content component={ContentVariants.p} style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            Nothing matches &quot;{query}&quot;.
          </Content>
        ) : (
          <Grid hasGutter style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            {filteredPublic.map((p) => (
              <GridItem
                key={`public:${team.id}:${p.title}:${p.jiraKey}:${p.updatedAt}`}
                span={12}
                md={6}
                lg={6}
                xl={4}
                style={{ display: "flex" }}
              >
                <PrototypeEntryCard entry={p} />
              </GridItem>
            ))}
            {filteredPrivate.map((entry) => (
              <GridItem
                key={`private:${team.id}:${entry.title}:${entry.jiraKey}:${entry.updatedAt}`}
                span={12}
                md={6}
                lg={6}
                xl={4}
                style={{ display: "flex" }}
              >
                <PrivatePrototypeCard
                  entry={entry}
                  contactLabel={resolvePrivatePrototypeContact(entry, team.maintainer)}
                />
              </GridItem>
            ))}
          </Grid>
        )}
      </PageSection>
    </>
  );
}

function HubFooter({
  legacyUrl,
  footer,
}: {
  legacyUrl?: string | null;
  footer?: PrototypesManifest["footer"];
}) {
  const year = new Date().getFullYear();
  const name = footer?.contactDisplayName?.trim() || "Matt Carleton";
  const email = footer?.contactEmail?.trim();
  const slackHref = footer?.contactSlackHref?.trim();
  const slackHandle = footer?.contactSlackHandle ?? "@mcarleto";
  const mailHref = email ? `mailto:${email}` : undefined;

  return (
    <PageSection variant="default" isWidthLimited className="ops-hub-footer">
      <Divider />
      <Flex direction={{ default: "column" }} gap={{ default: "gapXs" }} className="ops-hub-footer__body">
        <Flex
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          alignItems={{ default: "alignItemsBaseline" }}
          flexWrap={{ default: "wrap" }}
          gap={{ default: "gapMd" }}
          className="ops-hub-footer__legacy-repo-row"
        >
          <FlexItem>
            <Content component={ContentVariants.small}>
              Legacy site:&nbsp;
              {legacyUrl?.trim() ? (
                <Button
                  variant="link"
                  isInline
                  component="a"
                  href={legacyUrl.trim()}
                  icon={<ExternalLinkAltIcon aria-hidden />}
                  iconPosition="right"
                  size="sm"
                >
                  openshift-origin-design
                </Button>
              ) : (
                "Not configured"
              )}
              {" · "}© {year} Red Hat, Inc.
            </Content>
          </FlexItem>
          <FlexItem className="ops-hub-footer__repo-item">
            <Content component={ContentVariants.small} className="ops-hub-footer__repo-line">
              This repo represents all the opensource designs contributed by the OpenShift User Experience Design team.
            </Content>
          </FlexItem>
        </Flex>

        <Content component={ContentVariants.small}>
          Have questions? Ask <strong>{name}</strong>
          {" — "}
          {mailHref ? (
            <Button variant="link" isInline size="sm" component="a" href={mailHref}>
              Email
            </Button>
          ) : null}
          {mailHref && slackHref ? " · " : null}
          {slackHref ? (
            <Button
              variant="link"
              isInline
              size="sm"
              component="a"
              href={slackHref}
              target="_blank"
              rel="noopener noreferrer"
              title={`Opens Slack in the browser or app (${slackHandle} in Red Hat Slack)`}
            >
              Slack ({slackHandle})
            </Button>
          ) : slackHandle ? (
            <span> Slack {slackHandle}</span>
          ) : null}
        </Content>
      </Flex>
    </PageSection>
  );
}

function HubHomePage() {
  const { query } = useOutletContext<HubOutletContextType>();

  const q = query.trim().toLowerCase();

  const filteredTeams = useMemo(() => {
    if (!q) return manifest.teams;
    return manifest.teams.filter((t) => t.name.toLowerCase().includes(q));
  }, [q]);

  const filteredCross = useMemo(() => {
    const protoMatchesArea = (areaId: string) => {
      const bucket = teamPrototypeBucket(areaId);
      const maintainer = areaMaintainerForTeamId(areaId);
      return (
        bucket.public.some((p) => manifestPrototypeEntryMatchesSearchQuery(p, q)) ||
        bucket.private.some((p) => privateManifestEntryMatchesSearchQuery(p, maintainer, q))
      );
    };
    if (!q) return manifest.crossProducts;
    return manifest.crossProducts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || protoMatchesArea(c.id),
    );
  }, [q]);

  return (
    <>
      <PageSection variant="default" isWidthLimited>
        <Title headingLevel="h1" size="4xl">
          OpenShift UX Prototypes
        </Title>
        <Content component={ContentVariants.p} style={{ marginTop: "var(--pf-t--global--spacer--md)", maxWidth: "52rem" }}>
          Browse clickable prototypes tied to UX work across OpenShift product areas. Use masthead search to filter areas and
          cross‑product lanes.
        </Content>
      </PageSection>

      <PageSection
        variant="default"
        isWidthLimited={false}
        className="ops-hub-designer-callout ops-hub-home-callouts"
        aria-label="Contributing designers"
      >
        <Flex direction={{ default: "column" }} alignItems={{ default: "alignItemsFlexStart" }} gap={{ default: "gapMd" }}>
          <Title headingLevel="h2" size="lg">
            Contributing designers
          </Title>
          <Content component={ContentVariants.p} style={{ marginBottom: 0 }}>
            Adding a prototype here?
          </Content>
          {/* Router `to`; PF Button types don’t expose Link props */}
          <Button
            variant="primary"
            {...({
              component: Link,
              to: "/contributing",
              children: "Open contributor guide",
            } as Parameters<typeof Button>[0])}
          />
        </Flex>
      </PageSection>

      <PageSection variant="default" isWidthLimited>
        <Title headingLevel="h2" size="xl">
          Prototypes by product area
        </Title>

        {filteredTeams.length === 0 ? (
          <Content component={ContentVariants.p} style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            Nothing matches &quot;{query}&quot;.
          </Content>
        ) : (
          <Grid hasGutter style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            {filteredTeams.map((team) => {
              const bucket = teamPrototypeBucket(team.id);
              return (
                <GridItem key={team.id} span={12} md={6} lg={6} xl={4}>
                  <Link to={`/team/${team.id}`} className="ops-hub-team-card-link" aria-label={`Open prototypes for ${team.name}`}>
                    <TeamListingCard team={team} publicCount={bucket.public.length} privateCount={bucket.private.length} />
                  </Link>
                </GridItem>
              );
            })}
          </Grid>
        )}
      </PageSection>

      <PageSection variant="default" isWidthLimited>
        <Divider />
        <Title headingLevel="h2" size="xl" style={{ marginTop: "var(--pf-t--global--spacer--lg)" }}>
          Cross-product prototypes
        </Title>
        <Content component={ContentVariants.p}>
          The OpenShift Design team is focused on cross product customer experiences that represent the journey our customers are on.
        </Content>

        {filteredCross.length === 0 ? (
          <Content component={ContentVariants.p} style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            Nothing matches &quot;{query}&quot;.
          </Content>
        ) : (
          <Grid hasGutter style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            {filteredCross.map((item) => (
              <GridItem key={item.id} span={12} md={6}>
                <CrossProductCard item={item} />
              </GridItem>
            ))}
          </Grid>
        )}
      </PageSection>
    </>
  );
}

function SectionSpacer() {
  return <div style={{ marginTop: "var(--pf-t--global--spacer--xl)" }} />;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="ops-hub-inline-code">{children}</code>;
}

const MW = { maxWidth: "52rem" };
const STEP_GAP = { marginTop: "var(--pf-t--global--spacer--sm)" };

function HubContributingPage() {
  const { setQuery } = useOutletContext<HubOutletContextType>();
  const contributorDocs = manifest.resourceLinks.contributorDocsUrl?.trim();

  return (
    <>
      {/* ── Header ── */}
      <PageSection variant="default" isWidthLimited className="ops-hub-team-header">
        <Breadcrumb aria-label="Contributor guide navigation">
          <BreadcrumbItem
            render={({ className }) => (
              <Link to="/" className={className} onClick={() => setQuery("")} aria-label="Home">
                Home
              </Link>
            )}
          />
          <BreadcrumbItem isActive>Contributor guide</BreadcrumbItem>
        </Breadcrumb>

        <Title headingLevel="h1" size="3xl">
          Contributor guide
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          This guide is for OpenShift UX designers contributing prototypes with Cursor. Treat the built-in{" "}
          <strong>prototype-contributor</strong> skill as the source of truth: it walks you through branching, building, updating
          the hub listing, and opening a pull request — so you don’t have to memorize manifest fields or repo scripts. Use the
          next section for clone and branch basics, then stay in chat. A strong first prompt is{" "}
          <em>I need to add to the design repo</em> — the skill asks whether this is a new listing or an update, then carries the
          work forward.
        </Content>
        <nav aria-label="Page sections" className="ops-hub-contrib-subnav">
          <Flex gap={{ default: "gapMd", md: "gapLg" }} flexWrap={{ default: "wrap" }}>
            <FlexItem>
              <Button variant="link" component="a" href="#skill" isInline size="sm">
                The skill
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="link" component="a" href="#getting-started" isInline size="sm">
                Getting started
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="link" component="a" href="#share-preview" isInline size="sm">
                Share without merging
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="link" component="a" href="#record-meet" isInline size="sm">
                Record (Meet)
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="link" component="a" href="#need-help" isInline size="sm">
                Need help?
              </Button>
            </FlexItem>
          </Flex>
        </nav>
        {contributorDocs ? (
          <div style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
            <Button
              variant="secondary"
              component="a"
              href={contributorDocs}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLinkAltIcon aria-hidden />}
              iconPosition="right"
              size="sm"
            >
              Extended playbook (internal)
            </Button>
          </div>
        ) : null}
      </PageSection>

      {/* ── The skill ── */}
      <PageSection variant="secondary" isWidthLimited className="ops-hub-designer-callout" id="skill">
        <Flex
          alignItems={{ default: "alignItemsFlexStart", md: "alignItemsCenter" }}
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          gap={{ default: "gapMd" }}
          flexWrap={{ default: "wrap" }}
        >
          <FlexItem grow={{ default: "grow" }}>
            <Title headingLevel="h2" size="lg">
              The prototype-contributor skill
            </Title>
            <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
              This repo ships with a Cursor skill at <Code>.cursor/skills/prototype-contributor/</Code>. Open this folder in Cursor
              and the skill loads automatically. Prefer chat over hunting through docs — try{" "}
              <em>I need to add to the design repo</em>, <em>help me add a prototype</em>, <em>set up my branch</em>,{" "}
              <em>register my prototype in the hub</em>, or <em>commit and push my changes</em>. It knows the conventions and
              manifest so you don’t have to.
            </Content>
            <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
              Prototype cards always show two slots — <strong>Design doc</strong> and <strong>Recording</strong>. They become
              clickable links when the manifest entry includes <Code>designDocUrl</Code> and <Code>prototypeRecordingUrl</Code>;
              otherwise they read <em>Not linked</em> until you add full URLs (Confluence, Google Docs, Loom, Drive, etc.). Ask the
              skill to add or update those fields when you register or refresh a listing.
            </Content>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* ── Getting started ── */}
      <PageSection variant="default" isWidthLimited id="getting-started">
        <Title headingLevel="h2" size="2xl">
          Getting started
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          Use this section to get a local copy of the repo and a working branch. Once the folder is open in Cursor, use the{" "}
          <strong>prototype-contributor</strong> skill for the rest — building, registering in the hub, and shipping a merge
          request — so you don’t have to edit manifests or remember npm scripts by hand.
        </Content>

        <SectionSpacer />
        <Title headingLevel="h3" size="xl">
          Clone the repo and open it in Cursor
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          Cloning downloads a copy of the repo to your machine. Open Cursor&apos;s built-in terminal (
          <strong>Terminal → New Terminal</strong> or <Code>Ctrl+`</Code>) and run:
        </Content>
        <Content component="ol" style={MW}>
          <li>Copy the repo&apos;s clone URL (SSH or HTTPS) from GitLab or GitHub.</li>
          <li>
            <Code>git clone &lt;paste-url-here&gt;</Code>
          </li>
          <li>
            Open the cloned folder in Cursor: <strong>File → Open Folder</strong>.
          </li>
        </Content>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          When the workspace loads, the skill is available. In chat, try{" "}
          <em>I just opened this repo — what should I do next?</em> or jump straight to{" "}
          <em>I need to add to the design repo</em>.
        </Content>

        <SectionSpacer />
        <Title headingLevel="h3" size="xl">
          Create your branch
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          A branch keeps your work separate until it&apos;s ready to merge. Ask the skill for a branch name that matches what
          you&apos;re building (for example,{" "}
          <em>create a branch for my sovereign cloud onboarding prototype</em>) or run:
        </Content>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          <Code>git checkout -b your-name/short-description</Code>
        </Content>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          We use <Code>name/short-description</Code> — for example <Code>ethan/sovereign-cloud-onboarding</Code> or{" "}
          <Code>joy/acm-cluster-overview</Code> — so it&apos;s clear who owns the line of work.
        </Content>

        <SectionSpacer />
        <Title headingLevel="h3" size="xl">
          Commit and push your branch
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          When you&apos;re ready to share, ask the skill to{" "}
          <em>commit my changes and push</em> — it can stage, message, and push. If you prefer the terminal:
        </Content>
        <Content component="ol" style={MW}>
          <li>
            <Code>git add .</Code> — stage your changes.
          </li>
          <li>
            <Code>git commit -m &quot;Describe what changed&quot;</Code> — save with a short explanation.
          </li>
          <li>
            <Code>git push -u origin your-name/short-description</Code> — publish the branch.
          </li>
        </Content>

        <span id="share-preview" />
        <SectionSpacer />
        <Title headingLevel="h3" size="xl">
          Share work without merging
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          Nothing has to land on <Code>main</Code> for people to see what you&apos;re doing. After you push your branch to GitHub,
          automation can build the hub and publish a preview — you don&apos;t run <Code>npm run build</Code> yourself unless you
          want to. Ask the <strong>prototype-contributor</strong> skill if you get stuck finding the link.
        </Content>
        <Content component="ul" style={MW}>
          <li>
            <strong>GitHub Pages preview (built in CI).</strong> This repo includes a workflow that runs on every push and deploys
            the hub to <Code>gh-pages</Code> under <Code>preview/&lt;your-branch-slug&gt;/</Code>. Open the repo&apos;s{" "}
            <strong>Actions</strong> tab, click the latest <em>Hub branch preview (GitHub Pages)</em> run for your branch, and scroll
            to the job summary for the exact URL. The pattern is{" "}
            <Code>
              https://&lt;owner&gt;.github.io/&lt;repo&gt;/preview/&lt;slug&gt;/
            </Code>{" "}
            — the slug is your branch name lowercased with slashes and special characters turned into hyphens. Each push updates
            the same preview. (One-time: enable GitHub Pages from the <Code>gh-pages</Code> branch, root folder, in repo Settings.)
          </li>
          <li>
            <strong>Pull request link.</strong> Open a pull request (draft is fine) from your branch and paste that URL in Slack,
            Jira, or email. People can review diffs and discussion there; it does not have to be merged for the link to work. Pair
            it with the Pages preview when someone needs a clickable hub.
          </li>
        </Content>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          Screenshots or a short Loom are still useful when you only need a quick async opinion.
        </Content>

        <span id="record-meet" />
        <SectionSpacer />
        <Title headingLevel="h3" size="xl">
          Record a walkthrough with Google Meet
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          Record a short demo in Meet, then let Cursor do the wiring. You need a Google account where Meet can save to Drive — if
          you don&apos;t see <strong>Record meeting</strong>, your admin may have it off; use another tool or ask IT.
        </Content>
        <Content component="ol" style={MW}>
          <li>
            Go to{" "}
            <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">
              meet.google.com
            </a>{" "}
            and start an instant meeting (only you need to join).
          </li>
          <li>
            Click <strong>Present now</strong> → choose <strong>A window</strong> or <strong>A tab</strong> — pick the browser
            window or tab that shows your prototype.
          </li>
          <li>
            Open the meeting menu (<strong>⋮</strong> three dots, bottom of the call) → <strong>Record meeting</strong> → confirm.
            A red <strong>REC</strong> indicator means it&apos;s recording.
          </li>
          <li>
            Walk through the flow slowly; talk if it helps. A few clear minutes beats a long ramble.
          </li>
          <li>
            Open the menu again → <strong>Stop recording</strong>, then leave the call. Meet puts the video in your
            {" "}<strong>Google Drive</strong> (look in <strong>Meet Recordings</strong>).
          </li>
          <li>
            In Drive, open the recording → <strong>Share</strong> → set access to <strong>Anyone with the link</strong> (or
            whatever your team allows) → copy the link. Open <strong>Cursor</strong> chat and tell the assistant to{" "}
            <strong>attach the recording to your prototype</strong> on the hub listing. <strong>Paste the recording link</strong>{" "}
            into the chat. The <strong>prototype-contributor</strong> skill updates the manifest so the card <strong>Recording</strong>{" "}
            button points at it.
          </li>
        </Content>

        <SectionSpacer />
        <Title headingLevel="h3" size="xl">
          Open a pull request when you&apos;re ready
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          When you want the change on <Code>main</Code>, open a pull request with a short description and a screenshot when it
          helps. You don&apos;t need anyone&apos;s approval to merge once you&apos;re satisfied — optionally mention your area
          maintainer if you want feedback. For hub listing and manifest updates, keep using the skill —{" "}
          <em>register my prototype in the hub</em> and related prompts — rather than editing JSON yourself.
        </Content>
      </PageSection>

      <Divider />

      {/* ── Need help ── */}
      <PageSection variant="default" isWidthLimited id="need-help">
        <Title headingLevel="h2" size="xl">
          Need help?
        </Title>
        <Content component={ContentVariants.p} style={{ ...STEP_GAP, ...MW }}>
          Start in Cursor chat with the <strong>prototype-contributor</strong> skill — it handles the usual workflow questions. For
          area-specific ownership or access, ask your lead.
        </Content>
      </PageSection>
    </>
  );
}

const OME_EMBED_VERSION_OPTIONS: EmbedVersionOption[] = [
  { id: "e2e", label: "Full console" },
  { id: "day-one", label: "Day 1 interactions" },
];

function OmeEmbedFullscreenPage() {
  const { mode } = useParams<{ mode: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEmbedFullscreenChrome();

  if (mode !== "e2e" && mode !== "day-one") {
    return <Navigate to="/team/ome" replace />;
  }

  const hubBase = import.meta.env.BASE_URL;
  const personaRaw = searchParams.get("persona")?.toLowerCase().trim();
  const personaKey = personaRaw === "adi" || personaRaw === "sara" ? personaRaw : undefined;
  const hash =
    mode === "day-one"
      ? "#/day-one/terminal"
      : `#/overview${personaKey ? `?persona=${personaKey}` : ""}`;
  const src = `${hubBase}ome-console/index.html${hash}`;
  const label =
    mode === "day-one"
      ? "Day 1 interactions"
      : personaKey === "sara"
        ? "Full console — Sara SecOps (Security Operations)"
        : personaKey === "adi"
          ? "Full console — Adi Cluster Admin"
          : "Full console prototype";

  const onVersionChange = (id: string) => {
    const qs = searchParams.toString();
    navigate(qs.length > 0 ? `/embed/ome/${id}?${qs}` : `/embed/ome/${id}`);
  };

  return (
    <div className="ops-hub-embed-fullscreen-root">
      <EmbedFullscreenTopBar
        backTo="/team/ome"
        backLabel="Back to OME prototypes"
        versionOptions={OME_EMBED_VERSION_OPTIONS}
        versionValue={mode}
        onVersionChange={onVersionChange}
        versionAriaLabel="OME prototype version"
      />
      <iframe key={src} title={`OME: ${label}`} className="ops-hub-embed-fullscreen-frame" src={src} />
    </div>
  );
}

function OsacEmbedFullscreenPage() {
  const [searchParams] = useSearchParams();
  useEmbedFullscreenChrome();

  const entry = searchParams.get("entry");
  const tenant = searchParams.get("tenant");
  const isValidOsacEmbed =
    entry === "provider" ||
    ((entry === "tenant-admin" || entry === "tenant-user") &&
      (tenant === "northstar" || tenant === "evergreen"));

  if (!isValidOsacEmbed) {
    return <Navigate to="/team/sovereign-cloud" replace />;
  }

  const iframeSearch = new URLSearchParams();
  if (entry === "provider") {
    iframeSearch.set("entry", "provider");
  } else if (tenant) {
    iframeSearch.set("entry", entry ?? "");
    iframeSearch.set("tenant", tenant);
  }
  const hubBase = import.meta.env.BASE_URL;
  const src = `${hubBase}osac-demo/index.html?${iframeSearch.toString()}`;

  let label = "OSAC prototype";
  if (entry === "provider") label = "OSAC — Provider Admin";
  else if (entry === "tenant-admin") {
    label =
      tenant === "northstar"
        ? "OSAC — Tenant Admin (North Summit Bank)"
        : "OSAC — Tenant Admin (BlueSolace Financial Group)";
  } else if (entry === "tenant-user") {
    label =
      tenant === "northstar"
        ? "OSAC — Tenant User (North Summit Bank)"
        : "OSAC — Tenant User (BlueSolace Financial Group)";
  }

  return (
    <div className="ops-hub-embed-fullscreen-root">
      <EmbedFullscreenTopBar
        backTo="/team/sovereign-cloud"
        backLabel="Back to Sovereign Cloud prototypes"
        versionOptions={[{ id: "current", label: "Latest version" }]}
        versionValue="current"
        onVersionChange={() => undefined}
        versionAriaLabel="OSAC prototype version"
      />
      <iframe key={src} title={label} className="ops-hub-embed-fullscreen-frame" src={src} />
    </div>
  );
}

/** Allowlist: registry ids are kebab-case; some use dots (e.g. fleet-admin-rbac-v1.1). */
const HPUX_PROTOTYPE_ID_RE = /^[a-z][a-z0-9._-]{0,79}$/i;

/**
 * Look up design doc and recording URLs from the manifest for a given hpux prototype id.
 * Matches by checking whether the entry's `prototypeUrl` contains `prototype=<id>`.
 * Returns undefined for each field when the entry has no value so callers can safely coalesce.
 */
function lookupManifestLinks(prototypeId: string): { designDocUrl?: string | null; recordingUrl?: string | null } {
  if (!prototypeId) return {};
  const param = `prototype=${prototypeId}`;
  const entry = manifest.prototypes.find(
    (p) => typeof p.prototypeUrl === "string" && p.prototypeUrl.includes(param),
  );
  if (!entry) return {};
  return {
    designDocUrl: entry.designDocUrl,
    recordingUrl: entry.prototypeRecordingUrl,
  };
}

/**
 * Prototypes that share one hub embed with a version dropdown (see {@link HpuxPrototypesEmbedFullscreenPage}).
 * Order: newest / preferred first. Designers register new rows here when shipping a new listed iteration — see prototype-contributor skill.
 */
const HPUX_PROTOTYPE_VERSION_GROUPS: {
  backTo: string;
  backLabel: string;
  versions: { prototype: string; label: string }[];
}[] = [
  {
    backTo: "/team/observability",
    backLabel: "Back to Observability prototypes",
    versions: [
      { prototype: "shiri-alerting-ui-v2", label: "v2 — Filtering navigation (latest)" },
      { prototype: "shiri-alerting-ui", label: "v1 — Heatmap drill-down (archived)" },
    ],
  },
  {
    backTo: "/cross-product/rbac",
    backLabel: "Back to RBAC prototypes",
    versions: [
      { prototype: "fleet-admin-rbac", label: "Fleet admin — Tenant delegation (v1.0)" },
      { prototype: "fleet-admin-rbac-v1.1", label: "Fleet admin — v1.1" },
      { prototype: "tenant-admin-access", label: "Tenant admin — Project access" },
      { prototype: "acm-empty-states", label: "RBAC empty states" },
    ],
  },
];

function resolveHpuxEmbedVersionContext(prototype: string): {
  backTo: string;
  backLabel: string;
  versionOptions: EmbedVersionOption[];
} {
  for (const group of HPUX_PROTOTYPE_VERSION_GROUPS) {
    if (group.versions.some((v) => v.prototype === prototype)) {
      return {
        backTo: group.backTo,
        backLabel: group.backLabel,
        versionOptions: group.versions.map((v) => ({ id: v.prototype, label: v.label })),
      };
    }
  }
  return {
    backTo: "/",
    backLabel: "Back to prototype hub",
    versionOptions: [{ id: prototype, label: "Latest version" }],
  };
}

/** RHACS vendored SPA lives under public/ after `npm run build:rhacs`; client routes use /main/… */
const RHACS_SAVED_FILTERS_BASE = "rhacs-ux-prototypes/saved-filters";
const RHACS_USER_WORKLOADS_PATH = "main/vulnerabilities/user-workloads";

const RHACS_EMBED_VERSION_OPTIONS: EmbedVersionOption[] = [
  { id: "saved-filters", label: "Saved filters (v1) (latest)" },
  { id: "baseline", label: "Baseline vulnerability UI" },
];

/** OCP 5 cluster update / OLM UX prototype — vendored under public/ after `npm run build:ocp5-cluster-update`. */
function Ocp5ClusterUpdateEmbedFullscreenPage() {
  useEmbedFullscreenChrome();

  /** Absolute path from site root — iframe must not use a relative URL (would resolve under `/embed/…`). */
  const hubBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const src = `${hubBase}ocp5-cluster-update-experience/administration/cluster-update`;
  const label = "OCP 5.x — Cluster update & operator management (prototype)";

  return (
    <div className="ops-hub-embed-fullscreen-root">
      <EmbedFullscreenTopBar
        backTo="/cross-product/upgrades"
        backLabel="Back to Upgrades prototypes"
        versionOptions={[{ id: "ocp5", label: "Latest version" }]}
        versionValue="ocp5"
        onVersionChange={() => undefined}
        versionAriaLabel="OCP 5 prototype version"
      />
      <iframe key={src} title={label} className="ops-hub-embed-fullscreen-frame" src={src} />
    </div>
  );
}

/** Hosted on Vercel; iframe is same UX as other fullscreen embeds (thin hub back bar only). */
const HPUX_1429_LIST_FILTER_ORIGIN = "https://hpux-1429-list-filter-prototype.vercel.app";

function Hpux1429ListFilterEmbedFullscreenPage() {
  useEmbedFullscreenChrome();

  const src = `${HPUX_1429_LIST_FILTER_ORIGIN}/`;
  const label = "Console list & data view filters — HPUX-1429 (prototype)";

  return (
    <div className="ops-hub-embed-fullscreen-root">
      <EmbedFullscreenTopBar
        backTo="/team/core-openshift"
        backLabel="Back to Core OpenShift prototypes"
        versionOptions={[{ id: "vercel", label: "Latest version" }]}
        versionValue="vercel"
        onVersionChange={() => undefined}
        versionAriaLabel="List filter prototype version"
      />
      <iframe key={src} title={label} className="ops-hub-embed-fullscreen-frame" src={src} />
    </div>
  );
}

function RhacsUxPrototypesEmbedFullscreenPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEmbedFullscreenChrome();

  const rawSurface = searchParams.get("surface")?.trim().toLowerCase() ?? "";
  const surface =
    rawSurface === "baseline" ? "baseline" : rawSurface === "saved-filters" || rawSurface === "" ? "saved-filters" : null;

  if (surface === null) {
    return <Navigate to="/embed/rhacs-ux-prototypes?surface=saved-filters" replace />;
  }

  const hubBase = import.meta.env.BASE_URL;
  const pathWithQuery =
    surface === "saved-filters"
      ? `${RHACS_USER_WORKLOADS_PATH}?prototype=v1`
      : RHACS_USER_WORKLOADS_PATH;
  const src = `${hubBase}${RHACS_SAVED_FILTERS_BASE}/${pathWithQuery}`;
  const label =
    surface === "saved-filters"
      ? "RHACS UX prototype — Saved filters (v1)"
      : "RHACS UX prototype — Baseline vulnerability UI (user workloads)";

  const onVersionChange = (id: string) => {
    navigate(`/embed/rhacs-ux-prototypes?${new URLSearchParams({ surface: id }).toString()}`);
  };

  return (
    <div className="ops-hub-embed-fullscreen-root">
      <EmbedFullscreenTopBar
        backTo="/team/acs"
        backLabel="Back to ACS prototypes"
        versionOptions={RHACS_EMBED_VERSION_OPTIONS}
        versionValue={surface}
        onVersionChange={onVersionChange}
        versionAriaLabel="RHACS prototype surface"
      />
      <iframe key={src} title={label} className="ops-hub-embed-fullscreen-frame" src={src} />
    </div>
  );
}

function HpuxPrototypesEmbedFullscreenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  useEmbedFullscreenChrome();

  const [designNotes, setDesignNotes] = useState<HpuxDesignNotesData | null>(null);
  const [designNotesPrototypeName, setDesignNotesPrototypeName] = useState<string>("");
  const [isDesignNotesOpen, setIsDesignNotesOpen] = useState(false);
  const [prototypeStatus, setPrototypeStatus] = useState<string | undefined>(undefined);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const prototype = searchParams.get("prototype")?.trim() ?? "";
  const valid = prototype.length > 0 && HPUX_PROTOTYPE_ID_RE.test(prototype);

  // Listen for design notes data posted from the hpux-prototypes iframe on load.
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.data !== null &&
        typeof event.data === "object" &&
        event.data.type === "hpux-prototype-loaded"
      ) {
        const dn = event.data.designNotes as HpuxDesignNotesData | null;
        setDesignNotes(
          dn
            ? {
                ...dn,
                ownerName: typeof event.data.ownerName === "string" ? event.data.ownerName : undefined,
                ownerSlack: typeof event.data.ownerSlack === "string" ? event.data.ownerSlack : undefined,
                personaName: typeof event.data.personaName === "string" ? event.data.personaName : undefined,
                jiraUrl: typeof event.data.jiraUrl === "string" ? event.data.jiraUrl : undefined,
                recordingUrl: typeof event.data.recordingUrl === "string" ? event.data.recordingUrl : undefined,
                designDocUrl: typeof event.data.designDocUrl === "string" ? event.data.designDocUrl : undefined,
              }
            : null,
        );
        setDesignNotesPrototypeName(typeof event.data.prototypeName === "string" ? event.data.prototypeName : "");
        setPrototypeStatus(typeof event.data.status === "string" ? event.data.status : undefined);
        setIsDesignNotesOpen(false);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Fix race condition: after the prototype iframe (re)loads, ping it so it re-sends its data
  // even if its postMessage fired before our listener was registered.
  useEffect(() => {
    if (!valid) return;
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: "hpux-hub-ready" }, "*");
    }, 100);
    return () => clearTimeout(t);
  }, [prototype, valid]);

  // Reset design notes and status when the prototype param changes so stale data never shows.
  useEffect(() => {
    setDesignNotes(null);
    setIsDesignNotesOpen(false);
    setPrototypeStatus(undefined);
  }, [prototype]);

  if (!valid) {
    return <Navigate to="/" replace />;
  }

  const manifestLinks = useMemo(() => lookupManifestLinks(prototype), [prototype]);

  const { backTo, backLabel, versionOptions } = resolveHpuxEmbedVersionContext(prototype);
  const hubBase = import.meta.env.BASE_URL;
  const iframeQs = new URLSearchParams({ prototype });
  // Use the directory URL (trailing slash), not the explicit index.html path.
  // With `index.html` in the path, React Router strips the basename and is left with
  // `/index.html`, which hits the catch-all blank route instead of `/` → redirect.
  const src = `${hubBase}hpux-prototypes/?${iframeQs.toString()}`;
  const label = `Shared HPUX Prototypes: ${prototype}`;

  const designNotesButton = designNotes ? (
    <Button
      variant="plain"
      size="sm"
      icon={<OutlinedStickyNoteIcon aria-hidden />}
      onClick={() => setIsDesignNotesOpen((prev) => !prev)}
      aria-expanded={isDesignNotesOpen}
      className="ops-hub-design-notes-btn"
    >
      Design Notes
    </Button>
  ) : null;

  const designNotesPanelContent = designNotes ? (
    <DrawerPanelContent defaultSize="420px" minSize="350px">
      <DrawerHead>
        <div>
          <Title headingLevel="h2" size="xl">Design Notes</Title>
          <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
            {designNotesPrototypeName}
          </Content>
        </div>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsDesignNotesOpen(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        {/* Persona + Designer callout */}
        {(designNotes.personaName || designNotes.ownerName) && (
          <div style={{ marginBottom: "var(--pf-t--global--spacer--xl)", display: "flex", flexDirection: "column", gap: "var(--pf-t--global--spacer--sm)" }}>
            {designNotes.personaName && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--pf-t--global--spacer--sm)" }}>
                <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)", minWidth: "4.5rem" }}>Persona</Content>
                <Label isCompact color="purple">{designNotes.personaName}</Label>
              </div>
            )}
            {designNotes.ownerName && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--pf-t--global--spacer--sm)" }}>
                <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)", minWidth: "4.5rem" }}>Designer</Content>
                <Content component="small">
                  {designNotes.ownerName}
                  {designNotes.ownerSlack && ` — ${designNotes.ownerSlack}`}
                </Content>
              </div>
            )}
          </div>
        )}

        {designNotes.designerNotes && (
          <div style={{ marginBottom: "var(--pf-t--global--spacer--xl)" }}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: "var(--pf-t--global--spacer--sm)" }}>
              Designer Notes
            </Title>
            <Content component="p">
              {designNotes.designerNotes}
            </Content>
          </div>
        )}

        {designNotes.navigationGuide && designNotes.navigationGuide.length > 0 && (
          <div style={{ marginBottom: "var(--pf-t--global--spacer--xl)" }}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: "var(--pf-t--global--spacer--md)" }}>
              Where to navigate
            </Title>
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {designNotes.navigationGuide.map((entry, index) => (
                <li key={index} style={{ marginBottom: "var(--pf-t--global--spacer--lg)" }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--pf-t--global--spacer--sm)", marginBottom: entry.notes ? "var(--pf-t--global--spacer--xs)" : 0 }}>
                    <span style={{ minWidth: "1.25rem", fontWeight: 700, color: "var(--pf-t--global--text--color--subtle)" }}>
                      {index + 1}.
                    </span>
                    <strong>{entry.page}</strong>
                    <Label isCompact variant="outline" color="blue">
                      <code style={{ fontSize: "11px" }}>{entry.path}</code>
                    </Label>
                  </div>
                  {entry.notes && (
                    <Content component="p" style={{ color: "var(--pf-t--global--text--color--subtle)", paddingLeft: "1.75rem" }}>
                      {entry.notes}
                    </Content>
                  )}
                  {index < designNotes.navigationGuide!.length - 1 && (
                    <Divider style={{ marginTop: "var(--pf-t--global--spacer--md)" }} />
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* External resource links — postMessage values take priority; manifest fills gaps. */}
        {(() => {
          const effectiveDesignDocUrl = designNotes.designDocUrl ?? manifestLinks.designDocUrl;
          const effectiveRecordingUrl = designNotes.recordingUrl ?? manifestLinks.recordingUrl;
          return (
            <div>
              <Title headingLevel="h3" size="md" style={{ marginBottom: "var(--pf-t--global--spacer--sm)" }}>
                Resources
              </Title>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--pf-t--global--spacer--xs)" }}>
                {effectiveDesignDocUrl ? (
                  <Button
                    variant="link"
                    icon={<ExternalLinkAltIcon aria-hidden />}
                    iconPosition="end"
                    component="a"
                    href={effectiveDesignDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ paddingLeft: 0 }}
                  >
                    Design doc
                  </Button>
                ) : (
                  <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>Design doc — Not linked</Content>
                )}
                {effectiveRecordingUrl ? (
                  <Button
                    variant="link"
                    icon={<ExternalLinkAltIcon aria-hidden />}
                    iconPosition="end"
                    component="a"
                    href={effectiveRecordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ paddingLeft: 0 }}
                  >
                    Recording
                  </Button>
                ) : (
                  <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>Recording — Not linked</Content>
                )}
                {designNotes.jiraUrl && (
                  <Button
                    variant="link"
                    icon={<ExternalLinkAltIcon aria-hidden />}
                    iconPosition="end"
                    component="a"
                    href={designNotes.jiraUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ paddingLeft: 0 }}
                  >
                    Jira ticket
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </DrawerPanelBody>
    </DrawerPanelContent>
  ) : <></>;

  return (
    <div className="ops-hub-embed-fullscreen-root">
      <EmbedFullscreenTopBar
        backTo={backTo}
        backLabel={backLabel}
        versionOptions={versionOptions}
        versionValue={prototype}
        onVersionChange={(id) => setSearchParams({ prototype: id }, { replace: true })}
        versionAriaLabel="Prototype build"
        statusBadge={prototypeStatus}
        extraActions={designNotesButton}
      />
      <Drawer
        isExpanded={isDesignNotesOpen && designNotes !== null}
        position="end"
        className="ops-hub-design-notes-drawer"
      >
        <DrawerContent panelContent={designNotesPanelContent}>
          <iframe ref={iframeRef} key={src} title={label} className="ops-hub-embed-fullscreen-frame" src={src} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function HubCrossProductDetailPage() {
  const { crossProductId } = useParams<{ crossProductId: string }>();
  const { query, setQuery } = useOutletContext<HubOutletContextType>();

  const item = crossProductId ? CROSS_PRODUCT_BY_ID.get(crossProductId) : undefined;
  if (!item) return <Navigate to="/" replace />;

  const bucket = teamPrototypeBucket(item.id);
  const pseudoTeam = crossProductToTeamEntry(item);

  return (
    <TeamDetailView
      team={pseudoTeam}
      publicEntries={bucket.public}
      privateEntries={bucket.private}
      onNavigateHome={() => setQuery("")}
      query={query}
    />
  );
}

function HubTeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { query, setQuery } = useOutletContext<HubOutletContextType>();

  const team = teamId ? TEAM_BY_ID.get(teamId) : undefined;
  if (!team) return <Navigate to="/" replace />;

  const bucket = teamPrototypeBucket(team.id);

  return (
    <TeamDetailView
      team={team}
      publicEntries={bucket.public}
      privateEntries={bucket.private}
      onNavigateHome={() => setQuery("")}
      query={query}
    />
  );
}

function HubAppShell() {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const isHomeView = Boolean(matchPath({ path: "/", end: true }, location.pathname));
  const isContributingView = Boolean(matchPath({ path: "/contributing", end: true }, location.pathname));
  const teamMatch = matchPath({ path: "/team/:teamId", end: true }, location.pathname);
  const crossProductMatch = matchPath({ path: "/cross-product/:crossProductId", end: true }, location.pathname);
  const focusedTeam = teamMatch?.params.teamId ? TEAM_BY_ID.get(teamMatch.params.teamId) : undefined;
  const focusedCrossProduct = crossProductMatch?.params.crossProductId
    ? CROSS_PRODUCT_BY_ID.get(crossProductMatch.params.crossProductId)
    : undefined;
  const focusedAreaLabel = focusedTeam?.name ?? focusedCrossProduct?.name;

  const legacy = manifest.resourceLinks.legacyDesignSiteUrl;
  const teamConfluence = manifest.resourceLinks.teamConfluenceUrl;
  const demos = manifest.resourceLinks.demosUrl;

  const resetSearchWhenHome = () => setQuery("");

  const masthead = (
    <HubMasthead
      isHomeView={isHomeView}
      isContributingView={isContributingView}
      teamConfluenceUrl={teamConfluence}
      demosUrl={demos}
      onResetSearchWhenHome={resetSearchWhenHome}
      query={query}
      onQueryChange={setQuery}
      searchAriaLabel={
        focusedAreaLabel
          ? `Search prototypes in ${focusedAreaLabel}`
          : "Search product areas and cross-product prototypes"
      }
      searchPlaceholder={focusedAreaLabel ? `Search in ${focusedAreaLabel}…` : "Search areas and lanes…"}
    />
  );

  const outletContext: HubOutletContextType = { query, setQuery };

  return (
    <Page masthead={masthead} className="ops-hub-page">
      <Outlet context={outletContext} />
      <HubFooter legacyUrl={legacy} footer={manifest.footer} />
    </Page>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/embed/ome/:mode" element={<OmeEmbedFullscreenPage />} />
      <Route path="/embed/osac" element={<OsacEmbedFullscreenPage />} />
      <Route path="/embed/rhacs-ux-prototypes" element={<RhacsUxPrototypesEmbedFullscreenPage />} />
      <Route path="/embed/ocp5-cluster-update-experience" element={<Ocp5ClusterUpdateEmbedFullscreenPage />} />
      <Route path="/embed/hpux-1429-list-filter-prototype" element={<Hpux1429ListFilterEmbedFullscreenPage />} />
      <Route path="/embed/hpux-prototypes" element={<HpuxPrototypesEmbedFullscreenPage />} />
      <Route path="/" element={<HubAppShell />}>
        <Route index element={<HubHomePage />} />
        <Route path="contributing" element={<HubContributingPage />} />
        <Route path="cross-product/:crossProductId" element={<HubCrossProductDetailPage />} />
        <Route path="team/:teamId" element={<HubTeamDetailPage />} />
      </Route>
    </Routes>
  );
}
