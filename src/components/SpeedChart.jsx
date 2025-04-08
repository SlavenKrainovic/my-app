import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import PropTypes from 'prop-types';

const SpeedChart = ({ chartData }) => {
  if (!chartData?.data?.length) {
    return null;
  }

  // Get unique gears and speeds
  const gears = [...new Set(chartData.data.map(item => item.gear))]
    .filter(gear => gear !== undefined)
    .sort((a, b) => a - b);

  // Get max RPM from the data
  const maxRpm = Math.max(...chartData.data.map(item => item.rpm));

  // Generate colors for each gear
  const colors = {
    1: '#FF4136', // Red
    2: '#FF851B', // Orange
    3: '#FFDC00', // Yellow
    4: '#2ECC40', // Green
    5: '#0074D9', // Blue
    6: '#B10DC9', // Purple
    7: '#85144b', // Maroon
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Get all gear data at this speed point
      const speed = label;
      const gearData = chartData.data
        .filter(item => Math.abs(item.speed - speed) < 0.1)
        .reduce((acc, item) => {
          acc[item.gear] = item.rpm;
          return acc;
        }, {});

      return (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '13px',
          userSelect: 'none'
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            color: '#333', 
            fontWeight: 600,
            borderBottom: '1px solid #eee',
            paddingBottom: '4px'
          }}>
            Speed: {speed.toFixed(1)} km/h
          </p>
          {gears.map(gear => (
            <p key={gear} style={{ 
              margin: '4px 0', 
              color: gearData[gear] ? colors[gear] : '#999',
              fontWeight: 500,
              opacity: gearData[gear] ? 1 : 0.7,
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '140px'
            }}>
              <span>Gear {gear}:</span>
              <span style={{ marginLeft: '8px' }}>
                {gearData[gear] ? `${gearData[gear].toLocaleString()} RPM` : 'N/A'}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
        <XAxis 
          type="number"
          dataKey="speed" 
          name="Speed"
          label={{ value: "Speed (km/h)", position: "bottom" }}
          domain={[0, 'auto']}
          tickCount={10}
        />
        <YAxis 
          type="number"
          dataKey="rpm"
          name="RPM"
          label={{ value: "RPM", angle: -90, position: "insideLeft" }}
          domain={[0, maxRpm]}
          tickCount={8}
        />
        <Tooltip 
          content={<CustomTooltip />}
          cursor={{ 
            stroke: '#666',
            strokeWidth: 1,
            strokeDasharray: '4 4'
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          formatter={(value) => <span style={{ color: colors[parseInt(value.split(' ')[1])] }}>{value}</span>}
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
            activeDot={{ r: 4 }}
            connectNulls={true}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
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
