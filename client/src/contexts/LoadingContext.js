import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
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
  backgroundColor: "rgba(0, 0, 0, 0.2)",
}));

function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [typeLoading, setTypeLoading] = useState('bar');

  const handleOpenLoading = (type) => {
    setIsLoading(true);

    if (type) {
      setTypeLoading(type);
    }
  }

  const handleCloseLoading = () => {
    setIsLoading(false);
  }

  const handleResetType = () => {
    setTypeLoading("bar");
  }

  return (
    <LoadingContext.Provider
      value={{
        onOpenLoading: handleOpenLoading,
        onCloseLoading: handleCloseLoading,
        onResetLoading: handleResetType,
      }}
    >
      <>
        {isLoading && typeLoading === "backdrop" &&
          <RootStyle>
            <div className="loader">
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </RootStyle>
        }

        {isLoading && typeLoading === "bar" &&
          <ProgressBar />
        }
      </>
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, LoadingContext }
