// Cleaned up for readability, accessibility, and maintainability
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import NumberInput from './NumberInput';
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
            <NumberInput
              value={g.ratio}
              onChange={e => onInputChange(`gear${g.gear}`, e.target.value)}
              min={0}
              step={0.001}
              sx={{ width: 70, ml: 1, mr: 1 }}
              inputProps={{}}
            />
            {/* Editable box for pattern for this gear */}
            <NumberInput
              value={patternArr[idx] || 1}
              onChange={e => onInputChange(`pattern${g.gear}`, e.target.value)}
              min={1}
              max={2}
              step={1}
              sx={{ width: 50, ml: 1 }}
              label="Pattern"
              inputProps={{}}
            />
            {typeof g.finalDrive === 'number' && (
              <span> (<strong>Final Drive:</strong> {g.finalDrive.toFixed(3)})</span>
            )}
          </li>
        ))}
        {/* Show both final drives for reference as value boxes */}
        <li style={{marginTop: '10px'}}>
          <strong>Final Drive 1:</strong>
          <NumberInput
            value={selectedGearbox.finalDrive ?? ''}
            readOnly
            sx={{ ml: 1, width: 100 }}
            inputProps={{}}
          />
        </li>
        {selectedGearbox.finalDrive2 && (
          <li style={{marginTop: '5px'}}>
            <strong>Final Drive 2:</strong>
            <NumberInput
              value={selectedGearbox.finalDrive2 ?? ''}
              readOnly
              sx={{ ml: 1, width: 100 }}
              inputProps={{}}
            />
          </li>
        )}
        <li>
          <strong>Tyre Width:</strong>
          <NumberInput
            value={userInput.tyreWidth}
            onChange={e => onInputChange('tyreWidth', e.target.value)}
            min={0}
            label="Tyre Width"
            inputProps={{ 'aria-label': 'Tyre Width' }}
          />
        </li>
        <li>
          <strong>Tyre Profile:</strong>
          <NumberInput
            value={userInput.tyreProfile}
            onChange={e => onInputChange('tyreProfile', e.target.value)}
            min={0}
            label="Tyre Profile"
            inputProps={{ 'aria-label': 'Tyre Profile' }}
          />
        </li>
        <li>
          <strong>Wheel Diameter:</strong>
          <NumberInput
            value={userInput.wheelDiameter}
            onChange={e => onInputChange('wheelDiameter', e.target.value)}
            min={0}
            label="Wheel Diameter"
            inputProps={{ 'aria-label': 'Wheel Diameter' }}
          />
        </li>
        <li>
          <strong>Max RPM:</strong>
          <NumberInput
            value={userInput.maxRpm}
            onChange={e => onInputChange('maxRpm', e.target.value)}
            min={0}
            label="Max RPM"
            inputProps={{ 'aria-label': 'Max RPM' }}
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

GearboxTable.defaultProps = {
  selectedGearbox: {
    name: '',
    gear1: 0,
    gear2: 0,
    gear3: 0,
    gear4: 0,
    gear5: 0,
    gear6: 0,
    gear7: 0,
    gears: [],
    finalDrive: 0,
    finalDrive2: 0,
    finalDrivePattern: ''
  },
  userInput: {
    tyreWidth: '',
    tyreProfile: '',
    wheelDiameter: '',
    maxRpm: ''
  },
  onInputChange: () => {},
  onCalculate: () => {},
};

export default GearboxTable;
