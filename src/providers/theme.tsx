import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import merge from 'lodash/merge';
import { default as themeMapping } from '../assets/theme-mapping.json';

const customMapping = merge({}, eva.mapping, themeMapping);

export const ThemeProvider: React.FC = (props) => (
	<ApplicationProvider
		{...eva}
		theme={eva.dark}
		customMapping={customMapping}
	>
		{props.children}
	</ApplicationProvider>
);
