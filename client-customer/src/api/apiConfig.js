function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_API = '/api';
const AUTH_API = '/api/auth';

export const CLIENT_API = {
  root: ROOTS_API,
  bill: {
    all: path(ROOTS_API, '/bills'),
    post: path(ROOTS_API, '/bills'),
    put: (id) => path(ROOTS_API, `/bills/${id}`),
    details: (id) => path(ROOTS_API, `/bills/${id}`),
  },

  cart: {
    all: path(ROOTS_API, `/carts`),
    all_account: (accountId) => path(ROOTS_API, `/carts/${accountId}`),
    post: path(ROOTS_API, `/carts`),
    put: path(ROOTS_API, `/carts`),
    put_quantity: path(ROOTS_API, `/carts/quantity`),
    delete: (id) => path(ROOTS_API, `/carts/${id}`),
  },

  product: {
    all: path(ROOTS_API, '/product-list'),
    home: path(ROOTS_API, '/product-home'),
    post: path(ROOTS_API, '/products'),
    attributes: path(ROOTS_API, '/products/attributes/all'),
    postAttributes: path(ROOTS_API, '/products/attributes'),
    put: path(ROOTS_API, `/products`),
    putStatus: path(ROOTS_API, `/products/status`),
    details: (sku) => path(ROOTS_API, `/product-details/${sku}`),
    details_size: (id) => path(ROOTS_API, `/product-detail/${id}`),
  },

  account: {
    login: path(AUTH_API, '/account/login'),
    register: path(AUTH_API, '/account/register'),
    logout: path(AUTH_API, '/account/logout'),
    register_success: (id) => path(AUTH_API, `/account/register-success/${id}`),
    verify: (id) => path(AUTH_API, `/account/verify/${id}`),
    details: path(AUTH_API, `/account/my-account`),
    put: path(AUTH_API, '/account/update'),
    bills: (accountId) => path(AUTH_API, `/account/bills/${accountId}`),
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
    details: path(ROOTS_API, `/cart-voucher`),
  },
};
