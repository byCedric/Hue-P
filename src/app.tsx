import React from 'react';
import { AssetsProvider } from './providers/assets';
import { HueProvider } from './providers/hue';
import { NavigationProvider } from './providers/navigation';
import { ThemeProvider } from './providers/theme';

export const App: React.FC = () => (
	<AssetsProvider>
		<ThemeProvider>
			<HueProvider>
				<NavigationProvider />
			</HueProvider>
		</ThemeProvider>
	</AssetsProvider>
);
