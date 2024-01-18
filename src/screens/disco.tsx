import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { Layout, Button } from '@ui-kitten/components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { DiscoFloor } from '../components/disco-floor';
import { LightMap } from '../components/light-map';
import { Message } from '../components/message';
import { Screen } from '../components/screen';
import { useHue, HueLight, type HuePatternFrame } from '../providers/hue';
import { type RootStackParamList } from '../providers/navigation';

const gridWidth = 5;
const gridHeight = 1;

type NavigationProp = StackNavigationProp<RootStackParamList, 'Disco'>;

export function DiscoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const hue = useHue();
  const lightGrid = useRef<{ [key: number]: number }>({}).current;
  const loopId = useRef<number | undefined>();
  const [isLooping, setIsLooping] = useState(false);
  const [frame, setFrame] = useState<HuePatternFrame>(hue.pattern.getFrame());
  const [floorWidth, setFloorWidth] = useState(0);

  const onFloorLayout = useCallback((event: LayoutChangeEvent) => {
    setFloorWidth(event.nativeEvent.layout.width);
  }, []);

  const onStartOver = useCallback(() => {
    navigation.navigate('SetupLights');
  }, []);

  const onLightChange = useCallback(
    (light: HueLight, position: number) => {
      lightGrid[light.lampIndex] = position;
      hue.sdk.setFrameState(light, frame[position]);
    },
    [frame]
  );

  const onNextFrame = useCallback(() => {
    const frame = hue.pattern.nextFrame();

    hue.lights.forEach((light) => {
      const frameCursor = lightGrid[light.lampIndex];
      if (frameCursor || frameCursor === 0) {
        hue.sdk.setFrameState(light, frame[frameCursor], true);
      }
    });

    setFrame(frame);
  }, [hue]);

  const onStartLoop = useCallback(() => {
    window.clearInterval(loopId.current);
    setIsLooping(true);
    loopId.current = window.setInterval(onNextFrame, hue.pattern.getTransitionSpeed());
  }, [onNextFrame]);

  const onStopLoop = useCallback(() => {
    window.clearInterval(loopId.current);
    setIsLooping(false);
    loopId.current = undefined;
  }, []);

  useEffect(() => {
    hue.lights.forEach((light) => onLightChange(light, 0));
  }, []);

  return (
    <Screen>
      <Layout style={styles.container}>
        <Message
          title="Enjoy!"
          message="Move your lights onto the disco floor, and see magic happen!"
        />
        <View
          onLayout={onFloorLayout}
          style={[styles.floor, { height: (floorWidth / gridWidth) * gridHeight }]}
        >
          <DiscoFloor width={gridWidth} height={gridHeight} tileColors={frame}>
            <LightMap
              width={gridWidth}
              height={gridHeight}
              tileSize={floorWidth / gridWidth}
              lights={hue.lights}
              onChange={onLightChange}
              onIdentify={(light) => hue.sdk.flash(light.lampIndex)}
            />
          </DiscoFloor>
        </View>
        <Layout style={styles.menu}>
          <Button
            onPress={onStartOver}
            status="secondary"
            accessoryLeft={() => <MaterialIcons name="navigate-before" color="white" size={24} />}
          >
            Reset
          </Button>
          <Layout>
            {isLooping && (
              <Button
                onPress={onStopLoop}
                accessoryRight={() => <MaterialIcons name="pause" color="white" size={24} />}
              />
            )}
            {!isLooping && (
              <Button
                onPress={onStartLoop}
                accessoryRight={() => <MaterialIcons name="play-arrow" color="white" size={24} />}
              />
            )}
          </Layout>
          <Button
            onPress={onNextFrame}
            status="secondary"
            accessoryRight={() => <MaterialIcons name="navigate-next" color="white" size={24} />}
          >
            Next
          </Button>
        </Layout>
      </Layout>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    margin: 16,
    maxWidth: '80%',
  },
  heading: {
    textAlign: 'center',
  },
  floor: {
    width: '80%',
    margin: 16,
  },
  menu: {
    margin: 32,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
