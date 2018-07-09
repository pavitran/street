import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';
import configureStore from "./redux/configureStore";
import registerServiceWorker from './registerServiceWorker';

import * as firebase from "firebase";
let config = require("./fb-config.json");
firebase.initializeApp(config);

//async function init() {
let { store, persistor } = configureStore();
  //const store = await configureStore();
  //const store = createStore(rootReducer);
  //window.store = store;
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
//}

// init();
registerServiceWorker();
