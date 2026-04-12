// lib/care-type/labels.ts
// Maintained by Ivan Sanchez and Campbell McGlynn
// One platform, three care types — labels branch on care_type flag

import type { CareType } from '@/lib/types';

export const CARE_TYPE_LABELS: Record<CareType, Record<string, string>> = {
  residential: {
    person: 'Resident', people: 'Residents',
    service: 'Care', services: 'Care Services',
    nav_residents: 'Residents', nav_clinical: 'Clinical',
    nav_financial: 'Financial', nav_visits: 'Care Minutes',
    nav_sirs: 'SIRS Register', nav_budget: 'Financial',
    domain_1: 'Clinical', domain_2: 'Workforce',
    domain_3: 'Financial', domain_4: 'Governance', domain_5: 'Residents',
  },
  home_care: {
    person: 'Client', people: 'Clients',
    service: 'Visit', services: 'Visits',
    nav_residents: 'Clients', nav_clinical: 'Care Management',
    nav_financial: 'Budget', nav_visits: 'Visit Compliance',
    nav_sirs: 'Incident Register', nav_budget: 'Budget Management',
    domain_1: 'Visits', domain_2: 'Workforce',
    domain_3: 'Budget', domain_4: 'Compliance', domain_5: 'Clients',
  },
  ndis: {
    person: 'Participant', people: 'Participants',
    service: 'Support', services: 'Supports',
    nav_residents: 'Participants', nav_clinical: 'Supports',
    nav_financial: 'Plan Budgets', nav_visits: 'Support Delivery',
    nav_sirs: 'Incident Register', nav_budget: 'Plan Budgets',
    domain_1: 'Supports', domain_2: 'Workforce',
    domain_3: 'Plans', domain_4: 'Quality', domain_5: 'Participants',
  },
};

export function getLabel(careType: CareType, key: string): string {
  return CARE_TYPE_LABELS[careType][key] || key;
}

export function getDomainStrip(careType: CareType): string[] {
  const l = CARE_TYPE_LABELS[careType];
  return [l.domain_1, l.domain_2, l.domain_3, l.domain_4, l.domain_5];
}
