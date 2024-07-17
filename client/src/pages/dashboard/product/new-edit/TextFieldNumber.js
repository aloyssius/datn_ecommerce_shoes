import { useState } from 'react';
// @mui
import { TextField } from '@mui/material';
// utils
import { formatNumberString, formatCurrencyVnd } from '../../../../utils/formatCurrency';

// ----------------------------------------------------------------------

export function TextFieldNumber({ onEditRow, quantity }) {
  const [inputQuantity, setInputQuantity] = useState(quantity);
  const [initial, setInitial] = useState();

  const setInitialValue = (value) => {
    setInputQuantity(value);
    setInitial(value);
  }

  const handleBlur = () => {
    if (inputQuantity !== initial) {
      onEditRow(inputQuantity);
    }
  }

  return (
    <TextField
      size='small'
      value={inputQuantity === 0 ? "" : inputQuantity}
      onChange={(e) => setInputQuantity(formatNumberString(e.target.value))}
      onBlur={handleBlur}
      onFocus={() => setInitialValue(inputQuantity)}
      autoComplete='off'
      placeholder='0'
      InputLabelProps={{ shrink: true }}
      sx={{
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
  )
}

export function TextFieldPrice({ variant, onUpdatePrice, isSubmitted }) {
  const [inputPrice, setInputPrice] = useState(variant?.price);
  const [initial, setInitial] = useState();

  const setInitialValue = (value) => {
    setInputPrice(value);
    setInitial(value);
  }

  const handleBlur = () => {
    if (inputPrice !== initial) {
      onUpdatePrice(variant?.colorId, inputPrice);
    }
  }

  const getHelperText = () => {
    if (!isSubmitted) {
      return "";
    }

    if (inputPrice === 0 || inputPrice === "") {
      return "Bạn chưa nhập đơn giá.";
    }

    return "";
  }

  const getError = () => {
    if (!isSubmitted) {
      return false;
    }

    if (inputPrice === 0 || inputPrice === "") {
      return true;
    }

    return false;
  }

  return (
    <TextField
      size='small'
      value={inputPrice === 0 ? "" : inputPrice}
      onChange={(e) => setInputPrice(formatCurrencyVnd(e.target.value))}
      onBlur={handleBlur}
      onFocus={() => setInitialValue(inputPrice)}
      placeholder="0.00"
      InputLabelProps={{ shrink: true }}
      autoComplete='off'
      helperText={getHelperText()}
      error={getError()}
      sx={{
        width: "75%",
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
  )
}
