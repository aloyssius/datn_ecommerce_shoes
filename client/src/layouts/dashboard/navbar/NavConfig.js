// react-icons
import { FaUserGroup, FaCartArrowDown, FaCartPlus, FaUserTag, FaChartPie } from "react-icons/fa6";
import { RiShoppingBag3Fill } from "react-icons/ri";
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------


const ICONS = {
  user: <FaUserGroup />,
  dashboard: <FaChartPie />,
  product: <RiShoppingBag3Fill />,
  discount: <FaUserTag />,
  order: <FaCartArrowDown />,
  point_of_sale: <FaCartPlus />,
};

const navConfig = [
  // ----------------------------------------------------------------------

  {
    items: [
      { title: 'Thống kê', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Bán Hàng Tại Quầy', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.point_of_sale },
      { title: 'Quản Lý Đơn Hàng', path: PATH_DASHBOARD.general.analytics, icon: ICONS.order },
      {
        title: 'Quản Lý Sản Phẩm',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.product,
        children: [
          { title: 'Sản Phẩm', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'Danh Mục', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'Màu Sắc', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'Chất Liệu', path: PATH_DASHBOARD.eCommerce.shop },
          // { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
          // { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
          // { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
          // { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
        ],
      },
      {
        title: 'Quản Lý Tài Khoản',
        path: PATH_DASHBOARD.account.root,
        icon: ICONS.user,
        children: [
          // { title: 'profile', path: PATH_DASHBOARD.user.profile },
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'Khách Hàng', path: PATH_DASHBOARD.account.customer.list },
          { title: 'Nhân Viên', path: PATH_DASHBOARD.account.employee.list },
          // { title: 'create', path: PATH_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          // { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },
      {
        title: 'Giảm Giá',
        path: PATH_DASHBOARD.discount.root,
        icon: ICONS.discount,
        children: [
          // { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          // { title: 'post', path: PATH_DASHBOARD.blog.demoView },
          { title: 'Mã Giảm Giá', path: PATH_DASHBOARD.discount.voucher.list },
          { title: 'Đợt Giảm Giá', path: PATH_DASHBOARD.discount.promotion.list },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------
  // GENERAL
  // {
  //   subheader: 'general',
  //   items: [
  //     { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
  //     { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
  //     { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
  //     { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
  //     { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
  //   ],
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'profile', path: PATH_DASHBOARD.user.profile },
          { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.new },
          { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // E-COMMERCE
      {
        title: 'e-commerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.order,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
        ],
      },

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.order,
        children: [
          { title: 'list', path: PATH_DASHBOARD.invoice.list },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          { title: 'create', path: PATH_DASHBOARD.invoice.new },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },

      // BLOG
      // {
      //   title: 'blog',
      //   path: PATH_DASHBOARD.blog.root,
      //   icon: ICONS.blog,
      //   children: [
      //     // { title: 'posts', path: PATH_DASHBOARD.blog.posts },
      //     // { title: 'post', path: PATH_DASHBOARD.blog.demoView },
      //     { title: 'create', path: PATH_DASHBOARD.blog.new },
      //   ],
      // },
    ],
  },


  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: (
  //         <Label variant="outlined" color="error">
  //           +32
  //         </Label>
  //       ),
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
  //   ],
  // },
];

export default navConfig;
