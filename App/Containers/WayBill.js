/**
 * Created by Calvin Huang on 2/6/17.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Navigator,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import Color from 'color';
import moment from 'moment';

import store from '../storeInstance';

import { NavigatorComponent, MiumiuThemeNavigatorBackground, IconFasterShipping, HUD } from '../Components';
import UrgentProcessing from './UrgentProcessing';
import ServiceStore from './ServiceStore';
import WebInspector from './WebInspector';
import { NavigatorStyle, MiumiuTheme } from '../Styles';
import { WayBillState, stateInfoMapping } from '../Constants/states';
import { removeBadge, showUserQRCode, deleteWayBill, refreshWayBills } from '../Actions';
import { DATETIME_FORMAT, DOMAIN } from '../Constants/config';

const styles = {
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginLeft: 18,
    marginRight: 10,
    marginTop: 13,
    marginBottom: 9,
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.54)',
  },
  listViewRow: {
    ...MiumiuTheme.listViewRow,
    paddingVertical: 16,
    paddingHorizontal: 17,
  },
  infoFieldValueText: {
    ...MiumiuTheme.listViewText,
    flex: 1,
    textAlign: 'right',
  },
  guideLinkLabel: {
    fontWeight: 'bold',
    padding: 10,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  body: {
    flex: 1,
  },
};

class WayBill extends NavigatorComponent {
  static navRightButton({ data: { hex, status } }) {
    if (status === WayBillState.CONFIRMING) {
      return (
        <TouchableOpacity onPress={() => { store.dispatch(deleteWayBill(hex)); }}>
          <Text style={NavigatorStyle.itemTextButton}>
            刪除
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.route.data,
    };

    this.openStockFeeReference = this.openStockFeeReference.bind(this);
    this.checkServiceStoreButtonTapped = this.checkServiceStoreButtonTapped.bind(this);
  }

  componentDidMount() {
    this.props.removeBadge(`shipping:${this.props.route.data.shippingNo}`);
  }

  componentWillReceiveProps(props) {
    // Prevent triggering update from other components.
    if (!this.isCurrentRoute) {
      return;
    }

    if (this.props.isRequesting !== props.isRequesting) {
      if (!props.isRequesting) {
        if (!props.error) {
          this.props.refreshWayBills();
          this.props.navigator.pop();
        } else {
          // Wait HUD disappear.
          setTimeout(() => {
            Alert.alert(
              '發生了一點問題',
              props.error.message,
            );
          }, 100);
        }
      }
    }
  }

  checkServiceStoreButtonTapped() {
    const { data } = this.state;
    this.pushToNextComponent(ServiceStore, { id: data.locationId }, Navigator.SceneConfigs.FloatFromBottom);
  }

  openStockFeeReference() {
    this.pushToNextComponent(WebInspector, { title: '倉儲費用計算表', uri: `${DOMAIN}/stock_fees` }, Navigator.SceneConfigs.FloatFromBottom);
  }

  render() {
    const { data } = this.state;
    const { isRequesting } = this.props;
    const { icon, iconColor } = stateInfoMapping[data.status] || {};

    const sectionTitle = ((_data) => {
      switch (_data.status) {
        case WayBillState.CONFIRMING:
          return '待確認訂單，您可以申請加急服務';
        case WayBillState.SHIPPING:
          return (
            <Text style={styles.sectionText}>
              往 <Text style={{ ...styles.sectionText, color: 'black' }}>{data.locationName || '-'}</Text> 貨運中
            </Text>
          );
        case WayBillState.ARRIVED:
          return (
            <Text style={styles.sectionText}>
              已到 <Text style={{ ...styles.sectionText, color: 'black' }}>{data.locationName || '-'}</Text> 集貨中心，請儘速提領
            </Text>
          );
        default:
          return null;
      }
    })(data);

    return (
      <View style={MiumiuTheme.container}>
        <MiumiuThemeNavigatorBackground>
          <View style={NavigatorStyle.titleView}>
            <Text style={NavigatorStyle.titleText}>
              單號: { data.shippingNo }
            </Text>
          </View>
        </MiumiuThemeNavigatorBackground>
        <View style={styles.body}>
          <View style={styles.sectionHeader}>
            <Icon style={styles.sectionIcon} name={icon} size={24} color={iconColor} />
            <Text style={styles.sectionText}>{sectionTitle}</Text>
          </View>
          <View style={styles.listViewRow}>
            <Text style={MiumiuTheme.listViewText}>
              到貨日
            </Text>
            <Text style={styles.infoFieldValueText}>
              {data.arrivedAt ? moment(data.arrivedAt).format(DATETIME_FORMAT) : '-'}
            </Text>
          </View>
          <View style={styles.listViewRow}>
            <Text style={MiumiuTheme.listViewText}>
              到期日
            </Text>
            <Text style={styles.infoFieldValueText}>
              {data.expiredAt ? moment(data.expiredAt).format(DATETIME_FORMAT) : '-'}
            </Text>
          </View>
          <View style={styles.listViewRow}>
            <Text style={{ ...MiumiuTheme.listViewText, color: '#F6A623' }}>
              物流費用
            </Text>
            <Text style={{ ...styles.infoFieldValueText, color: '#F6A623' }}>
              {data.fee ? `$${data.fee}` : '-'}
            </Text>
          </View>
          <View style={styles.listViewRow}>
            <Text style={MiumiuTheme.listViewText}>
              倉儲費用
            </Text>
            <Text style={styles.infoFieldValueText}>
              {data.stockFee ? `$${data.stockFee}` : '-'}
            </Text>
          </View>
          <TouchableOpacity onPress={this.openStockFeeReference}>
            <Text style={{ ...MiumiuTheme.contentText, ...styles.guideLinkLabel, marginTop: 10 }}>完整的倉儲費用計算表</Text>
          </TouchableOpacity>
          { data.locationId && data.status === WayBillState.ARRIVED &&
            <TouchableOpacity onPress={this.checkServiceStoreButtonTapped}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...MiumiuTheme.contentText, textDecorationLine: 'none' }}>{data.locationName}</Text>
                <Icon name="md-information-circle" size={14} color="gray" style={{ marginLeft: 5, marginTop: 4 }} />
              </View>
            </TouchableOpacity>
          }
        </View>
        { data.status === WayBillState.CONFIRMING &&
          <View style={{ backgroundColor: Color(MiumiuTheme.buttonPrimary.backgroundColor).lighten(0.2) }}>
            <TouchableOpacity
              style={{ ...MiumiuTheme.actionButton, ...MiumiuTheme.buttonPrimary }}
              disabled={data.isUrgent}
              onPress={() => {
                this.pushToNextComponent(UrgentProcessing, data, Navigator.SceneConfigs.FloatFromBottom);
              }}
            >
              <IconFasterShipping style={MiumiuTheme.actionButtonIcon} iconColor="white" tintColor="white" />
              <Text style={{ ...MiumiuTheme.actionButtonText, opacity: !data.isUrgent ? 1 : 0.7 }}>
                {data.isUrgent ? '已加急' : '加急服務'}
              </Text>
            </TouchableOpacity>
          </View>
        }

        { data.status === WayBillState.ARRIVED &&
          <View style={{ backgroundColor: Color(MiumiuTheme.buttonWarning.backgroundColor).lighten(0.2) }}>
            <TouchableOpacity
              style={{ ...MiumiuTheme.actionButton, ...MiumiuTheme.buttonWarning }}
              onPress={() => { this.props.showUserQRCode(); }}
            >
              <Text style={{ ...MiumiuTheme.actionButtonText, ...MiumiuTheme.textShadow }}>取貨</Text>
            </TouchableOpacity>
          </View>
        }
        <HUD visible={this.isCurrentRoute && isRequesting} type="progress" message="更新中" />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { generalRequest } = state;
  return {
    ...ownProps,
    isRequesting: generalRequest.isRequesting,
    error: generalRequest.error,
  };
};

export default connect(
  mapStateToProps,
  { removeBadge, showUserQRCode, deleteWayBill, refreshWayBills },
)(WayBill);
