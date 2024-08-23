import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
import { Check9x7Svg } from '../../svg';

// ----------------------------------------------------------------------

RHFCheckbox.propTypes = {
  name: PropTypes.string,
};

export function RHFCheckbox({ name, label, ...other }) {
  const { control } = useFormContext();

  const handleClick = (field) => {
    if (field.onChange) {
      field.onChange(!field.value);
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="form-group d-inline-block mb-2" onClick={() => handleClick(field)}>
          <div className="form-check checkbox-hover">
            <span className="form-check-input input-check">
              <span className="input-check__body">
                <input
                  {...other}
                  {...field}
                  checked={field.value}
                  type="checkbox"
                  className="input-check__input "
                />
                <span className="input-check__box" />
                <Check9x7Svg className="input-check__icon" />
              </span>
            </span>
            <label className="form-check-label checkbox-hover">
              {label}
            </label>
          </div>
        </ div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

// RHFMultiCheckbox.propTypes = {
//   name: PropTypes.string,
//   options: PropTypes.arrayOf(PropTypes.string),
// };
//
// export function RHFMultiCheckbox({ name, options, ...other }) {
//   const { control } = useFormContext();
//
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => {
//         const onSelected = (option) =>
//           field.value.includes(option) ? field.value.filter((value) => value !== option) : [...field.value, option];
//
//         return (
//           <FormGroup>
//             {options.map((option) => (
//               <FormControlLabel
//                 key={option}
//                 control={
//                   <Checkbox
//                     checked={field.value.includes(option)}
//                     onChange={() => field.onChange(onSelected(option))}
//                   />
//                 }
//                 label={option}
//                 {...other}
//               />
//             ))}
//           </FormGroup>
//         );
//       }}
//     />
//   );
// }
