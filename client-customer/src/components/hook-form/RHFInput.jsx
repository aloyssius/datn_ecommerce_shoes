import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

RHFInput.propTypes = {
  name: PropTypes.string,
  topLabel: PropTypes.string,
  optional: PropTypes.string,
  textarea: PropTypes.bool,
  row: PropTypes.number,
  isRequired: PropTypes.bool,
  children: PropTypes.object,
  inputGroup: PropTypes.object,
};

export default function RHFInput({ name, topLabel, isRequired, children, errorRes = "", inputGroup, optional, textarea, row, ...other }) {
  const { control } = useFormContext();

  if (inputGroup) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="form-group">
            <label>{topLabel || ""}</label>
            <span className="required">{isRequired && "*"}</span>
            <div className='input-group'>
              <input
                {...field}
                {...other}
                className={`${error || errorRes !== "" ? "input-border-error" : ""} form-control`}
              />
              {inputGroup}
            </div>
            <span className='text-error'>{error?.message || errorRes}</span>
            {children}
          </div>

        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="form-group">
          <label>{topLabel || ""}
            <span className="text-muted">{optional ? ` (${optional})` : ""}</span>
          </label>
          <span className="required">{isRequired && "*"}</span>
          {textarea ?
            <textarea
              className="form-control"
              rows={row}
              {...field}
              {...other}
            /> :
            <input
              {...field}
              {...other}
              className={`${error || errorRes !== "" ? "input-border-error" : ""} form-control`}
            />
          }
          <span className='text-error'>{error?.message || errorRes}</span>
          {children}
        </div>

      )}
    />
  );
}
