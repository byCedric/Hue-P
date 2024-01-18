import { useFonts, OpenSans_400Regular, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import { type PropsWithChildren } from 'react';

type AssetProviderProps = PropsWithChildren;

export function AssetProvider(props: AssetProviderProps) {
  const [loaded] = useFonts({
    'open-sans-regular': OpenSans_400Regular,
    'open-sans-semibold': OpenSans_600SemiBold,
    'raleway-bold': Raleway_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return props.children;
}
