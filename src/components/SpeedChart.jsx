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
          backgroundColor: '#1e1e1e', 
          padding: '8px 12px',
          border: '1px solid #333',
          borderRadius: '4px',
          fontSize: '13px',
          userSelect: 'none',
          color: '#fff'
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontWeight: 500,
            borderBottom: '1px solid #333',
            paddingBottom: '4px'
          }}>
            Speed: {speed.toFixed(0)} MPH
          </p>
          {gears.map(gear => (
            <p key={gear} style={{ 
              margin: '4px 0', 
              color: gearData[gear] ? colors[gear] : '#666',
              fontWeight: 500,
              opacity: gearData[gear] ? 1 : 0.7,
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '140px'
            }}>
              <span>Gear {gear}:</span>
              <span style={{ marginLeft: '8px', fontFamily: 'monospace' }}>
                {gearData[gear] ? `${Math.round(gearData[gear]).toLocaleString()} RPM` : 'N/A'}
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
        style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          padding: '20px'
        }}
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
            value: "MPH", 
            position: "bottom", 
            style: { fill: '#999' } 
          }}
          domain={[0, 'auto']}
          tickCount={10}
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
          domain={[2000, roundedMaxRpm]}
          tickCount={8}
          stroke="#999"
          tick={{ fill: '#999' }}
          tickFormatter={value => `${(value/1000).toFixed(0)}k`}
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
            activeDot={{ 
              r: 4, 
              fill: colors[gear],
              stroke: '#fff',
              strokeWidth: 1
            }}
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
