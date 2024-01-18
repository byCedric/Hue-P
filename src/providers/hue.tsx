import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { type Lamp as HueLight } from 'hue-hacking-node';
import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';

import { HueSdk, type HueBridgeInfo, HuePattern } from '../services/hue';

export * from '../services/hue';

export type HueContextData = {
  sdk: HueSdk;
  initialState: 'loading' | 'authenticated' | 'unauthenticated';
  setSdk: (sdk: HueSdk) => void;
  lights: HueLight[];
  setLights: (lights: HueLight[]) => void;
  pattern: HuePattern;
  setPattern: (pattern: HuePattern) => void;
  resetSession: () => Promise<void>;
};

export const HueContext = createContext<HueContextData>({
  sdk: new HueSdk(),
  initialState: 'loading',
  pattern: HuePattern.getKnightRider(),
  lights: [],
  setSdk: () => {
    throw new Error('Missing Hue provider');
  },
  setPattern: () => {
    throw new Error('Missing Hue provider');
  },
  setLights: () => {
    throw new Error('Missing Hue provider');
  },
  resetSession: () => {
    throw new Error('Missing Hue provider');
  },
});

type HueProviderProps = PropsWithChildren;

export function HueProvider(props: HueProviderProps) {
  const [sdk, setSdk] = useState(new HueSdk());
  const [initialState, setInitialState] = useState<HueContextData['initialState']>('loading');
  const [lights, setLights] = useState<HueLight[]>([]);
  const [pattern, setPattern] = useState<HuePattern>(HuePattern.getKnightRider());
  const storedSession = useStoredHueSession();

  const resetSession = useCallback(async () => {
    await storedSession.removeStoredSession();
    setInitialState('unauthenticated');
    setSdk(new HueSdk());
  }, []);

  useEffect(() => sdk.setnumberOfLamps(lights.length), [sdk, lights.length]);

  useEffect(() => {
    storedSession
      .getStoredSession()
      .then((oldSession) => restartStoredSession(oldSession))
      .then((oldSdk) => {
        if (oldSdk) {
          setSdk(oldSdk);
          setInitialState('authenticated');
        } else {
          setInitialState('unauthenticated');
        }
      });
  }, []);

  return (
    <HueContext.Provider
      value={{ sdk, setSdk, lights, setLights, pattern, setPattern, initialState, resetSession }}
    >
      {props.children}
    </HueContext.Provider>
  );
}

async function restartStoredSession(session: StoredHueSession | null) {
  if (!session) return null;

  const sdk = new HueSdk({ key: session.key, ip: session.ip });

  try {
    await sdk.getLamps();
    return sdk;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

export function useHue() {
  return useContext(HueContext);
}

export function useHueDiscovery(): [
  HueBridgeInfo[],
  boolean,
  () => Promise<HueBridgeInfo[] | undefined>,
] {
  const [loading, setLoading] = useState(true);
  const [bridges, setBridges] = useState<HueBridgeInfo[]>([]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const bridges = await HueSdk.discover();
      setBridges(bridges);
      return bridges;
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return [bridges, loading, fetch];
}

export function useHueAuthenticate(
  bridge: Pick<HueBridgeInfo, 'internalipaddress'>
): [string, boolean, () => Promise<void>] {
  const hue = useHue();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState('');
  const storedSession = useStoredHueSession();

  const authenticate = useCallback(async () => {
    setLoading(true);
    try {
      const key = await HueSdk.authenticate(bridge);
      await storedSession.setStoredSession({ key, ip: bridge.internalipaddress });
      setSession(key);
      hue.setSdk(new HueSdk({ key, ip: bridge.internalipaddress }));
    } catch (error) {
      console.warn(error);
      setSession('');
    } finally {
      setLoading(false);
    }
  }, [storedSession.setStoredSession]);

  return [session, loading, authenticate];
}

type StoredHueSession = {
  key: string;
  ip: string;
};

export function useStoredHueSession() {
  const storage = useAsyncStorage('hue-session');

  return {
    removeStoredSession: storage.removeItem,
    async getStoredSession(): Promise<StoredHueSession | null> {
      const item = await storage.getItem();
      return item ? JSON.parse(item) : null;
    },
    async setStoredSession(info: StoredHueSession) {
      return await storage.setItem(JSON.stringify(info));
    },
  };
}

export function useHueLights() {
  const hue = useHue();
  const [loading, setLoading] = useState(false);
  const [allLights, setAllLights] = useState<HueLight[]>([]);
  const [lightsEnabled, setLightsEnabled] = useState<{ [key: number]: boolean }>({});
  const [hasLightEnabled, setHasLightEnabled] = useState(false);

  const fetchLights = useCallback(async () => {
    setLoading(true);
    try {
      const lights = await hue.sdk.getLamps();
      setAllLights(lights.filter((light) => light.state.reachable));
    } catch (error) {
      console.warn(error);
      setAllLights([]);
    } finally {
      setLoading(false);
    }
  }, [hue.sdk]);

  const toggleLight = useCallback(
    async (light: HueLight) => {
      const isEnabled = lightsEnabled[light.lampIndex];

      if (!isEnabled) {
        hue.sdk.flash(light.lampIndex).then(() => {
          hue.sdk.setState(light, { on: true, bri: 254 }, true);
        });
      } else {
        hue.sdk.turnOff(light.lampIndex);
      }

      const newLightsEnabled = {
        ...lightsEnabled,
        [light.lampIndex]: !isEnabled,
      };

      setLightsEnabled(newLightsEnabled);
      setHasLightEnabled(Object.values(newLightsEnabled).filter(Boolean).length > 0);
    },
    [lightsEnabled]
  );

  const saveLights = useCallback(() => {
    hue.setLights(allLights.filter((light) => lightsEnabled[light.lampIndex] === true));
  }, [allLights, lightsEnabled]);

  return {
    loading,
    allLights,
    lightsEnabled,
    hasLightEnabled,
    toggleLight,
    fetchLights,
    saveLights,
  };
}
