import { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
// utils
import { apiGet, apiPost } from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import { CLIENT_API } from '../api/apiConfig.js';
import useLoading from '../hooks/useLoading';
import { PATH_PAGE } from '../routes/path';
import { LOCAL_STORAGE_CART_ITEMS_KEY } from '../enum/enum';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  authUser: null,
  addressDefault: {},
  onChangeUserAuth: () => { },
  onChangeIsAuth: () => { },
  updateAddressDefault: () => { },
};

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {

  const history = useHistory();
  const { onOpenLoading, onCloseLoading } = useLoading();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [addressDefault, setAddressDefault] = useState({});

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        console.log(accessToken || "token is null")

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await apiGet(CLIENT_API.account.details);
          const user = response?.data?.data;

          console.log(user)
          console.log(response?.data);

          setAuthUser(user);
          setAddressDefault(user?.addressDefault)
          setIsAuthenticated(true);
        } else {
          setAuthUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setAuthUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }

    };

    initialize();
  }, []);

  const login = async (data) => {

    const response = await apiPost(CLIENT_API.account.login, data);

    const { accessToken, user, isRemoveCartBrowser } = response.data?.data;

    console.log(accessToken || "token is null")
    console.log(response?.data);
    setSession(accessToken);
    setAuthUser(user);
    setAddressDefault(user?.addressDefault)
    setIsAuthenticated(true);

    if (isRemoveCartBrowser) {
      localStorage.removeItem(LOCAL_STORAGE_CART_ITEMS_KEY);
    }
  };

  const logout = async () => {
    onOpenLoading();
    try {
      const response = await apiPost(CLIENT_API.account.logout);
      onCloseLoading();
      setSession(null);
      setAuthUser(null);
      setAddressDefault({})
      setIsAuthenticated(false);
      history.push(PATH_PAGE.root);
    } catch (error) {
      console.error(error);
      onCloseLoading();
      setSession(null);
      setAuthUser(null);
      setAddressDefault({})
      setIsAuthenticated(false);
      history.push(PATH_PAGE.root);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isAuthenticated,
        isInitialized,
        method: 'jwt',
        login,
        logout,
        onChangeIsAuth: (value) => setIsAuthenticated(value),
        onChangeUserAuth: (user) => setIsAuthenticated(user),
        updateAddressDefault: (address) => setAddressDefault(address),
        addressDefault,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
