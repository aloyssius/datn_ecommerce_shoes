import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

LoadingScreenCustom.propTypes = {
  isAuth: PropTypes.bool,
};

export default function LoadingScreenCustom({ isAuth, ...other }) {
  return (
    <>
      <div {...other} style={{ ...rootStyle, backgroundColor: isAuth ? "white" : "rgba(0, 0, 0, 0.2)" }}>
        <div className="loader">
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </>
  );
}
