import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Footer, BackgroundCarousel } from '../Common';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import HomeSelector from './HomeSelector';
import { colorPalette, deviceWidth, textStyles } from '../../Style';
import currentDate from '../../Helpers/currentDate';
import ProfileModal from './ProfileModal';
import HomeModal from './HomeModal';

class Entry extends Component {
  state = {
    imageUp: false,
    profileModalActive: false,
    homeModalActive: false,
    reload: false
  }

  onSwipeUp = (gestureState) => {
    this.setState({
      imageUp: true
    })
  }

  onSwipeDown = (gestureState) => {
    this.setState({
      imageUp: false
    })
  }

  onProfilePress = async () => {
    this.props.homeContext.profileModal.open();
  }

  onHomePress = () => {
    this.setState({
      homeModalActive: true
    });
  }

  onModalClose = () => {
    this.props.homeContext.profileModal.close();
    // this.setState({
    //   profileModalActive: false,
    //   homeModalActive: false
    // });
  }

  completedSignUp = () => {
    console.log('hello world');
    this.setState({
      reload: !reload
    })
  }

  getTodayEvents = () => {
    const selectedDateEvents = this.props.homeContext.events.filter(event => {
      return event.date === currentDate() && event.userId === this.props.homeContext.currentUser.id
    });
    return selectedDateEvents;
  }

  renderMainContent = (currentUser, name) => {
    const images = ['https://picsum.photos/id/311/1000/1000', 'https://picsum.photos/id/100/1000/1000', 'https://picsum.photos/id/253/1000/1000', 'https://picsum.photos/id/137/1000/1000', 'https://picsum.photos/id/25/1000/1000', 'https://picsum.photos/id/431/1000/1000'];
    const profileColor = currentUser.color
    const users = this.props.homeContext.users;
    const todayEvents = this.getTodayEvents().length !== 0 ? this.getTodayEvents() : [{text: "Hello World"}];
    console.log('todayEvents', todayEvents);
    return (
      <View>
        <BackgroundCarousel 
          images={images}
          title={name}
        />
        <View style={styles.guideWrapper}>
          <TouchableOpacity style={styles.imageWrapper(profileColor)} onPress={this.onProfilePress}>
            <Text style={textStyles.normalStyle}>Profile</Text>
            {/* <Image source={require('../../../assets/images/user-black-c.png')} style={styles.imageStyle} /> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageWrapper('white')} onPress={this.onHomePress}>
            <Text style={{ color: colorPalette.secondary }}>Home</Text>
            {/* <Image source={require('../../../assets/images/group-c.png')} style={styles.imageStyle} /> */}
          </TouchableOpacity>
        {/* </View>
        <View style={styles.guideWrapper}> */}
          {/* <View style={styles.imageWrapper('white')}>
            <Text style={{ color: colorPalette.primary }}>Your Balance</Text>
            <Text style={{ color: colorPalette.primary }}>+100$</Text>
          </View> */}
          {/* <View style={styles.imageWrapper('white')}>
            <Text style={{ color: colorPalette.primary }}>Events today</Text>
            <Text style={{ color: colorPalette.primary, textAlign: 'center', }}>{todayEvents[0].text}</Text>
          </View> */}
        </View>
        {/* <GestureRecognizer
          onSwipeUp={(state) => this.onSwipeUp(state)}
          onSwipeDown={(state) => this.onSwipeDown(state)}
        >
          <Image source={require('../../assets/images/eggplant.png')} style={styles.imageStyle(this.state.imageUp)} />
        </GestureRecognizer> */}
        {/* <View style={styles.flatmatesContainer}>
          <Text style={styles.greeting}>
            Hi {this.props.homeContext.currentUser.name}, these are your flatmates.
          </Text>
          <View style={styles.userLetterWrapper}>
            {users.map(user => (
              <View style={styles.userLetterStyleContainer(user.color || 'black')}>
                <Text style={styles.userLetterStyle}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View> */}
        {/* <ProfileModal 
          profileModalActive={this.state.profileModalActive}
          onModalClose={this.onModalClose}
        /> */}
        {this.props.homeContext.profileModal.render}
        <HomeModal
          homeModalActive={this.state.homeModalActive}
          onModalClose={this.onModalClose}
        />
      </View>
    );
  }

  render() {
    console.log('this.props.homeContext', this.props.homeContext)
    const {currentUser, users, name} = this.props.homeContext

    if (currentUser && users) {
      return (
        <View style={styles.entryContainer}>
          {this.renderMainContent(currentUser, name)}
          <Footer isHomeActive={true} />
        </View>
      );
    }

    return (
      <View style={styles.entryContainer}>
        <HomeSelector
          completedSignUp={this.completedSignUp}
        />
      </View>
    );
  }
};

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 15,
    marginTop: 20
  },

  entryContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },

  carouselWrapper: {
    // height: '60%'
  },

  greeting: {
    fontSize: 18,
    margin: 20,
    fontWeight: '600'
  },

  imageStyle: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginTop: 20
  },

  userLetterStyleContainer: (color) => ({
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: color,
    justifyContent: 'center'
  }),

  userLetterStyle: {
    color: 'white',
    textAlign: 'center',
  },

  userLetterWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  guideWrapper: {
    margin: 20,
    marginBottom: 0,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  imageWrapper: (backgroundColor) => ({
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
    // backgroundColor: colorPalette.secondary,
    height: deviceWidth/4.5,
    width: deviceWidth/4.5
  }),
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <Entry {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);