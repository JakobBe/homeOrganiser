import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { fetchHomes } from '../../RailsClient';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { UserContext } from '../../contexts/UserContextHolder';
import HomeSelectorModal from './HomeSelectorModal';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette } from '../../Style/Colors';
import { appSyncGraphQl } from '../../AWSClient';
import { createHome } from '../../graphql/Homes/mutations';
import { listHomes } from '../../graphql/Homes/queries';
import { listPendingInvitationsWithEmail } from '../../graphql/Invitaions/queries';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { invitationStatus } from '../../Helpers/magicNumbers';
import { faHammer, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { NotificationNumber } from '../Common';

class HomeSelector extends Component {
  state = {
    homes: undefined,
    createModalPresented: false,
    joinModalPresented: false,
    homeId: undefined,
    invitations: undefined,
  }

  componentDidMount() {
    appSyncGraphQl({query: listHomes})
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            homes: res.res.listHomes.items
          });
        }
      })

    const variables = {
      email: this.props.homeContext.currentUser.email,
      status: invitationStatus.pending
    };
    appSyncGraphQl({ query: listPendingInvitationsWithEmail, variables })
      .then((res) => {
        if (res.status === 200) {
          console.log('res from inivations for User', res.res.listInvitations);
          this.setState({
            invitations: res.res.listInvitations.items
          });         
        }
      })
  }

  componentWillReceiveProps(props) {
    console.log('new props', props);
  }

  onModalClose = () => {
    this.setState({
      createModalPresented: false,
      joinModalPresented: false,
    })
  }

  onCreateHomePress = () => {
    this.setState({
      createModalPresented: true,
    })
  }

  onJoinHomePress = () => {
    this.setState({
      joinModalPresented: true,
    })
  }

  successfulHomeSelection = async (homeId) => {
    await this.props.homeContext.buildHomeContext(homeId);
    Actions.newProfile({ type: ActionConst.REPLACE });
  }

  render() {
    const notification = this.state.invitations && this.state.invitations.length > 0 ? <NotificationNumber invitations={this.state.invitations} /> : undefined;
    return (
      <View style={styles.homeSelectorContainer}>
        <View style={styles.textWrapper}>
          <Text style={styles.mainText}>
            Welcome to EggPlanner. {"\n"} {"\n"}
            <Text style={styles.mainTextBody}>
              In order to get started you have to create a new Home or join an existing one.
            </Text>
          </Text>
        </View>
        <View style={styles.guideWrapper}>
          <View style={styles.navigationWrapper}>
          <TouchableOpacity style={styles.imageWrapper} onPress={this.onCreateHomePress}>
              <FontAwesomeIcon icon={faHammer} style={{ color: colorPalette.primary, marginBottom: 8 }} size={60} mask={['far', 'circle']} />
            {/* <Image source={require('../../../assets/images/eggplant_single.png')} style={styles.imageStyle}/> */}
          </TouchableOpacity>
          <Text style={styles.navigationText}>
            Create
          </Text>
          </View>
          <View style={styles.navigationWrapper}>
            <TouchableOpacity style={styles.imageWrapper} onPress={this.onJoinHomePress}>
              <FontAwesomeIcon icon={faDoorOpen} style={{ color: colorPalette.primary, marginBottom: 8 }} size={60} mask={['far', 'circle']} />
              {/* <Image source={require('../../../assets/images/eggplant_double.png')} style={styles.imageStyle} /> */}
            </TouchableOpacity>
            <Text style={styles.navigationText}>
              Join
            </Text>
            {notification}
          </View>
        </View>
        <HomeSelectorModal 
          createModalPresented={this.state.createModalPresented}
          joinModalPresented={this.state.joinModalPresented}
          onModalClose={this.onModalClose}
          homes={this.state.homes}
          user={this.props.homeContext.currentUser}
          successfulHomeSelection={this.successfulHomeSelection}
          invitations={this.state.invitations}
        />
      </View>
    );
  }
}

const styles = {
  homeSelectorContainer: {
    padding: 30,
  },

  textWrapper: {
  },

  mainText: {
    fontSize: 20,
    color: colorPalette.secondary,
    lineHeight: 35,
    letterSpacing: 3
  },

  mainTextBody: {
    fontSize: 18,
    letterSpacing: 1
  },

  guideWrapper: {
    marginTop: 50,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30
  },

  imageWrapper: {
    flex: 0,
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
  },

  imageStyle: {
    height: 80,
    width: 80
  },

  navigationWrapper: {
    flex: 0,
    alignItems: 'center',
    position: 'relative'
  },

  navigationText: {
    fontSize: 18,
    color: colorPalette.secondary
  }
}

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <HomeSelector {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);
