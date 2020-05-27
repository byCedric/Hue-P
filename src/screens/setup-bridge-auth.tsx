import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHueAuthenticate, HueBridgeInfo } from '../providers/hue';

export const SetupBridgeAuthScreen: React.FC = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const { bridge } = route.params as { bridge: HueBridgeInfo };
	const [session, loading, authenticate] = useHueAuthenticate(bridge);

	useEffect(() => {
		if (!session) {
			authenticate();
		}
	}, []);

	if (loading) {
		return (
			<View>
				<Text>Go ahead and press the button on the bridge</Text>
			</View>
		);
	}

	if (session) {
		return (
			<View>
				<Text>Awesome, let's continue!</Text>
				<Button title='Continue' onPress={() => navigation.navigate('Disco')} />
			</View>
		);
	}

	return (
		<View>
			<Text>Oh no! The authentication timed out</Text>
			<Button title='Retry' onPress={authenticate} />
		</View>
	);
};
