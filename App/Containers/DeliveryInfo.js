/**
 * Created by Calvin Huang on 3/8/17.
 */

import React from 'react';
import {
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Clipboard,
  Platform,
} from 'react-native';

import dismissKeyboard from 'dismissKeyboard';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { MKTextField } from 'react-native-material-kit';

import { NavigatorComponent, MiumiuThemeNavigatorBackground, HUD } from '../Components';
import { MiumiuTheme, NavigatorStyle } from '../Styles';
import { fetchDeliveryInfo } from '../Actions';

// Delivery info id fixed to 4.
const data = { id: 4 };

const styles = {
  body: {
    marginTop: 27,
    flex: 1,
    zIndex: -1,
  },
  inlineFieldGroup: {
    flexDirection: 'row',
  },
  copyButton: {
    paddingLeft: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  copyButtonText: {
    marginLeft: 4,
    color: '#0091FF',
  },
  textInputTouchReceiver: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

class DeliveryInfo extends NavigatorComponent {
  static navLeftButton(route, navigator) {
    return (
      <TouchableOpacity onPress={() => { navigator.pop(); }}>
        <Icon
          style={NavigatorStyle.navBackButton}
          name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    );
  }

  constructor(props) {
    super(props);

    let initStates = {
      data: this.props.route.data,
      keyboardVerticalOffset: 0,
    };

    const { name: serviceStoreName } = initStates.data;

    if (props.deliveryInfo) {
      const { deliveryInfo } = props;
      initStates = {
        ...initStates,
        area: deliveryInfo.area,
        street: deliveryInfo.street,
        name: deliveryInfo.name,
        address: deliveryInfo.address,
        phone: deliveryInfo.phone,
        zipcode: deliveryInfo.zipcode,
        receiver: `${serviceStoreName} ${deliveryInfo.receiver}`,
      };
    }

    this.state = initStates;

    this.layoutOffset = {};
  }

  componentWillMount() {
    const { deliveryInfo } = this.props;
    const info = deliveryInfo || {};
    if (!info.address) {
      // Delivery info id fixed to 4.
      this.props.fetchDeliveryInfo(data.id);
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.deliveryInfo !== props.deliveryInfo) {
      const { name: serviceStoreName } = props.route.data;
      const { area, street, name, address, phone, zipcode, receiver } = props.deliveryInfo;
      this.setState({
        area,
        street,
        name,
        address,
        phone,
        zipcode,
        receiver: `${serviceStoreName} ${receiver}`,
      });
    }
  }

  copyText(fieldName) {
    const copyString = this.state[fieldName];
    if (copyString) {
      Clipboard.setString(copyString);

      this.HUD.flash(2);
    }
  }

  measureLayout(refName, event) {
    const { height: screenHeight } = Dimensions.get('window');
    const { y, height } = event.nativeEvent.layout;
    const navigationBarHeight = 64;
    const graceMarginBottom = 20;

    this.layoutOffset[refName] = -(screenHeight - y - height - navigationBarHeight - graceMarginBottom);
  }

  modifyKeyboardVerticalOffset(refName) {
    this.setState({ keyboardVerticalOffset: this.layoutOffset[refName] });

    this[refName].focus();
  }

  render() {
    const { isFetching, error } = this.props;
    const { area, street, address, phone, zipcode, receiver } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => { dismissKeyboard(); }}>
        <View style={MiumiuTheme.container}>
          <MiumiuThemeNavigatorBackground>
            <View style={NavigatorStyle.titleView}>
              <Text style={NavigatorStyle.titleText}>{data.name}收貨地址</Text>
            </View>
          </MiumiuThemeNavigatorBackground>
          { error &&
            <TouchableOpacity
              style={{ ...MiumiuTheme.button, ...MiumiuTheme.buttonPrimary, margin: 10 }}
              onPress={() => { this.props.fetchServiceStore(data.id); }}
            >
              <Text style={MiumiuTheme.buttonText}>↻ 讀取失敗，重試一次</Text>
            </TouchableOpacity>
          }
          { !error &&
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={this.state.keyboardVerticalOffset}
              style={styles.body}
            >
              <View
                onLayout={event => this.measureLayout('receiverField', event)}
                style={{ ...MiumiuTheme.textFieldGroup, ...styles.inlineFieldGroup }}
              >
                <View style={MiumiuTheme.fixMKTextFieldStyleError}>
                  <MKTextField
                    ref={(ref) => { this.receiverField = ref; }}
                    floatingLabelEnabled
                    textInputStyle={{ height: 31 }}
                    underlineSize={1}
                    highlightColor="#9E9E9E"
                    placeholder="收貨人"
                    placeholderTextColor="#9E9E9E"
                    style={{ backgroundColor: 'white' }}
                    onChangeText={(text) => { this.setState({ receiver: text }); }}
                    value={receiver}
                  />
                  <TouchableWithoutFeedback onPress={() => this.modifyKeyboardVerticalOffset('receiverField')}>
                    <View style={styles.textInputTouchReceiver} />
                  </TouchableWithoutFeedback>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={() => this.copyText('receiver')}>
                  <Icon name="md-clipboard" color="#0091FF" />
                  <Text style={styles.copyButtonText}>複製</Text>
                </TouchableOpacity>
              </View>
              <View
                onLayout={event => this.measureLayout('phoneNumberField', event)}
                style={{ ...MiumiuTheme.textFieldGroup, ...styles.inlineFieldGroup }}
              >
                <View style={MiumiuTheme.fixMKTextFieldStyleError}>
                  <MKTextField
                    ref={(ref) => { this.phoneNumberField = ref; }}
                    floatingLabelEnabled
                    textInputStyle={{ height: 31 }}
                    underlineSize={1}
                    highlightColor="#9E9E9E"
                    placeholder="收貨人電話"
                    placeholderTextColor="#9E9E9E"
                    style={{ backgroundColor: 'white' }}
                    onFocus={() => this.modifyKeyboardVerticalOffset('phoneNumberField')}
                    onChangeText={(text) => { this.setState({ phone: text }); }}
                    value={phone}
                  />
                  <TouchableWithoutFeedback onPress={() => this.modifyKeyboardVerticalOffset('phoneNumberField')}>
                    <View style={styles.textInputTouchReceiver} />
                  </TouchableWithoutFeedback>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={() => this.copyText('phone')}>
                  <Icon name="md-clipboard" color="#0091FF" />
                  <Text style={styles.copyButtonText}>複製</Text>
                </TouchableOpacity>
              </View>
              <View
                onLayout={event => this.measureLayout('areaField', event)}
                style={{ ...MiumiuTheme.textFieldGroup, ...styles.inlineFieldGroup }}
              >
                <View style={MiumiuTheme.fixMKTextFieldStyleError}>
                  <MKTextField
                    ref={(ref) => { this.areaField = ref; }}
                    floatingLabelEnabled
                    textInputStyle={{ height: 31 }}
                    underlineSize={1}
                    highlightColor="#9E9E9E"
                    placeholder="地區"
                    placeholderTextColor="#9E9E9E"
                    style={{ backgroundColor: 'white' }}
                    onFocus={() => this.modifyKeyboardVerticalOffset('areaField')}
                    onChangeText={(text) => { this.setState({ data: { ...data, area: text } }); }}
                    value={area}
                  />
                  <TouchableWithoutFeedback onPress={() => this.modifyKeyboardVerticalOffset('areaField')}>
                    <View style={styles.textInputTouchReceiver} />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View
                onLayout={event => this.measureLayout('streetField', event)}
                style={{ ...MiumiuTheme.textFieldGroup, ...styles.inlineFieldGroup }}
              >
                <View style={MiumiuTheme.fixMKTextFieldStyleError}>
                  <MKTextField
                    ref={(ref) => { this.streetField = ref; }}
                    floatingLabelEnabled
                    textInputStyle={{ height: 31 }}
                    underlineSize={1}
                    highlightColor="#9E9E9E"
                    placeholder="街道"
                    placeholderTextColor="#9E9E9E"
                    style={{ backgroundColor: 'white' }}
                    onFocus={() => this.modifyKeyboardVerticalOffset('streetField')}
                    onChangeText={(text) => { this.setState({ data: { ...data, street: text } }); }}
                    value={street}
                  />
                  <TouchableWithoutFeedback onPress={() => this.modifyKeyboardVerticalOffset('streetField')}>
                    <View style={styles.textInputTouchReceiver} />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View
                onLayout={event => this.measureLayout('addressField', event)}
                style={{ ...MiumiuTheme.textFieldGroup, ...styles.inlineFieldGroup }}
              >
                <View style={MiumiuTheme.fixMKTextFieldStyleError}>
                  <MKTextField
                    ref={(ref) => { this.addressField = ref; }}
                    floatingLabelEnabled
                    multiline
                    textInputStyle={{ height: 50 }}
                    underlineSize={1}
                    highlightColor="#9E9E9E"
                    placeholder="街道"
                    placeholderTextColor="#9E9E9E"
                    style={{ backgroundColor: 'white' }}
                    onFocus={() => this.modifyKeyboardVerticalOffset('addressField')}
                    onChangeText={(text) => { this.setState({ address: text }); }}
                    value={address}
                  />
                  <TouchableWithoutFeedback onPress={() => this.modifyKeyboardVerticalOffset('addressField')}>
                    <View style={styles.textInputTouchReceiver} />
                  </TouchableWithoutFeedback>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={() => this.copyText('address')}>
                  <Icon name="md-clipboard" color="#0091FF" />
                  <Text style={styles.copyButtonText}>複製</Text>
                </TouchableOpacity>
              </View>
              <View
                onLayout={event => this.measureLayout('postCodeField', event)}
                style={{ ...MiumiuTheme.textFieldGroup, ...styles.inlineFieldGroup }}
              >
                <View style={MiumiuTheme.fixMKTextFieldStyleError}>
                  <MKTextField
                    ref={(ref) => { this.postCodeField = ref; }}
                    editable={false}
                    floatingLabelEnabled
                    textInputStyle={{ height: 31 }}
                    underlineSize={1}
                    highlightColor="#9E9E9E"
                    placeholder="郵政編號"
                    placeholderTextColor="#9E9E9E"
                    style={{ backgroundColor: 'white' }}
                    onFocus={() => this.modifyKeyboardVerticalOffset('postCodeField')}
                    onChangeText={(text) => { this.setState({ zipcode: text }); }}
                    value={zipcode}
                  />
                  <TouchableWithoutFeedback onPress={() => this.modifyKeyboardVerticalOffset('postCodeField')}>
                    <View style={styles.textInputTouchReceiver} />
                  </TouchableWithoutFeedback>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={() => this.copyText('zipcode')}>
                  <Icon name="md-clipboard" color="#0091FF" />
                  <Text style={styles.copyButtonText}>複製</Text>
                </TouchableOpacity>
              </View>
              { isFetching &&
                <View style={MiumiuTheme.paginationView}>
                  <ActivityIndicator />
                </View>
              }
            </KeyboardAvoidingView>
          }
          <HUD ref={(ref) => { this.HUD = ref; }} type="success" message="已複製到剪貼簿" />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { deliveryInfo, deliveryInfoList } = state;

  // Delivery info id fixed to 4.
  // const { data } = ownProps.route;
  const info = deliveryInfoList.data.find(object => object.id === data.id);
  return {
    ...ownProps,
    isFetching: deliveryInfo.isFetching,
    error: deliveryInfo.error,
    deliveryInfo: info,
  };
};

export default connect(
  mapStateToProps,
  { fetchDeliveryInfo },
)(DeliveryInfo);
