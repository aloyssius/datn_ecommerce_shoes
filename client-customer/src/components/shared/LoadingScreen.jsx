import PropTypes from 'prop-types';

LoadingScreen.propTypes = {
  isAuth: PropTypes.bool,
};

const rootStyle = {
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function LoadingScreen({ isAuth }) {
  return (
    <div style={{ ...rootStyle, backgroundColor: isAuth ? "white" : "rgba(0, 0, 0, 0.2)" }}>
      <div className="loader">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
};
