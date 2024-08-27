import { Suspense, lazy, useEffect } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const ROLE_ADMIN = 'admin';
const ROLE_EMP = 'employee';

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <Register />
        //     </GuestGuard>
        //   ),
        // },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        {
          path: 'reset-password', element: (
            <GuestGuard>
              <ResetPassword />
            </GuestGuard>
          )
        },
        // { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'app', element: (
            <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
              <GeneralEcommerce />
            </RoleBasedGuard>
          )
        },
        // { path: 'ecommerce', element: <GeneralEcommerce /> },
        // { path: 'analytics', element: <GeneralAnalytics /> },
        // { path: 'banking', element: <GeneralBanking /> },
        // { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'bill',
          children: [
            { element: <Navigate to="/dashboard/bill/list" replace />, index: true },
            { path: 'list', element: <BillList /> },
            { path: ':id/edit', element: <BillDetails /> },
            // { path: 'product/:id/edit', element: <EcommerceProductCreate /> },
          ],
        },

        {
          path: 'product',
          children: [
            { element: <Navigate to="/dashboard/product/list" replace />, index: true },
            { path: 'list', element: <ProductList /> },
            {
              path: 'new', element: (
                <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                  <ProductCreateEdit />
                </RoleBasedGuard>
              )
            },
            {
              path: ':id/edit', element: (
                <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                  <ProductCreateEdit />
                </RoleBasedGuard>
              )
            },
          ],
        },

        {
          path: 'attribute',
          children: [
            {
              path: 'color',
              children: [
                { element: <Navigate to="/dashboard/attribute/color/list" replace />, index: true },
                { path: 'list', element: <ColorList /> },
              ]
            },

            {
              path: 'category',
              children: [
                { element: <Navigate to="/dashboard/attribute/category/list" replace />, index: true },
                { path: 'list', element: <CategoryList /> },
              ]
            },

            {
              path: 'brand',
              children: [
                { element: <Navigate to="/dashboard/attribute/brand/list" replace />, index: true },
                { path: 'list', element: <BrandList /> },
              ]
            },

            {
              path: 'size',
              children: [
                { element: <Navigate to="/dashboard/attribute/size/list" replace />, index: true },
                { path: 'list', element: <SizeList /> },
              ]
            },
          ],
        },


        {
          path: 'account',
          children: [
            {
              path: 'customer',
              children: [
                { element: <Navigate to="/dashboard/account/customer/list" replace />, index: true },
                { path: 'list', element: <CustomerList /> },
                { path: ':id', element: <CustomerNewEdit /> },
                { path: ':id/edit', element: <CustomerNewEdit /> },
              ]
            },
            {
              path: 'employee',
              children: [
                { element: <Navigate to="/dashboard/account/employee/list" replace />, index: true },
                {
                  path: 'list', element: (
                    <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                      <EmployeeList />
                    </RoleBasedGuard>
                  )
                },
                {
                  path: ':id', element: (

                    <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                      <EmployeeNewEdit />
                    </RoleBasedGuard>
                  )
                },
                {
                  path: ':id/edit', element: (

                    <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                      <EmployeeNewEdit />
                    </RoleBasedGuard>
                  )
                },
              ],
            },
          ],
        },

        {
          path: 'discount',
          children: [
            // {
            //   path: 'promotion',
            //   children: [
            //     { element: <Navigate to="/dashboard/discount/Promotion/list" replace />, index: true },
            //     { path: 'list', element: <PromotionList /> },
            //     // { path: ':id', element: <InvoiceDetails /> },
            //     // { path: ':id/edit', element: <InvoiceEdit /> },
            //     // { path: 'new', element: <InvoiceCreate /> },
            //   ]
            // },
            {
              path: 'voucher',
              children: [
                { element: <Navigate to="/dashboard/discount/voucher/list" replace />, index: true },
                {
                  path: 'list', element: (
                    <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                      <VoucherList />
                    </RoleBasedGuard>
                  )
                },
                // { path: ':id', element: <InvoiceDetails /> },
                {
                  path: ':id/edit', element: (

                    <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                      <VoucherCreateEdit />
                    </RoleBasedGuard>
                  )
                },
                {
                  path: 'new', element: (

                    <RoleBasedGuard accessibleRoles={[ROLE_ADMIN]}>
                      <VoucherCreateEdit />
                    </RoleBasedGuard>
                  )
                },
              ],
            },
          ],
        },

        // {
        //   path: 'e-commerce',
        //   children: [
        //     { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
        //     { path: 'shop', element: <EcommerceShop /> },
        //     { path: 'product/:name', element: <EcommerceProductDetails /> },
        //     { path: 'list', element: <EcommerceProductList /> },
        //     { path: 'product/new', element: <EcommerceProductCreate /> },
        //     { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
        //     { path: 'checkout', element: <EcommerceCheckout /> },
        //   ],
        // },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            // { path: 'list', element: <UserList /> },
            // { path: 'new', element: <UserCreate /> },
            // { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        // {
        //   path: 'invoice',
        //   children: [
        //     { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
        //     { path: 'list', element: <InvoiceList /> },
        //     { path: ':id', element: <InvoiceDetails /> },
        //     { path: ':id/edit', element: <InvoiceEdit /> },
        //     { path: 'new', element: <InvoiceCreate /> },
        //   ],
        // },
        // {
        //   path: 'blog',
        //   children: [
        //     { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
        //     { path: 'posts', element: <BlogPosts /> },
        //     { path: 'post/:title', element: <BlogPost /> },
        //     { path: 'new', element: <BlogNewPost /> },
        //   ],
        // },
        // {
        //   path: 'mail',
        //   children: [
        //     { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
        //     { path: 'label/:customLabel', element: <Mail /> },
        //     { path: 'label/:customLabel/:mailId', element: <Mail /> },
        //     { path: ':systemLabel', element: <Mail /> },
        //     { path: ':systemLabel/:mailId', element: <Mail /> },
        //   ],
        // },
        // {
        //   path: 'chat',
        //   children: [
        //     { element: <Chat />, index: true },
        //     { path: 'new', element: <Chat /> },
        //     { path: ':conversationKey', element: <Chat /> },
        //   ],
        // },
        // { path: 'calendar', element: <Calendar /> },
        // { path: 'kanban', element: <Kanban /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}


