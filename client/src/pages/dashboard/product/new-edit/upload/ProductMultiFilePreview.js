import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import { List, Stack, Button, IconButton, ListItemText, ListItem } from '@mui/material';
// utils
import { fData } from '../../../../../utils/formatNumber';
//
import Image from '../../../../../components/Image';
import Iconify from '../../../../../components/Iconify';
import { varFade } from '../../../../../components/animate';

// ----------------------------------------------------------------------

const getFileData = (file) => {
  if (typeof file === 'string') {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};

// ----------------------------------------------------------------------

ProductMultiFilePreview.propTypes = {
  files: PropTypes.array,
  showPreview: PropTypes.bool,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
};

export default function ProductMultiFilePreview({ showPreview = false, files, onRemove, onRemoveAll, onUpdateImageDefault, isEdit }) {
  const hasFile = files.length > 0;

  return (
    <>
      <List disablePadding sx={{ ...(hasFile && { my: 1 }) }}>
        <AnimatePresence>
          {files?.map((file) => {
            const { preview } = getFileData(file);

            if (!isEdit) {
              return (
                <ListItem
                  key={file?.path}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.25,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Image alt="preview" src={isString(file) ? file : preview} ratio="1/1" />
                  <IconButton
                    size="small"
                    onClick={() => onUpdateImageDefault(file?.path)}
                    sx={{
                      top: 6,
                      p: '2px',
                      left: 6,
                      position: 'absolute',
                      color: file?.isDefault ? 'yellow' : 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon={'eva:star-outline'} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 6,
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon={'eva:close-fill'} />
                  </IconButton>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={file?.id}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'inline-flex',
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Image alt="preview" src={file?.path} ratio="1/1" />
                <IconButton
                  size="small"
                  onClick={() => onUpdateImageDefault(file?.path)}
                  sx={{
                    top: 6,
                    p: '2px',
                    left: 6,
                    position: 'absolute',
                    color: file?.isDefault ? 'yellow' : 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    },
                  }}
                >
                  <Iconify icon={'eva:star-outline'} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{
                    top: 6,
                    p: '2px',
                    right: 6,
                    position: 'absolute',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    },
                  }}
                >
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              </ListItem>
            );

          })}

        </AnimatePresence>
      </List>

      {hasFile && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button color="error" variant="contained" size="small" onClick={onRemoveAll}>
            Xóa tất cả
          </Button>
        </Stack>
      )}
    </>
  );
}
