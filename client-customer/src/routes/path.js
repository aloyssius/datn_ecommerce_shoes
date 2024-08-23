
const ROOT_PATH = "/";

export const PATH_PAGE = {
  root: ROOT_PATH,
  cart: {
    root: '/cart',
  },
  checkout: {
    root: '/checkout',
    success: '/order-completed',
  },
  product: {
    product_list: '/product-list',
    detail: (id) => `/product-detail/${id}`,
  },
  track_order: {
    root: '/track-order',
    details: (id) => `/track-order/${id}`,
  },
  root: ROOT_PATH,
  account: {
    root: '/account',
    login_register: '/account/login',
    register_sucess: (id) => `/account/register-success/${id}`,
    orders: (id) => `/account/orders/${id}`,
    my_account: (id) => `/account/${id}`,
  }
};
