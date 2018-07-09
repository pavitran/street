/*©Copyright startupgurukul.in*/
import { createStore } from "redux";
import { createMigrate, persistReducer, persistStore } from 'redux-persist'
import { rootReducer } from "./reducer";
import sessionStorage from 'redux-persist/lib/storage/session';
const migrations = {
  0: (state) => {
    // migration clear out device state
    return {
      ...state,
      device: undefined
    }
  },
  1: (state) => {
    // migration to keep only device state
    return {
      device: state.device
    }
  }
}
const persistConfig = {
  key: 'primary',
  version: 1,
  storage : sessionStorage,
  migrate: createMigrate(migrations, { debug: true }),
}


/*
*source : https://github.com/rt2zz/redux-persist/issues/126#issuecomment-270120325
*use : doesn't render the component until rehydration complete(what ever that means😜)
*/
// old implementation
/*export default function configureStore() {
  return new Promise((resolve, reject) => {
    try {
      //const store = createStore(rootReducer);
      const store = createStore(
        rootReducer,
        undefined,
        autoRehydrate()
      );
      persistStore(store, { storage : sessionStorage,blacklist: ['unclustered_markers','bound_switch','current_bounds',"switch_tab"] }, () => resolve(store));
      window.store = store;
    } catch (e) {
      reject(e);
    }
  });
}*/

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}
