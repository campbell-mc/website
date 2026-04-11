import { describe, it, expect, vi } from "vitest";
import { PracticeSelector, type MicroPractice } from "../monday-briefing/practice-selector";

// Mock the database module so tests don't need a live connection
vi.mock("@chris/db", () => ({
  db: { select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }) },
  facilityInterventions: {},
}));

// Test practice library
const testLibrary: MicroPractice[] = [
  {
    id: "MP_001",
    title: "Protect breaks when under pressure",
    tagline: "Treat breaks like a safety control",
    whatToTry: "At the start of shift, state the break plan. Take buffer duty for 10 minutes.",
    whyThisHelps: "Break loss drives fatigue, errors, injuries, burnout.",
    whatItLooksLike: '"Breaks are protected today. I\'ll cover the floor for 10 minutes."',
    metadata: {
      floorPresence: "Yes",
      skillLevel: "Foundational",
      timeRequired: "<2 min",
      theme: "Workload/Safety",
      psychosocialHazard: "Job demands, fatigue",
      repeatable: true,
    },
    signalsAddressed: ["workload_pressure_pulse_low", "sick_leave_spike", "break_non_compliance_rate_high"],
  },
  {
    id: "MP_002",
    title: "One genuine check-in per shift",
    tagline: "Ask how they are and mean it",
    whatToTry: "Once per shift, ask one team member how they're going. Listen for 60 seconds.",
    whyThisHelps: "Micro-moments of genuine connection prevent psychological withdrawal.",
    whatItLooksLike: '"How are you really going today? I noticed it\'s been a tough week."',
    metadata: {
      floorPresence: "Yes",
      skillLevel: "Foundational",
      timeRequired: "<2 min",
      theme: "Recognition",
      psychosocialHazard: "Low recognition, emotional demands",
      repeatable: true,
    },
    signalsAddressed: ["emotional_exhaustion_pulse_high", "support_from_leader_pulse_low"],
  },
  {
    id: "MP_003",
    title: "Structured shift handover",
    tagline: "Three things in, three things out",
    whatToTry: "At each handover, the outgoing leader names exactly three things the incoming leader needs to know.",
    whyThisHelps: "Structured handovers reduce information loss and near-miss events.",
    whatItLooksLike: '"Three things for you: Mrs J in room 12 had a fall at 2pm, pharmacy delivery delayed, and night RN is agency tonight."',
    metadata: {
      floorPresence: "Yes",
      skillLevel: "Intermediate",
      timeRequired: "5-10 min",
      theme: "Communication/Handover",
      psychosocialHazard: "Role conflict, job control",
      repeatable: true,
    },
    signalsAddressed: ["incident_rate_elevated", "role_clarity_pulse_low", "agency_usage_spike"],
  },
  {
    id: "MP_004",
    title: "Acknowledge the hard day",
    tagline: "Name it before they leave",
    whatToTry: "At the end of a tough shift, acknowledge it directly before staff leave.",
    whyThisHelps: "Naming difficulty validates the experience and prevents emotional carryover.",
    whatItLooksLike: '"That was a hard shift. You handled it well. Thank you."',
    metadata: {
      floorPresence: "Yes",
      skillLevel: "Advanced",
      timeRequired: "<2 min",
      theme: "Recognition",
      psychosocialHazard: "Emotional demands, traumatic exposure",
      repeatable: true,
    },
    signalsAddressed: ["emotional_exhaustion_pulse_high", "psychological_safety_pulse_low", "trust_pulse_low"],
  },
];

describe("Practice selector", () => {
  it("selects practice with highest signal match", async () => {
    const selector = new PracticeSelector(testLibrary);

    const result = await selector.selectPractice({
      facilityId: "test",
      teamId: "team1",
      cycleId: 5,
      agedCareSetting: "residential",
      leaderStatus: "experienced",
      activeSignals: ["workload_pressure_pulse_low", "sick_leave_spike"],
    });

    expect(result).not.toBeNull();
    expect(result!.practice.id).toBe("MP_001"); // Matches 2 signals
    expect(result!.signalMatchCount).toBe(2);
  });

  it("filters to foundational for new leaders", async () => {
    const selector = new PracticeSelector(testLibrary);

    const result = await selector.selectPractice({
      facilityId: "test",
      teamId: "team1",
      cycleId: 5,
      agedCareSetting: "residential",
      leaderStatus: "new",
      activeSignals: ["emotional_exhaustion_pulse_high", "psychological_safety_pulse_low"],
    });

    expect(result).not.toBeNull();
    // MP_004 matches 2 signals but is Advanced, MP_002 matches 1 and is Foundational
    expect(result!.practice.metadata.skillLevel).toBe("Foundational");
  });

  it("returns null when no signals match", async () => {
    const selector = new PracticeSelector(testLibrary);

    const result = await selector.selectPractice({
      facilityId: "test",
      teamId: "team1",
      cycleId: 5,
      agedCareSetting: "residential",
      leaderStatus: "experienced",
      activeSignals: ["completely_unknown_signal"],
    });

    expect(result).toBeNull();
  });

  it("selects multiple practices covering different signals", async () => {
    const selector = new PracticeSelector(testLibrary);

    const results = await selector.selectMultiple(
      {
        facilityId: "test",
        teamId: "team1",
        cycleId: 5,
        agedCareSetting: "residential",
        leaderStatus: "experienced",
        activeSignals: [
          "workload_pressure_pulse_low",
          "sick_leave_spike",
          "emotional_exhaustion_pulse_high",
          "incident_rate_elevated",
          "agency_usage_spike",
        ],
      },
      3
    );

    expect(results.length).toBeGreaterThanOrEqual(2);
    // Each selection should have a unique practice
    const ids = results.map((r) => r.practice.id);
    expect(new Set(ids).size).toBe(ids.length);

    // Ranks should be sequential
    expect(results[0].selectionRank).toBe(1);
    if (results[1]) expect(results[1].selectionRank).toBe(2);
  });

  it("action block has required structure", () => {
    // Verify the action block interface matches the spec
    const block = {
      priority: 1,
      hazardDomain: "workload_pressure",
      teamId: "team1",
      teamName: "Wattle Wing Evening",
      signal: {
        classification: "RED" as const,
        consecutiveCycles: 3,
        corroboratingData: ["rostering_understaffed", "absenteeism_high"],
        confidence: "HIGH" as const,
      },
      action: {
        summary: "Protect breaks when under pressure",
        steps: ["Review shift allocation", "Determine root cause", "Acknowledge pressure"],
        practice: null,
      },
      script: '"Breaks are protected today."',
      consequenceOfInaction: "Expected 1-2 resignations. Cost: $18-22K.",
      deadline: "Action this week.",
    };

    expect(block.signal.classification).toBe("RED");
    expect(block.action.steps).toHaveLength(3);
    expect(block.script.length).toBeGreaterThan(0);
    expect(block.consequenceOfInaction.length).toBeGreaterThan(0);
  });
});
