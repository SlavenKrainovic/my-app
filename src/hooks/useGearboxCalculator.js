import { useState, useEffect } from 'react';
import { getCarBrands, getGearboxesByBrand } from '../services/gearboxes';

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
      setTableData([]);
    }
  };

  const calculateSpeeds = async () => {
    if (!selectedGearbox.name) {
      setError('No gearbox selected');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/gearbox/calculateSpeeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxRpm: parseInt(userInput.maxRpm),
          gearRatio1: selectedGearbox.gear1 || 0,
          gearRatio2: selectedGearbox.gear2 || 0,
          gearRatio3: selectedGearbox.gear3 || 0,
          gearRatio4: selectedGearbox.gear4 || 0,
          gearRatio5: selectedGearbox.gear5 || 0,
          gearRatio6: selectedGearbox.gear6 || 0,
          gearRatio7: selectedGearbox.gear7 || 0,
          finalDrive: selectedGearbox.finalDrive,
          tyreWidth: parseInt(userInput.tyreWidth),
          tyreProfile: parseInt(userInput.tyreProfile),
          wheelDiameter: parseInt(userInput.wheelDiameter)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate speeds');
      }

      const data = await response.json();
      
      // Transform the API response for chart and table
      const chartPoints = [];
      const tableRows = {};
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

            if (!tableRows[rpm]) {
              tableRows[rpm] = { rpm };
            }
            tableRows[rpm][`gear${gearNumber}`] = speed;
            
            maxSpeed = Math.max(maxSpeed, speed);
          }
        });
      });

      setChartData({
        data: chartPoints,
        maxSpeed: Math.ceil(maxSpeed)
      });
      setTableData(Object.values(tableRows).sort((a, b) => a.rpm - b.rpm));
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
