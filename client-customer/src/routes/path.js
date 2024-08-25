
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
    details: `/tracking-order`,
  },
  account: {
    root: '/account',
    info: '/account/info',
    login_register: '/account/login',
    register_sucess: (id) => `/account/register-success/${id}`,
    orders: `/account/orders`,
    order_detail: (id) => `/order-detail/${id}`,
    my_account: (id) => `/account/${id}`,
  }
};
