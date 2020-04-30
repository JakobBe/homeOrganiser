import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Picker, Switch, Keyboard } from 'react-native';
import { Button, Input, TouchableTextHighlight, CloseButton } from '../Common';
import { colorPalette, layouts } from '../../Style';
import moment from 'moment';

class CalendarModal extends Component {
  state = {
    newEvent: '',
    allDay: false,
    timeInformationPresented: true,
    timePickerPresented: false,
    hour: moment.utc().format('HH'),
    minute: moment.utc().format('MM'),
    needsUpdate: true
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.singleEventId && this.props.singleEventId !== prevProps.singleEventId) {
      const { text, allDay, time } = this.props.modalValue
      this.setState({
        newEvent: text,
        allDay,
        timeInformationPresented: !allDay,
        hour: time.substring(0,2),
        minute: time.substring(3, 5),
        needsUpdate: false
      })
    }
  }

  onSaveButtonPress = () => {
    let { newEvent, hour, minute, allDay } = this.state;
    if (allDay) {
      hour = '00';
      minute = '00';
    }

    if (this.props.singleEventId) {
      this.props.updateEvent(this.props.singleEventId, newEvent, allDay, `${hour}:${minute}`);
      this.setState({ newEvent: '', allDay: false, hour: moment.utc().format('HH'), minute: moment.utc().format('MM'), needsUpdate: false });
      return;
    }

    this.props.createEvent(newEvent, allDay, `${hour}:${minute}`); 
    this.setState({ newEvent: '', allDay: false, hour: moment.utc().format('HH'), minute: moment.utc().format('MM') });
  }

  onAllDayToggle = () => {
    Keyboard.dismiss();
    this.setState({
      allDay: !this.state.allDay,
      timeInformationPresented: this.state.allDay,
      timePickerPresented: this.state.allDay && this.state.timeInformationPresented
    });
  }

  getHourPickerItems = () => {
    const hours = Array.from({ length: 24 }, (v, k) => (k).toString());

    return hours.map(hour => {
      let visibleHour = hour.length === 1 ? `0${hour}` : hour
      return (
        <Picker.Item label={visibleHour} value={visibleHour} style={{ color: colorPalette.secondary }} />
      );
    });
  }

  getMinutePickerItems = () => {
    const minutes = Array.from({ length: 60 }, (v, k) => (k).toString());

    return minutes.map(minute => {
      let visibleMinute = minute.length === 1 ? `0${minute}` : minute
      return (
        <Picker.Item label={visibleMinute} value={visibleMinute} style={{ color: colorPalette.secondary }} />
      );
    });
  }

  getTimePicker = () => {
    const hourPickerItems = this.getHourPickerItems()
    const minutePickerItems = this.getMinutePickerItems()

    return this.state.timePickerPresented ? (
      <View style={styles.timePickerWrapper}>
        <Picker
          selectedValue={this.state.hour}
          onValueChange={value => this.setState({ hour: value })}
          style={{ height: 200, backgroundColor: 'white', width: 80, color: colorPalette.secondary }}
          itemStyle={{ height: 200 }}
        >
          {hourPickerItems}
        </Picker>
        <Text style={{ fontSize: 30, color: colorPalette.secondary }}>:</Text>
        <Picker
          selectedValue={this.state.minute}
          onValueChange={value => this.setState({ minute: value })}
          style={{ height: 200, backgroundColor: 'white', width: 80, color: colorPalette.secondary }}
          itemStyle={{ height: 200 }}
        >
          {minutePickerItems}
        </Picker>
      </View>
    ) : undefined;
  }

  getTimeInformation = () => {
    return this.state.timeInformationPresented ? (
      <TouchableTextHighlight
        onPress={() => this.setState({ timePickerPresented: !this.state.timePickerPresented })}
        feedbackColor={colorPalette.primary}
      >
        <View style={styles.timeWrapper}>
          <Text>
            Starting
          </Text>
          <Text>
            {this.state.hour}:{this.state.minute}
          </Text>
        </View>
      </TouchableTextHighlight>
    ) : undefined;
  }

  render() {
    const timePicker = this.getTimePicker();
    const timeInformation = this.getTimeInformation();

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <CloseButton
              onPress={() => {
                this.props.onModalClose(),
                this.setState({
                  newEvent: this.props.singleEventId ? this.state.newEvent : '',
                  needsUpdate: this.props.singleEventId ? true : false
                })
              }}
            />
            <View style={layouts.centerWrapper}>
              <Text style={styles.dateHeader}>
                {this.props.day}
              </Text>
            </View>
            {/* <TouchableHighlight
              onPress={() => { this.props.onModalClose(), 
                this.setState({ 
                  newEvent: this.props.singleEventId ? this.state.newEvent : '',
                  needsUpdate: this.props.singleEventId ? true : false
                }) 
              }}
              style={{ top: 3, left: '85%' }}
            >
              <Text style={{ color: colorPalette.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableHighlight> */}
            <Input
              value={this.state.newEvent}
              onChangeText={value => this.setState({ newEvent: value })}
              placeholder={'Enter a new event'}
              autoFocus={true}
            />
            <View style={styles.allDayWrapper}>
              <Text>
                All-day
              </Text>
              <Switch
                value={this.state.allDay}
                onValueChange={() => this.onAllDayToggle()}
              />
            </View>
            {timeInformation}
            {timePicker}
            <View style={layouts.centerWrapper}>
              <Button
                onPress={() => this.onSaveButtonPress()}
                additionalButtonStyles={styles.buttonStyle}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  modalContainer: {
    margin: 30,
    marginTop: 110,
    marginBottom: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
  },

  buttonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5
  },

  timePickerWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },

  allDayWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '',
    borderBottomStyle: 'solid',
    borderBottomWidth: .2,
    paddingBottom: 10
  },

  timeWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '',
    borderBottomStyle: 'solid',
    borderBottomWidth: .2,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 20
  },

  dateHeader: {
    fontWeight: 'bold'
  }
}

export { CalendarModal };