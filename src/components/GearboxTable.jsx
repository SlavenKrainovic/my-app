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
<Table>
        <TableHead>
          <TableRow>
            <TableCell>GearboxName</TableCell>
            <TableCell>FirstGear</TableCell>
            <TableCell>SecondGear</TableCell>
            <TableCell>ThirdGear</TableCell>
            <TableCell>FourthGear</TableCell>
            <TableCell>FifthGear</TableCell>
            <TableCell>SixthGear</TableCell>
            <TableCell>SeventhGear</TableCell>
            <TableCell>FinalDrive</TableCell>
            <TableCell>TyreWidth</TableCell>
            <TableCell>TyreProfile</TableCell>
            <TableCell>WheelDiameter</TableCell>
            <TableCell>MaxRpm</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{selectedGearbox.name || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear1?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear2?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear3?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear4?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear5?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear6?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.gear7?.toFixed(3) || '-'}</TableCell>
            <TableCell>{selectedGearbox.finalDrive?.toFixed(3) || '-'}</TableCell>
            <TableCell>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={userInput.tyreWidth}
                onChange={(e) => onInputChange('tyreWidth', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </TableCell>
            <TableCell>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={userInput.tyreProfile}
                onChange={(e) => onInputChange('tyreProfile', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </TableCell>
            <TableCell>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={userInput.wheelDiameter}
                onChange={(e) => onInputChange('wheelDiameter', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </TableCell>
            <TableCell>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={userInput.maxRpm}
                onChange={(e) => onInputChange('maxRpm', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={onCalculate}
                disabled={!userInput.tyreWidth || !userInput.tyreProfile || !userInput.wheelDiameter || !userInput.maxRpm}
              >
                Calculate
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

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
