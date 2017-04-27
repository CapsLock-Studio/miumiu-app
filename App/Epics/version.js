/**
 * Created by calvin.huang on 25/04/2017.
 */

import { Observable } from 'rxjs';

import { FETCH_CURRENT_VERSION_INFO } from '../Constants/actionTypes';
import { showVersionOutdatedHint } from '../Actions';

import { get } from '../Utils/api';

import humps from 'humps';
import compareVersions from 'compare-versions';

import DeviceInfo from 'react-native-device-info';

export function checkVersion(action$) {
  return action$.ofType(FETCH_CURRENT_VERSION_INFO)
    .switchMap((_) => {
      return new Observable(async (observer) => {
        try {
          const { name: currentVersion, forceUpdate } = humps.camelizeKeys(await get('version'));
          const version = DeviceInfo.getVersion();

          if (compareVersions(currentVersion, version) === 1) {
            observer.next(showVersionOutdatedHint(currentVersion, forceUpdate));
          }

        } catch (error) {
          // Do nothing when fetch version info failed.
        }

        observer.complete();
      });
    });
}
