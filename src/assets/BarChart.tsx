import React from 'react';

type Palette = [number, string][];
interface BarChartProps {
  properties: { [key: string]: string | number } | null;
  palette: Palette;
  name: string; // e.g., 'prod'
  width?: number;
  height?: number;
  gridLines?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  properties,
  palette,
  name,
  width = 320,
  height = 200,
  gridLines = 4
}) => {
  const midColor = palette[Math.floor(palette.length / 2)][1];
  const leftMargin = 40; // Allocate space for tick labels

  const bars = Array.from({ length: 12 }, (_, i) => {
    const key = `${(i + 1).toString().padStart(2, '0')}_${name}`;
    const raw = properties?.[key];
    const value = typeof raw === 'string' ? parseFloat(raw) : raw ?? 0;
    return { key, value: isNaN(value) ? 0 : value };
  });

  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: height + 30, // extra space for bottom labels
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '20px'
      }}
    >
      {/* Ticks and grid */}
      <div
        style={{
          width: leftMargin,
          height,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingRight: 6
        }}
      >
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const value = Math.round((maxValue * (gridLines - i)) / gridLines);
          return (
            <div key={i} style={{ fontSize: 10, color: '#666', lineHeight: 1 }}>
              {value}
            </div>
          );
        })}
      </div>

      {/* Grid lines and bars container */}
      <div style={{ position: 'relative', flex: 1 }}>
        {/* Grid lines */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height,
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: gridLines + 1 }, (_, i) => (
            <div
              key={i}
              style={{
                borderTop: '1px solid #ccc',
                width: '100%'
              }}
            />
          ))}
        </div>

        {/* Bars */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 4
          }}
        >
          {bars.map((bar, index) => {
            const barHeight = (bar.value / maxValue) * height;
            return (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: barHeight,
                    backgroundColor: midColor,
                    borderRadius: 3,
                    transition: 'height 0.3s ease'
                  }}
                  title={`${bar.key}: ${bar.value}`}
                />
                <div style={{ marginTop: 4, fontSize: 10, color: '#555' }}>
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
