import type { ManifestPrototypeEntry } from "./manifest.types";
import { PrototypeEntryCard } from "./PrototypeEntryCard";

export function PrivatePrototypeCard({
  entry,
  contactLabel,
}: {
  entry: ManifestPrototypeEntry;
  contactLabel: string;
}) {
  return <PrototypeEntryCard entry={entry} restrictedContactLabel={contactLabel} />;
}
