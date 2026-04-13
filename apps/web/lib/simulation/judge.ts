// lib/simulation/judge.ts
// Evaluate agent output against scenario ground truth.
// Returns pass/fail with detection rate, silence rate, and timeliness.

import type { ScenarioResult, Verdict, Detection, SilenceCheck } from './types';

/**
 * Judge a scenario result against its ground truth.
 */
export function judgeScenario(result: ScenarioResult): Verdict {
  const { scenario, findings, actions } = result;
  const gt = scenario.ground_truth;

  // 1. Check expected findings were detected
  const detections: Detection[] = gt.expected_findings.map((expected) => {
    const found = findings.find((f) =>
      f.agent === expected.agent &&
      f.type === expected.finding_type &&
      f.tick <= expected.max_ticks_to_detect
    );
    return {
      expected,
      found: !!found,
      tick_detected: found?.tick,
    };
  });

  // 2. Check expected silence (no false positives)
  const silenceChecks: SilenceCheck[] = gt.expected_silence.map((expected) => {
    const falseFired = findings.find((f) =>
      f.agent === expected.agent &&
      f.type.includes(expected.should_not_fire)
    );
    return {
      expected,
      silent: !falseFired,
      false_positive: falseFired,
    };
  });

  // 3. Calculate scores
  const totalExpected = detections.length;
  const totalDetected = detections.filter((d) => d.found).length;
  const detection_rate = totalExpected > 0 ? totalDetected / totalExpected : 1;

  const totalSilence = silenceChecks.length;
  const totalSilent = silenceChecks.filter((s) => s.silent).length;
  const silence_rate = totalSilence > 0 ? totalSilent / totalSilence : 1;

  // Timeliness: how quickly were findings detected relative to max allowed?
  let timeliness_score = 1;
  if (totalDetected > 0) {
    const timelinessSum = detections
      .filter((d) => d.found)
      .reduce((sum, d) => {
        const maxTicks = d.expected.max_ticks_to_detect;
        const actualTicks = d.tick_detected!;
        return sum + (1 - actualTicks / maxTicks); // 1 = instant, 0 = at deadline
      }, 0);
    timeliness_score = timelinessSum / totalDetected;
  }

  // Actions score: did expected actions happen?
  const expectedActions = gt.expected_actions.length;
  const matchedActions = gt.expected_actions.filter((ea) =>
    actions.some((a) => a.type === ea.type)
  ).length;
  const actions_score = expectedActions > 0 ? matchedActions / expectedActions : 1;

  // Overall weighted score
  const rubric = scenario.rubric;
  const overall_score = Math.min(1, Math.max(0,
    (detection_rate * (rubric.completeness + rubric.accuracy)) +
    (silence_rate * rubric.accuracy) +
    (timeliness_score * rubric.timeliness) +
    (actions_score * rubric.actionability)
  ));

  // Pass criteria: 80%+ detection, 90%+ silence
  const pass = detection_rate >= 0.8 && silence_rate >= 0.9;

  return {
    scenario_id: scenario.id,
    scenario_name: scenario.name,
    pass,
    overall_score,
    detection_rate,
    silence_rate,
    timeliness_score,
    detections,
    silence_checks: silenceChecks,
    findings_count: findings.length,
    actions_count: actions.length,
    duration_ms: result.duration_ms,
  };
}
