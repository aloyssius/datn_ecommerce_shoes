// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  bill: {
    root: path(ROOTS_DASHBOARD, '/bill'),
    list: path(ROOTS_DASHBOARD, '/bill/list'),
    new: path(ROOTS_DASHBOARD, '/bill/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/bill/${id}/edit`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/product'),
    list: path(ROOTS_DASHBOARD, '/product/list'),
    new: path(ROOTS_DASHBOARD, '/product/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/product/${id}/edit`),
  },
  account: {
    root: path(ROOTS_DASHBOARD, '/account'),
    customer: {
      root: path(ROOTS_DASHBOARD, '/account/customer'),
      list: path(ROOTS_DASHBOARD, '/account/customer/list'),
      new: path(ROOTS_DASHBOARD, '/account/customer/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/account/customer/${id}/edit`)
    },
    employee: {
      root: path(ROOTS_DASHBOARD, '/account/employee'),
      list: path(ROOTS_DASHBOARD, '/account/employee/list'),
      new: path(ROOTS_DASHBOARD, '/account/employee/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/account/employee/${id}/edit`),
    }
  },
  discount: {
    root: path(ROOTS_DASHBOARD, '/discount'),
    voucher: {
      root: path(ROOTS_DASHBOARD, '/discount/voucher'),
      list: path(ROOTS_DASHBOARD, '/discount/voucher/list'),
      new: path(ROOTS_DASHBOARD, '/discount/voucher/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/discount/voucher/${id}/edit`),
    },
    promotion: {
      root: path(ROOTS_DASHBOARD, '/discount/promotion'),
      list: path(ROOTS_DASHBOARD, '/discount/promotion/list'),
      // new: path(ROOTS_DASHBOARD, '/voucher/new'),
      // edit: (id) => path(ROOTS_DASHBOARD, `/voucher/${id}/edit`),
    }
  },
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
