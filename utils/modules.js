// Registry of every sidebar-accessible module: nav path + optional search/filter metadata.
// Centralizing this lets both navigation and search/filter tests be data-driven per module.
module.exports = {
  Dashboard: { group: null, item: 'Dashboard', heading: 'Summary Dashboard' },
  Workspaces: {
    group: null,
    item: 'Workspaces',
    heading: 'Tenant Explorer',
    filters: ['Workspace Type', 'Workspace Name', 'Capacity'],
  },
  GatewayOverview: {
    group: 'Gateway',
    item: 'Overview',
    heading: 'Gateway Monitoring',
    filters: ['Gateway Type', 'Owner', 'Location', 'DataSource Type'],
  },
  GatewayDownTimeLogs: {
    group: 'Gateway',
    item: 'DownTimeLogs',
    heading: 'Downtime History',
    filters: ['Entity Type', 'Gateway', 'Time Range'],
  },
  GrowthAnalytics: {
    group: null,
    item: 'Growth Analytics',
    heading: 'Growth Analytics',
    filters: ['Time Period', 'View Mode'],
  },
  LineageExplorer: {
    group: null,
    item: 'Lineage Explorer',
    heading: 'Lineage Explorer',
    search: 'Search for artifacts or workspaces',
  },
  AdminRoles: { group: 'Admin', item: 'Roles', heading: 'Roles' },
  AdminUsers: { group: 'Admin', item: 'Users', heading: 'Users' },
  AdminAudit: { group: 'Admin', item: 'Audit', heading: 'Audit Logs' },
  DatasetRefreshHealth: {
    group: null,
    item: 'Dataset Refresh Health',
    heading: 'Refresh Health',
    filters: ['Type', 'Workspace', 'Dataset / Dataflow', 'Date Range'],
  },
  BackupRestore: {
    group: null,
    item: 'Backup & Restore',
    search: 'Search artifact…',
    filters: ['Type', 'Workspace'],
  },
};
