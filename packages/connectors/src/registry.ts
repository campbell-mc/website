// ============================================================================
// ConnectorRegistry — Dynamic registration of connector implementations.
// ============================================================================

import type { BaseConnector } from "./base";
import type { ConnectorConfig } from "./types";

type ConnectorConstructor = new (config: ConnectorConfig) => BaseConnector;

export class ConnectorRegistry {
  private connectors = new Map<string, ConnectorConstructor>();

  register(sourceSystem: string, ConnectorClass: ConnectorConstructor): void {
    this.connectors.set(sourceSystem.toLowerCase(), ConnectorClass);
  }

  get(sourceSystem: string): ConnectorConstructor | null {
    return this.connectors.get(sourceSystem.toLowerCase()) ?? null;
  }

  create(config: ConnectorConfig): BaseConnector {
    const ConnectorClass = this.get(config.sourceSystem);
    if (!ConnectorClass) {
      throw new Error(
        `No connector registered for source system: ${config.sourceSystem}`
      );
    }
    return new ConnectorClass(config);
  }

  list(): string[] {
    return Array.from(this.connectors.keys());
  }
}

// Singleton registry
export const registry = new ConnectorRegistry();
