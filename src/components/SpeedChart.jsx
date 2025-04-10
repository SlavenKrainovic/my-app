import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import PropTypes from 'prop-types';
import { useState } from 'react';

const SpeedChart = ({ chartData }) => {
  const [hoverData, setHoverData] = useState(null);

  if (!chartData?.data?.length) {
    return null;
  }

  const gears = [...new Set(chartData.data.map(item => item.gear))]
    .filter(gear => gear !== undefined)
    .sort((a, b) => a - b);

  const maxRpm = Math.max(...chartData.data.map(item => item.rpm));
  const roundedMaxRpm = Math.ceil(maxRpm / 1000) * 1000;

  const colors = {
    1: '#ff0059',   // Neon pink
    2: '#00ffe1',   // Cyan
    3: '#ffe600',   // Yellow
    4: '#00ff00',   // Green
    5: '#ff8000',   // Orange
    6: '#0044ff',   // Blue
    7: '#b200ff',   // Purple
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
    <div style={{
      background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      color: "#fff",
      fontFamily: "'Orbitron', sans-serif"
    }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 15 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            type="number"
            dataKey="speed"
            label={{ value: "KPH", position: "bottom", fill: '#fff', fontSize: 12 }}
            domain={[0, 'auto']}
            tick={{ fill: '#aaa', fontSize: 12 }}
            stroke="#888"
          />
          <YAxis
            type="number"
            dataKey="rpm"
            label={{ value: "RPM", angle: -90, position: "insideLeft", fill: '#fff', fontSize: 12 }}
            domain={[0, roundedMaxRpm]}
            tick={{ fill: '#aaa', fontSize: 12 }}
            tickFormatter={value => value.toLocaleString()}
            stroke="#888"
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{value}</span>
            )}
          />
          <Tooltip cursor={{ stroke: '#ccc', strokeWidth: 1 }} content={() => null} />
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
          padding: '16px',
          backgroundColor: '#111',
          borderRadius: '12px',
          color: '#0ff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          border: '1px solid #222'
        }}>
          <div style={{ fontWeight: 'bold', minWidth: '120px' }}>
            Speed: {hoverData.speed.toFixed(0)} KPH
          </div>
          {gears.map(gear => (
            <div key={gear} style={{
              color: hoverData.gearData[gear] ? colors[gear] : '#666',
              fontWeight: 'bold',
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
