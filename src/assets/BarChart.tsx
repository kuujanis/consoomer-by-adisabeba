import React from 'react';

type Palette = [number, string][];
interface BarChartProps {
  palette: Palette;
  width?: number;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ palette, width = 300, height = 200 }) => {
  const maxValue = Math.max(...palette.map(([value]) => value));

  return (
    <div style={{ width, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      {palette.map(([value, color], index) => {
        const barHeight = (value / maxValue) * height;

        return (
          <div key={index} style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                height: barHeight,
                backgroundColor: color,
                transition: 'height 0.3s',
                borderRadius: 4
              }}
              title={`Value: ${value}`}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>{value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;