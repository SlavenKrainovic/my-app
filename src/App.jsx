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
    handleFinalDriveChange,
    handleFinalDrive2Change,
    handlePatternChange
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
              {/* Final Drive Ratio and Max RPM in a row, labels above each input */}
              <div className="final-drive-section">
                <h2>Gearbox configuration</h2>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <label htmlFor="finalDrive">Final Drive 1:</label>
                    <input
                      id="finalDrive"
                      step="0.001"
                      min="0"
                      max="9.999"
                      type="number"
                      value={selectedGearbox.finalDrive || ''}
                      onChange={(e) => handleFinalDriveChange(e.target.value)}
                      style={{ width: '70px' }}
                    />
                  </div>
                  {/* Final Drive 2 Box - always show, for UI/UX consistency */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <label htmlFor="finalDrive2">Final Drive 2:</label>
                    <input
                      id="finalDrive2"
                      step="0.001"
                      min="0"
                      max="9.999"
                      type="number"
                      value={selectedGearbox.finalDrive2 || ''}
                      onChange={(e) => handleFinalDrive2Change(e.target.value)}
                      style={{ width: '70px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <label htmlFor="maxRpm">Max RPM:</label>
                    <input
                      id="maxRpm"
                      placeholder="7500"
                      type="number"
                      value={userInput.maxRpm || ''}
                      name="maxRpm"
                      onChange={(e) => handleInputChange('maxRpm', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Gear Ratios */}
              <div className="gear-ratios-section">
                <h2>Gear Ratios</h2>
                <div style={{ marginTop: '-6px' }} className="ratio-grid">
                  {[1, 2, 3, 4, 5, 6, 7].map((gearNumber) => (
                    <div key={gearNumber} className="ratio-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                      <label htmlFor={`gear-${gearNumber}`} style={{ marginBottom: 4 }}>Gear {gearNumber}:</label>
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
              <div className="pattern-section">
                <div className="chip-label">
                  <h2>Final Drive Switch</h2>
                </div>
                <div className="chip-row">
                  {[1,2,3,4,5,6,7].map((gear) => {
                    const hasFinalDrive2 = !!selectedGearbox.finalDrive2 && selectedGearbox.finalDrive2 !== '' && selectedGearbox.finalDrive2 !== 0;
                    let selected = (selectedGearbox.finalDrivePattern && selectedGearbox.finalDrivePattern.split(',').length >= gear)
                      ? selectedGearbox.finalDrivePattern.split(',')[gear-1] || '1'
                      : '1';
                    // If no finalDrive2, force all to '1'
                    if (!hasFinalDrive2) selected = '1';
                    return (
                      <button
                        key={gear}
                        type="button"
                        className={`chip-btn${selected === '2' ? ' chip-btn-active' : ''}${!hasFinalDrive2 ? ' chip-btn-disabled' : ''}`}
                        onClick={() => hasFinalDrive2 && handlePatternChange(gear, selected === '1' ? '2' : '1')}
                        aria-label={`Toggle final drive for gear ${gear}`}
                        disabled={!hasFinalDrive2}
                        title={!hasFinalDrive2 ? 'Final Drive 2 not available' : ''}
                      >
                        {selected}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="wheel-config">
                <h2>Wheel Configuration</h2>
                <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="tyreWidth">Tyre Width:</label>
                    <input
                      id="tyreWidth"
                      type="number"
                      name="tyreWidth"
                      value={userInput.tyreWidth || ''}
                      onChange={(e) => handleInputChange('tyreWidth', e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="tyreProfile">Tyre Profile:</label>
                    <input
                      id="tyreProfile"
                      type="number"
                      name="tyreProfile"
                      value={userInput.tyreProfile || ''}
                      onChange={(e) => handleInputChange('tyreProfile', e.target.value)}
                    />
                  </div>
                </div>
                <label htmlFor="wheelDiameter">Wheel Diameter (inch):</label>
                <input
                  id="wheelDiameter"
                  type="number"
                  name="wheelDiameter"
                  value={userInput.wheelDiameter || ''}
                  onChange={(e) => handleInputChange('wheelDiameter', e.target.value)}
                />
                <button type="button" onClick={calculateSpeeds}>Calculate</button>

                {error && <div className="error-message">{error}</div>}
              </div>
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
