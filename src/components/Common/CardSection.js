import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={[styles.containerStyle, props.additionalCardSectionStyles]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    // padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    alignItems: 'center'
  }
};

export { CardSection };
