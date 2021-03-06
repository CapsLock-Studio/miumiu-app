/**
 * Created by Calvin Huang on 3/11/17.
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';
import { MKTextField } from 'react-native-material-kit';
import Color from 'color';
import Icon from 'react-native-vector-icons/Ionicons';

import dismissKeyboard from 'dismissKeyboard';

import { NavigatorComponent, MiumiuThemeNavigatorBackground } from '../Components';
import { MiumiuTheme, NavigatorStyle } from '../Styles';
import { openSideDrawer } from '../Actions';
import store from '../storeInstance';

const styles = {
  body: {
    flex: 1,
  },
  pickUpPasswordSection: {
    alignItems: 'center',
  },
  codeFieldGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  codeField: {
    width: 40,
    height: 54,
    marginHorizontal: 16,
    marginBottom: 21,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    textAlign: 'center',
  },
  forgetButton: {
    ...MiumiuTheme.button,
    marginTop: 20,
  },
  forgetButtonText: {
    ...MiumiuTheme.contentText,
    textDecorationLine: 'underline',
  },
};

class PickUpPassword extends NavigatorComponent {
  static navLeftButton() {
    return (
      <TouchableOpacity
        onPress={() => { store.dispatch(openSideDrawer()); }}
      >
        <View style={NavigatorStyle.itemButton}>
          <Icon name="md-menu" size={24} color="white" />
        </View>
      </TouchableOpacity>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      codes: ['', '', '', ''],
    };
  }

  codeFieldTextChanged(codeFieldNumber, text) {
    const nextCodeField = this.refs[`codeField${codeFieldNumber + 1}`];

    const codes = this.state.codes;
    codes[codeFieldNumber] = text;
    this.setState({
      codes,
    });

    if (text !== '') {
      if (nextCodeField) {
        nextCodeField.focus();
      } else {
        dismissKeyboard();
      }
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { dismissKeyboard(); }}>
        <View style={MiumiuTheme.container}>
          <MiumiuThemeNavigatorBackground>
            <View style={NavigatorStyle.titleView}>
              <Text style={NavigatorStyle.titleText}>
                取貨鎖設定
              </Text>
            </View>
          </MiumiuThemeNavigatorBackground>
          <View style={styles.body}>
            <View style={styles.pickUpPasswordSection}>
              <Text style={MiumiuTheme.sectionText}>
                請輸入取貨鎖密碼
              </Text>
              <View style={styles.codeFieldGroup}>
                <TextInput
                  ref={(ref) => { this.codeField1 = ref; }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.codeField}
                  onChangeText={text => this.codeFieldTextChanged(1, text)}
                />
                <TextInput
                  ref={(ref) => { this.codeField2 = ref; }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.codeField}
                  onChangeText={text => this.codeFieldTextChanged(2, text)}
                />
                <TextInput
                  ref={(ref) => { this.codeField3 = ref; }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.codeField}
                  onChangeText={text => this.codeFieldTextChanged(3, text)}
                />
                <TextInput
                  ref={(ref) => { this.codeField4 = ref; }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.codeField}
                  onChangeText={text => this.codeFieldTextChanged(4, text)}
                />
              </View>
            </View>
            <Text style={MiumiuTheme.sectionText}>
              * 基於安全考量，請你協助我們確認是本人在操作
            </Text>
            <View style={MiumiuTheme.textFieldGroup}>
              <MKTextField
                floatingLabelEnabled
                textInputStyle={{ height: 31 }}
                underlineSize={1}
                highlightColor="#D8D8D8"
                placeholder="請輸入密碼"
                placeholderTextColor="#9E9E9E"
                style={{ backgroundColor: 'white' }}
                onChangeText={(password) => { this.setState({ password }); }}
                value={this.state.password}
              />
            </View>
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <View style={{ backgroundColor: Color(MiumiuTheme.buttonPrimary.backgroundColor).lighten(0.2) }}>
              <TouchableOpacity
                style={{ ...MiumiuTheme.actionButton, ...MiumiuTheme.buttonPrimary }}
                onPress={() => {
                  dismissKeyboard();
                }}
              >
                <Text style={MiumiuTheme.actionButtonText}>確認</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state, ownProps) => ownProps;

export default connect(
  mapStateToProps,
  {},
)(PickUpPassword);
