import type { ManifestPrototypeEntry } from "./manifest.types";
import hpuxPrivateIdsRaw from "./data/hpux-private-prototype-ids.json";

const hpuxPrivatePrototypeIds = new Set(
  (hpuxPrivateIdsRaw as { ids?: string[] }).ids ?? [],
);

/** Registry id from `/embed/hpux-prototypes?prototype=<id>` (and similar query URLs). */
export function extractHpuxPrototypeIdFromUrl(prototypeUrl: string | null | undefined): string | null {
  if (typeof prototypeUrl !== "string" || !prototypeUrl.trim()) return null;
  const match = prototypeUrl.match(/[?&]prototype=([a-z][a-z0-9._-]{0,79})/i);
  return match ? match[1] : null;
}

/** Whether a hub manifest card should appear in public listings and search. */
export function isPublicManifestEntry(entry: ManifestPrototypeEntry): boolean {
  if (entry.private === true) return false;
  const hpuxId = extractHpuxPrototypeIdFromUrl(entry.prototypeUrl);
  if (hpuxId && hpuxPrivatePrototypeIds.has(hpuxId)) return false;
  return true;
}

export function isPrivateManifestEntry(entry: ManifestPrototypeEntry): boolean {
  return !isPublicManifestEntry(entry);
}

const PRIVATE_CONTACT_FIELD_KEYS = ["contact", "owner", "designer", "team"] as const;

/** Maintainer or POC shown in the restricted-card access message. */
export function resolvePrivatePrototypeContact(
  entry: ManifestPrototypeEntry,
  areaMaintainer?: string | null,
): string {
  for (const key of PRIVATE_CONTACT_FIELD_KEYS) {
    const value = entry[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  const author = typeof entry.author === "string" ? entry.author.trim() : "";
  if (author.length > 0) return author;
  const maintainer = typeof areaMaintainer === "string" ? areaMaintainer.trim() : "";
  if (maintainer.length > 0) return maintainer;
  return "the area maintainer";
}

/** Search text shared by public and private prototype cards (title, metadata, Jira, resources). */
export function manifestPrototypeEntryMatchesSearchQuery(entry: ManifestPrototypeEntry, q: string): boolean {
  const qq = q.trim().toLowerCase();
  if (!qq) return true;
  return (
    entry.title.toLowerCase().includes(qq) ||
    entry.author.toLowerCase().includes(qq) ||
    entry.jiraKey.toLowerCase().includes(qq) ||
    (entry.description ?? "").toLowerCase().includes(qq) ||
    (entry.persona ?? "").toLowerCase().includes(qq) ||
    (entry.jiraIssueStatus ?? "").toLowerCase().includes(qq) ||
    (entry.jiraIssueRelease ?? "").toLowerCase().includes(qq) ||
    (entry.designDocUrl ?? "").toLowerCase().includes(qq) ||
    (entry.prototypeRecordingUrl ?? "").toLowerCase().includes(qq)
  );
}

/** Private listings also match on access-contact fields. */
export function privateManifestEntryMatchesSearchQuery(
  entry: ManifestPrototypeEntry,
  areaMaintainer: string | undefined,
  q: string,
): boolean {
  if (manifestPrototypeEntryMatchesSearchQuery(entry, q)) return true;
  const qq = q.trim().toLowerCase();
  if (!qq) return true;
  const contact = resolvePrivatePrototypeContact(entry, areaMaintainer).toLowerCase();
  if (contact.includes(qq)) return true;
  const maintainer = (areaMaintainer ?? "").trim().toLowerCase();
  if (maintainer.length > 0 && maintainer.includes(qq)) return true;
  for (const key of PRIVATE_CONTACT_FIELD_KEYS) {
    const value = entry[key];
    if (typeof value === "string" && value.trim().toLowerCase().includes(qq)) return true;
  }
  return false;
}
