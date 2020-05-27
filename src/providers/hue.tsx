import React, { createContext, useEffect, useContext, useState, useCallback } from 'react';
import { Lamp as HueLight } from 'hue-hacking-node';
import { HueSdk, HueBridgeInfo, HuePattern } from '../services/hue';

export * from '../services/hue';

export const HueContext = createContext<HueContextData>({
	sdk: new HueSdk(),
	pattern: HuePattern.getKnightRider(),
	lights: [],
	initialize: () => Promise.reject(new Error('Missing Hue provider')),
	setPattern: () => { throw new Error('Missing Hue provider') },
});

export interface HueContextData {
	sdk: HueSdk;
	pattern: HuePattern;
	lights: HueLight[];
	initialize: (sdk: HueSdk) => Promise<void>;
	setPattern: (pattern: HuePattern) => void;
}

export const HueProvider: React.FC = (props) => {
	const [sdk, setSdk] = useState(new HueSdk());
	const [lights, setLights] = useState<HueLight[]>([]);
	const [pattern, setPattern] = useState<HuePattern>(HuePattern.getKnightRider());

	const initialize = useCallback(async (newSdk: HueSdk) => {
		const allLights = await newSdk.getLamps();
		const relevantLights = allLights.filter(light => light.state.xy);

		newSdk.setnumberOfLamps(relevantLights.length);

		setSdk(newSdk);
		setLights(relevantLights);
	}, []);

	return (
		<HueContext.Provider value={{ sdk, pattern, lights, initialize, setPattern }}>
			{props.children}
		</HueContext.Provider>
	);
};

export function useHue() {
	return useContext(HueContext);
}

export function useHueDiscovery(): [HueBridgeInfo[], boolean, () => Promise<void>] {
	const [loading, setLoading] = useState(true);
	const [bridges, setBridges] = useState<HueBridgeInfo[]>([]);

	const fetch = useCallback(async () => {
		setLoading(true);
		try {
			setBridges(await HueSdk.discover());
		} catch (error) {
			console.warn(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return [bridges, loading, fetch];
}

export function useHueAuthenticate(bridge: HueBridgeInfo): [string, boolean, () => Promise<void>] {
	const { sdk, initialize } = useHue();
	const [loading, setLoading] = useState(false);
	const [session, setSession] = useState(
		(!sdk.getConfig().key || sdk.getConfig().key === 'testapp')
			? ''
			: sdk.getConfig().key
	);

	const authenticate = useCallback(async () => {
		setLoading(true);
		try {
			const newSession = await HueSdk.authenticate(bridge);
			setSession(newSession);
			initialize(new HueSdk({ key: newSession, ip: bridge.internalipaddress }));
		} catch (error) {
			console.warn(error);
			setSession('');
		} finally {
			setLoading(false);
		}
	}, []);

	return [session, loading, authenticate];
}