// EXAMPLE

// VOUCHER
const VoucherList = Loadable(lazy(() => import('../pages/dashboard/voucher/list/VoucherList')))
const VoucherCreateEdit = Loadable(lazy(() => import('../pages/dashboard/voucher/new-edit/VoucherNewEdit')))

const PromotionList = Loadable(lazy(() => import('../pages/dashboard/promotion/list/PromotionList')))

// CUSTOMER
const CustomerList = Loadable(lazy(() => import('../pages/dashboard/customer/list/CustomerList')))
const CustomerNewEdit = Loadable(lazy(() => import('../pages/dashboard/customer/new-edit/CustomerNewEdit')))
// Employee
const EmployeeList = Loadable(lazy(() => import('../pages/dashboard/employee/list/EmployeeList')))
const EmployeeNewEdit = Loadable(lazy(() => import('../pages/dashboard/employee/new-edit/EmployeeNewEdit')))
// PROMOTION
// PRODUCT
const ProductList = Loadable(lazy(() => import('../pages/dashboard/product/list/ProductList')))
const ProductCreateEdit = Loadable(lazy(() => import('../pages/dashboard/product/new-edit/ProductNewEdit')))

// ATTRIBUTE
const ColorList = Loadable(lazy(() => import('../pages/dashboard/attributes/color/list/ColorList')))
const CategoryList = Loadable(lazy(() => import('../pages/dashboard/attributes/category/list/CategoryList')))
const BrandList = Loadable(lazy(() => import('../pages/dashboard/attributes/brand/list/BrandList')))
const SizeList = Loadable(lazy(() => import('../pages/dashboard/attributes/size/list/SizeList')))
// BILL
const BillList = Loadable(lazy(() => import('../pages/dashboard/order/list/BillList')))
const BillDetails = Loadable(lazy(() => import('../pages/dashboard/order/details/BillDetails')))



















// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
