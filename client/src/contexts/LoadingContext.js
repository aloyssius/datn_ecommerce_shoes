import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import Logo from '../components/Logo';
import ProgressBar from '../components/ProgressBar';

const initialState = {
  onOpenLoading: () => { },
  onCloseLoading: () => { },
}

const LoadingContext = createContext(initialState);

LoadingProvider.propTypes = {
  children: PropTypes.node,
}

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: theme.palette.background.default,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
}));

function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenLoading = () => {
    setIsLoading(true);
  }

  const handleCloseLoading = () => {
    setIsLoading(false);
  }

  return (
    <LoadingContext.Provider
      value={{
        onOpenLoading: handleOpenLoading,
        onCloseLoading: handleCloseLoading,
      }}
    >
      <>
        {isLoading &&
          <ProgressBar />
        }
      </>
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, LoadingContext }
