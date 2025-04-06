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

const COLORS = [
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#8c564b', // brown
  '#e377c2', // pink
];

const SpeedChart = ({ chartData }) => {
  if (!chartData.data || chartData.data.length === 0) {
    return null;
  }

  // Get a sample data point to see which gears are present
  const samplePoint = chartData.data[0];
  const availableGears = Object.keys(samplePoint)
    .filter(key => key.startsWith('gear'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('gear', ''));
      const numB = parseInt(b.replace('gear', ''));
      return numA - numB;
    });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={chartData.data}
        margin={{
          top: 20,
          right: 30,
          bottom: 20,
          left: 30,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="rpm"
          type="number"
          domain={[0, 'dataMax']}
          label={{ value: "RPM", position: "bottom", offset: 0 }}
        />
        <YAxis
          unit="km/h"
          domain={[0, Math.ceil(chartData.maxSpeed / 10) * 10]}
          label={{ value: "Speed (km/h)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip 
          formatter={(value) => value.toFixed(1) + " km/h"}
          labelFormatter={(value) => value.toFixed(0) + " RPM"}
        />
        <Legend verticalAlign="top" height={36} />
        {availableGears.map((gear, index) => (
          <Line
            key={gear}
            type="monotone"
            dataKey={gear}
            name={`${index + 1}. Gear`}
            stroke={COLORS[index]}
            dot={false}
            strokeWidth={2}
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
      gear1: PropTypes.number,
      gear2: PropTypes.number,
      gear3: PropTypes.number,
      gear4: PropTypes.number,
      gear5: PropTypes.number,
      gear6: PropTypes.number,
      gear7: PropTypes.number
    })).isRequired,
    maxSpeed: PropTypes.number.isRequired
  }).isRequired
};

export default SpeedChart;
