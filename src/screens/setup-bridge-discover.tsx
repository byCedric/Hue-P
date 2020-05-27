import React, { useState, useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useHueDiscovery } from '../providers/hue';

export const SetupBridgeDiscoverScreen: React.FC = () => {
	const navigation = useNavigation();
	const [bridges, loading, discover] = useHueDiscovery();

	useEffect(() => {
		discover();
	}, []);

	return (
		<View>
			{loading && <Text>Loading...</Text>}
			{!loading && (
				bridges.map(bridge => (
					<TouchableOpacity
						key={bridge.bridgeid}
						onPress={() => navigation.navigate('SetupBridgeAuth', { bridge })}
					>
						<Text>{bridge.name}</Text>
					</TouchableOpacity>
				))
			)}
		</View>
	)
};
