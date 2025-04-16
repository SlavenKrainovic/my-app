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
    handleGearRatioChange,
    handleFinalDriveChange
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

          {selectedGearbox && selectedGearbox.name && (
            <>
              {/* Final Drive Ratio */}
              <div className="final-drive-section">
                <h2>Final Drive Ratio</h2>
                <div>
                  <label htmlFor="finalDrive">Final Drive Ratio:</label>
                  <input
                    id="finalDrive"
                    type="number"
                    value={selectedGearbox.finalDrive || ''}
                    onChange={(e) => handleFinalDriveChange(e.target.value)}
                    step="0.001"
                    min="0"
                    max="9.999"
                  />
                </div>
              </div>

              {/* Gear Ratios */}
              <div>
                <h2>Gear Ratios</h2>
                <div className="ratio-grid">
                  {[1, 2, 3, 4, 5, 6, 7].map((gearNumber) => (
                    <div key={gearNumber} className="ratio-item">
                      <label htmlFor={`gear-${gearNumber}`}>Gear {gearNumber}:</label>
                      <input
                        id={`gear-${gearNumber}`}
                        type="number"
                        value={selectedGearbox[`gear${gearNumber}`] || ''}
                        onChange={(e) => handleGearRatioChange(gearNumber, e.target.value)}
                        step="0.001"
                        min="0"
                        max="9.999"
                        className="ratio-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="wheel-config">
                <h2>Wheel Configuration</h2>
                <label htmlFor="tyreWidth">Tyre Width:</label>
                <input
                  id="tyreWidth"
                  type="number"
                  name="tyreWidth"
                  value={userInput.tyreWidth || ''}
                  onChange={(e) => handleInputChange('tyreWidth', e.target.value)}
                />

                <label htmlFor="tyreProfile">Tyre Profile:</label>
                <input
                  id="tyreProfile"
                  type="number"
                  name="tyreProfile"
                  value={userInput.tyreProfile || ''}
                  onChange={(e) => handleInputChange('tyreProfile', e.target.value)}
                />

                <label htmlFor="wheelDiameter">Wheel Diameter (inch):</label>
                <input
                  id="wheelDiameter"
                  type="number"
                  name="wheelDiameter"
                  value={userInput.wheelDiameter || ''}
                  onChange={(e) => handleInputChange('wheelDiameter', e.target.value)}
                />

                <label htmlFor="maxRpm">Max RPM:</label>
                <input
                  id="maxRpm"
                  type="number"
                  name="maxRpm"
                  value={userInput.maxRpm}
                  onChange={(e) => handleInputChange('maxRpm', e.target.value)}
                  placeholder="7500"
                />
              </div>

              <button type="button" onClick={calculateSpeeds}>Calculate</button>

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
