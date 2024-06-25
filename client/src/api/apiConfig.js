function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_API = '/api';

export const ADMIN_API = {
  root: ROOTS_API,
  bill: {
    all: path(ROOTS_API, '/bills'),
    post: path(ROOTS_API, '/bills'),
    put: (id) => path(ROOTS_API, `/bills/${id}`),
    details: (id) => path(ROOTS_API, `/bills/${id}`),
  },

  product: {
    all: path(ROOTS_API, '/products'),
    // post: path(ROOTS_API, '/bills'),
    // put: (id) => path(ROOTS_API, `/bills/${id}`),
    // details: (id) => path(ROOTS_API, `/bills/${id}`),
  },

  promotion: {
    all: path(ROOTS_API, '/promotions'),
    // post: path(ROOTS_API, '/bills'),
    // put: (id) => path(ROOTS_API, `/bills/${id}`),
    // details: (id) => path(ROOTS_API, `/bills/${id}`),
  },

  customer: {
    all: path(ROOTS_API, '/customers'),
    details: (id) => path(ROOTS_API, `/customers/${id}`),
    post: path(ROOTS_API, '/customers'),
    put: (id) => path(ROOTS_API, `/customers/${id}`),
    // details: (id) => path(ROOTS_API, `/bills/${id}`),
  },

  voucher: {
    all: path(ROOTS_API, '/vouchers'),
  },

  employee: {
    all: path(ROOTS_API, '/employees'),
    // post: path(ROOTS_API, '/bills'),
    // put: (id) => path(ROOTS_API, `/bills/${id}`),
    // details: (id) => path(ROOTS_API, `/bills/${id}`),
  },
};
