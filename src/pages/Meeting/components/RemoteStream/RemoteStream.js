import React from 'react';
import { RTCView } from 'react-native-webrtc';
import { Dimensions, Image, StyleSheet, Text } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RemoteStream = ({
  callAccepted,
  remoteStream,
  callEnded,
  remoteVideoOn,
  remoteUserInfo,
  remoteUserDisconnected
}) => {
  if (remoteUserDisconnected) return <Text></Text>;

  return remoteStream && !callEnded ? (
    <RTCView
      streamURL={remoteStream?.toURL()}
      style={styles.stream}
      objectFit="cover"
      zOrder={0}
      mirror
    />
  ) : (
    !remoteVideoOn &&
      callAccepted &&
      remoteUserInfo &&
      remoteUserInfo.photo && (
        <Image
          source={{
            uri: remoteUserInfo.photo
          }}
          alt="photo"
          style={styles.stream}
        />
      )
  );
};

const styles = StyleSheet.create({
  profileImg: {
    width: windowWidth - 50,
    height: windowWidth - 50,
    marginTop: -100
  },
  stream: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight
  }
});

export default RemoteStream;
