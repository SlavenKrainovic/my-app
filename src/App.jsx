
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getGearboxes, calculateGearboxSpeeds } from './services/gearboxes';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function App() {
  useEffect(() => {
    getGearboxes().then(data => setGearboxes(data));
  }, []);
  const [gearboxes, setGearboxes] = useState([]);
  const [gearbox, setGearbox] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedGearbox, setSelectedGearbox] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const handleChange = (event) => {
    setGearbox(event.target.value);
    gearboxes.filter((gearbox) => {
      console.log(gearbox.name == event.target.value);
      if (gearbox.name == event.target.value) {
        setSelectedGearbox(gearbox);
      }
    });  
  };
  const handleEdit = () => {
    const mergedObject = {
      maxRpm: parseInt(userInput.maxRpm),
      finalDrive: selectedGearbox.finalDrive,
      tyreWidth: parseInt(userInput.tyreWidth),
      tyreProfile: parseInt(userInput.tyreProfile),
      wheelDiameter: parseInt(userInput.wheelDiameter)
  };
  
  // Map gear ratios
  selectedGearbox.gears.forEach(gear => {
      mergedObject[`gearRatio${gear.gear}`] = gear.ratio;
  });
  calculateGearboxSpeeds(mergedObject).then(data => setChartData(data));
  console.log(chartData);
};

  return (
    <>
      <Box sx={{ minWidth: 500 }}>
        {selectedGearbox.name && (
          <TableContainer component={Paper}>
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
                  <TableCell>{selectedGearbox.name}</TableCell>
                  <TableCell>{selectedGearbox.gears[0].ratio}</TableCell>
                  <TableCell>{selectedGearbox.gears[1].ratio}</TableCell>
                  <TableCell>{selectedGearbox.gears[2].ratio}</TableCell>
                  <TableCell>{selectedGearbox.gears[3].ratio}</TableCell>
                  <TableCell>{selectedGearbox.gears[4].ratio}</TableCell>
                  <TableCell>{selectedGearbox.gears[5].ratio}</TableCell>
                  <TableCell>{selectedGearbox.gears[6].ratio}</TableCell>
                  <TableCell>{selectedGearbox.finalDrive}</TableCell>
                  <TableCell><TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  value={userInput.tyreWidth}
                  onChange={(e) => setUserInput({...userInput, tyreWidth: e.target.value})}
                /></TableCell>
                  <TableCell><TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  value={userInput.tyreProfile}
                  onChange={(e) => setUserInput({...userInput, tyreProfile: e.target.value})}
                /></TableCell>
                  <TableCell><TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  value={userInput.wheelDiameter}
                  onChange={(e) => setUserInput({...userInput, wheelDiameter: e.target.value})}
                /></TableCell>
                  <TableCell><TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  value={userInput.maxRpm}
                  onChange={(e) => setUserInput({...userInput, maxRpm: e.target.value})}
                /></TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit()}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Gearbox</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gearbox}
            label="Gearbox"
            onChange={handleChange}
          >
            {gearboxes.map((gearbox) => (
              <MenuItem key={gearbox.name} value={gearbox.name}>
                {gearbox.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}

export default App
