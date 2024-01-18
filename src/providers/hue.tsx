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
  setSdk: (sdk: HueSdk) => void;
  lights: HueLight[];
  setLights: (lights: HueLight[]) => void;
  pattern: HuePattern;
  setPattern: (pattern: HuePattern) => void;
};
export const HueContext = createContext<HueContextData>({
  sdk: new HueSdk(),
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
});

type HueProviderProps = PropsWithChildren;

export function HueProvider(props: HueProviderProps) {
  const [sdk, setSdk] = useState(new HueSdk());
  const [lights, setLights] = useState<HueLight[]>([]);
  const [pattern, setPattern] = useState<HuePattern>(HuePattern.getKnightRider());

  useEffect(() => sdk.setnumberOfLamps(lights.length), [sdk, lights.length]);

  return (
    <HueContext.Provider value={{ sdk, setSdk, lights, setLights, pattern, setPattern }}>
      {props.children}
    </HueContext.Provider>
  );
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

export function useHueAuthenticate(bridge: HueBridgeInfo): [string, boolean, () => Promise<void>] {
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

  useEffect(() => {
    setLoading(true);
    storedSession.getStoredSession().then((oldSession) => {
      if (!oldSession) {
        setLoading(false);
        return;
      }

      const oldSdk = new HueSdk({ key: oldSession.key, ip: oldSession.ip });

      oldSdk
        .getLamps()
        .then(() => {
          setSession(oldSession.key);
          hue.setSdk(oldSdk);
        })
        .catch(() => {
          setSession('');
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, []);

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
