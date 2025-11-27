export const API_PATHS = {
  AUTH: {
    LOGIN: '/v1/public/login',
    VALIDATE: '/admin/validate',
  },
  ORGANIZATIONS: {
    GET_ALL: '/v1/organizations',
    GET_DETAIL_BY_ID: (id) => `/v1/organizations/${id}`,
    CREATE: '/v1/organizations',
    UPDATE: (id) => `/v1/organizations/${id}`,
    DELETE: (id) => `/v1/organizations/${id}`,
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
  QUEUES: {
    CALL: '/v1/queues/call',
    ACTION: '/v1/queues/action',
    CREATE: '/v1/queues',
    GET_RECENT_PUBLIC: '/v1/public/queues',
    GET_LIST: (serviceId) => `/v1/queues/${serviceId}`,
    GET_SUMMARY: (serviceId) => `/v1/queues/${serviceId}/summary`,
    PRIORITIZE: (queueId) => `/v1/queues/${queueId}/prioritize`,
  },
  TICKETS: {
    CREATE_PUBLIC: '/v1/public/tickets',
  },
  USERS: {
    GET_ALL: '/v1/users',
    GET_DETAIL_BY_ID: (id) => `/v1/users/${id}`,
    CREATE: '/v1/users',
    UPDATE: (id) => `/v1/users/${id}`,
    DELETE: (id) => `/v1/users/${id}`,
  },
}
