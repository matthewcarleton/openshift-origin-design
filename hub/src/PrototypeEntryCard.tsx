import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import ExclamationTriangleIcon from "@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon";
import FileAltIcon from "@patternfly/react-icons/dist/js/icons/file-alt-icon";
import LockIcon from "@patternfly/react-icons/dist/js/icons/lock-icon";
import OutlinedClockIcon from "@patternfly/react-icons/dist/js/icons/outlined-clock-icon";
import UserIcon from "@patternfly/react-icons/dist/js/icons/user-icon";
import VideoIcon from "@patternfly/react-icons/dist/js/icons/video-icon";

import type { ManifestPrototypeEntry } from "./manifest.types";

import {
  Button,
  Card,
  CardBody,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Icon,
  Label,
  Title,
  Tooltip,
} from "@patternfly/react-core";

const JIRA_ISSUE_KEY_IN_URL_RE = /\/browse\/([A-Za-z][A-Za-z0-9_]+-\d+)/;
const JIRA_ISSUE_KEY_STANDALONE_RE = /^[A-Z][A-Z0-9_]+-\d+$/;

function parseManifestJiraIssueKey(entry: ManifestPrototypeEntry): string | null {
  const url = typeof entry.jiraUrl === "string" ? entry.jiraUrl.trim() : "";
  const fromUrl = url.match(JIRA_ISSUE_KEY_IN_URL_RE);
  if (fromUrl) return fromUrl[1].toUpperCase();
  const k = typeof entry.jiraKey === "string" ? entry.jiraKey.trim() : "";
  if (JIRA_ISSUE_KEY_STANDALONE_RE.test(k)) return k;
  return null;
}

function manifestEntryHasLinkedJira(entry: ManifestPrototypeEntry): boolean {
  return parseManifestJiraIssueKey(entry) !== null;
}

type HubJiraStatusLabelColor = "blue" | "green" | "grey" | "orange" | "purple" | "red" | "teal" | "orangered" | "yellow";

