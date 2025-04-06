import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const GearboxTable = ({ 
  selectedGearbox, 
  userInput, 
  onInputChange, 
  onCalculate 
}) => {
  console.log('GearboxTable received:', selectedGearbox);
  
  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
<ul class="gearbox-info-list">
  <li><strong>Gearbox Name:</strong> {selectedGearbox.name || '-'}</li>
  <li><strong>First Gear:</strong> {selectedGearbox.gear1?.toFixed(3) || '-'}</li>
  <li><strong>Second Gear:</strong> {selectedGearbox.gear2?.toFixed(3) || '-'}</li>
  <li><strong>Third Gear:</strong> {selectedGearbox.gear3?.toFixed(3) || '-'}</li>
  <li><strong>Fourth Gear:</strong> {selectedGearbox.gear4?.toFixed(3) || '-'}</li>
  <li><strong>Fifth Gear:</strong> {selectedGearbox.gear5?.toFixed(3) || '-'}</li>
  <li><strong>Sixth Gear:</strong> {selectedGearbox.gear6?.toFixed(3) || '-'}</li>
  <li><strong>Seventh Gear:</strong> {selectedGearbox.gear7?.toFixed(3) || '-'}</li>
  <li><strong>Final Drive:</strong> {selectedGearbox.finalDrive?.toFixed(3) || '-'}</li>
  <li>
    <strong>Tyre Width:</strong>
    <TextField
      type="number"
      variant="outlined"
      size="small"
      value={userInput.tyreWidth}
      onChange={(e) => onInputChange('tyreWidth', e.target.value)}
      inputProps={{ min: 0 }}
    />
  </li>
  <li>
    <strong>Tyre Profile:</strong>
    <TextField
      type="number"
      variant="outlined"
      size="small"
      value={userInput.tyreProfile}
      onChange={(e) => onInputChange('tyreProfile', e.target.value)}
      inputProps={{ min: 0 }}
    />
  </li>
  <li>
    <strong>Wheel Diameter:</strong>
    <TextField
      type="number"
      variant="outlined"
      size="small"
      value={userInput.wheelDiameter}
      onChange={(e) => onInputChange('wheelDiameter', e.target.value)}
      inputProps={{ min: 0 }}
    />
  </li>
  <li>
    <strong>Max RPM:</strong>
    <TextField
      type="number"
      variant="outlined"
      size="small"
      value={userInput.maxRpm}
      onChange={(e) => onInputChange('maxRpm', e.target.value)}
      inputProps={{ min: 0 }}
    />
  </li>
  <li>
    <Button
      variant="contained"
      color="primary"
      onClick={onCalculate}
      disabled={!userInput.tyreWidth || !userInput.tyreProfile || !userInput.wheelDiameter || !userInput.maxRpm}
    >
      Calculate
    </Button>
  </li>
</ul>


    </TableContainer>
  );
};

GearboxTable.propTypes = {
  selectedGearbox: PropTypes.shape({
    name: PropTypes.string,
    gear1: PropTypes.number,
    gear2: PropTypes.number,
    gear3: PropTypes.number,
    gear4: PropTypes.number,
    gear5: PropTypes.number,
    gear6: PropTypes.number,
    gear7: PropTypes.number,
    finalDrive: PropTypes.number,
  }).isRequired,
  userInput: PropTypes.shape({
    tyreWidth: PropTypes.string.isRequired,
    tyreProfile: PropTypes.string.isRequired,
    wheelDiameter: PropTypes.string.isRequired,
    maxRpm: PropTypes.string.isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onCalculate: PropTypes.func.isRequired,
};

export default GearboxTable;
