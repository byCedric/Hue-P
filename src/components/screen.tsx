import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout, useTheme } from '@ui-kitten/components';

export const Screen: React.FC = (props) => {
	const theme = useTheme();
	const bgStyle = { backgroundColor: theme['color-basic-800'] };

	return (
		<SafeAreaView style={[styles.container, bgStyle]}>
			<Layout style={styles.container}>
				{props.children}
			</Layout>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
