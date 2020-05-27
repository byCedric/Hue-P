import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';

export const Screen: React.FC = (props) => (
	<SafeAreaView style={styles.container}>
		<Layout style={styles.container}>
			{props.children}
		</Layout>
	</SafeAreaView>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
