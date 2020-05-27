import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { View, Button, Dimensions } from 'react-native';

import { useHue, HueLight, HuePatternFrame, HuePattern } from '../providers/hue';
import { DiscoFloor } from '../components/disco-floor';
import { LightMap } from '../components/light-map';

const gridWidth = 5;
const gridHeight = 1;

export const DiscoScreen: React.FC = () => {
	const hue = useHue();
	const height = useMemo(() => Dimensions.get('window').width / gridWidth, []);
	const lightGrid = useRef<{ [key: number]: number }>({}).current;
	const loopId = useRef<number | undefined>();
	const [frame, setFrame] = useState<HuePatternFrame>(hue.pattern.getFrame());

	const onLightChange = useCallback((light: HueLight, position: number) => {
		lightGrid[light.lampIndex] = position;
		hue.sdk.setFrameState(light, frame[position]);
	}, [frame]);

	const onNextFrame = useCallback(() => {
		const frame = hue.pattern.nextFrame();

		hue.lights.forEach(light => {
			const frameCursor = lightGrid[light.lampIndex];
			if (frameCursor || frameCursor === 0) {
				hue.sdk.setFrameState(light, frame[frameCursor], true);
			}
		});

		setFrame(frame);
	}, [hue]);

	const startAnimation = useCallback(() => {
		window.clearInterval(loopId.current);
		loopId.current = window.setInterval(
			onNextFrame,
			hue.pattern.getTransitionSpeed(),
		);
	}, [onNextFrame]);

	const stopAnimation = useCallback(() => {
		window.clearInterval(loopId.current);
		loopId.current = undefined;
	}, []);

	const setPattern = useCallback((pattern: HuePattern) => {
		hue.setPattern(pattern);
		setFrame(pattern.getFrame());
	}, []);

	useEffect(() => {
		hue.lights.forEach((light, key) => onLightChange(light, key));
	});

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<DiscoFloor
				width={gridWidth}
				height={gridHeight}
				tileColors={frame}
				tileEmptyColor='transparent'
			>
				<LightMap
					width={gridWidth}
					height={gridHeight}
					tileSize={height}
					lights={hue.lights}
					onChange={onLightChange}
					onIdentify={light => hue.sdk.flash(light.lampIndex)}
				/>
			</DiscoFloor>
			<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 56 }}>
				<Button title='expo' onPress={() => setPattern(HuePattern.getWave())} />
				<Button title='kr' onPress={() => setPattern(HuePattern.getKnightRider())} />
				<Button title='complex' onPress={() => setPattern(HuePattern.getComplex())} />
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 56 }}>
				<Button title='next' onPress={onNextFrame} />
				<Button title='start' onPress={startAnimation} />
				<Button title='stop' onPress={stopAnimation} />
			</View>
		</View>
	);
};
