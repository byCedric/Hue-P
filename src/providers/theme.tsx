import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { PropsWithChildren } from 'react';

import { default as themeMapping } from '../assets/theme-mapping.json';
import { mergeObjects } from '../utils/object';

type ThemeProviderProps = PropsWithChildren;

const customMapping = mergeObjects({}, eva.mapping, themeMapping);

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <ApplicationProvider {...eva} theme={eva.dark} customMapping={customMapping}>
      {props.children}
    </ApplicationProvider>
  );
}
