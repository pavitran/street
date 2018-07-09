/*©Copyright startupgurukul.in*/
import { combineReducers } from "redux";

export const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return allReducers(state, action);
};

const allReducers = combineReducers({
  route: currentRoute,
  user: currentUser,
  location : currentLocation,
  data : streeterData,
  current_bounds : currentBounds,
  bound_switch : boundSwitch,
  unclustered_markers : unclusteredMarkers,
  switch_tab : switchTab
});

function currentRoute(state = "", action) {
  switch (action.type) {
    case "CURRENT_ROUTE":
      return action.payload;
    // case "persist/REHYDRATE":
    //   debugger;
    //   return action.payload.route ? action.payload.route : state;
    default:
      return state;
  }
}

function currentUser(state = null, action) {
  switch (action.type) {
    case "CURRENT_USER":
      return action.payload;
    // case "persist/REHYDRATE":
    //   return action.payload.user ? action.payload.user : state;
    default:
      return state;
  }
}

function currentLocation(state = null, action) {
  switch (action.type) {
    case "CURRENT_LOCATION":
      return action.payload;
    // case "persist/REHYDRATE":
    //   return action.payload.location ? action.payload.location : state;
    default:
      return state;
  }
}

function streeterData(state = [], action) {
  switch (action.type) {
    case "STREETER_DATA":
      return {...state,...action.payload};
    case "DELETE_STREETER_DATA":
      return {};
    // case "persist/REHYDRATE":
    //   return action.payload.data ? action.payload.data : state;
    default:
      return state;
  }
}

function currentBounds(state = null, action) {
  switch (action.type) {
    case "CURRENT_BOUNDS":
      return action.payload;
    default:
      return state;
  }
}
function boundSwitch(state = false, action) {
  switch (action.type) {
    case "BOUND_SWITCH":
      return action.payload;
    default:
      return state;
  }
}

function unclusteredMarkers(state = null, action) {
  switch (action.type) {
    case "UNCLUSTERED_MARKERS":
      return action.payload;
    default:
      return state;
  }
}

function detailsModalData(state = null, action) {
  switch (action.type) {
    case "DETAILS_MODAL_DATA":
      return action.payload;
    default:
      return state;
  }
}

function detailsModalVisibility(state = false, action) {
  switch (action.type) {
    case "DETAILS_MODAL_SHOW":
      return !state;
    default:
      return state;
  }
}
function switchTab(state = 1, action) {
  switch (action.type) {
    case "SWITCH_TAB":
      return !state;
    default:
      return state;
  }
}
