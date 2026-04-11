export { BaseConnector } from "./base";
export { ConnectorRegistry, registry } from "./registry";
export { DeputyConnector } from "./deputy/index";
export { HumanforceConnector } from "./humanforce/index";
export { ElmoConnector } from "./elmo/index";
export type {
  ConnectorConfig,
  ConnectorPullResult,
  ConnectorHealth,
  ConnectorError,
  DataAnomaly,
} from "./types";
export { PII_FIELDS } from "./types";

// Register all connectors
import { registry } from "./registry";
import { DeputyConnector } from "./deputy/index";
import { HumanforceConnector } from "./humanforce/index";
import { ElmoConnector } from "./elmo/index";
registry.register("deputy", DeputyConnector);
registry.register("humanforce", HumanforceConnector);
registry.register("elmo", ElmoConnector);
