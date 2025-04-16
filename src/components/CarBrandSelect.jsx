// Cleaned up for readability and accessibility
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

const CarBrandSelect = ({ brands, selectedBrand, onBrandChange }) => (
  <FormControl fullWidth>
    <InputLabel id="car-brand-select-label" sx={{ color: '#f5f5f5' }}>Select Car Brand</InputLabel>
    <Select
      labelId="car-brand-select-label"
      id="car-brand-select"
      value={selectedBrand || ''}
      label="Select Car Brand"
      onChange={onBrandChange}
      sx={{ 
        color: '#f5f5f5',
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.08)'
        },
        '& .MuiSvgIcon-root': {
          color: 'rgba(255, 255, 255, 0.08)'
        },
        '&:hover': {
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.15)'
          },
          '& .MuiSvgIcon-root': {
            color: 'rgba(255, 255, 255, 0.15)'
          }
        }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: '#2d2d2d',
            '& .MuiMenuItem-root': {
              color: '#f5f5f5',
              '&:hover': {
                bgcolor: '#3d3d3d'
              }
            }
          }
        }
      }}
      inputProps={{ 'aria-label': 'Select Car Brand' }}
    >
      {brands?.map((brand) => (
        <MenuItem key={brand} value={brand}>
          {brand}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

CarBrandSelect.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBrand: PropTypes.string,
  onBrandChange: PropTypes.func.isRequired,
};

export default CarBrandSelect;
