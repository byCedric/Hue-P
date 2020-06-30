import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, Layout, Button, Card, useTheme } from '@ui-kitten/components';
import { useHueLights } from '../providers/hue';
import { Screen } from '../components/screen';
import { Message } from '../components/message';

export const SetupLightsScreen: React.FC = () => {
	const navigation = useNavigation();
	const hue = useHueLights();
	const theme = useTheme();

	const onLightSave = useCallback(() => {
		hue.saveLights();
		navigation.navigate('SetupPattern');
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
					<Message
						title='Sit tight.'
						message='We are almost done, searching for your lights...'
					/>
				</Layout>
			</Screen>
		);
	}

	if (!hue.allLights.length) {
		return (
			<Screen>
				<Layout style={styles.container}>
					<Message
						title='Good and bad news...'
						message='Hue told us there are no light bulbs connected, but you can still retry maybe?'
					/>
					<Button onPress={hue.fetchLights}>Search harder</Button>
				</Layout>
			</Screen>
		)
	}

	const textStyleEnabled = { color: theme['color-basic-200'] };

	return (
		<Screen>
			<Layout style={styles.container}>
				<Message
					title='Great!'
					message={
						hue.allLights.length === 1
							? 'We found 1 light bulb! Press to enable it.'
							: `We found ${hue.allLights.length} light bulbs! Press on the ones you want to use.`
					}
				/>
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
					disabled={!hue.hasLightEnabled}
					accessoryRight={() => (
						!hue.hasLightEnabled ? <></> : <MaterialIcons name='navigate-next' color='white' size={24} />
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
