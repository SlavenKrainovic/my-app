// Cleaned up for readability and accessibility
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

const GearboxSelect = ({ gearboxes, selectedGearbox, onGearboxChange }) => (
  <FormControl fullWidth>
    <InputLabel id="gearbox-select-label" sx={{ color: '#f5f5f5' }}>Select Gearbox</InputLabel>
    <Select
      labelId="gearbox-select-label"
      id="gearbox-select"
      value={selectedGearbox || ''}
      label="Select Gearbox"
      onChange={onGearboxChange}
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
      inputProps={{ 'aria-label': 'Select Gearbox' }}
    >
      {gearboxes?.map((box) => (
        <MenuItem key={box.name} value={box.name}>
          {box.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

GearboxSelect.propTypes = {
  gearboxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedGearbox: PropTypes.string,
  onGearboxChange: PropTypes.func.isRequired,
};

export default GearboxSelect;
