import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import {Ionicons} from '@expo/vector-icons'
// import { Text } from 'react-native';
// import ChatColors from '../../constants/chatColors'
// import Photo from './Photo'
// import Chats from './Chats'
//import { doc, setDoc } from '@firebase/firestore'
//import { auth, db } from '../../utils/firebase'
// import { ContactsFloatingIcon } from '../../components/chat/ContactsFloatingIcon';
import ChatColors from './constants/chatColors';
import ContactsFloatingIcon from './components/ContactsFloatingIcon';
import Chats from './components/Chats';

const Home = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarItemStyle: {
            display: 'none'
          }
        }}
        initialRouteName="chats"
      >
        {/* <Tab.Screen name="photo" component={Mock} /> */}
        <Tab.Screen
          name="chats"
          component={Chats}
          options={{ header: () => null }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Home;
