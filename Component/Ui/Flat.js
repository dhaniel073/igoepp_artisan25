import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Color, FontSize } from './GlobalStyle';

function Flat({ children, onPress }) {

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}


export default Flat;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    // color: Color.lightgreen,
    color:'black',
    fontSize: 14,
    fontFamily: 'poppinsRegular'
  },
});
