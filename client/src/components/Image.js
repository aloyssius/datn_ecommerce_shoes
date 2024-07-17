import PropTypes from 'prop-types';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// @mui
import { Modal, Box, Fade, Backdrop } from '@mui/material';

// ----------------------------------------------------------------------

Image.propTypes = {
  disabledEffect: PropTypes.bool,
  effect: PropTypes.string,
  ratio: PropTypes.oneOf(['4/3', '3/4', '6/4', '4/6', '16/9', '9/16', '21/9', '9/21', '1/1']),
  sx: PropTypes.object,
};

export default function Image({ ratio, disabledEffect = false, effect = 'blur', sx, ...other }) {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (ratio) {
    return (
      <>
        <Box
          component="span"
          sx={{
            width: 1,
            lineHeight: 0,
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            pt: getRatio(ratio),
            '& .wrapper': {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              lineHeight: 0,
              position: 'absolute',
              backgroundSize: 'cover !important',
              cursor: 'pointer',
            },
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 0.6,
            },
            ...sx,
          }}
        >
          <Box
            onClick={handleOpen}
            component={LazyLoadImage}
            wrapperClassName="wrapper"
            effect={disabledEffect ? undefined : effect}
            sx={{ width: 1, height: 1, objectFit: 'cover' }}
            {...other}
          />
        </Box>
        <Modal
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", }}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          disableRestoreFocus
        >
          <Fade in={open} timeout={300} sx={{ outline: "none" }}>
            <img
              {...other}
              alt="asd"
              style={{ maxHeight: "90%", maxWidth: "90%", outline: "none" }}
            />
          </Fade>
        </Modal>
      </>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        lineHeight: 0,
        display: 'block',
        overflow: 'hidden',
        '& .wrapper': { width: 1, height: 1, backgroundSize: 'cover !important' },
        ...sx,
      }}
    >
      <Box
        component={LazyLoadImage}
        wrapperClassName="wrapper"
        effect={disabledEffect ? undefined : effect}
        // placeholderSrc="https://zone-assets-api.vercel.app/assets/img_placeholder.svg"
        sx={{ width: 1, height: 1, objectFit: 'cover' }}
        {...other}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function getRatio(ratio = '1/1') {
  return {
    '4/3': 'calc(100% / 4 * 3)',
    '3/4': 'calc(100% / 3 * 4)',
    '6/4': 'calc(100% / 6 * 4)',
    '4/6': 'calc(100% / 4 * 6)',
    '16/9': 'calc(100% / 16 * 9)',
    '9/16': 'calc(100% / 9 * 16)',
    '21/9': 'calc(100% / 21 * 9)',
    '9/21': 'calc(100% / 9 * 21)',
    '1/1': '100%',
  }[ratio];
}
