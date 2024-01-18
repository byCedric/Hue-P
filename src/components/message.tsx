import { Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

type MessageProps = {
  title: string;
  message: string;
};

export function Message(props: MessageProps) {
  return (
    <View style={styles.container}>
      <Text category="h1" style={styles.heading}>
        {props.title}
      </Text>
      <Text category="p1" style={styles.paragraph}>
        {props.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    maxWidth: '80%',
  },
  heading: {
    marginVertical: 8,
    textAlign: 'center',
  },
  paragraph: {
    marginVertical: 8,
  },
});
