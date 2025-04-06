import Box from '@mui/material/Box';
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
  console.log('Chart received data:', chartData);

  if (!chartData.data || chartData.data.length === 0) {
    return null;
  }

  return (
    <Box sx={{ height: 400, mb: 4 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData.data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="rpm"
            type="number"
            domain={[0, 'dataMax']}
            label={{ value: "RPM", position: "insideBottomRight", offset: 0 }}
          />
          <YAxis
            unit="km/h"
            domain={[0, Math.ceil(chartData.maxSpeed)]}
            label={{ value: "Speed (km/h)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          {['gear1', 'gear2', 'gear3', 'gear4', 'gear5', 'gear6', 'gear7'].map((gear, index) => (
            <Line
              key={gear}
              type="monotone"
              dataKey={gear}
              name={`Gear ${gear.slice(-1)}`}
              stroke={COLORS[index % COLORS.length]}
              dot={false}
              connectNulls={true}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
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
