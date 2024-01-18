import { useTheme } from '@ui-kitten/components';
import range from 'lodash/range';
import { useState, useCallback, useMemo, PropsWithChildren } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';

type DiscoFloorProps = PropsWithChildren<{
  /** The amount of tiles to render horizontally */
  width: number;
  /** The amount of tiles to render vertically */
  height: number;
  /** A flat array with all tile colors */
  tileColors?: (string | null)[];
  /** The "empty" color to use when tile doesn't have a color */
  tileEmptyColor?: string;
}>;

export function DiscoFloor({
  children,
  width,
  height,
  tileColors = [],
  tileEmptyColor,
}: DiscoFloorProps) {
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const totalHeight = useMemo(
    () => (containerWidth / width) * height,
    [containerWidth, width, height]
  );

  const tiles = useMemo(() => range(0, width * height), [width, height]);

  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      {tiles.map((key) => (
        <View
          key={`dance-floor-tile-${key}`}
          style={[
            styles.tile,
            {
              width: containerWidth / width,
              height: containerWidth / width,
              backgroundColor: tileColors![key] || tileEmptyColor || theme['color-basic-900'],
              borderColor: theme['color-basic-800'],
            },
          ]}
        />
      ))}
      <View style={[styles.overlay, { width: containerWidth, height: totalHeight }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overlay: {
    position: 'absolute',
  },
  tile: {
    borderRadius: 8,
    borderWidth: 1,
  },
});
