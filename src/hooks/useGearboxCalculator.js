import { useState, useEffect } from 'react';
import { getCarBrands, getGearboxesByBrand } from '../services/gearboxes';

const calculateSpeed = (rpm, gearRatio, finalDrive, tyreWidth, tyreProfile, wheelDiameter) => {
  // Convert inputs to numbers and handle invalid values
  rpm = Number(rpm);
  gearRatio = Number(gearRatio);
  finalDrive = Number(finalDrive);
  tyreWidth = Number(tyreWidth);
  tyreProfile = Number(tyreProfile);
  wheelDiameter = Number(wheelDiameter);

  // Basic validation
  if ([rpm, gearRatio, finalDrive, tyreWidth, tyreProfile, wheelDiameter].some(val => !val || isNaN(val))) {
    return 0;
  }

  // Calculate tire circumference in meters
  const tireHeight = (tyreWidth * tyreProfile / 100) * 2 + (wheelDiameter * 25.4);
  const tireCircumference = (tireHeight * Math.PI) / 1000;

  // Calculate wheel RPM
  const wheelRpm = rpm / (gearRatio * finalDrive);

  // Calculate speed in MPH (converted from km/h)
  const speedKmh = (wheelRpm * tireCircumference * 60) / 1000;
  return speedKmh * 0.621371; // Convert to MPH
};

export const useGearboxCalculator = () => {
  const [carBrands, setCarBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [gearboxes, setGearboxes] = useState([]);
  const [selectedGearboxName, setSelectedGearboxName] = useState('');
  const [selectedGearbox, setSelectedGearbox] = useState({});
  const [chartData, setChartData] = useState({ data: [], maxSpeed: 0 });
  const [tableData, setTableData] = useState([]); 
  const [userInput, setUserInput] = useState({
    tyreWidth: '205',
    tyreProfile: '50',
    wheelDiameter: '15',
    maxRpm: '7500'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedGearboxName('');
    setSelectedGearbox({});
    setChartData({ data: [], maxSpeed: 0 });
    setTableData([]); 
  };

  const handleGearboxChange = (event) => {
    const name = event.target.value;
    setSelectedGearboxName(name);
    const selected = gearboxes.find(g => g.name === name);
    if (selected) {
      const cleanedGearbox = {
        name: selected.name,
        finalDrive: selected.finalDrive,
      };
      
      for (let i = 1; i <= 7; i++) {
        const gearValue = selected[`gear${i}`];
        if (gearValue !== undefined && gearValue !== null && gearValue !== 0) {
          cleanedGearbox[`gear${i}`] = gearValue;
        }
      }
      
      setSelectedGearbox(cleanedGearbox);
    } else {
      setSelectedGearbox({});
    }
    setChartData({ data: [], maxSpeed: 0 });
    setTableData([]); 
  };

  const handleInputChange = (field, value) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGearRatioChange = (gearNumber, value) => {
    if (selectedGearbox) {
      const newGearbox = { ...selectedGearbox };
      newGearbox[`gear${gearNumber}`] = parseFloat(value) || 0;
      setSelectedGearbox(newGearbox);
      setChartData({ data: [], maxSpeed: 0 });
    }
  };

  const calculateSpeeds = () => {
    if (!selectedGearbox.name) {
      setError('No gearbox selected');
      return;
    }

    try {
      setLoading(true);
      const chartPoints = [];
      let maxSpeed = 0;

      // Calculate for each gear
      for (let gear = 1; gear <= 7; gear++) {
        const gearRatio = selectedGearbox[`gear${gear}`];
        if (!gearRatio) continue;

        // Calculate points for this gear
        for (let rpm = 2000; rpm <= parseInt(userInput.maxRpm); rpm += 100) {
          const speed = calculateSpeed(
            rpm,
            gearRatio,
            selectedGearbox.finalDrive,
            userInput.tyreWidth,
            userInput.tyreProfile,
            userInput.wheelDiameter
          );

          if (speed > 0) {
            chartPoints.push({
              gear,
              rpm,
              speed
            });
            maxSpeed = Math.max(maxSpeed, speed);
          }
        }
      }

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
  };

  return {
    carBrands,
    selectedBrand,
    gearboxes,
    selectedGearbox,
    selectedGearboxName,
    chartData,
    tableData, 
    userInput,
    loading,
    error,
    handleBrandChange,
    handleGearboxChange,
    handleInputChange,
    handleGearRatioChange,
    calculateSpeeds
  };
};
