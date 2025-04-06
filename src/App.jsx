import './App.css';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CarBrandSelect from './components/CarBrandSelect';
import GearboxSelect from './components/GearboxSelect';
import GearboxTable from './components/GearboxTable';
import SpeedChart from './components/SpeedChart';
import { useGearboxCalculator } from './hooks/useGearboxCalculator';

function App() {
  const {
    carBrands,
    selectedBrand,
    gearboxes,
    selectedGearbox,
    selectedGearboxName,
    chartData,
    userInput,
    loading,
    error,
    handleBrandChange,
    handleGearboxChange,
    handleInputChange,
    calculateSpeeds
  } = useGearboxCalculator();

  return (
    <div className="container">
      <Box sx={{ minWidth: 500, p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <CarBrandSelect
          brands={carBrands}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
        />

        <GearboxSelect
          gearboxes={gearboxes}
          selectedGearbox={selectedGearboxName}
          onGearboxChange={handleGearboxChange}
        />

        {selectedGearbox.name && (
          <>
            <GearboxTable
              selectedGearbox={selectedGearbox}
              userInput={userInput}
              onInputChange={handleInputChange}
              onCalculate={calculateSpeeds}
            />

            {chartData.data && chartData.data.length > 0 && (
              <SpeedChart chartData={chartData} />
            )}
          </>
        )}
      </Box>
    </div>
  );
}

export default App;
