import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SetupBridgeDiscoverScreen } from '../screens/setup-bridge-discover';
import { SetupBridgeAuthScreen } from '../screens/setup-bridge-auth';
import { SetupLightsScreen } from '../screens/setup-lights';
import { SetupPatternScreen } from '../screens/setup-pattern';
import { DiscoScreen } from '../screens/disco';

const Stack = createStackNavigator();

export const NavigationProvider: React.FC = () => (
	<NavigationContainer>
		<Stack.Navigator initialRouteName='SetupBridgeDiscover' screenOptions={{ headerShown: false }}>
			<Stack.Screen name="SetupBridgeDiscover" component={SetupBridgeDiscoverScreen} />
			<Stack.Screen name="SetupBridgeAuth" component={SetupBridgeAuthScreen} />
			<Stack.Screen name="SetupLights" component={SetupLightsScreen} />
			<Stack.Screen name="SetupPattern" component={SetupPatternScreen} />
			<Stack.Screen name="Disco" component={DiscoScreen} />
		</Stack.Navigator>
	</NavigationContainer>
);
