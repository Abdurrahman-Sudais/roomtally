/**
 * Illustrative pricing. Edit this file to change tiers, prices, billing labels, or features —
 * the Pricing page and homepage teaser render entirely from this configuration.
 */
export interface PricingTier {
  id: string;
  name: string;
  /** Price in whole currency units; null renders as "Custom". */
  price: number | null;
  /** Shown after the price, e.g. "/project" or "/month". */
  unit: string;
  summary: string;
  features: string[];
  cta: { label: string; to: string };
  highlighted?: boolean;
}

export const pricingConfig = {
  currencySymbol: '$',
  /** Discount applied to monthly tiers when annual billing is selected (0–1). */
  annualDiscount: 0.15,
  note: 'Prices are illustrative and exclude applicable taxes. Roomtally is in early access.',
  tiers: [
    {
      id: 'survey',
      name: 'Survey Project',
      price: 39,
      unit: '/project',
      summary: 'For small office surveys.',
      features: [
        'One property, up to 25 rooms',
        'Photograph and note uploads',
        'Proposed inventory records for review',
        'Duplicate review queue',
        'CSV inventory export',
        '90 days of project access',
      ],
      cta: { label: 'Start a survey project', to: '/contact?plan=survey' },
    },
    {
      id: 'business',
      name: 'Business',
      price: 129,
      unit: '/month',
      summary: 'For facilities teams managing recurring inventory and relocation work.',
      features: [
        'Up to 10 properties',
        'Unlimited rooms and survey rounds',
        'Relocation planning board',
        'Reuse, refurbishment and disposal reports',
        'Team review with up to 8 seats',
        'Floor plan and FF&E schedule import',
      ],
      cta: { label: 'Talk to us about Business', to: '/contact?plan=business' },
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      unit: '',
      summary: 'For multi-property operations and relocation companies.',
      features: [
        'Unlimited properties and seats',
        'Client workspaces for relocation partners',
        'Single sign-on and audit history',
        'Custom categories and action workflows',
        'Data export to CAFM and asset registers',
        'Named onboarding contact',
      ],
      cta: { label: 'Contact sales', to: '/contact?plan=enterprise' },
    },
  ] satisfies PricingTier[] as PricingTier[],
};
