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
    tyreWidth: '',
    tyreProfile: '',
    wheelDiameter: '',
    maxRpm: ''
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
  };

  const handleGearboxChange = (event) => {
    const name = event.target.value;
    setSelectedGearboxName(name);
    const selected = gearboxes.find(g => g.name === name);
    if (selected) {
      setSelectedGearbox(selected);
    } else {
      setSelectedGearbox({});
    }
  };

  const handleInputChange = (field, value) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value
    }));
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
        Object.values(response).forEach(speeds => {
          Object.values(speeds).forEach(speed => {
            if (isFinite(Number(speed))) {
              maxSpeed = Math.max(maxSpeed, Number(speed));
            }
          });
        });

        const transformedData = Object.entries(response).map(([rpm, speeds]) => ({
          rpm: Number(rpm),
          ...Object.entries(speeds).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: (isFinite(Number(value)) ? Number(value) : null)
          }), {})
        }));

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
    calculateSpeeds
  };
};
