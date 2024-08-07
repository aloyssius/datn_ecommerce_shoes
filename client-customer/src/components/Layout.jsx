// react
import React, { Suspense, lazy } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// application
import Footer from './footer';
import Header from './header';
import MobileHeader from './mobile/MobileHeader';
import MobileMenu from './mobile/MobileMenu';
import Quickview from './shared/Quickview';
import LoadingScreen from './shared/LoadingScreen';

// pages
import SitePageAboutUs from './site/SitePageAboutUs';
import SitePageComponents from './site/SitePageComponents';
import SitePageContactUs from './site/SitePageContactUs';
import SitePageContactUsAlt from './site/SitePageContactUsAlt';
import SitePageFaq from './site/SitePageFaq';
import SitePageNotFound from './site/SitePageNotFound';
import SitePageTerms from './site/SitePageTerms';
import SitePageTypography from './site/SitePageTypography';
import AuthGuard from '../guards/AuthGuard';

// data stubs
import theme from '../data/theme';
import GuestGuard from '../guards/GuestGuard';

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const AccountLogin = Loadable(lazy(() => import('./account/AccountPageLogin')));
const MyCart = Loadable(lazy(() => import('./shop/ShopPageCart')));
const Checkout = Loadable(lazy(() => import('./shop/ShopPageCheckout')));
const TrackOrder = Loadable(lazy(() => import('./shop/ShopPageTrackOrder')));
const MyAccount = Loadable(lazy(() => import('./account/AccountLayout')));
const AccountVerify = Loadable(lazy(() => import('./account/AccountVerify')));
const AccountRegisterSuccess = Loadable(lazy(() => import('./account/AccountRegisterSuccess')));
const ProductList = Loadable(lazy(() => import('./shop/ShopPageCategory')));
const ProductDetail = Loadable(lazy(() => import('./shop/ShopPageProduct')));
const CheckoutSuccess = Loadable(lazy(() => import('./shop/ShopPageCheckoutSuccess')));
const OrderDetails = Loadable(lazy(() => import('./account/AccountPageOrderDetails')));

function Layout(props) {
  const { match, headerLayout, homeComponent } = props;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  return (
    <React.Fragment>
      <Helmet>
        <title>{theme.name}</title>
        <meta name="description" content={theme.fullName} />
      </Helmet>

      <Quickview />

      <MobileMenu />

      <div className="site">
        <header className="site__header d-lg-none">
          <MobileHeader />
        </header>

        <header className="site__header d-lg-block d-none">
          <Header layout={headerLayout} />
        </header>

        <div className="site__body">
          <Switch>
            {/*
                        // Home
                        */}
            <Route exact path={`${match.path}`} component={homeComponent} />

            {/*
                        // Shop
                        */}
            <Route
              exact
              path="/product-list"
              render={(props) => (
                <ProductList {...props} columns={3} viewMode="grid" sidebarPosition="start" />
              )}
            />
            <Route
              exact
              path="/product-list/male"
              render={(props) => (
                <ProductList {...props} columns={3} viewMode="grid" sidebarPosition="start" gender="male" />
              )}
            />
            <Route
              exact
              path="/product-list/female"
              render={(props) => (
                <ProductList {...props} columns={3} viewMode="grid" sidebarPosition="start" gender="female" />
              )}
            />

            <Route exact path="/product-detail/:sku" component={ProductDetail} />
            <Route exact path="/order-completed" component={CheckoutSuccess} />

            <Route exact path="/cart" component={MyCart} />
            <Route exact path="/checkout" component={Checkout} />
            <Route exact path="/track-order" component={TrackOrder} />
            <Route exact path="/track-order/:id" component={OrderDetails} />

            <Route path="/account/register-success/:id" render={() => (
              <GuestGuard>
                <AccountRegisterSuccess />
              </GuestGuard>
            )} />
            <Route path="/account/verify/:id" render={() => (
              <GuestGuard>
                <AccountVerify />
              </GuestGuard>
            )} />
            <Route path="/account/login" render={() => (
              <GuestGuard>
                <AccountLogin />
              </GuestGuard>
            )} />

            <Route path="/account" render={(props) => (
              <AuthGuard  >
                <MyAccount {...props} />
              </AuthGuard>
            )} />

            <Redirect exact from="/site" to="/site/about-us" />
            <Route exact path="/site/about-us" component={SitePageAboutUs} />
            <Route exact path="/site/components" component={SitePageComponents} />
            <Route exact path="/site/contact-us" component={SitePageContactUs} />
            <Route exact path="/site/contact-us-alt" component={SitePageContactUsAlt} />
            <Route exact path="/site/faq" component={SitePageFaq} />
            <Route exact path="/site/terms" component={SitePageTerms} />
            <Route exact path="/site/typography" component={SitePageTypography} />
            <Route exact path="/not-found" component={SitePageNotFound} />

            <Route component={SitePageNotFound} />
          </Switch>
        </div>

        <footer className="site__footer">
          <Footer />
        </footer>
      </div>
    </React.Fragment>
  );
}

Layout.propTypes = {
  /**
   * header layout (default: 'classic')
   * one of ['classic', 'compact']
   */
  headerLayout: PropTypes.oneOf(['default', 'compact']),
  /**
   * home component
   */
  homeComponent: PropTypes.elementType.isRequired,
};

Layout.defaultProps = {
  headerLayout: 'default',
};

export default Layout;
