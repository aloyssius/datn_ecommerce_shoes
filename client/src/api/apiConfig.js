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
    address: {
      all: (id) => path(ROOTS_API, `/customers/${id}/address`),
      details: (id) => path(ROOTS_API, `/customers/address/${id}`),
      post: path(ROOTS_API, '/customers/address'),
      put: (id) => path(ROOTS_API, `/customers/address/${id}`),
    }
  },

  voucher: {
    all: path(ROOTS_API, '/vouchers'),
  },

  employee: {
    all: path(ROOTS_API, '/employees'),
    details: (id) => path(ROOTS_API, `/employees/${id}`),
    post: path(ROOTS_API, '/employees'),
    put: (id) => path(ROOTS_API, `/employees/${id}`),
    address: {
      all: (id) => path(ROOTS_API, `/employees/${id}/address`),
      details: (id) => path(ROOTS_API, `/employees/address/${id}`),
      post: path(ROOTS_API, '/employees/address'),
      put: (id) => path(ROOTS_API, `/employees/address/${id}`),
    }
  },
};
