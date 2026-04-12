// lib/agents/connector-monitor.ts
// Maintained by Ivan Sanchez
//
// Runs every 5 minutes. Checks data freshness for every connector.
// Publishes connector health events if data goes stale.
// Drives the "Updated X min ago" display and connector health dots.

import { routeConnectorData } from './sentinel-router';

export interface ConnectorStatus {
  id: string;
  facility_id: string;
  system_name: string;
  last_successful_sync: string;
  data_domains: string[];
  status: 'healthy' | 'stale' | 'degraded' | 'failed';
}

export async function runConnectorMonitor(
  facilityId: string,
  connectors: ConnectorStatus[]
): Promise<void> {
  const now = new Date();

  for (const connector of connectors) {
    const lastSync = new Date(connector.last_successful_sync);
    const minutesStale = Math.round((now.getTime() - lastSync.getTime()) / 60000);
    const hoursStale = minutesStale / 60;

    const newStatus: ConnectorStatus['status'] =
      hoursStale > 12 ? 'degraded' : hoursStale > 4 ? 'stale' : 'healthy';

    // TODO: Ivan — update connector_health table with new status

    if (hoursStale > 4) {
      await routeConnectorData({
        facility_id: facilityId,
        data_type: 'connector_health_changed',
        source_system: connector.system_name,
        payload: {
          system_name: connector.system_name,
          hours_stale: hoursStale,
          minutes_stale: minutesStale,
          last_sync: connector.last_successful_sync,
          data_domains: connector.data_domains,
          new_status: newStatus,
        },
        received_at: now,
        connector_pull_id: `monitor_${now.getTime()}`,
      });
    }
  }

  console.log(`[Connector Monitor] ${facilityId} | ${connectors.length} connectors checked`);
}
