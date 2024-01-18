import { View } from 'react-native';

import { AssetProvider } from './providers/asset';
import { HueProvider } from './providers/hue';
import { NavigationProvider } from './providers/navigation';
import { SplashProvider } from './providers/splash';
import { ThemeProvider } from './providers/theme';

export function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#222B45' }}>
      <ThemeProvider>
        <HueProvider>
          <SplashProvider>
            <AssetProvider>
              <NavigationProvider />
            </AssetProvider>
          </SplashProvider>
        </HueProvider>
      </ThemeProvider>
    </View>
  );
}
