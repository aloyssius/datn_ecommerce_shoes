// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

// application
import messages from '../i18n';

// pages
import Layout from './Layout';
import HomePageOne from './home/HomePageOne';
import { LoadingProvider } from '../context/LoadingContext';
import { AuthProvider } from '../context/JWTContext';
import { NofiticationProvider } from '../context/NotificationContext';
import { UserProvider } from '../context/UserContext';


class Root extends Component {

  render() {
    const { locale } = this.props;

    return (
      <LoadingProvider>
        <NofiticationProvider>
          <IntlProvider locale={locale} messages={messages[locale]}>
            <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
              <AuthProvider>
                <UserProvider>
                  <Switch>
                    <Route
                      path="/"
                      render={(props) => (
                        <Layout {...props} headerLayout="default" homeComponent={HomePageOne} />
                      )}
                    />
                    <Redirect to="/" />
                  </Switch>
                </UserProvider>
              </AuthProvider>
            </BrowserRouter>
          </IntlProvider>
        </NofiticationProvider>
      </LoadingProvider>
    );
  }
}

Root.propTypes = {
  /** current locale */
  locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
  locale: state.locale,
});

export default connect(mapStateToProps)(Root);
