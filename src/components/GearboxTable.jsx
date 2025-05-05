// Cleaned up for readability, accessibility, and maintainability
import TableContainer from '@mui/material/TableContainer';
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
  // --- Dual Final Drive Logic ---
  // Parse finalDrivePattern if present, fallback to all 1s if not
  const patternArr = selectedGearbox.finalDrivePattern
    ? selectedGearbox.finalDrivePattern.split(',').map(Number)
    : [1,1,1,1,1,1,1];

  // Gather gears from either array or legacy fields
  let gears = [];
  if (Array.isArray(selectedGearbox.gears)) {
    gears = selectedGearbox.gears.filter(g => g.ratio && g.ratio !== 0);
  } else {
    // fallback: build gears from gear1-gear7
    for (let i = 1; i <= 7; i++) {
      const ratio = selectedGearbox[`gear${i}`];
      if (ratio && ratio !== 0) gears.push({ gear: i, ratio });
    }
  }

  // Map each gear to its correct final drive
  const gearsWithFinalDrive = gears.map((g, idx) => {
    const pattern = patternArr[idx] || 1;
    const finalDriveUsed = pattern === 2 && selectedGearbox.finalDrive2
      ? selectedGearbox.finalDrive2
      : selectedGearbox.finalDrive;
    return {
      ...g,
      finalDrive: finalDriveUsed
    };
  });

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <ul className="gearbox-info-list">
        <li><strong>Gearbox Name:</strong> {selectedGearbox.name || '-'}</li>
        {/* Show per-gear ratios and final drive */}
        {gearsWithFinalDrive.map((g, idx) => (
          <li key={g.gear} className="ratio-item">
            <span>Gear {g.gear}:</span>
            <TextField
              type="number"
              size="small"
              value={g.ratio}
              onChange={e => onInputChange(`gear${g.gear}`, e.target.value)}
              inputProps={{ min: 0, step: 0.001 }}
              style={{ width: 70, marginLeft: 8, marginRight: 8 }}
            />
            {/* Editable box for pattern for this gear */}
            <TextField
              type="number"
              size="small"
              value={patternArr[idx] || 1}
              onChange={e => onInputChange(`pattern${g.gear}`, e.target.value)}
              inputProps={{ min: 1, max: 2, step: 1 }}
              style={{ width: 50, marginLeft: 8 }}
              label="Pattern"
            />
            {typeof g.finalDrive === 'number' && (
              <span> (<strong>Final Drive:</strong> {g.finalDrive.toFixed(3)})</span>
            )}
          </li>
        ))}
        {/* Show both final drives for reference as value boxes */}
        <li style={{marginTop: '10px'}}>
          <strong>Final Drive 1:</strong>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            value={selectedGearbox.finalDrive ?? ''}
            InputProps={{ readOnly: true }}
            sx={{ ml: 1, width: 100 }}
          />
        </li>
        {selectedGearbox.finalDrive2 && (
          <li style={{marginTop: '5px'}}>
            <strong>Final Drive 2:</strong>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={selectedGearbox.finalDrive2 ?? ''}
              InputProps={{ readOnly: true }}
              sx={{ ml: 1, width: 100 }}
            />
          </li>
        )}
        <li>
          <strong>Tyre Width:</strong>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            value={userInput.tyreWidth}
            onChange={(e) => onInputChange('tyreWidth', e.target.value)}
            inputProps={{ min: 0, 'aria-label': 'Tyre Width' }}
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
            inputProps={{ min: 0, 'aria-label': 'Tyre Profile' }}
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
            inputProps={{ min: 0, 'aria-label': 'Wheel Diameter' }}
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
            inputProps={{ min: 0, 'aria-label': 'Max RPM' }}
          />
        </li>
        <li>
          <Button
            variant="contained"
            color="primary"
            onClick={onCalculate}
            disabled={!userInput.tyreWidth || !userInput.tyreProfile || !userInput.wheelDiameter || !userInput.maxRpm}
            aria-label="Calculate"
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
    gears: PropTypes.array,
    finalDrive: PropTypes.number,
    finalDrive2: PropTypes.number,
    finalDrivePattern: PropTypes.string,
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
