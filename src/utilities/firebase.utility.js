// Import the functions you need from the SDKs you need
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import appCore from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

let app = null;
let auth = null;

if (!appCore.apps.length) {
  (async () => {
    try {
      app = await appCore.initializeApp({
        apiKey: 'AIzaSyBePGAmFdmabeI9jat4cFyxPg5RwML-arI',
        authDomain: 'bonum-web-test.firebaseapp.com',
        projectId: 'bonum-web-test',
        storageBucket: 'bonum-web-test.appspot.com',
        messagingSenderId: '312546331631',
        appId: '1:312546331631:web:2d20f2f62b8dcd0d91041a'
      });
    } catch (error) {
      console.log('Error al conectar a firebase');
    }
  })();
} else {
  app = appCore.app();
}

auth = app.auth(app);
let firestore = app.firestore();
export { auth, firestore };
// export const firestore = app.(app);
// export const storage = getStorage(app);

export function translateFirebaseErrors({ code }) {
  let message = '';
  switch (code) {
    case 'auth/wrong-password': {
      message = 'La contraseña es incorrecta';
      break;
    }

    case 'auth/user-not-found': {
      message = 'El usuario no existe';
      break;
    }

    case 'auth/too-many-requests': {
      message = 'Demasiados intentos, vuelva a intentar en 10 minutos';
      break;
    }

    case 'EMAIL_NOT_FOUND': {
      message = 'El correo no existe';
      break;
    }

    case 'INVALID_PASSWORD': {
      message = 'Contraseña incorrecta';
      break;
    }

    default: {
      message = 'Error, contacte al administrador';
      break;
    }
  }

  return message;
}
