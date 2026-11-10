import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Polygon, Text as SvgText } from 'react-native-svg';

export interface ChartPlanet {
  name: string;
  house: number;
}

interface ModernVedicChartProps {
  planets: ChartPlanet[];
  lagnaSign?: number; // 1 = Mesha .. 12 = Meena
  chartStyle?: 'north' | 'south';
  size?: number;
  isDark?: boolean;
  centerLabel?: string;
}

const RASHI_NAMES_HI: Record<number, string> = {
  1: 'मेष',
  2: 'वृष',
  3: 'मिथुन',
  4: 'कर्क',
  5: 'सिंह',
  6: 'कन्या',
  7: 'तुला',
  8: 'वृश्चिक',
  9: 'धनु',
  10: 'मकर',
  11: 'कुंभ',
  12: 'मीन',
};

export const PLANET_HI_SHORT: Record<string, string> = {
  Su: 'सू',
  Mo: 'चं',
  Ma: 'मं',
  Me: 'बु',
  Ju: 'गु',
  Ve: 'शु',
  Sa: 'श',
  Ra: 'रा',
  Ke: 'के',
};

const NORTH_CENTERS: Record<number, { x: number; numY: number; plY: number; raY: number }> = {
  1: { x: 160, numY: 60, plY: 82, raY: 100 },
  2: { x: 81, numY: 22, plY: 38, raY: 53 },
  3: { x: 32, numY: 64, plY: 82, raY: 98 },
  4: { x: 81, numY: 140, plY: 162, raY: 180 },
  5: { x: 32, numY: 222, plY: 240, raY: 256 },
  6: { x: 81, numY: 274, plY: 290, raY: 305 },
  7: { x: 160, numY: 220, plY: 242, raY: 260 },
  8: { x: 239, numY: 274, plY: 290, raY: 305 },
  9: { x: 288, numY: 222, plY: 240, raY: 256 },
  10: { x: 239, numY: 140, plY: 162, raY: 180 },
  11: { x: 288, numY: 64, plY: 82, raY: 98 },
  12: { x: 239, numY: 22, plY: 38, raY: 53 },
};

// South Indian grid: Sign -> (col, row) in 4x4 grid
const SOUTH_GRID_POS: Record<number, { col: number; row: number }> = {
  12: { col: 0, row: 0 },
  1: { col: 1, row: 0 },
  2: { col: 2, row: 0 },
  3: { col: 3, row: 0 },
  4: { col: 3, row: 1 },
  5: { col: 3, row: 2 },
  6: { col: 3, row: 3 },
  7: { col: 2, row: 3 },
  8: { col: 1, row: 3 },
  9: { col: 0, row: 3 },
  10: { col: 0, row: 2 },
  11: { col: 0, row: 1 },
};

