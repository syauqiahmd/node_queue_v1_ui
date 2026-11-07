export const DEFAULT_PAGE_SIZE = 10

export const API_PATHS = {
  AUTH: {
    LOGIN: '/v1/public/login',
    LOGOUT: '/v1/auth/logout',
    VALIDATE_TOKEN: '/v1/auth/validate-token',
  },
  ORGANIZATIONS: {
    GET_ALL: '/v1/organizations',
    GET_ALL_PUBLIC: '/v1/public/organizations',
    GET_DETAIL_BY_ID: (id) => `/v1/organizations/${id}`,
    CREATE: '/v1/organizations',
    UPDATE: (id) => `/v1/organizations/${id}`,
    DELETE: (id) => `/v1/organizations/${id}`,
    UPLOAD_LOGO: (id) => `/v1/organizations/${id}/logo`,
  },
  SERVICES: {
    GET_ALL: '/v1/services',
    GET_ALL_PUBLIC: '/v1/public/services',
    GET_DETAIL_BY_ID: (id) => `/v1/services/${id}`,
    CREATE: '/v1/services',
    UPDATE: (id) => `/v1/services/${id}`,
    DELETE: (id) => `/v1/services/${id}`,
  },
  COUNTERS: {
    GET_ALL: '/v1/counters',
    GET_DETAIL_BY_ID: (id) => `/v1/counters/${id}`,
    CREATE: '/v1/counters',
    UPDATE: (id) => `/v1/counters/${id}`,
    DELETE: (id) => `/v1/counters/${id}`,
  },
  REPORTS: {
    DAILY_SERVICE_STATS: '/v1/services/report/daily-service-stats',
  },
  QUEUES: {
    CALL: '/v1/queues/call',
    ACTION: '/v1/queues/action',
    GET_RECENT_PUBLIC: '/v1/public/queues',
    GET_LIST: (serviceId) => `/v1/queues/${serviceId}`,
    GET_SUMMARY: (serviceId) => `/v1/queues/${serviceId}/summary`,
    PRIORITIZE: (queueId) => `/v1/queues/${queueId}/prioritize`,
  },
  TICKETS: {
    CREATE_PUBLIC: '/v1/public/tickets',
  },
  CRON: {
    TRIGGER: '/v1/cron/trigger',
  },
  USERS: {
    GET_ALL: '/v1/users',
    GET_DETAIL_BY_ID: (id) => `/v1/users/${id}`,
    CREATE: '/v1/users',
    UPDATE: (id) => `/v1/users/${id}`,
    DELETE: (id) => `/v1/users/${id}`,
  },
  VISITORS: {
    GET_ALL: '/v1/visitors',
    UPSERT_PUBLIC: '/v1/public/visitors',
    REPORT: '/v1/visitors/report',
  },
  VISITOR_HISTORIES: {
    GET_ALL: '/v1/visitor-histories',
    CREATE_PUBLIC: '/v1/public/visitor-histories',
    REPORT: '/v1/visitor-histories/report',
  },
}
