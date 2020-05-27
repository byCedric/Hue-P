import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, Layout, Button, Card, useTheme } from '@ui-kitten/components';
import { useHueLights } from '../providers/hue';
import { Screen } from '../components/screen';

export const SetupLightsScreen: React.FC = () => {
	const navigation = useNavigation();
	const hue = useHueLights();
	const theme = useTheme();

	const onLightSave = useCallback(() => {
		hue.saveLights();
		navigation.navigate('Disco');
	}, [hue.saveLights]);

	useEffect(() => {
		if (!hue.allLights.length) {
			hue.fetchLights();
		}
	}, []);

	if (hue.loading) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<View style={styles.wrapper}>
						<Text category='h1' style={styles.heading}>Sit tight.</Text>
						<Text category='p1'>We are almost done, searching for your lights...</Text>
					</View>
				</Layout>
			</Screen>
		);
	}

	if (!hue.allLights.length) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<View style={styles.wrapper}>
						<Text category='h1' style={styles.heading}>Good and bad news...</Text>
						<Text category='p1'>
							Hue told us there are no light bulbs connected, but you can still retry maybe?
						</Text>
					</View>
					<Button onPress={hue.fetchLights}>Search harder</Button>
				</Layout>
			</Screen>
		)
	}

	const textStyleEnabled = { color: theme['color-basic-200'] };

	return (
		<Screen>
			<Layout style={styles.container}>
				<View style={styles.wrapper}>
					<Text category='h1' style={styles.heading}>Great!</Text>
					<Text category='p1'>
						{hue.allLights.length === 1
							? 'We found 1 light bulb! Press to enable it.'
							: `We found ${hue.allLights.length} light bulbs! Press on the ones you want to use.`
						}
					</Text>
				</View>
				<Layout style={styles.lights}>
					{hue.allLights.map(light => {
						const isDisabled = !light.state.xy;
						const isActive = hue.lightsEnabled[light.lampIndex];

						return (
							<Card
								key={`light-${light.lampIndex}`}
								onPress={() => hue.toggleLight(light)}
								style={[styles.light, isDisabled && styles.lightDisabled]}
								disabled={isDisabled}
								activeOpacity={0.75}
								appearance='filled'
								status='primary'
							>
								<Text category='label' style={isActive && textStyleEnabled}>
									#{light.lampIndex} - {light.name}
								</Text>
								<Text category='p2' style={isActive && textStyleEnabled}>
									{light.type}
								</Text>
							</Card>
						);
					})}
				</Layout>
				<Button
					onPress={onLightSave}
					accessoryRight={() => (
						<MaterialIcons name='navigate-next' color='white' size={24} />
					)}
				>
					Im done!
				</Button>
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
	lights: {
		margin: 16,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	light: {
		margin: 8,
	},
	lightDisabled: {
		opacity: 0.5,
	},
});
