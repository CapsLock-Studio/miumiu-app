/**
 * Created by calvin.huang on 08/05/2017.
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import HtmlRender from 'react-native-html-render';

import { NavigatorComponent, MiumiuThemeNavigatorBackground } from '../Components';
import { MiumiuTheme, NavigatorStyle } from '../Styles';
import { hideNavigationBar } from '../Actions/navigationBarActions';
import { fetchBulletin } from '../Actions/bulletinActions';

const styles = {
  body: {
    flex: 1,
    marginTop: 27,
    paddingVertical: 13,
    paddingHorizontal: 17,
    backgroundColor: 'white',
  },
};

class Bulletin extends NavigatorComponent {
  componentWillMount() {
    const { bulletin } = this.props;
    if (!bulletin || !bulletin.content) {
      this.props.fetchBulletin(this.props.route.data.id);
    }
  }

  componentWillUnmount() {
    if (this.props.isSearching) {
      this.props.hideNavigationBar();
    }
  }

  render() {
    const { route: { data }, bulletin, isFetching, error } = this.props;
    const { title, content } = bulletin || {};

    return (
      <View style={MiumiuTheme.container}>
        <MiumiuThemeNavigatorBackground>
          <View style={{ ...NavigatorStyle.titleView, left: 0, right: 0 }}>
            <Text numberOfLines={1} style={{ ...NavigatorStyle.titleText, marginHorizontal: 30 }}>
              {title}
            </Text>
          </View>
        </MiumiuThemeNavigatorBackground>
        <ScrollView>
          <View style={styles.body}>
            { isFetching &&
            <View style={MiumiuTheme.paginationView}>
              <ActivityIndicator />
            </View>
            }
            { error &&
            <TouchableOpacity
              style={{ ...MiumiuTheme.button, ...MiumiuTheme.buttonPrimary, margin: 10 }}
              onPress={() => { this.props.fetchFAQ(data.id); }}
            >
              <Text style={MiumiuTheme.buttonText}>↻ 讀取失敗，重試一次</Text>
            </TouchableOpacity>
            }
            { !isFetching && !error &&
            <HtmlRender
              value={content}
              onLinkPress={url => Linking.openURL(url)}
            />
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bulletin, bulletinBoard } = state;
  const { data } = ownProps.route;
  const bulletinInfo = bulletinBoard.data.find(object => object.id === data.id);

  return {
    ...ownProps,
    isFetching: bulletin.isFetching,
    isSearching: bulletinBoard.isSearching,
    error: bulletin.error,
    bulletin: bulletinInfo,
  };
};

export default connect(
  mapStateToProps,
  { hideNavigationBar, fetchBulletin },
)(Bulletin);
