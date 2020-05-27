import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { Text, Layout, Button } from '@ui-kitten/components';

import { useHue, HueLight, HuePatternFrame } from '../providers/hue';
import { DiscoFloor } from '../components/disco-floor';
import { LightMap } from '../components/light-map';
import { Screen } from '../components/screen';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const gridWidth = 5;
const gridHeight = 1;

export const DiscoScreen: React.FC = () => {
	const navigation = useNavigation();
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

	const onStartLoop = useCallback(() => {
		window.clearInterval(loopId.current);
		setIsLooping(true);
		loopId.current = window.setInterval(
			onNextFrame,
			hue.pattern.getTransitionSpeed(),
		);
	}, [onNextFrame]);

	const onStopLoop = useCallback(() => {
		window.clearInterval(loopId.current);
		setIsLooping(false);
		loopId.current = undefined;
	}, []);

	return (
		<Screen>
			<Layout style={styles.container}>
				<View style={styles.wrapper}>
					<Text category='h1' style={styles.heading}>Enjoy!</Text>
					<Text category='p1'>Move your lights onto the disco floor, and see magic happen!</Text>
				</View>
				<View
					onLayout={onFloorLayout}
					style={[styles.floor, { height: (floorWidth / gridWidth) * gridHeight }]}
				>
					<DiscoFloor
						width={gridWidth}
						height={gridHeight}
						tileColors={frame}
					>
						<LightMap
							width={gridWidth}
							height={gridHeight}
							tileSize={floorWidth / gridWidth}
							lights={hue.lights}
							onChange={onLightChange}
							onIdentify={light => hue.sdk.flash(light.lampIndex)}
						/>
					</DiscoFloor>
				</View>
				<Layout style={styles.menu}>
					<View style={styles.menuItem}>
						<Button
							onPress={onStartOver}
							status='secondary'
							accessoryLeft={() => (
								<MaterialIcons name='navigate-before' color='white' size={24} />
							)}
						>
							Start over
						</Button>
					</View>
					<View style={[styles.menuItem, { paddingHorizontal: 32 }]}>
						{isLooping && (
							<Button
								onPress={onStopLoop}
								accessoryRight={() => (
									<MaterialIcons name='pause' color='white' size={24} />
								)}
							>
								Pause
							</Button>
						)}
						{!isLooping && (
							<Button
								onPress={onStartLoop}
								accessoryRight={() => (
									<MaterialIcons name='play-arrow' color='white' size={24} />
								)}
							>
								Play
							</Button>
						)}
					</View>
					<View style={styles.menuItem}>
						<Button
							onPress={onNextFrame}
							status='secondary'
							accessoryRight={() => (
								<MaterialIcons name='navigate-next' color='white' size={24} />
							)}
						>
							Next frame
						</Button>
					</View>
				</Layout>
			</Layout>
		</Screen>
	);
};

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
		margin: 16,
		width: '80%',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	menuItem:{
		flex: 1,
	},
});
