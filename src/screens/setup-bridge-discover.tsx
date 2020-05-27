import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Card, Text, Layout, Button } from '@ui-kitten/components';
import { useHueDiscovery, HueBridgeInfo } from '../providers/hue';
import { Screen } from '../components/screen';

export const SetupBridgeDiscoverScreen: React.FC = () => {
	const navigation = useNavigation();
	const [bridges, loading, discover] = useHueDiscovery();

	const onBridgePress = useCallback((bridge: HueBridgeInfo) => {
		navigation.navigate('SetupBridgeAuth', { bridge });
	}, []);

	useEffect(() => {
		if (!bridges.length) {
			discover();
		}
	}, []);

	if (loading) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<View style={styles.wrapper}>
						<Text category='h1' style={styles.heading}>Hold on.</Text>
						<Text category='p1'>We are searching for your Hue bridges...</Text>
					</View>
				</Layout>
			</Screen>
		);
	}

	if (!bridges.length) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<View style={styles.wrapper}>
						<Text category='h1' style={styles.heading}>Uh-oh...</Text>
						<Text category='p1'>
							We didn't detect any Hue bridges.
							Make sure you are connected to your local network.
						</Text>
					</View>
					<Button onPress={discover}>
						Try again
					</Button>
				</Layout>
			</Screen>
		)
	}

	return (
		<Screen>
			<Layout style={styles.container}>
				<View style={styles.wrapper}>
					<Text category='h1' style={styles.heading}>Alright!</Text>
					<Text category='p1'>
						{bridges.length === 1
							? 'We found 1 Hue bridge! Press on it to continue.'
							: `We found ${bridges.length} Hue bridges! Press on the one you want to use.`
						}
					</Text>
				</View>
				<Layout style={styles.bridges}>
					{bridges.map(bridge => (
						<Card
							key={`bridge-${bridge.bridgeid}`}
							onPress={() => onBridgePress(bridge)}
							style={styles.bridge}
							activeOpacity={0.75}
							appearance='filled'
							status='primary'
						>
							<Text category='label'>{bridge.name}</Text>
							<Text category='p2'>{bridge.internalipaddress}</Text>
						</Card>
					))}
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
	bridges: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	bridge: {
		margin: 8,
	},
});
