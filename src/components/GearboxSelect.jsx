import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

const GearboxSelect = ({ gearboxes, selectedGearbox, onGearboxChange }) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="gearbox-select-label">Select Gearbox</InputLabel>
      <Select
        sx={{ width: '100%', minHeight: '30px', fontSize: '0.8rem', padding: '2px 6px', border: '1px solid #ccc', borderRadius: '4px' }}
        labelId="gearbox-select-label"
        id="gearbox-select"
        value={selectedGearbox || ''}
        label="Gearbox"
        onChange={onGearboxChange}
      >
        {gearboxes.map((box) => (
          <MenuItem key={box.name} value={box.name}>
            {box.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

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
