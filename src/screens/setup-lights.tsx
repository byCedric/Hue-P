import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { Text, Layout, Button, Card } from '@ui-kitten/components';
import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Message } from '../components/message';
import { Screen } from '../components/screen';
import { useHue, useHueLights } from '../providers/hue';
import { type RootStackParamList } from '../providers/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SetupLights'>;

export function SetupLightsScreen() {
  const { resetSession } = useHue();
  const navigation = useNavigation<NavigationProp>();
  const hue = useHueLights();

  const onLightSave = useCallback(() => {
    hue.saveLights();
    navigation.navigate('SetupPattern');
  }, [hue.saveLights]);

  const onBridgeReset = useCallback(() => {
    resetSession().then(() => {
      navigation.navigate('SetupBridgeDiscover');
    });
  }, []);

  useEffect(() => {
    if (!hue.allLights.length) {
      hue.fetchLights();
    }
  }, []);

  if (hue.loading) {
    return (
      <Screen>
        <Layout style={styles.container}>
          <Message title="Sit tight." message="We are almost done, searching for your lights..." />
        </Layout>
      </Screen>
    );
  }

  if (!hue.allLights.length) {
    return (
      <Screen>
        <Layout style={styles.container}>
          <Message
            title="Good and bad news..."
            message="Hue told us there are no light bulbs connected, but you can still retry maybe?"
          />
          <Button onPress={hue.fetchLights}>Search harder</Button>
        </Layout>
      </Screen>
    );
  }

  return (
    <Screen>
      <Layout style={styles.container}>
        <Message
          title="Great!"
          message={
            hue.allLights.length === 1
              ? 'We found 1 light bulb! Press to enable it.'
              : `We found ${hue.allLights.length} light bulbs! Press on the ones you want to use.`
          }
        />
        <ScrollView style={styles.lightsScroll}>
          <View style={styles.lightsLayout}>
            {hue.allLights.map((light) => {
              const isDisabled = !light.state.xy;
              const isActive = hue.lightsEnabled[light.lampIndex];

              return (
                <View style={styles.lightContainer} key={light.lampIndex}>
                  <Card
                    key={`light-${light.lampIndex}`}
                    onPress={() => hue.toggleLight(light)}
                    style={isDisabled ? styles.lightDisabled : !isActive && styles.lightInactive}
                    disabled={isDisabled}
                    activeOpacity={0.75}
                    appearance="filled"
                    status="primary"
                  >
                    <Text category="label">
                      #{light.lampIndex} - {light.name}
                    </Text>
                    <Text category="p2">{light.type}</Text>
                  </Card>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            onPress={onBridgeReset}
            appearance="outline"
            accessoryLeft={() => <MaterialIcons name="navigate-before" color="white" size={24} />}
          >
            {(props) => (
              <Text {...props} style={[props?.style, { color: 'white' }]}>
                Select different bridge
              </Text>
            )}
          </Button>
          <Button
            onPress={onLightSave}
            disabled={!hue.hasLightEnabled}
            accessoryRight={() => <MaterialIcons name="navigate-next" color="white" size={24} />}
          >
            Im done!
          </Button>
        </View>
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
  lightsScroll: {
    width: '100%',
  },
  lightsLayout: {
    margin: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  lightContainer: {
    padding: 8,
    flexBasis: '50%',
  },
  lightInactive: {
    opacity: 0.5,
  },
  lightDisabled: {
    opacity: 0.15,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
