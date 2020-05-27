import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import range from 'lodash/range';

export const DiscoFloor: React.FC<DiscoFloorProps> = (props) => {
	const theme = useTheme();
	const [containerWidth, setContainerWidth] = useState(0);

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
	}, []);

	return (
		<View style={styles.container} onLayout={onContainerLayout}>
			{tiles.map(key => (
				<View
					key={`dance-floor-tile-${key}`}
					style={[styles.tile, {
						width: containerWidth / props.width,
						height: containerWidth / props.width,
						backgroundColor: props.tileColors![key] || (props.tileEmptyColor || theme['color-basic-900']),
						borderColor: theme['color-basic-800'],
					}]}
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
	tile: {
		borderRadius: 8,
		borderWidth: 1,
	},
});
