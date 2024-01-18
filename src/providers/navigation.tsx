import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { type HueBridgeInfo } from './hue';
import { DiscoScreen } from '../screens/disco';
import { SetupBridgeAuthScreen } from '../screens/setup-bridge-auth';
import { SetupBridgeDiscoverScreen } from '../screens/setup-bridge-discover';
import { SetupLightsScreen } from '../screens/setup-lights';
import { SetupPatternScreen } from '../screens/setup-pattern';

export type RootStackParamList = {
  SetupBridgeDiscover: undefined;
  SetupBridgeAuth: { bridge: HueBridgeInfo };
  SetupLights: undefined;
  SetupPattern: undefined;
  Disco: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const navigationTheme = {
  dark: false,
  colors: {
    background: 'transparent',
    primary: 'transparent',
    card: 'transparent',
    text: 'transparent',
    border: 'transparent',
    notification: 'transparent',
  },
};

export function NavigationProvider() {
  return (
    <ThemeProvider value={navigationTheme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SetupBridgeDiscover"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SetupBridgeDiscover" component={SetupBridgeDiscoverScreen} />
          <Stack.Screen name="SetupBridgeAuth" component={SetupBridgeAuthScreen} />
          <Stack.Screen name="SetupLights" component={SetupLightsScreen} />
          <Stack.Screen name="SetupPattern" component={SetupPatternScreen} />
          <Stack.Screen name="Disco" component={DiscoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
