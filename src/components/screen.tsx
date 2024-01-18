import { Layout, useTheme } from '@ui-kitten/components';
import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type ScreenProps = PropsWithChildren;

export function Screen(props: ScreenProps) {
  const theme = useTheme();
  const bgStyle = { backgroundColor: theme['color-basic-800'] };

  return (
    <SafeAreaView style={[styles.container, bgStyle]}>
      <Layout style={styles.container}>{props.children}</Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
