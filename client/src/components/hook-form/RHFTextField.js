import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  topLabel: PropTypes.string,
  isRequired: PropTypes.bool,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export default function RHFTextField({ name, topLabel, isRequired, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Grid>
          <LabelStyle>
            {topLabel || ""} <span className="required">{isRequired && "*"}</span>
          </LabelStyle>
          <TextField
            {...field}
            size='small'
            fullWidth
            error={!!error}
            helperText={error?.message || ''}
            {...other}
            sx={{
              '& fieldset': {
                borderRadius: '6px',
              },
              "& .Mui-error": {
                marginLeft: 0,
              },
            }}
            inputProps={
              {
                sx: {
                  '&::placeholder': {
                    fontSize: '14.5px'
                  },
                },
              }
            }
          />
        </Grid>
      )}
    />
  );
}
