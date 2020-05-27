import axios from 'axios';
import { Hue, Lamp as HueLight } from 'hue-hacking-node';
import pRetry from 'p-retry';
import { HuePatternBlock } from './hue-pattern';

export type HueLightId = HueLight['lampIndex'];
export type HueLightState = Pick<HueLight['state'], 'on' | 'bri' | 'xy'>;

export class HueSdk extends Hue {
	/** A cache with a hashed state to determine if we need to update lights */
	private stateCache: Map<HueLightId, string> = new Map();

	/**
	 * Generate a simple hash to use in the state cache for a light state.
	 * This is used to check if we need to send an update.
	 */
	private getStateHash(state: HueLightState) {
		return `on:${state.on}|bri:${state.bri}|xy:${state.xy?.join(',')}`;
	}

	/**
	 * Apply a pattern block to the light.
	 * This converts a (possible) color to CIE color and sends the update.
	 */
	setFrameState(light: HueLight, color: HuePatternBlock, force = false) {
		const on = !!color;
		const xyColor = color ? this.colors.getCIEColor(color) : undefined;
		const xy = xyColor ? [xyColor.x, xyColor.y] : undefined;

		return this.setState(light, { on, xy, transitiontime: 1, bri: 254 }, force);
	}

	/**
	 * Update the a partial or full state of the lights.
	 * This is a faster method, compared to `setColor`, by transfering everything in one call.
	 * The state is also cached to prevent DDoS of lighting.
	 */
	setState(light: HueLight, state: HueLight['state'] & { transitiontime?: number }, force = false) {
		const prevStateHash = this.stateCache.get(light.lampIndex);
		const nextStateHash = this.getStateHash(state);

		if (!force && prevStateHash === nextStateHash) {
			return;
		}

		const { key, ip } = this.getConfig();
		const url = `http://${ip}/api/${key}/lights/${light.lampIndex}/state`;

		this.stateCache.set(light.lampIndex, nextStateHash);
		this.getHttp().put(url, state);
	}

	/**
	 * Discover all bridges in the local network.
	 * It returns `Hue.search` with a `/api/config` lookup combined.
	 */
	static async discover() {
		const bridgeRefs = (await axios.get<HueBridgeDiscovery[]>('https://discovery.meethue.com/')).data;
		const bridges = await Promise.all(
			bridgeRefs.map(async ref => {
				const url = `http://${ref.internalipaddress}/api/config`;
				const { data } = await axios.get(url);
				return { ...ref, ...data } as HueBridgeInfo;
			}),
		);
		return bridges;
	}

	/**
	 * Try and authenticate with the bridge.
	 * This will poll the bridge with an interval and limited amount of attempts.
	 */
	static async authenticate(bridge: HueBridgeInfo) {
		return pRetry(
			async () => {
				const { data } = await axios.post(
					`http://${bridge.internalipaddress}/api`,
					{ devicetype: 'com.bycedric.huep' },
				);
				if (data[0]?.success?.username) {
					return data[0]?.success?.username;
				}
				throw new Error('Not authenticated');
			},
			{ retries: 15, minTimeout: 2000, maxTimeout: 2000 },
		);
	}
}

export interface HueBridgeDiscovery {
	id: string;
	internalipaddress: string;
}

export interface HueBridgeInfo {
	internalipaddress: string;
	name: string;
	datastoreversion: string;
	swversion: string;
	apiversion: string;
	mac: string;
	bridgeid: string;
	factorynew: boolean;
	replacesbridgeid: string | null;
	modelid: string;
	starterkitid: string;
}
