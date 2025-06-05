import React from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const NumberInput = ({ label, value, onChange, min = 0, max, step = 1, readOnly = false, sx, ...props }) => (
  <TextField
    type="number"
    variant="outlined"
    size="small"
    label={label}
    value={value}
    onChange={onChange}
    inputProps={{ min, max, step, readOnly, 'aria-label': label, ...props.inputProps }}
    sx={sx}
    {...props}
  />
);

NumberInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  readOnly: PropTypes.bool,
  sx: PropTypes.object,
  inputProps: PropTypes.object
};

NumberInput.defaultProps = {
  label: '',
  value: '',
  onChange: () => {},
  min: 0,
  max: undefined,
  step: 1,
  readOnly: false,
  sx: {},
  inputProps: {},
};

export default NumberInput;
