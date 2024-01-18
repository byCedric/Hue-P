import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useEffect } from 'react';

type SplashProviderProps = PropsWithChildren;

SplashScreen.preventAutoHideAsync();

export function SplashProvider(props: SplashProviderProps) {
  useEffect(() => {
    if (props.children) {
      // Hide the splash screen, also avoid any errors if we've already hidden it
      SplashScreen.hideAsync()?.catch(() => {});
    }
  }, [props.children]);

  return props.children;
}
