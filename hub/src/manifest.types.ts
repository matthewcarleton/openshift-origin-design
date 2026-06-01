import type { IconKey } from "./iconImports";

export interface ManifestTeamEntry {
  id: string;
  name: string;
  icon: IconKey;
  lastUpdated: string;
  /** Primary UX contact for this lane; align with Hybrid Platforms initiative org deck “UX focus” snapshot — reporting / area POC, not Jira sprint ownership. Shown on home cards. */
  maintainer: string;
}

export interface ManifestCrossProductEntry {
  id: string;
  name: string;
  description: string;
  icon: IconKey;
  prototypeCount: number;
  /** Primary UX contact — same source of truth as {@link ManifestTeamEntry.maintainer} (org deck UX focus snapshot). */
  maintainer: string;
  /** Published design docs (opens in new tab). Whole card acts as link when set. */
  resourceUrl?: string | null;
}

export interface ManifestPrototypeEntry {
  /** Product-area id from `teams` or cross-lane id from `crossProducts` (e.g. `rbac`). */
  teamId: string;
  title: string;
  /** Short paragraph shown on the prototype card (search includes this text when set). */
  description?: string;
  /** Primary persona this work is aligned to (e.g. cluster admin, security analyst). Shown on the card when set. */
  persona?: string;
  /** Jira workflow status name (`fields.status.name`). Filled by `npm run sync:jira-manifest`; do not edit by hand. */
  jiraIssueStatus?: string | null;
  /** Comma-separated Jira fixVersion names. Null/omitted when none. Filled by sync script. */
  jiraIssueRelease?: string | null;
  author: string;
  /** Optional access contact when the card is private (falls back to author, then area maintainer). */
  owner?: string;
  designer?: string;
  contact?: string;
  team?: string;
  updatedAt: string;
  jiraKey: string;
  /** Issue or repo link; omit when the card should only show the prototype button (no secondary link). */
  jiraUrl?: string;
  prototypeUrl: string | null;
  /** Design spec / UX doc (Confluence, Google Doc, markdown in repo, etc.). Opens in a new tab from the card when set. */
  designDocUrl?: string | null;
  /** Walkthrough or demo recording (Loom, Drive, etc.). Opens in a new tab from the card when set. */
  prototypeRecordingUrl?: string | null;
  /**
   * Optional design notes for hpux-prototypes embeds. When present, the hub renders the Design Notes
   * panel immediately on page load without waiting for a postMessage from the iframe.
   * Mirrors the `designNotes` shape in `hpux-prototypes/src/app/core/types.ts`.
   */
  designNotes?: {
    /** Free-form notes from the designer about design decisions, intent, and open questions. */
    designerNotes: string;
    /** Ordered list of pages/screens the reviewer should navigate through. */
    navigationGuide?: Array<{
      /** Page name, e.g. "Alert List" */
      page: string;
      /** Route path to navigate to, e.g. /observe/alerting */
      path: string;
      /** What to look at or focus on when on this page. */
      notes?: string;
    }>;
  };
  /**
   * When true, hide from hub listings and search. Use for embed-only cards without an hpux-prototypes config,
   * or alongside `private: true` in hpux `prototype.config.ts` (hub also reads generated private-id list).
   */
  private?: boolean;
}

export interface PrototypesManifest {
  teams: ManifestTeamEntry[];
  crossProducts: ManifestCrossProductEntry[];
  prototypes: ManifestPrototypeEntry[];
  resourceLinks: {
    legacyDesignSiteUrl?: string | null;
    /** HPUX / team wiki — masthead nav label "Team". */
    teamConfluenceUrl?: string | null;
    /** Your demos catalog (e.g. Google Doc) — masthead nav label "Demos". */
    demosUrl?: string | null;
    /** Longer contributing / workflow doc (opens in new tab). Linked from Contributor guide page when set. */
    contributorDocsUrl?: string | null;
    /** External JTBD / research site — home page callout when set (opens in new tab). */
    jtbdResearchUrl?: string | null;
    /** Button label for JTBD callout link; defaults in UI if omitted. */
    jtbdResearchLabel?: string | null;
    /** Optional extended JTBD blurb (reserved for future use; home uses a short fixed teaser). */
    jtbdResearchIntro?: string | null;
  };
  /** Page footer: copyright, open-design note, contact links. */
  footer?: {
    contactDisplayName: string;
    contactEmail: string;
    /** Web or deep link to Slack (e.g. app.slack.com after sign-in, or a profile URL). */
    contactSlackHref: string;
    /** Shown next to the Slack link, e.g. @mcarleto */
    contactSlackHandle?: string;
  };
}
