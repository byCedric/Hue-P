import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, LayoutChangeEvent, Dimensions } from 'react-native';
import range from 'lodash/range';
import Draggable from 'react-native-draggable';

export const DiscoFloor: React.FC<DiscoFloorProps> = (props) => {
	const [containerWidth, setContainerWidth] = useState(0);
	// const [containerHeight, setContainerHeight] = useState(0);

	const totalHeight = useMemo(
		() => (containerWidth / props.width) * props.height,
		[containerWidth, props.width, props.height],
	);

	const tiles = useMemo(
		() => range(0, props.width * props.height),
		[props.width, props.height],
	);

	const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
		setContainerWidth(event.nativeEvent.layout.width);
		// setContainerHeight(event.nativeEvent.layout.height);
	}, []);

	return (
		<View style={styles.container} onLayout={onContainerLayout}>
			{tiles.map(key => (
				<View
					key={`dance-floor-tile-${key}`}
					style={{
						width: containerWidth / props.width,
						height: containerWidth / props.width,
						backgroundColor: props.tileColors![key] || props.tileEmptyColor,
					}}
				/>
			))}
			<View style={[styles.overlay, { width: containerWidth, height: totalHeight }]}>
				{props.children}
			</View>
		</View>
	);
};

DiscoFloor.defaultProps = {
	tileColors: [],
	tileEmptyColor: 'black',
};

export interface DiscoFloorProps {
	/** The amount of tiles to render horizontally */
	width: number;
	/** The amount of tiles to render vertically */
	height: number;
	/** A flat array with all tile colors */
	tileColors?: (string | null)[];
	/** The "empty" color to use when tile doesn't have a color */
	tileEmptyColor?: string;
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
});
