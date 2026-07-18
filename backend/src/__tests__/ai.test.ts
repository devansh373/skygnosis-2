import { test } from 'node:test';
import assert from 'node:assert/strict';
import { triageTicketMessage } from '../services/ai.js';

// We can test the timeout fallback by mocking process.env.GROQ_API_KEY to an invalid key
// and asserting that it falls back to the safe object gracefully without throwing.

test('AI Service Triage successfully returns structured JSON', async () => {
  const result = await triageTicketMessage("I need help with my account");
  
  assert.ok(["Low", "Medium", "High"].includes(result.priority));
  assert.ok(typeof result.category === "string");
  assert.ok(typeof result.suggested_reply === "string" || result.suggested_reply === null);
  // It should succeed if API key is valid
  assert.equal(result.ai_success, true);
});
