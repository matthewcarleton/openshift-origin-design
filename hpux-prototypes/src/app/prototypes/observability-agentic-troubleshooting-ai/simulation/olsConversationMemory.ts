/**
 * Lightweight session memory for scripted multi-turn replies (no LLM).
 * Reset when the user clears chat or starts a fresh troubleshooting flow.
 */

export type AdvisorTurnIntent =
  | 'off_topic'
  | 'right_now'
  | 'navigate'
  | 'ambient'
  | 'no_alerts'
  | 'play_along_only'
  | 'default'
  | 'continuation_deep'
  | 'continuation_why'
  | 'continuation_thanks'
  | 'continuation_next'
  | 'continuation_other_alert';

let lastIntent: AdvisorTurnIntent = 'default';
let lastFocusedAlertId: string | null = null;

export function resetConversationMemory(): void {
  lastIntent = 'default';
  lastFocusedAlertId = null;
}

export function recordAdvisorTurn(intent: AdvisorTurnIntent, focusedAlertId: string | null): void {
  lastIntent = intent;
  lastFocusedAlertId = focusedAlertId;
}

export function getConversationMemory(): { lastIntent: AdvisorTurnIntent; lastFocusedAlertId: string | null } {
  return { lastIntent, lastFocusedAlertId };
}
