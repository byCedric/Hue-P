import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { Layout, Button, Spinner } from '@ui-kitten/components';
import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { Message } from '../components/message';
import { Screen } from '../components/screen';
import { useHueAuthenticate, type HueBridgeInfo } from '../providers/hue';
import { type RootStackParamList } from '../providers/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SetupBridgeAuth'>;

export function SetupBridgeAuthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const { bridge } = route.params as { bridge: Pick<HueBridgeInfo, 'internalipaddress'> };
  const [session, loading, authenticate] = useHueAuthenticate(bridge);

  const onLightSetup = useCallback(() => {
    navigation.navigate('SetupLights');
  }, []);

  useEffect(() => {
    if (!session) {
      authenticate();
    }
  }, []);

  if (loading) {
    return (
      <Screen>
        <Layout style={styles.container}>
          <Message
            title="We need your permission."
            message="Please press the button on top of your Hue bridge."
          />
          <Spinner size="giant" />
        </Layout>
      </Screen>
    );
  }

  if (session) {
    return (
      <Screen>
        <Layout style={styles.container}>
          <Message title="Awesome!" message={`Let's chose the light bulbs you want to use.`} />
          <Button
            onPress={onLightSetup}
            accessoryRight={() => <MaterialIcons name="navigate-next" color="white" size={24} />}
          >
            Hell yeah!
          </Button>
        </Layout>
      </Screen>
    );
  }

  return (
    <Screen>
      <Layout style={styles.container}>
        <Message
          title="Ready when you are."
          message="Authentication timed out, but you can retry whenever you are ready."
        />
        <Button onPress={authenticate}>I'm ready</Button>
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
    margin: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bridge: {
    margin: 8,
  },
});
