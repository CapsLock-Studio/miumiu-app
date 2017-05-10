/**
 * Created by calvin.huang on 10/05/2017.
 */

import * as ActionTypes from '../Constants/actionTypes';
import { updateBadges } from '../Actions/badgeActions';

import { get, del } from '../Utils/api';

export function fetchBadges(action$) {
  return action$.ofType(ActionTypes.FETCH_BADGES)
    .switchMap(async (_) => {
      const response = await get('badges');

      return updateBadges(response);
    });
}

export function removeBadge(action$) {
  return action$.ofType(ActionTypes.REMOVE_BADGE)
    .switchMap(async (action) => {
      const response = await del(`badges/${action.badge}`);

      return updateBadges(response);
    });
}
