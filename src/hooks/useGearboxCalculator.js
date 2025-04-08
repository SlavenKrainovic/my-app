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
  const [tableData, setTableData] = useState([]); 
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
    setTableData([]); 
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
      
      // Transform the data for the chart and table
      const chartPoints = [];
      const tableRows = {};
      const speeds = Object.keys(data).map(Number).sort((a, b) => a - b);
      let maxSpeed = 0;

      speeds.forEach(speed => {
        const gearData = data[speed];
        Object.entries(gearData).forEach(([gear, rpm]) => {
          if (rpm > 0) {
            const gearNumber = parseInt(gear.replace('gear', ''));
            
            // Add point to chart data
            chartPoints.push({
              gear: gearNumber,
              rpm: rpm,
              speed: parseFloat(speed)
            });

            // Add data to table structure
            if (!tableRows[speed]) {
              tableRows[speed] = { speed };
            }
            tableRows[speed][`gear${gearNumber}`] = rpm;
            
            maxSpeed = Math.max(maxSpeed, parseFloat(speed));
          }
        });
      });

      // Convert table data to array format
      const tableData = Object.values(tableRows).sort((a, b) => a.speed - b.speed);

      setChartData({
        data: chartPoints,
        maxSpeed: Math.ceil(maxSpeed)
      });
      setTableData(tableData);
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
