import './App.css';
import { useState } from 'react';
import SpeedChart from './components/SpeedChart';
import CarBrandSelect from './components/CarBrandSelect';
import GearboxSelect from './components/GearboxSelect';
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
      <div className="form-container">
        <h1>Gearbox Calculator</h1>
        <div className="form-section">
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
              <div className="gearbox-info">
                <h2>Speed Ratios</h2>
                <div className="ratio-grid">
                  {selectedGearbox.gear1 !== undefined && selectedGearbox.gear1 !== null && (
                    <div className="ratio-item">
                      <label>1st Gear:</label>
                      <span>{selectedGearbox.gear1}</span>
                    </div>
                  )}
                  {selectedGearbox.gear2 !== undefined && selectedGearbox.gear2 !== null && (
                    <div className="ratio-item">
                      <label>2nd Gear:</label>
                      <span>{selectedGearbox.gear2}</span>
                    </div>
                  )}
                  {selectedGearbox.gear3 !== undefined && selectedGearbox.gear3 !== null && (
                    <div className="ratio-item">
                      <label>3rd Gear:</label>
                      <span>{selectedGearbox.gear3}</span>
                    </div>
                  )}
                  {selectedGearbox.gear4 !== undefined && selectedGearbox.gear4 !== null && (
                    <div className="ratio-item">
                      <label>4th Gear:</label>
                      <span>{selectedGearbox.gear4}</span>
                    </div>
                  )}
                  {selectedGearbox.gear5 !== undefined && selectedGearbox.gear5 !== null && (
                    <div className="ratio-item">
                      <label>5th Gear:</label>
                      <span>{selectedGearbox.gear5}</span>
                    </div>
                  )}
                  {selectedGearbox.gear6 !== undefined && selectedGearbox.gear6 !== null && (
                    <div className="ratio-item">
                      <label>6th Gear:</label>
                      <span>{selectedGearbox.gear6}</span>
                    </div>
                  )}
                  {selectedGearbox.gear7 !== undefined && selectedGearbox.gear7 !== null && (
                    <div className="ratio-item">
                      <label>7th Gear:</label>
                      <span>{selectedGearbox.gear7}</span>
                    </div>
                  )}
                  {selectedGearbox.finalDrive !== undefined && selectedGearbox.finalDrive !== null && (
                    <div className="ratio-item">
                      <label>Final Drive:</label>
                      <span>{selectedGearbox.finalDrive}</span>
                    </div>
                  )}
                </div>
              </div>

              <h2>Wheel Configuration</h2>
              <label>Tyre Width:</label>
              <input 
                type="number"
                name="tyreWidth"
                value={userInput.tyreWidth || ''}
                onChange={(e) => handleInputChange('tyreWidth', e.target.value)}
              />

              <label>Tyre Profile:</label>
              <input 
                type="number"
                name="tyreProfile"
                value={userInput.tyreProfile || ''}
                onChange={(e) => handleInputChange('tyreProfile', e.target.value)}
              />

              <label>Wheel Diameter (inch):</label>
              <input 
                type="number"
                name="wheelDiameter"
                value={userInput.wheelDiameter || ''}
                onChange={(e) => handleInputChange('wheelDiameter', e.target.value)}
              />

              <label>Max RPM:</label>
              <input 
                type="number"
                name="maxRpm"
                value={userInput.maxRpm}
                onChange={(e) => handleInputChange('maxRpm', e.target.value)}
                placeholder="7500"
              />

              <button onClick={calculateSpeeds}>Calculate</button>

              {error && <div className="error-message">{error}</div>}
            </>
          )}
        </div>
      </div>

      <div className="chart-container">
        <h1>Speed vs RPM Chart</h1>
        {loading ? (
          <div className="loading">Calculating...</div>
        ) : (
          chartData && chartData.data && chartData.data.length > 0 && (
            <SpeedChart chartData={chartData} />
          )
        )}
      </div>
    </div>
  );
}

export default App;
