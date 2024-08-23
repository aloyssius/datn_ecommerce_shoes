import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import LoadingScreen from '../components/shared/LoadingScreen';

const initialState = {
  onOpenLoading: () => { },
  onCloseLoading: () => { },
  isLoading: false,
}

const LoadingContext = createContext(initialState);

LoadingProvider.propTypes = {
  children: PropTypes.node,
}

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
        isLoading,
      }}
    >
      <>
        {isLoading &&
          <LoadingScreen />
        }
      </>
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, LoadingContext }
