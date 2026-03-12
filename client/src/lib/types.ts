export interface Inquiry {
  id: string;
  role: string;
  name: string;
  email: string;
  organization: string | null;
  exploring: string;
  links: string | null;
  consent: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  highlight: string;
  url: string;
  sortOrder: number;
  metricsEndpoint: string | null;
  metricsApiKey: string | null;
  showUsersMetrics: boolean;
  showEngagementMetrics: boolean;
  showRevenueMetrics: boolean;
  showOnchainMetrics: boolean;
  showOnLandingPage: boolean;
  chartColor: string | null;
}

export interface Metrics {
  app: string;
  timestamp: string;
  users: {
    total: number;
    daily_active: number;
    weekly_active: number;
    monthly_active: number;
    paying: number;
  };
  engagement: {
    key_actions: number;
    sessions_today: number;
  };
  revenue: {
    total_payments: number;
    net_income: number;
    currency: string;
  };
  onchain: {
    transactions: number;
    volume: number;
  };
}

export interface MetricsSnapshot {
  id: string;
  projectId: string;
  timestamp: string;
  metrics: Metrics;
}

export interface PublicMetrics {
  totalUsers: number;
  trackedApps: number;
  totalTransactions: number;
  trackedProjectIds: string[];
}
