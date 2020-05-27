import React, { useCallback, useState} from 'react';
import { StyleSheet, View, LayoutChangeEvent, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import Draggable from 'react-native-draggable';
import { HueLight } from '../providers/hue';

export const LightMap: React.FC<LightMapProps> = (props) => {
	const [containerWidth, setContainerWidth] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);

	const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
		setContainerWidth(event.nativeEvent.layout.width);
		setContainerHeight(event.nativeEvent.layout.height);
	}, []);

	const createDragHandler = useCallback((light: HueLight) => (
		(
			event: GestureResponderEvent,
			guestureState: PanResponderGestureState,
			bounds: { top: number, right: number, bottom: number, left: number }
		) => {
			const x = Math.round(bounds.left / props.tileSize);
			const y = Math.round(bounds.top / props.tileSize);
			const grid = x + (y * props.width);

			props.onChange(light, grid);
		}
	), [props.width, props.tileSize]);

	return (
		<View style={styles.container} onLayout={onContainerLayout}>
			{props.lights.map((light) => (
				<Draggable
					key={`light-map-${light.lampIndex}`}
					isCircle
					minX={0}
					maxX={containerWidth}
					minY={0}
					maxY={containerHeight}
					renderSize={56}
					renderColor='rgba(0, 0, 0, 0.5)'
					renderText={`#${light.lampIndex}`}
					onDragRelease={createDragHandler(light)}
					onShortPressRelease={() => props.onIdentify(light)}
					onLongPress={() => props.onIdentify(light)}
				/>
			))}
		</View>
	);
};

export interface LightMapProps {
	/** The amount of tiles to render horizontally */
	width: number;
	/** The amount of tiles to render vertically */
	height: number;
	/** All lights to render within the map */
	lights: HueLight[];
	/** The width and height of a single tile */
	tileSize: number;
	/** Invoked when the light is dragged to another position */
	onChange: (light: HueLight, position: number) => any;
	/** Invoked when the user wants to identify  */
	onIdentify: (light: HueLight) => any;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
