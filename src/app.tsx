import React from 'react';
import { NavigationProvider } from './providers/navigation';
import { HueProvider } from './providers/hue';

export const App: React.FC = () => (
	<HueProvider>
		<NavigationProvider />
	</HueProvider>
);
