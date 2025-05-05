import React, { useState } from 'react';
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
    1: 'rgba(0, 113, 227, 0.8)',   // Apple Blue
    2: 'rgba(48, 209, 88, 0.8)',    // Apple Green
    3: 'rgba(255, 159, 10, 0.8)',   // Apple Orange
    4: 'rgba(255, 69, 58, 0.8)',    // Apple Red
    5: 'rgba(191, 90, 242, 0.8)',   // Apple Purple
    6: 'rgba(0, 199, 190, 0.8)',    // Apple Teal
    7: 'rgba(94, 92, 230, 0.8)',    // Apple Indigo
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
            borderRadius: '20px',
            padding: '24px'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.2)"
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="speed"
            name="Speed"
            label={{
              value: "KPH",
              position: "bottom",
              style: {
                fill: '#86868b',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: '13px'
              }
            }}
            domain={[0, 'auto']}
            tickCount={15}
            stroke="#86868b"
            tick={{
              fill: '#86868b',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
              fontSize: '12px'
            }}
          />
          <YAxis
            type="number"
            dataKey="rpm"
            name="RPM"
            label={{
              value: "RPM",
              angle: -90,
              position: "insideLeft",
              style: {
                fill: '#86868b',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: '13px'
              }
            }}
            domain={[0, roundedMaxRpm]}
            tickCount={15}
            stroke="#86868b"
            tick={{
              fill: '#86868b',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
              fontSize: '12px'
            }}
            tickFormatter={value => value.toLocaleString()}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{
                color: colors[parseInt(value.split(' ')[1])],
                opacity: 1,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {value}
              </span>
            )}
          />
          <Tooltip
            cursor={{
              stroke: '#666',
              strokeWidth: 1,
              strokeDasharray: '4 4'
            }}
            content={() => null} // Hide tooltip content
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
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{
            fontWeight: 500,
            minWidth: '120px',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            fontSize: '13px'
          }}>
            <h3>Speed: {hoverData.speed.toFixed(0)} KPH</h3>
          </div>
          <div style={{
            display: 'block',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            width: '100%',
            paddingBottom: '2px'
          }}>
            {gears.map(gear => (
              <div key={gear} style={{
                display: 'inline-block',
                color: hoverData.gearData[gear] ? colors[gear].replace('0.8', '1') : '#86868b',
                opacity: hoverData.gearData[gear] ? 1 : 0.7,
                fontWeight: 500,
                minWidth: '90px',
                marginRight: '10px',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: '13px',
                verticalAlign: 'top'
              }}>
                Gear {gear}: {hoverData.gearData[gear] ?
                  `${Math.round(hoverData.gearData[gear]).toLocaleString()} RPM` :
                  'N/A'
                }
              </div>
            ))}
          </div>
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
