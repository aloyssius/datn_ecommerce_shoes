function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_API = '/api';
const AUTH_API = '/api/auth';

export const CLIENT_API = {
  root: ROOTS_API,
  reset_pass: path(AUTH_API, '/forgot-password'),
  bill: {
    post: path(ROOTS_API, '/bills'),
    details: path(ROOTS_API, `/tracking-order`),
    vnpay: path(ROOTS_API, `/bills/vn-pay/process-payment`),
    create_payment: path(ROOTS_API, `/bills/vn-pay/payment`),
    billStatus: path(ROOTS_API, `/bill/status/customer`),
    paymentMethod: path(ROOTS_API, `/bill/payment-method`),
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
    male: path(ROOTS_API, '/product-list/male'),
    female: path(ROOTS_API, '/product-list/female'),
    home: path(ROOTS_API, '/product-home'),
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
    change_pass: path(AUTH_API, '/change-password'),

    bills: path(AUTH_API, `/account/bills`),
    billDetail: path(AUTH_API, `/account/bill-detail`),
    billStatus: path(AUTH_API, `/account/bill/status`),
    billPaymentMethod: path(AUTH_API, `/account/bill/payment-method`),

    address: {
      all: path(AUTH_API, `/account/addresses`),
      delete: (id) => path(AUTH_API, `/account/addresses/${id}`),
      post: path(AUTH_API, `/account/addresses`),
      put: path(AUTH_API, `/account/addresses`),
      putIsDefault: path(AUTH_API, `/account/addresses/default`),
    }
  },

  voucher: {
    details: path(ROOTS_API, `/cart-voucher`),
  },
};
