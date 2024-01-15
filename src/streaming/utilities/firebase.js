import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

let app = null;

if (!firebase.apps.length) {
  (async () => {
    try {
      app = await firebase.initializeApp({
        apiKey: 'AIzaSyB5McU4c6SV_i8GQdawViwZv1tjwuSfbGQ',
        authDomain: 'bonum-web-production.firebaseapp.com',
        projectId: 'bonum-web-production',
        storageBucket: 'bonum-web-production.appspot.com',
        messagingSenderId: '257283497244',
        appId: '1:257283497244:web:68112e9d12ce94660f2ed9',
        measurementId: 'G-LTFVRX7YN3'
      });
    } catch (error) {
      console.log('Error al conectar a firebase');
    }
  })();
} else {
  app = firebase.app();
}

export const db = app.firestore();
