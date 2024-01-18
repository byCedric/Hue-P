import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { Card, Text, Layout, Button } from '@ui-kitten/components';
import { useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { Message } from '../components/message';
import { Screen } from '../components/screen';
import { useHueDiscovery, type HueBridgeInfo, useStoredHueSession } from '../providers/hue';
import { type RootStackParamList } from '../providers/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SetupBridgeDiscover'>;

export function SetupBridgeDiscoverScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [bridges, loading, discover] = useHueDiscovery();
  const storedSession = useStoredHueSession();

  const onBridgePress = useCallback((bridge: HueBridgeInfo) => {
    navigation.navigate('SetupBridgeAuth', { bridge });
  }, []);

  useEffect(() => {
    if (!bridges.length) {
      discover().then((discoverdBridges = []) => {
        storedSession.getStoredSession().then((oldSession) => {
          if (oldSession) {
            const oldBridge = discoverdBridges.find(
              (bridge) => bridge.internalipaddress === oldSession.ip
            );

            if (oldBridge) {
              onBridgePress(oldBridge);
            }
          }
        });
      });
    }
  }, []);

  if (loading) {
    return (
      <Screen>
        <Layout style={styles.container}>
          <Message title="Hold on." message="Searching for your Hue bridges..." />
        </Layout>
      </Screen>
    );
  }

  if (!bridges.length) {
    return (
      <Screen>
        <Layout style={styles.container}>
          <Message
            title="Uh-oh..."
            message={`Hmm, couldn't find any Hue bridges. Make sure you are connected to your local network.`}
          />
          <Button onPress={discover}>It's there...</Button>
        </Layout>
      </Screen>
    );
  }

  return (
    <Screen>
      <Layout style={styles.container}>
        <Message
          title="Alright!"
          message={
            bridges.length === 1
              ? 'We found 1 Hue bridge! Press on it to continue.'
              : `We found ${bridges.length} Hue bridges! Press on the one you want to use.`
          }
        />
        <Layout style={styles.bridges}>
          {bridges.map((bridge) => (
            <Card
              key={`bridge-${bridge.bridgeid}`}
              onPress={() => onBridgePress(bridge)}
              style={styles.bridge}
              activeOpacity={0.75}
              appearance="filled"
              status="primary"
            >
              <Text category="label">{bridge.name}</Text>
              <Text category="p2">{bridge.internalipaddress}</Text>
            </Card>
          ))}
        </Layout>
      </Layout>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bridges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bridge: {
    flex: 1,
    margin: 8,
  },
});
