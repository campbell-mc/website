// ============================================================================
// Saga Pattern for Multi-Step Transactional Operations
//
// Used for irreversible actions (SIRS submission, pack distribution).
// On failure: compensate completed steps in reverse order.
// An ACQSC submission CANNOT be undone — compensation alerts humans.
// ============================================================================

export interface SagaStep {
  name: string;
  execute: () => Promise<unknown>;
  compensate: ((result: unknown) => Promise<void>) | null;
}

export type SagaStatus = "pending" | "executing" | "completed" | "compensating" | "compensated" | "failed";

export class SagaTransaction {
  name: string;
  steps: SagaStep[] = [];
  completedSteps: Array<{ step: SagaStep; result: unknown }> = [];
  status: SagaStatus = "pending";
  error: Error | null = null;

  constructor(name: string) {
    this.name = name;
  }

  addStep(step: SagaStep): void {
    this.steps.push(step);
  }

  async execute(): Promise<void> {
    this.status = "executing";
    this.completedSteps = [];

    for (const step of this.steps) {
      try {
        const result = await step.execute();
        this.completedSteps.push({ step, result });
      } catch (err) {
        this.error = err instanceof Error ? err : new Error(String(err));
        console.error(
          `[Saga:${this.name}] Step "${step.name}" failed: ${this.error.message}. Compensating ${this.completedSteps.length} completed steps.`
        );
        await this.compensate();
        return;
      }
    }

    this.status = "completed";
  }

  private async compensate(): Promise<void> {
    this.status = "compensating";

    // Compensate in reverse order
    for (let i = this.completedSteps.length - 1; i >= 0; i--) {
      const { step, result } = this.completedSteps[i];
      if (step.compensate) {
        try {
          await step.compensate(result);
          console.log(`[Saga:${this.name}] Compensated step "${step.name}"`);
        } catch (compErr) {
          // Compensation failure is critical — log but continue compensating other steps
          console.error(
            `[Saga:${this.name}] CRITICAL: Compensation failed for step "${step.name}": ${compErr}`
          );
        }
      }
    }

    this.status = "compensated";
  }
}
