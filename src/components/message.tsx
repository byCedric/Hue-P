import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

export const Message: React.FC<MessageProps> = (props) => (
	<View style={styles.container}>
		<Text category='h1' style={styles.heading}>{props.title}</Text>
		<Text category='p1' style={styles.paragraph}>{props.message}</Text>
	</View>
);

export interface MessageProps {
	title: string;
	message: string;
}

const styles = StyleSheet.create({
	container: {
		margin: 16,
		maxWidth: '80%',
	},
	heading: {
		marginVertical: 8,
		textAlign: 'center',
	},
	paragraph: {
		marginVertical: 8,
	},
});
