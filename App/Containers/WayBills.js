/**
 * Created by Calvin Huang on 2/3/17.
 */
import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Navigator,
  Animated,
  Easing,
} from 'react-native';

import { connect } from 'react-redux';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import dismissKeyboard from 'dismissKeyboard';

import WayBill from './WayBill';
import AddWayBill from './AddWayBill';
import Calculator from './Calculator';
import { NavigatorComponent, WayBillStateView, IconFasterShipping } from '../Components';
import { MiumiuTheme, NavigatorStyle } from '../Styles';
import { WayBillState, UrgentState } from '../Constants/states';
import { showNavigationBar, hideNavigationBar } from '../Actions/navigationBarActions';
import { openSideDrawer } from '../Actions/sideDrawerActions';
import { showUserQRCode } from '../Actions/userActions';
import { fetchWayBills, refreshWayBills } from '../Actions/wayBillActions';
import store from '../storeInstance';

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class WayBills extends NavigatorComponent {
  static navLeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity onPress={() => { store.dispatch(openSideDrawer()); }}>
        <View style={NavigatorStyle.itemButton}>
          <Icon name="md-menu" size={24} color="white" />
        </View>
      </TouchableOpacity>
    );
  }

  static navRightButton(route, navigator, index, navState) {
    return (
      <View style={NavigatorStyle.itemButtonsContainer}>
        <TouchableOpacity
          onPress={() => {
            navigator.push({
              index: route.index + 1,
              component: AddWayBill,
              transition: Navigator.SceneConfigs.FloatFromBottom,
            });
          }}
        >
          <View style={{ ...NavigatorStyle.itemButton, marginRight: 9, marginLeft: 7 }}>
            <Icon name="md-add" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { store.dispatch(showUserQRCode()); }}>
          <View style={{ ...NavigatorStyle.itemButton, marginLeft: 16, marginRight: 2 }}>
            <FontAwesomeIcon name="qrcode" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  static propTypes = {
    wayBills: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequred,
        title: PropTypes.string.isRequred,
      })).isRequired,
    currentPage: PropTypes.number.isRequired,
  };

  static defaultProps = {
    wayBills: [],
    currentPage: 1,
    isRefreshing: false,
    isFetching: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      showNavButton: true,
      showTitle: true,
      navBarStretchValue: new Animated.Value(104),
      searchBarMarginBottom: new Animated.Value(9),
      cancelButtonMarginRight: new Animated.Value(-45),
      isSearching: false,
      wayBills: dataSource.cloneWithRows(props.wayBills),
      emptyStateImage: ((randomNumber) => {
        const images = [
          require('../../assets/images/cat-and-cardboard-1.png'),
          require('../../assets/images/cat-and-cardboard-2.png'),
          require('../../assets/images/cat-and-cardboard-3.png'),
          require('../../assets/images/cat-and-cardboard-4.png'),
        ];
        return images[randomNumber];
      })(Math.floor(Math.random() * 4)),
    };
  }

  componentDidMount() {
    const { wayBills } = this.props;

    if (wayBills.length <= 0) {
      this.props.fetchWayBills(this.props.currentPage);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      wayBills: dataSource.cloneWithRows(props.wayBills),
    });
  }

  showSearchBar() {
    this.props.hideNavigationBar();

    Animated.parallel([
      Animated.timing(
        this.state.navBarStretchValue,
        {
          toValue: 64,
          duration: 250,
          easing: Easing.linear,
        }
      ),
      Animated.timing(
        this.state.searchBarMarginBottom,
        {
          toValue: 49,
          duration: 250,
          easing: Easing.linear,
        }
      ),
      Animated.timing(
        this.state.cancelButtonMarginRight,
        {
          toValue: 10,
          duration: 250,
          easing: Easing.linear,
        }
      )
    ]).start();

    this.setState({ isSearching: true });
  }

  hideSearchBar() {
    dismissKeyboard();

    this.props.showNavigationBar();
    this.refs.searchBar.setNativeProps({ text: '' });

    Animated.parallel([
      Animated.timing(
        this.state.navBarStretchValue,
        {
          toValue: 104,
          duration: 250,
          easing: Easing.linear,
        }
      ),
      Animated.timing(
        this.state.searchBarMarginBottom,
        {
          toValue: 9,
          duration: 250,
          easing: Easing.linear,
        }
      ),
      Animated.timing(
        this.state.cancelButtonMarginRight,
        {
          toValue: -45,
          duration: 250,
          easing: Easing.linear,
        }
      )
    ]).start();

    this.setState({ isSearching: false });
  }

  searchBarTextChanged(text) {

  }
  
  onPaginating() {
    if (this.props.isFetching) {
      this.props.fetchWayBills(this.props.currentPage + 1)
    }
  }

  renderRowView(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => {
          this.hideSearchBar();
          this.pushToNextComponent(WayBill, rowData);
        }}>
        <WayBillStateView style={styles.wayBillState} state={rowData.status} />
        <Text style={{ ...MiumiuTheme.listViewText, opacity: rowData.status === WayBillState.CONFIRMING ? 0.6 : 1 }}>
          { rowData.shippingNo }
        </Text>
        { rowData.isUrgent &&
        <IconFasterShipping style={{ marginRight: 14 }} />
        }
        <Icon style={MiumiuTheme.listViewForwardIndicator} name="ios-arrow-forward" size={22} color="#D8D8D8" />
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    const rowData = this.props.wayBills;

    if (rowData.length - 1 == rowID) {
      return null;
    }

    return (
      <View key={`#seperator-${sectionID}-${rowID}`} style={styles.separatorContainer}>
        <View style={styles.separator} />
      </View>
    );
  }

  renderFooter() {
    if (this.props.error) {
      return (
        <TouchableOpacity
          style={{ ...MiumiuTheme.button, ...MiumiuTheme.buttonPrimary, margin: 10 }}
          onPress={() => { this.props.fetchWayBills(this.props.currentPage); }}
        >
          <Text style={MiumiuTheme.buttonText}>↻ 讀取失敗，重試一次</Text>
        </TouchableOpacity>
      );

    } else if (this.props.isFetching) {
      return (
        <View style={MiumiuTheme.paginationView}>
          <ActivityIndicator />
        </View>
      );

    } else if (this.props.wayBills.length === 0) {
      return (
        <View style={styles.emptyStateView}>
          <Image
            style={styles.emptyStateImageView}
            resizeMode="center"
            source={this.state.emptyStateImage}
          />
          <Text style={{ ...MiumiuTheme.sectionText, textAlign: 'center' }}>目前沒有貨單，快開始使用喵喵代收吧！</Text>
          <TouchableOpacity
            style={{ ...MiumiuTheme.button, ...MiumiuTheme.buttonPrimary, width: 300 }}
            onPress={() => {
              this.pushToNextComponent(AddWayBill, null, Navigator.SceneConfigs.FloatFromBottom)
            }}
          >
            <Text style={MiumiuTheme.buttonText}>新增貨單</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={MiumiuTheme.container}>
        <Animated.View
          style={{
            height: this.state.navBarStretchValue,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            start={{ x: 0.485544672, y: 1.08471279 }} end={{ x: 0.485544682, y: -0.0498809549 }}
            locations={[0, 0.0802375638, 0.438058036, 1]}
            colors={['#57C9EB', '#55BCE3', '#4E9ACF', '#487ABD']}
            style={MiumiuTheme.navBackgroundWithSearchBar}
          >
            { !this.state.isSearching &&
              <View style={NavigatorStyle.titleView}>
                <Image source={require('../../assets/images/icon-miumiu.png')} />
              </View>
            }
            <TouchableWithoutFeedback onPress={() => { this.refs.searchBar.focus(); }}>
              <Animated.View
                style={{
                  ...MiumiuTheme.searchBar,
                  marginBottom: this.state.searchBarMarginBottom,
                }}
              >
                <Icon name="ios-search" size={18} color="rgba(255, 255, 255, 0.65)" style={MiumiuTheme.searchBarIcon} />
                <TextInput
                  ref="searchBar"
                  style={{ ...MiumiuTheme.buttonText, flex: 1 }}
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  placeholder="輸入關鍵字查單"
                  onFocus={this.showSearchBar.bind(this)}
                  onChangeText={this.searchBarTextChanged.bind(this)}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
              }}
              onPress={this.hideSearchBar.bind(this)}
            >
              <Animated.Text
                style={{
                  ...MiumiuTheme.searchBarCancelButton,
                  marginBottom: this.state.searchBarMarginBottom,
                  marginRight: this.state.cancelButtonMarginRight,
                }}
              >
                取消
              </Animated.Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        { !this.state.isSearching &&
          <View
            style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F5C163',
              }}
          >
            <Text
              style={{
                ...MiumiuTheme.textShadow,
                ...MiumiuTheme.buttonText,
                flex: 0,
                marginLeft: 15,
              }}
            >
              嗨！你可以先
            </Text>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingLeft: 15,
              }}
              onPress={() => { this.pushToNextComponent(Calculator, null, Navigator.SceneConfigs.FloatFromBottom); }}
            >
              <Text
                style={{
                  ...MiumiuTheme.textShadow,
                  ...MiumiuTheme.buttonText,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  textDecorationColor: 'white',
                  textDecorationStyle: 'solid',
                }}
              >
                試算運費
              </Text>
            </TouchableOpacity>
          </View>
        }

        <ListView
          style={styles.wayBills}
          dataSource={this.state.wayBills}
          renderRow={this.renderRowView.bind(this)}
          renderSeparator={this.renderSeparator.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          onEndReached={this.onPaginating.bind(this)}
          onEndReachedThreshold={60}
          enableEmptySections={true}
          onScroll={() => { dismissKeyboard(); }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isRefreshing}
              onRefresh={this.props.refreshWayBills.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

const styles = {
  wayBills: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 57,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  separatorContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  separator: {
    flex: 1,
    marginLeft: 72,
    height: 1,
    backgroundColor: '#EFF0F4',
  },
  wayBillState: {
    marginLeft: 12,
    marginRight: 29,
  },
  emptyStateView: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyStateImageView: {
    width: 300,
    height: 200,
    marginTop: 55,
  },
};

const mapStateToProps = (state, ownProps) => {
  const { wayBills } = state;

  return {
    ...ownProps,
    wayBills: wayBills.data,
    currentPage: wayBills.currentPage,
    isRefreshing: wayBills.isRefreshing,
    isFetching: wayBills.isFetching,
    error: wayBills.error,
  };
};

export default connect(
  mapStateToProps,
  { showNavigationBar, hideNavigationBar, fetchWayBills, refreshWayBills }
)(WayBills);
