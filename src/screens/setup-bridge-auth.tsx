import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, } from '@react-navigation/native';
import { Text, Layout, Button, Spinner } from '@ui-kitten/components';
import { useHueAuthenticate, HueBridgeInfo } from '../providers/hue';
import { Screen } from '../components/screen';

export const SetupBridgeAuthScreen: React.FC = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const { bridge } = route.params as { bridge: HueBridgeInfo };
	const [session, loading, authenticate] = useHueAuthenticate(bridge);

	const onLightSetup = useCallback(() => {
		navigation.navigate('SetupLights');
	}, []);

	useEffect(() => {
		if (!session) {
			authenticate();
		}
	}, []);

	if (loading) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<View style={styles.wrapper}>
						<Text category='h1' style={styles.heading}>We need your permission.</Text>
						<Text category='p1'>Please press the button on top of your Hue bridge.</Text>
					</View>
					<Spinner size='giant' />
				</Layout>
			</Screen>
		);
	}

	if (session) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<View style={styles.wrapper}>
						<Text category='h1' style={styles.heading}>Awesome!</Text>
						<Text category='p1'>Let's chose the light bulbs you want to use.</Text>
					</View>
					<Button
						onPress={onLightSetup}
						accessoryRight={() => (
							<MaterialIcons
								name='navigate-next'
								color='white'
								size={24}
							/>
						)}
					>
						Hell yeah!
					</Button>
				</Layout>
			</Screen>
		);
	}

	return (
		<Screen>
			<Layout style={styles.container}>
				<View style={styles.wrapper}>
					<Text category='h1' style={styles.heading}>Ready when you are!</Text>
					<Text category='p1'>Authentication timed out, but you can retry whenever you are ready.</Text>
				</View>
				<Button onPress={authenticate}>Try again</Button>
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
	bridges: {
		margin: 8,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	bridge: {
		margin: 8,
	},
});
