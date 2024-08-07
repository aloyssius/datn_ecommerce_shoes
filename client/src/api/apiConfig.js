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
    post: path(ROOTS_API, '/products'),
    attributes: path(ROOTS_API, '/products/attributes/all'),
    postAttributes: path(ROOTS_API, '/products/attributes'),
    put: path(ROOTS_API, `/products`),
    details: (id) => path(ROOTS_API, `/products/${id}`),
  },

  color: {
    all: path(ROOTS_API, '/attributes/colors'),
    post: path(ROOTS_API, '/attributes/colors'),
    put: path(ROOTS_API, `/attributes/colors`),
    delete: path(ROOTS_API, `/attributes/colors`),
    putStatus: path(ROOTS_API, `/attributes/colors/status`),
  },

  category: {
    all: path(ROOTS_API, '/attributes/categories'),
    post: path(ROOTS_API, '/attributes/categories'),
    put: path(ROOTS_API, `/attributes/categories`),
    delete: path(ROOTS_API, `/attributes/categories`),
    putStatus: path(ROOTS_API, `/attributes/categories/status`),
  },

  size: {
    all: path(ROOTS_API, '/attributes/sizes'),
    post: path(ROOTS_API, '/attributes/sizes'),
    put: path(ROOTS_API, `/attributes/sizes`),
    delete: path(ROOTS_API, `/attributes/sizes`),
    putStatus: path(ROOTS_API, `/attributes/sizes/status`),
  },

  brand: {
    all: path(ROOTS_API, '/attributes/brands'),
    post: path(ROOTS_API, '/attributes/brands'),
    put: path(ROOTS_API, `/attributes/brands`),
    delete: path(ROOTS_API, `/attributes/brands`),
    putStatus: path(ROOTS_API, `/attributes/brands/status`),
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
    post: path(ROOTS_API, '/vouchers'),
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
