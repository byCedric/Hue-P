import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import merge from 'lodash/merge';
import { PropsWithChildren } from 'react';

import { default as themeMapping } from '../assets/theme-mapping.json';

type ThemeProviderProps = PropsWithChildren;

const customMapping = merge({}, eva.mapping, themeMapping);

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <ApplicationProvider {...eva} theme={eva.dark} customMapping={customMapping}>
      {props.children}
    </ApplicationProvider>
  );
}
