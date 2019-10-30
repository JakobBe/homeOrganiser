import React, { Component } from 'react';
import { Input, Button, Spinner } from '../Common';
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { HomeContext } from '../contexts/HomeContextHolder';
import { signIn, RejectionErros } from '../AWSClient';
import { layouts } from '../Style';

class SignIn extends Component {
  state = {
    loading: false,
    email: '',
    password: '',
    error: ''
  }

  onEmailChange(text) {
    this.setState({
      email: text
    });
  }

  onPasswordChange(text) {
    this.setState({
      password: text
    });
  }

  onLoginButtonPress = async () => {
    const { email, password } = this.state;
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Please enter an E-Mail address and a password.");
      return
    }

    this.setState({
      loading: true,
      error: ''
    });

    const signInRes = await signIn(email, password);
    if (signInRes.status === 400) {
      if (signInRes.res.code === RejectionErros.UserNotFoundException) {
        Alert.alert("Incorrect email or password.");
      }
      if (signInRes.res.code === RejectionErros.NotAuthorizedException) {
        Alert.alert("Incorrect email or password.");
      }
      this.setState({
        loading: false
      });
      return
    }

    if (signInRes.status === 200) {
      await this.props.homeContext.createUserSession(signInRes.res.attributes.sub);
      this.setState({
        loading: false
      });
      this.props.hasSignedIn();
    }
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size='large'/>;
    }

    return (
      <Button
        onPress={this.onLoginButtonPress}
        additionalButtonStyles={styles.button}
      >
        Login
      </Button>
    );
  }

  renderError() {
    if (this.state.error.length > 0) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.loginWrapper}>
        <Input
          label='Email'
          placeholder='email@gmail.com'
          onChangeText={this.onEmailChange.bind(this)}
          value={this.state.email}
          autoFocus={true}
          additionalTextFieldStyle={styles.additionalTextFieldStyle}
        />
        <Input
          secureTextEntry
          label='Password'
          placeholder='password'
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.state.password}
          additionalTextFieldStyle={styles.additionalTextFieldStyle}
        />
        {this.renderError()}
        <View style={layouts.centerWrapper}>
          {this.renderButton()}
        </View>
        <TouchableOpacity onPress={() => this.props.navigateSignIn()}>
          <Text style={styles.createAccounTextStyle}>
            Create a new account
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },

  additionalTextFieldStyle: {
    backgroundColor: 'transparent'
  },

  createAccounTextStyle: {
    marginTop: 20,
    fontSize: 15,
    alignSelf: 'center',
    color: 'grey',
    textDecorationLine: 'underline' 
  },

  button: {
    marginTop: 35,
  },
  
  loginWrapper: {
    flex: 0
  },
}

export default (props) => (
  <HomeContext.Consumer>
    {homeContext => <SignIn {...props} homeContext={homeContext} />}
  </HomeContext.Consumer>
);