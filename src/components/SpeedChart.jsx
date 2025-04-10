import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";
import PropTypes from 'prop-types';
import { useState } from 'react';

const SpeedChart = ({ chartData }) => {
  const [hoverData, setHoverData] = useState(null);

  if (!chartData?.data?.length) {
    return null;
  }

  // Get unique gears and speeds
  const gears = [...new Set(chartData.data.map(item => item.gear))]
    .filter(gear => gear !== undefined)
    .sort((a, b) => a - b);

  // Get max RPM from the data
  const maxRpm = Math.max(...chartData.data.map(item => item.rpm));
  const roundedMaxRpm = Math.ceil(maxRpm / 1000) * 1000;

  // Generate colors for each gear
  const colors = {
    1: '#FF0000', // Red
    2: '#FF0000', // Red
    3: '#FF0000', // Red
    4: '#00BFFF', // Blue
    5: '#00BFFF', // Blue
    6: '#00BFFF', // Blue
    7: '#00BFFF', // Blue
  };

  const handleMouseMove = (data) => {
    if (data && data.activePayload) {
      const speed = data.activeLabel;
      const gearData = chartData.data
        .filter(item => Math.abs(item.speed - speed) < 0.1)
        .reduce((acc, item) => {
          acc[item.gear] = item.rpm;
          return acc;
        }, {});
      setHoverData({ speed, gearData });
    }
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 15,
          }}
          style={{
            backgroundColor: '#e9ecef',  // Cool Grey
            borderRadius: '15px',
            padding: '50px'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#333" 
            vertical={false}
          />
          <XAxis 
            type="number"
            dataKey="speed" 
            name="Speed"
            label={{ 
              value: "KPH", 
              position: "bottom", 
              style: { fill: '#999' } 
            }}
            domain={[0, 'auto']}
            tickCount={15}
            stroke="#999"
            tick={{ fill: '#999' }}
          />
          <YAxis 
            type="number"
            dataKey="rpm"
            name="RPM"
            label={{ 
              value: "RPM", 
              angle: -90, 
              position: "insideLeft", 
              style: { fill: '#999' } 
            }}
            domain={[0, roundedMaxRpm]}
            tickCount={15}
            stroke="#999"
            tick={{ fill: '#999' }}
            tickFormatter={value => `${(value/1000).toFixed(1)}k`}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => (
              <span style={{ 
                color: colors[parseInt(value.split(' ')[1])],
                opacity: 0.8
              }}>
                {value}
              </span>
            )}
          />
          {gears.map(gear => (
            <Line
              key={gear}
              type="monotone"
              data={chartData.data.filter(d => d.gear === gear)}
              dataKey="rpm"
              name={`Gear ${gear}`}
              stroke={colors[gear]}
              strokeWidth={2}
              dot={false}
              activeDot={false}
              connectNulls={true}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {hoverData && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          color: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontWeight: 500,
            minWidth: '120px'
          }}>
            Speed: {hoverData.speed.toFixed(0)} KPH
          </div>
          {gears.map(gear => (
            <div key={gear} style={{ 
              color: hoverData.gearData[gear] ? colors[gear] : '#666',
              opacity: hoverData.gearData[gear] ? 1 : 0.7,
              fontWeight: 500,
              minWidth: '140px'
            }}>
              Gear {gear}: {hoverData.gearData[gear] ? 
                `${Math.round(hoverData.gearData[gear]).toLocaleString()} RPM` : 
                'N/A'
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SpeedChart.propTypes = {
  chartData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      gear: PropTypes.number.isRequired,
      speed: PropTypes.number.isRequired,
      rpm: PropTypes.number.isRequired
    })).isRequired,
    maxSpeed: PropTypes.number.isRequired
  }).isRequired
};

export default SpeedChart;
