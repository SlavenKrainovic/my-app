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

  // Calculate speed in km/h
  const speedKmh = (wheelRpm * tireCircumference * 60) / 1000;

  return speedKmh;
};

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

  // Fetch car brands on component mount
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

  // Fetch gearboxes when brand changes
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
  };

  const handleGearboxChange = (event) => {
    const name = event.target.value;
    setSelectedGearboxName(name);
    const selected = gearboxes.find(g => g.name === name);
    if (selected) {
      // Clean up the gearbox data to remove undefined/null/0 gears
      const cleanedGearbox = {
        name: selected.name,
        finalDrive: selected.finalDrive,
      };
      
      // Only include gears that exist and have values
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
      setChartData({ data: [], maxSpeed: 0 }); // Reset chart when ratios change
    }
  };

  const calculateSpeeds = () => {
    if (!selectedGearbox.name) {
      setError('No gearbox selected');
      return;
    }

    const maxRpm = parseFloat(userInput.maxRpm);
    const rpmStep = 50;
    const allData = [];
    let maxSpeed = 0;

    // Calculate for each gear
    for (let i = 1; i <= 7; i++) {
      const gearRatio = selectedGearbox[`gear${i}`];
      if (!gearRatio) continue;

      // Calculate multiple points for smooth lines
      for (let rpm = 0; rpm <= maxRpm; rpm += rpmStep) {
        const speed = calculateSpeed(
          rpm,
          gearRatio,
          selectedGearbox.finalDrive,
          userInput.tyreWidth,
          userInput.tyreProfile,
          userInput.wheelDiameter
        );

        if (speed > 0) {
          allData.push({
            gear: i,
            rpm: Math.round(rpm),
            speed: parseFloat(speed.toFixed(1))
          });
          maxSpeed = Math.max(maxSpeed, speed);
        }
      }
    }

    setChartData({
      data: allData.sort((a, b) => a.speed - b.speed),
      maxSpeed: Math.ceil(maxSpeed)
    });
  };

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
    calculateSpeeds
  };
};
