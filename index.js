/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './App';
import store from './src/redux/store';
import {name as appName} from './app.json';
import {RootSiblingParent} from 'react-native-root-siblings';
import {NativeBaseProvider} from 'native-base';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import './src/intecerptors/axios.interceptor';
import global_es from './src/translations/es/global.json';
import global_en from './src/translations/en/global.json';
import global_pt from './src/translations/pt/global.json';
import {SafeAreaProvider} from 'react-native-safe-area-context';

i18next.init({
  compatibilityJSON: 'v3',
  interpolation: {escapeValue: true},
  resources: {
    es: {
      global: global_es,
    },
    en: {
      global: global_en,
    },
    pt: {
      global: global_pt,
    },
  },
  lng: 'es',
});

const RNRedux = () => (
  <Provider store={store}>
    <RootSiblingParent>
      <NativeBaseProvider>
        <I18nextProvider i18n={i18next}>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </I18nextProvider>
      </NativeBaseProvider>
    </RootSiblingParent>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
