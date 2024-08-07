import { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
// utils
import { apiGet, apiPost } from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import { ADMIN_API } from '../api/apiConfig';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  notifies: [],
  onNotifies: () => {},
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notifies, setNotifies] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await apiGet(ADMIN_API.my_account);
          const user = response.data?.data;

          console.log(user);
          setNotifies(user?.notifies);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await apiPost(ADMIN_API.login, {
      email,
      password,
    });
    const { accessToken, user } = response.data?.data;

    console.log(accessToken);
    console.log(user);
          setNotifies(user?.notifies);

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await apiPost('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    try {
      const response = await apiPost(ADMIN_API.logout);
      setSession(null);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      setSession(null);
      dispatch({ type: 'LOGOUT' });
    }

  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        notifies,
        onNotifies: (data) => setNotifies(data),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