const ModernVedicChart: React.FC<ModernVedicChartProps> = ({
  planets,
  lagnaSign = 1,
  chartStyle = 'north',
  size = 310,
  isDark = false,
  centerLabel = 'जन्म कुंडली',
}) => {
  const strokeColor = isDark ? '#52525B' : '#D6CFC7';
  const bgColor = isDark ? '#1E1E1E' : '#FFFCFA';
  const numColor = isDark ? '#E5E7EB' : '#374151';
  const planetColor = isDark ? '#FCA5A5' : '#8B1D1D';
  const rashiColor = isDark ? '#9CA3AF' : '#9CA3AF';

  const getSignForHouse = (house: number) => ((lagnaSign - 1 + (house - 1)) % 12) + 1;

  const getPlanetsInHouse = (house: number) =>
    planets
      .filter((p) => p.house === house)
      .map((p) => PLANET_HI_SHORT[p.name] || p.name);

  if (chartStyle === 'south') {
    const cell = 78; // 4 * 78 = 312
    const pad = 4;
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 320 320">
          <Rect x={pad} y={pad} width={312} height={312} fill={bgColor} stroke={strokeColor} strokeWidth={1.2} />
          {/* 4x4 outer cells */}
          {Object.entries(SOUTH_GRID_POS).map(([signStr, pos]) => {
            const sign = Number(signStr);
            const x = pad + pos.col * cell;
            const y = pad + pos.row * cell;
            // House corresponding to this sign
            const house = ((sign - lagnaSign + 12) % 12) + 1;
            const pList = getPlanetsInHouse(house);
            const isLagna = sign === lagnaSign;

            return (
              <React.Fragment key={`south-${sign}`}>
                <Rect
                  x={x}
                  y={y}
                  width={cell}
                  height={cell}
                  fill={isLagna ? (isDark ? '#2B1616' : '#FFF5F5') : 'none'}
                  stroke={strokeColor}
                  strokeWidth={1}
                />
                {isLagna && (
                  <Line
                    x1={x}
                    y1={y + 14}
                    x2={x + 14}
                    y2={y}
                    stroke={planetColor}
                    strokeWidth={1.2}
                  />
                )}
                <SvgText
                  x={x + cell - 6}
                  y={y + 14}
                  textAnchor="end"
                  fontSize={10}
                  fontWeight="700"
                  fill={numColor}
                >
                  {sign}
                </SvgText>
                <SvgText
                  x={x + 6}
                  y={y + 14}
                  textAnchor="start"
                  fontSize={9.5}
                  fill={rashiColor}
                >
                  {RASHI_NAMES_HI[sign]}
                </SvgText>
                {pList.length > 0 && (
                  <SvgText
                    x={x + cell / 2}
                    y={y + cell / 2 + 6}
                    textAnchor="middle"
                    fontSize={pList.length > 2 ? 11 : 12.5}
                    fontWeight="700"
                    fill={planetColor}
                  >
                    {pList.join(' ')}
                  </SvgText>
                )}
                {isLagna && (
                  <SvgText
                    x={x + cell / 2}
                    y={y + cell - 8}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight="600"
                    fill={planetColor}
                  >
                    लग्न
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}

          {/* Center Box */}
          <Rect
            x={pad + cell}
            y={pad + cell}
            width={cell * 2}
            height={cell * 2}
            fill={bgColor}
            stroke={strokeColor}
            strokeWidth={1}
          />
          <SvgText
            x={160}
            y={154}
            textAnchor="middle"
            fontSize={18}
            fontWeight="700"
            fill={planetColor}
          >
            ॐ
          </SvgText>
          <SvgText
            x={160}
            y={174}
            textAnchor="middle"
            fontSize={11}
            fontWeight="600"
            fill={numColor}
          >
            {centerLabel}
          </SvgText>
        </Svg>
      </View>
    );
  }

  // North Indian Diamond Chart
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 320 320">
        {/* Outer Rect */}
        <Rect
          x={2}
          y={2}
          width={316}
          height={316}
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth={1.2}
        />

        {/* Diagonals */}
        <Line x1={2} y1={2} x2={318} y2={318} stroke={strokeColor} strokeWidth={1} />
        <Line x1={318} y1={2} x2={2} y2={318} stroke={strokeColor} strokeWidth={1} />

        {/* Inner Diamond */}
        <Polygon
          points="160,2 318,160 160,318 2,160"
          fill="none"
          stroke={strokeColor}
          strokeWidth={1}
        />

        {/* 12 Houses */}
        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((h) => {
          const c = NORTH_CENTERS[h];
          const sign = getSignForHouse(h);
          const pList = getPlanetsInHouse(h);
          const planetText = pList.join(' ');
          const hasPlanets = pList.length > 0;

          return (
            <React.Fragment key={`north-${h}`}>
              {/* Rashi Number */}
              <SvgText
                x={c.x}
                y={c.numY}
                textAnchor="middle"
                fontSize={11.5}
                fontWeight="700"
                fill={numColor}
              >
                {sign}
              </SvgText>

              {/* Planets in Hindi */}
              {hasPlanets && (
                <SvgText
                  x={c.x}
                  y={c.plY}
                  textAnchor="middle"
                  fontSize={pList.length > 2 ? 11 : 12.5}
                  fontWeight="700"
                  fill={planetColor}
                >
                  {planetText}
                </SvgText>
              )}

              {/* Rashi Name */}
              <SvgText
                x={c.x}
                y={hasPlanets ? c.raY : c.plY + 4}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight="500"
                fill={rashiColor}
              >
                {RASHI_NAMES_HI[sign]}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModernVedicChart;

