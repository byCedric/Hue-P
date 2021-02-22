import React from 'react';
import AppLoading from 'expo-app-loading';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import {
	useFonts,
	OpenSans_400Regular,
	OpenSans_600SemiBold,
} from '@expo-google-fonts/open-sans';

export const AssetsProvider: React.FC = (props) => {
	const [loaded] = useFonts({
		'open-sans-regular': OpenSans_400Regular,
		'open-sans-semibold': OpenSans_600SemiBold,
		'raleway-bold': Raleway_700Bold,
	});

	return !loaded
		? <AppLoading />
		: <>{props.children}</>;
};
