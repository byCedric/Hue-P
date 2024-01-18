import { AssetProvider } from './providers/asset';
import { HueProvider } from './providers/hue';
import { NavigationProvider } from './providers/navigation';
import { SplashProvider } from './providers/splash';
import { ThemeProvider } from './providers/theme';

export function App() {
  return (
    <ThemeProvider>
      <HueProvider>
        <SplashProvider>
          <AssetProvider>
            <NavigationProvider />
          </AssetProvider>
        </SplashProvider>
      </HueProvider>
    </ThemeProvider>
  );
}
