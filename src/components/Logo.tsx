import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

type LogoProps = {
  size?: number;
};

export const Logo: React.FC<LogoProps> = ({ size = 120 }) => {
  const width = size * 1.52;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height: size,
        },
      ]}
    >
      <Svg width={width} height={size} viewBox="80 230 850 570">
        <G opacity={0.24}>
          <Path
            d="M156 320L544 708"
            stroke="#12D8E6"
            strokeWidth="110"
            strokeLinecap="square"
          />
          <Path
            d="M544 320L156 708"
            stroke="#12D8E6"
            strokeWidth="110"
            strokeLinecap="square"
          />
          <Circle cx="680" cy="512" r="178" stroke="#F72D9B" strokeWidth="92" />
        </G>

        <G opacity={0.42}>
          <Path
            d="M156 320L544 708"
            stroke="#12D8E6"
            strokeWidth="88"
            strokeLinecap="square"
          />
          <Path
            d="M544 320L156 708"
            stroke="#12D8E6"
            strokeWidth="88"
            strokeLinecap="square"
          />
          <Circle cx="680" cy="512" r="178" stroke="#F72D9B" strokeWidth="76" />
        </G>

        <G>
          <Path
            d="M156 320L544 708"
            stroke="#12D8E6"
            strokeWidth="72"
            strokeLinecap="square"
          />
          <Path
            d="M544 320L156 708"
            stroke="#12D8E6"
            strokeWidth="72"
            strokeLinecap="square"
          />
          <Circle cx="680" cy="512" r="178" stroke="#F72D9B" strokeWidth="56" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
