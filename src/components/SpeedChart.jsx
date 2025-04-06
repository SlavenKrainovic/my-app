import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PropTypes from 'prop-types';

const SpeedChart = ({ chartData }) => {
  if (!chartData.data || chartData.data.length === 0) {
    return null;
  }

  // Get unique gears from the data
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
      const data = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          <p style={{ margin: '0', color: '#333', fontWeight: 600 }}>
            Gear {data.gear}
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Speed: {data.speed.toFixed(1)} km/h
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            RPM: {data.rpm}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
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
          isAnimationActive={false}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Legend verticalAlign="top" height={36} />
        {gears.map((gear) => (
          <Line
            key={gear}
            type="monotone"
            dataKey="rpm"
            data={chartData.data.filter(item => item.gear === gear)}
            name={`${gear}. brzina`}
            stroke={colors[gear]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

SpeedChart.propTypes = {
  chartData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      rpm: PropTypes.number.isRequired,
      gear: PropTypes.number.isRequired,
      speed: PropTypes.number.isRequired
    })).isRequired,
    maxSpeed: PropTypes.number.isRequired
  }).isRequired
};

export default SpeedChart;
