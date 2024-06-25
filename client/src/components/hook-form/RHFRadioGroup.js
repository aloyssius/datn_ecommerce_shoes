import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Typography, Radio, RadioGroup, FormHelperText, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

RHFRadioGroup.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  getOptionLabel: PropTypes.arrayOf(PropTypes.string),
  topLabel: PropTypes.string,
  isRequired: PropTypes.bool,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export default function RHFRadioGroup({ name, options, getOptionLabel, topLabel, isRequired, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
          <div>
            <LabelStyle>
              {topLabel || ""} <span className="required">{isRequired && "*"}</span>
            </LabelStyle>
            <RadioGroup {...field} row {...other}>
              {options.map((option, index) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={getOptionLabel?.length ? getOptionLabel[index] : option}
                />
              ))}
            </RadioGroup>

            {!!error && (
              <FormHelperText error sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
      )}
    />
  );
}
