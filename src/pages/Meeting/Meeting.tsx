import React from 'react';
import { View } from 'react-native';

import VideoPlayer from '../../components/VideoPlayer';
function Meeting({ navigation, route }) {
  return <VideoPlayer navigation={navigation} route={route} />;
}

export default Meeting;
