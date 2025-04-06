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
    calculateSpeeds,
    handleGearRatioChange
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
              {/* Gear Ratios */}
              <div className="gearbox-info">
                <h2>Gear Ratios</h2>
                <div className="ratio-grid">
                  {[1, 2, 3, 4, 5, 6, 7].map((gearNumber) => {
                    const gearValue = selectedGearbox[`gear${gearNumber}`];
                    if (gearValue === undefined || gearValue === null || gearValue === 0) return null;
                    
                    return (
                      <div key={gearNumber} className="ratio-item">
                        <label>Gear {gearNumber}:</label>
                        <input
                          type="number"
                          value={gearValue}
                          onChange={(e) => handleGearRatioChange(gearNumber, e.target.value)}
                          step="0.001"
                          min="0"
                          className="ratio-input"
                        />
                      </div>
                    );
                  })}
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
