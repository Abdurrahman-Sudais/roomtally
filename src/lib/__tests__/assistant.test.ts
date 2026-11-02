import { describe, expect, it } from 'vitest';
import { initialState } from '../../store/InventoryContext';
import { EXAMPLE_QUESTIONS, answer } from '../assistant';
import { ACTIONS, DEMO_USERS, can } from '../access';

const c = initialState();

describe('grounded assistant', () => {
  it('answers every example question', () => {
    for (const q of EXAMPLE_QUESTIONS) expect(answer(q, c).lines.length).toBeGreaterThan(0);
  });
  it('refuses valuations and estimated dimensions', () => {
    for (const q of ['What is RT-0101 worth?', 'What is the resale value of the desks?', 'Estimate the size of RT-0102', 'Will it fit in the lift?']) expect(answer(q, c).kind).toBe('refusal');
  });
  it('summarises an item and a room from their records', () => {
    expect(answer('Tell me about RT-0101', c).sources).toContain('RT-0101');
    expect(answer('What is in room 3.01?', c).sources).toContain('3.01');
  });
  it('lists what needs review', () => {
    expect(answer('What still needs review?', c).sources.length).toBeGreaterThan(0);
  });
  it('falls back to help', () => {
    expect(answer('What is the weather?', c).kind).toBe('help');
  });
});

describe('demo roles', () => {
  it('gives the facilities manager everything and the viewer nothing', () => {
    for (const a of ACTIONS) {
      expect(can('manager', a)).toBe(true);
      expect(can('viewer', a)).toBe(false);
    }
  });
  it('keeps deletion, settings and the audit log with the manager', () => {
    for (const r of ['planner', 'surveyor'] as const) for (const a of ['delete', 'settings', 'audit'] as const) expect(can(r, a)).toBe(false);
    expect(can('surveyor', 'duplicates')).toBe(false);
    expect(can('planner', 'duplicates')).toBe(true);
  });
  it('has one demo user per role', () => {
    expect(new Set(DEMO_USERS.map((u) => u.role)).size).toBe(4);
  });
});
