import { useState, useEffect } from 'react';
import { getCarBrands, getGearboxesByBrand, calculateGearboxSpeeds } from '../services/gearboxes';

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

  const calculateSpeeds = async () => {
    if (!selectedGearbox.name) {
      setError('No gearbox selected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = {
        maxRpm: parseInt(userInput.maxRpm) || 0,
        finalDrive: selectedGearbox.finalDrive,
        tyreWidth: parseInt(userInput.tyreWidth) || 0,
        tyreProfile: parseInt(userInput.tyreProfile) || 0,
        wheelDiameter: parseInt(userInput.wheelDiameter) || 0,
        gearRatio1: selectedGearbox.gear1 || 0,
        gearRatio2: selectedGearbox.gear2 || 0,
        gearRatio3: selectedGearbox.gear3 || 0,
        gearRatio4: selectedGearbox.gear4 || 0,
        gearRatio5: selectedGearbox.gear5 || 0,
        gearRatio6: selectedGearbox.gear6 || 0,
        gearRatio7: selectedGearbox.gear7 || 0
      };

      console.log('Sending data to calculate:', data);
      const response = await calculateGearboxSpeeds(data);
      console.log('Received speed data:', response);
      
      if (response) {
        let maxSpeed = 0;
        const transformedData = [];

        // Get all RPM points and sort them
        const rpmPoints = Object.keys(response).map(Number).sort((a, b) => a - b);

        // Transform data for each RPM point
        rpmPoints.forEach(rpm => {
          const speeds = response[rpm];
          const dataPoint = { rpm };

          // Add speed for each gear if it exists
          for (let i = 1; i <= 7; i++) {
            const gearKey = `gear${i}`;
            const speed = speeds[gearKey];
            if (speed !== undefined && speed !== null && isFinite(Number(speed))) {
              dataPoint[gearKey] = Number(speed);
              maxSpeed = Math.max(maxSpeed, Number(speed));
            }
          }

          transformedData.push(dataPoint);
        });

        setChartData({ data: transformedData, maxSpeed });
      }
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