function jiraWorkflowStatusToLabel(
  jiraStatus: string,
): { label: string; color: HubJiraStatusLabelColor } {
  const s = jiraStatus.toLowerCase();
  if (/(done|closed|complete|resolved|released)/.test(s)) return { label: jiraStatus, color: "green" };
  if (/(in progress|implementation|development)/.test(s)) return { label: jiraStatus, color: "blue" };
  if (/(review|triage|pending|qa|verification)/.test(s)) return { label: jiraStatus, color: "orange" };
  if (/(block|on hold|waiting|stuck)/.test(s)) return { label: jiraStatus, color: "red" };
  if (/(backlog|open|new|to do|todo|draft|selected|ready)/.test(s)) return { label: jiraStatus, color: "grey" };
  return { label: jiraStatus, color: "grey" };
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

function isHubInternalPrototypePath(href: string | undefined | null): boolean {
  if (!href) return false;
  return href.startsWith("/") && !href.startsWith("//");
}

export function PrototypeEntryCard({
  entry,
  restrictedContactLabel,
}: {
  entry: ManifestPrototypeEntry;
  /** When set, show full metadata but omit the prototype open link; show lock + access message. */
  restrictedContactLabel?: string;
}) {
  const restricted = typeof restrictedContactLabel === "string" && restrictedContactLabel.trim().length > 0;
  const primaryHref = entry.prototypeUrl ?? entry.jiraUrl ?? "";
  const jiraSeparate = Boolean(entry.prototypeUrl && entry.jiraUrl);
  const internalPrimary = isHubInternalPrototypePath(entry.prototypeUrl);
  const isExternalPrimary = !internalPrimary && /^https?:\/\//.test(primaryHref);
  const openLabel = entry.prototypeUrl ? "Open prototype" : "View prototype";
  const persona = typeof entry.persona === "string" ? entry.persona.trim() : "";
  const personaLabel = persona.length > 0 ? persona : null;
  const description =
    typeof entry.description === "string" && entry.description.trim().length > 0 ? entry.description.trim() : null;
  const designDocUrl = typeof entry.designDocUrl === "string" ? entry.designDocUrl.trim() : "";
  const prototypeRecordingUrl =
    typeof entry.prototypeRecordingUrl === "string" ? entry.prototypeRecordingUrl.trim() : "";
  const hasDesignDoc = designDocUrl.length > 0;
  const hasRecording = prototypeRecordingUrl.length > 0;
  const showJiraLink =
    Boolean(entry.jiraUrl) &&
    (restricted || jiraSeparate || !entry.prototypeUrl);

  const rowIcon = (glyph: ReactNode) => (
    <FlexItem className="ops-hub-prototype-card__row-icon">
      <Icon size="bodySm" iconSize="sm" status="custom" isInline aria-hidden>
        {glyph}
      </Icon>
    </FlexItem>
  );

  const primaryButton = internalPrimary ? (
    <Button
      className="ops-hub-prototype-card__open-btn"
      variant="secondary"
      size="sm"
      {...({
        component: Link,
        to: entry.prototypeUrl as string,
        children: openLabel,
      } as Parameters<typeof Button>[0])}
    />
  ) : (
    <Button
      className="ops-hub-prototype-card__open-btn"
      component="a"
      variant="secondary"
      href={primaryHref}
      target={isExternalPrimary ? "_blank" : undefined}
      rel={isExternalPrimary ? "noopener noreferrer" : undefined}
      size="sm"
    >
      {openLabel}
    </Button>
  );

  return (
    <Card
      isCompact
      isFullHeight
      ouiaSafe
      className={restricted ? "ops-hub-prototype-card ops-hub-prototype-card--private" : "ops-hub-prototype-card"}
    >
      <CardBody
        className={
          restricted
            ? "ops-hub-prototype-card__body ops-hub-prototype-card__body--private"
            : "ops-hub-prototype-card__body"
        }
      >
        <Flex className="ops-hub-prototype-card__layout" direction={{ default: "column" }} gap={{ default: "gapMd" }}>
          <FlexItem grow={{ default: "grow" }} className="ops-hub-prototype-card__main">
            <Flex direction={{ default: "column" }} gap={{ default: "gapMd" }}>
              <Flex
                direction={{ default: "column" }}
                gap={{ default: "gapSm" }}
                alignItems={{ default: "alignItemsFlexStart" }}
              >
                <Flex
                  className="ops-hub-prototype-card-meta"
                  gap={{ default: "gapSm" }}
                  alignItems={{ default: "alignItemsCenter" }}
                  flexWrap={{ default: "wrap" }}
                >
                  {restricted ? (
                    <FlexItem>
                      <Tooltip content="Restricted on the public hub">
                        <Icon
                          size="sm"
                          iconSize="md"
                          status="custom"
                          isInline
                          aria-label="Private prototype"
                          className="ops-hub-prototype-card--private__icon"
                        >
                          <LockIcon />
                        </Icon>
                      </Tooltip>
                    </FlexItem>
                  ) : null}
                  {!manifestEntryHasLinkedJira(entry) ? (
                    <FlexItem>
                      <Tooltip content="Jira ticket needed">
                        <Icon size="sm" iconSize="md" status="warning" isInline aria-label="Jira ticket needed">
                          <ExclamationTriangleIcon />
                        </Icon>
                      </Tooltip>
                    </FlexItem>
                  ) : null}
                  {manifestEntryHasLinkedJira(entry) &&
                  typeof entry.jiraIssueStatus === "string" &&
                  entry.jiraIssueStatus.trim().length > 0 ? (
                    <FlexItem>
                      {(() => {
                        const st = jiraWorkflowStatusToLabel(entry.jiraIssueStatus.trim());
                        return (
                          <Label color={st.color} isCompact>
                            {st.label}
                          </Label>
                        );
                      })()}
                    </FlexItem>
                  ) : null}
                  {manifestEntryHasLinkedJira(entry) ? (
                    <FlexItem>
                      <Label
                        color={entry.jiraIssueRelease && entry.jiraIssueRelease.trim().length > 0 ? "teal" : "grey"}
                        isCompact
                        variant="outline"
                      >
                        {entry.jiraIssueRelease && entry.jiraIssueRelease.trim().length > 0
                          ? entry.jiraIssueRelease.trim()
                          : "No release"}
                      </Label>
                    </FlexItem>
                  ) : null}
                  {showJiraLink ? (
                    <FlexItem>
                      <Button
                        isInline
                        component="a"
                        variant="link"
                        href={entry.jiraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                      >
                        {entry.jiraKey}
                      </Button>
                    </FlexItem>
                  ) : null}
                </Flex>
                <div className="ops-hub-prototype-card__title-block">
                  <Title headingLevel="h3" size="md">
                    {entry.title}
                  </Title>
                </div>
                {description ? (
                  <Content component={ContentVariants.p} className="ops-hub-prototype-card__description">
                    {description}
                  </Content>
                ) : null}
                <Flex
                  className="ops-hub-prototype-card__resource-links"
                  gap={{ default: "gapMd" }}
                  flexWrap={{ default: "wrap" }}
                  alignItems={{ default: "alignItemsCenter" }}
                >
                  {hasDesignDoc ? (
                    <Button
                      isInline
                      variant="link"
                      component="a"
                      href={designDocUrl}
                      {...(/^https?:\/\//i.test(designDocUrl)
                        ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
                        : {})}
                      size="sm"
                      icon={<FileAltIcon aria-hidden />}
                      iconPosition="left"
                    >
                      Design doc
                    </Button>
                  ) : (
                    <Flex
                      gap={{ default: "gapSm" }}
                      alignItems={{ default: "alignItemsCenter" }}
                      className="ops-hub-prototype-card__resource-slot"
                    >
                      <Icon size="sm" iconSize="sm" status="custom" isInline aria-hidden>
                        <FileAltIcon />
                      </Icon>
                      <Content component={ContentVariants.small} className="ops-hub-prototype-card__resource-unlinked">
                        Design doc — Not linked
                      </Content>
                    </Flex>
                  )}
                  {hasRecording ? (
                    <Button
                      isInline
                      variant="link"
                      component="a"
                      href={prototypeRecordingUrl}
                      {...(/^https?:\/\//i.test(prototypeRecordingUrl)
                        ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
                        : {})}
                      size="sm"
                      icon={<VideoIcon aria-hidden />}
                      iconPosition="left"
                    >
                      Recording
                    </Button>
                  ) : (
                    <Flex
                      gap={{ default: "gapSm" }}
                      alignItems={{ default: "alignItemsCenter" }}
                      className="ops-hub-prototype-card__resource-slot"
                    >
                      <Icon size="sm" iconSize="sm" status="custom" isInline aria-hidden>
                        <VideoIcon />
                      </Icon>
                      <Content component={ContentVariants.small} className="ops-hub-prototype-card__resource-unlinked">
                        Recording — Not linked
                      </Content>
                    </Flex>
                  )}
                </Flex>
              </Flex>
              <Flex flexWrap={{ default: "wrap" }} gap={{ default: "gapMd" }} alignItems={{ default: "alignItemsFlexStart" }}>
                {rowIcon(<UserIcon />)}
                <FlexItem>
                  <Content component={ContentVariants.small}>By {entry.author}</Content>
                </FlexItem>
                {rowIcon(<OutlinedClockIcon />)}
                <FlexItem grow={{ default: "grow" }}>
                  <Content component={ContentVariants.small}>
                    <time dateTime={entry.updatedAt}>{formatDisplayedDate(entry.updatedAt)}</time>
                  </Content>
                </FlexItem>
              </Flex>
            </Flex>
          </FlexItem>
          <Flex
            className="ops-hub-prototype-card__footer"
            alignItems={{ default: "alignItemsCenter" }}
            flexWrap={{ default: "wrap" }}
            gap={{ default: "gapMd" }}
            style={{ width: "100%" }}
          >
            {personaLabel ? (
              <FlexItem style={{ minWidth: 0 }}>
                <span className="ops-hub-prototype-card__persona">{personaLabel}</span>
              </FlexItem>
            ) : null}
            <FlexItem grow={{ default: "grow" }} style={{ minWidth: 0 }} />
            {restricted ? (
              <FlexItem className="ops-hub-prototype-card--private__message-wrap">
                <Content component={ContentVariants.small} className="ops-hub-prototype-card--private__message">
                  Restricted on the public hub. For access, contact {restrictedContactLabel}.
                </Content>
              </FlexItem>
            ) : (
              <FlexItem>{primaryButton}</FlexItem>
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
