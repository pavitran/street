/*©Copyright startupgurukul.in*/
export const currentRoute = route => {
  return {
    type: "CURRENT_ROUTE",
    payload: route
  };
};
export const currentUser = user => {
  return {
    type: "CURRENT_USER",
    payload: user
  };
};
export const currentLocation = loc => {
  return {
    type: "CURRENT_LOCATION",
    payload: loc
  };
};
export const streeterData = data => {
  return {
    type: "STREETER_DATA",
    payload: data
  };
};

export const setBounds = bounds => {
  return {
    type: "CURRENT_BOUNDS",
    payload: bounds
  };
};
export const setBoundSwitch = data => {
  return {
    type: "BOUND_SWITCH",
    payload : data
  };
};
export const setUnClusteredMarker = markerData => {
  return {
    type: "UNCLUSTERED_MARKERS",
    payload: markerData
  };
};

export const setDetailsModalData = modalData => {
  return {
    type: "DETAILS_MODAL_DATA",
    payload: modalData
  };
};

export const setdetailsModalVisibility = () => {
  return {
    type: "DETAILS_MODAL_SHOW"
  };
};

export const switchTab = () => {
  return {
    type: "SWITCH_TAB"
  };
}
