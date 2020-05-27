import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Layout, Card } from '@ui-kitten/components';
import { Screen } from '../components/screen';
import { HuePattern, useHue } from '../providers/hue';

const patterns = [
	{
		name: 'Knight Rider',
		description: 'Red, left - right - left',
		pattern: HuePattern.getKnightRider(),
	},
	{
		name: 'Waves',
		description: 'Blurple, center - edges',
		pattern: HuePattern.getWave(),
	},
	{
		name: 'Complex',
		description: '¯\\_(ツ)_/¯',
		pattern: HuePattern.getWave(),
	},
];

export const SetupPatternScreen: React.FC = () => {
	const navigation = useNavigation();
	const hue = useHue();

	const onPatternPress = useCallback((pattern: HuePattern) => {
		hue.setPattern(pattern);
		navigation.navigate('Disco');
	}, []);

	return (
		<Screen>
			<Layout style={styles.container}>
				<View style={styles.wrapper}>
					<Text category='h1' style={styles.heading}>One final thing.</Text>
					<Text category='p1'>What pattern do you want to see?</Text>
				</View>
				<Layout style={styles.patterns}>
					{patterns.map(pattern => (
						<Card
							key={`pattern-${pattern.name}`}
							onPress={() => onPatternPress(pattern.pattern)}
							style={styles.pattern}
							activeOpacity={0.75}
							appearance='filled'
							status='primary'
						>
							<Text category='label'>{pattern.name}</Text>
							<Text category='p2'>{pattern.description}</Text>
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
	patterns: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	pattern: {
		margin: 8,
	},
});
