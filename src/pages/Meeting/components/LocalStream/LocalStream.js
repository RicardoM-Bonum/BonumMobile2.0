import { Avatar, View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { RTCView } from 'react-native-webrtc';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LocalStream = ({ callAccepted, localStream, video, user }) => {
  return callAccepted ? (
    localStream && video ? (
      <RTCView
        streamURL={localStream?.toURL()}
        style={styles.remoteStream}
        zOrder={1}
        objectFit="cover"
        mirror
      />
    ) : (
      user && (
        <View
          style={{
            height: windowHeight,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Avatar
            source={{
              uri: user.photo ? user.photo : ''
            }}
            style={styles.profileImg}
          />
        </View>
      )
    )
  ) : localStream && video ? (
    <RTCView
      streamURL={localStream?.toURL()}
      style={styles.remoteStream}
      objectFit="cover"
      zOrder={1}
      mirror
    />
  ) : (
    user && (
      <View
        style={{
          flex: 1,
          height: windowHeight,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Avatar
          source={{
            uri: user.urlImgCoachee ? user.urlImgCoachee : user.urlImgCoach
          }}
          style={styles.profileImg}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  profileImg: {
    width: windowWidth - 50,
    height: windowWidth - 50,
    marginTop: -100
  },
  stream: {
    flex: 1,
    position: 'absolute'
  },
  backScreen: {
    position: 'absolute',
    display: 'flex',
    zIndex: 5,
    left: 5,
    top: 10
  },
  remoteStream: {
    flex: 1,
    position: 'absolute',
    borderRadius: 10,
    right: 20,
    zIndex: 10,
    top: 20,
    width: 150,
    height: 250
  },
  eachBotton: {
    width: 55,
    height: 55
  },
  StreamView: {
    width: windowWidth,
    height: windowHeight
  }
});

export default LocalStream;
