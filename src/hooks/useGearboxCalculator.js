import { useState, useEffect, useCallback } from 'react';
import { getCarBrands, getGearboxesByBrand } from '../services/gearboxes';

export const useGearboxCalculator = () => {
  const [carBrands, setCarBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [gearboxes, setGearboxes] = useState([]);
  const [selectedGearboxName, setSelectedGearboxName] = useState('');
  const [selectedGearbox, setSelectedGearbox] = useState({});
  const [chartData, setChartData] = useState({ data: [], maxSpeed: 0 });
  const [userInput, setUserInput] = useState({
    tyreWidth: '205',
    tyreProfile: '50',
    wheelDiameter: '15',
    maxRpm: '7500'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch car brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await getCarBrands();
        if (data) {
          setCarBrands(data);
        }
      } catch (err) {
        setError('Failed to load car brands');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Fetch gearboxes when selectedBrand changes
  useEffect(() => {
    const fetchGearboxes = async () => {
      if (!selectedBrand) {
        setGearboxes([]);
        return;
      }
      try {
        setLoading(true);
        const data = await getGearboxesByBrand(selectedBrand);
        if (data) {
          setGearboxes(data);
        }
      } catch (err) {
        setError('Failed to load gearboxes');
        console.error('Error fetching gearboxes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGearboxes();
  }, [selectedBrand]);

  // Handlers as useCallback for better performance
  const handleBrandChange = useCallback((event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedGearboxName('');
    setSelectedGearbox({});
    setChartData({ data: [], maxSpeed: 0 });
  }, []);

  const handleGearboxChange = useCallback((event) => {
    const name = event.target.value;
    setSelectedGearboxName(name);
    const selected = gearboxes.find(g => g.name === name);
    if (selected) {
      const cleanedGearbox = {
        name: selected.name,
        finalDrive: selected.finalDrive,
        finalDrive2: selected.finalDrive2,
        finalDrivePattern: selected.finalDrivePattern || '1,1,1,1,1,1,1',
      };
      for (let i = 1; i <= 7; i++) {
        const gearValue = selected[`gear${i}`];
        cleanedGearbox[`gear${i}`] = gearValue !== undefined && gearValue !== null ? gearValue : 0;
      }
      setSelectedGearbox(cleanedGearbox);
    } else {
      setSelectedGearbox({});
    }
    setChartData({ data: [], maxSpeed: 0 });
  }, [gearboxes]);

  const handleInputChange = useCallback((field, value) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGearRatioChange = useCallback((gearNumber, value) => {
    if (selectedGearbox) {
      const newGearbox = { ...selectedGearbox };
      newGearbox[`gear${gearNumber}`] = value === '' ? 0 : value;
      setSelectedGearbox(newGearbox);
      setChartData({ data: [], maxSpeed: 0 });
    }
  }, [selectedGearbox]);

  const handleFinalDriveChange = useCallback((value) => {
    if (selectedGearbox) {
      const newGearbox = { ...selectedGearbox };
      newGearbox.finalDrive = parseFloat(value) || 0;
      setSelectedGearbox(newGearbox);
      setChartData({ data: [], maxSpeed: 0 });
    }
  }, [selectedGearbox]);

  const handleFinalDrive2Change = useCallback((value) => {
    if (selectedGearbox) {
      const newGearbox = { ...selectedGearbox };
      newGearbox.finalDrive2 = parseFloat(value) || 0;
      setSelectedGearbox(newGearbox);
      setChartData({ data: [], maxSpeed: 0 });
    }
  }, [selectedGearbox]);

  const handlePatternChange = useCallback((gearNumber, value) => {
    if (selectedGearbox) {
      const patternArr = selectedGearbox.finalDrivePattern
        ? selectedGearbox.finalDrivePattern.split(',')
        : ['1','1','1','1','1','1','1'];
      patternArr[gearNumber - 1] = value;
      const newPattern = patternArr.join(',');
      setSelectedGearbox({ ...selectedGearbox, finalDrivePattern: newPattern });
      setChartData({ data: [], maxSpeed: 0 });
    }
  }, [selectedGearbox]);

  // Calculate speeds by calling backend API
  const calculateSpeeds = useCallback(async () => {
    if (!selectedGearbox.name) {
      setError('No gearbox selected');
      return;
    }
    try {
      setLoading(true);
      // Prepare finalDrive2 and pattern
      const hasFinalDrive2 = !!selectedGearbox.finalDrive2 && selectedGearbox.finalDrive2 !== '' && selectedGearbox.finalDrive2 !== 0;
      let finalDrivePattern = selectedGearbox.finalDrivePattern || '1,1,1,1,1,1,1';
      if (!hasFinalDrive2) {
        finalDrivePattern = '1,1,1,1,1,1,1';
      }
      const payload = {
        maxRpm: parseInt(userInput.maxRpm),
        gearRatio1: parseFloat(selectedGearbox.gear1) || 0,
        gearRatio2: parseFloat(selectedGearbox.gear2) || 0,
        gearRatio3: parseFloat(selectedGearbox.gear3) || 0,
        gearRatio4: parseFloat(selectedGearbox.gear4) || 0,
        gearRatio5: parseFloat(selectedGearbox.gear5) || 0,
        gearRatio6: parseFloat(selectedGearbox.gear6) || 0,
        gearRatio7: parseFloat(selectedGearbox.gear7) || 0,
        finalDrive: parseFloat(selectedGearbox.finalDrive) || 0,
        finalDrivePattern,
        finalDrive2: hasFinalDrive2 ? parseFloat(selectedGearbox.finalDrive2) : null,
        tyreWidth: parseInt(userInput.tyreWidth),
        tyreProfile: parseInt(userInput.tyreProfile),
        wheelDiameter: parseInt(userInput.wheelDiameter)
      };
      const response = await fetch('http://localhost:8081/api/v1/gearbox/calculateSpeeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Failed to calculate speeds');
      }
      const data = await response.json();
      const chartPoints = [];
      const rpms = Object.keys(data).map(Number).sort((a, b) => a - b);
      let maxSpeed = 0;
      rpms.forEach(rpm => {
        const gearSpeeds = data[rpm];
        Object.entries(gearSpeeds).forEach(([gear, speed]) => {
          if (speed > 0) {
            const gearNumber = parseInt(gear.replace('gear', ''));
            chartPoints.push({
              gear: gearNumber,
              rpm,
              speed
            });
            maxSpeed = Math.max(maxSpeed, speed);
          }
        });
      });
      setChartData({
        data: chartPoints,
        maxSpeed: Math.ceil(maxSpeed)
      });
      setError(null);
    } catch (err) {
      setError('Failed to calculate speeds');
      console.error('Error calculating speeds:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedGearbox, userInput]);

  return {
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
    handleGearRatioChange,
    handleFinalDriveChange,
    handleFinalDrive2Change,
    handlePatternChange,
    calculateSpeeds
  };
};
