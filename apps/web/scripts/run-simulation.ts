#!/usr/bin/env npx tsx
// scripts/run-simulation.ts
// Standalone simulation runner for CI.
// Usage: npx tsx scripts/run-simulation.ts [suite]
// Suites: all, sentinel, oracle, keeper, multi, home_care

import { runSuite } from '../lib/simulation';
import { sentinelScenarios } from '../lib/simulation/scenarios/sentinel';
import { oracleScenarios } from '../lib/simulation/scenarios/oracle';
import { keeperScenarios } from '../lib/simulation/scenarios/keeper';
import { multiAgentScenarios } from '../lib/simulation/scenarios/multi-agent';
import { homeCareScenarios } from '../lib/simulation/scenarios/home-care';

const ALL = [...sentinelScenarios, ...oracleScenarios, ...keeperScenarios, ...multiAgentScenarios, ...homeCareScenarios];

const SUITES: Record<string, typeof ALL> = {
  sentinel: sentinelScenarios,
  oracle: oracleScenarios,
  keeper: keeperScenarios,
  multi: multiAgentScenarios,
  home_care: homeCareScenarios,
  all: ALL,
};

async function main() {
  const suiteName = process.argv[2] ?? 'all';
  const scenarios = SUITES[suiteName] ?? ALL;

  console.log(`\n  Running ${scenarios.length} scenarios (${suiteName})...\n`);

  const report = await runSuite(scenarios);

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('  CHRIS Agent Simulation Report');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Suite:    ${suiteName}`);
  console.log(`  Total:    ${report.total_scenarios}`);
  console.log(`  Passed:   ${report.passed}`);
  console.log(`  Failed:   ${report.failed}`);
  console.log(`  Score:    ${Math.round(report.overall_score * 100)}%`);
  console.log(`  Duration: ${report.duration_ms}ms`);
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  // By agent breakdown
  for (const [agent, stats] of Object.entries(report.by_agent)) {
    console.log(`  ${agent}: ${stats.passed}/${stats.total} passed · ${Math.round(stats.avg_score * 100)}% avg`);
  }
  console.log('');

  // Individual verdicts
  for (const v of report.verdicts) {
    const icon = v.pass ? '  ✓' : '  ✗';
    const score = Math.round(v.overall_score * 100);
    const det = Math.round(v.detection_rate * 100);
    const sil = Math.round(v.silence_rate * 100);
    console.log(`${icon} ${v.scenario_name}`);
    console.log(`    Score: ${score}% · Detection: ${det}% · Silence: ${sil}% · ${v.findings_count} findings · ${v.duration_ms}ms`);

    // Show failed detections
    for (const d of v.detections) {
      if (!d.found) {
        console.log(`    ✗ MISSED: ${d.expected.description} (expected by tick ${d.expected.max_ticks_to_detect})`);
      }
    }
    // Show false positives
    for (const s of v.silence_checks) {
      if (!s.silent) {
        console.log(`    ✗ FALSE POSITIVE: ${s.expected.should_not_fire}`);
      }
    }
  }

  console.log('');

  if (report.failed > 0) {
    console.log(`❌ FAILED: ${report.failed} scenario(s) did not pass\n`);
    process.exit(1);
  } else {
    console.log(`✅ ALL ${report.total_scenarios} SCENARIOS PASSED\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Simulation crashed:', err);
  process.exit(1);
});
