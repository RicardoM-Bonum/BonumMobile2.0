// @refresh reset
import {useRoute} from '@react-navigation/native';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
  LoadEarlier,
} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import ChatBonumContext from '../../context/ChatBonumContext';
import ChatColors from '../../constants/chatColors';
import ChatHeader from '../ChatHeader';
import Icon from 'react-native-vector-icons/EvilIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import tw from 'twrnc';
import FadeInOut from 'react-native-fade-in-out';
import displayToast from '../../../../utilities/toast.utility';
import {useFileUpload} from '../../hooks/useFileUpload';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {PrimaryButton} from '../../../../components/Buttons';
import {useImageUpload} from '../../hooks/useImageUpload';
import ModalProgress from './components/ModalProgress/ModalProgress';
import ImageMessage from './components/ImageMessage/ImageMessage';
import {OneSignal} from 'react-native-onesignal';
import {useFetchAndLoad} from '../../../../hooks';
import {sendChatMessage} from '../../../../services/user.service';
import striptags from 'striptags';
import {decode} from 'html-entities';

export default function Chat({navigation}) {
  console.log('yahallo4');
  const [roomHash, setRoomHash] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViewImage, setSelectedViewImage] = useState('');
  const [lastVisibleMessage, setLastVisibleMessage] = useState(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log('messages', messages);

  const {
    handleFilePicker,
    uploading,
    progress,
    modalProgress,
    setModalProgress,
  } = useFileUpload({roomHash});
  const {
    handleImagePicker,
    uploading: uploadingImage,
    transferred,
    modalProgress: modalImageProgress,
    setModalProgress: setModalImageProgress,
  } = useImageUpload({roomHash});

  const {name, lastname, email, photo, uid, mongoID} = useSelector(
    state => state.user,
  );

  const route = useRoute();
  const room = route.params.room;
  const data = route.params.user;
  const isCoach = data?.role === 'coach';
  const avatar = isCoach ? data?.urlImgCoach : data?.urlImgCoachee;
  const userName = `${data?.name} ${data?.lastname}`;
  const {setInChatWith, modifyContactWithNewRoom} =
    useContext(ChatBonumContext);
  const MESSAGES_LIMIT = 50;
  const {loading: loadingFetch, callEndpoint} = useFetchAndLoad();

  const senderUser = {
    avatar: photo,
    name: `${name} ${lastname}`,
    _id: uid,
    email: email,
  };

  const idRoom = useMemo(
    () => (data?.roomId ? data?.roomId : nanoid(20)),
    [data],
  );

  const addOneSignalEventListener = () => {
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
      const sender = route.params.user._id;
      event.preventDefault();
      // some async work

      //@ts-ignore
      // console.log('event', event.notification);

      if (sender === event.notification.additionalData?.senderID) {
        console.log('already in chat');
        return;
      }

      event.getNotification().display();
    });
  };

  const roomRef = firestore().doc(`rooms/${idRoom}`);
  const roomMessagesRef = firestore().collection(`rooms/${idRoom}/messages`);
  const roomQuery = roomMessagesRef
    .limit(MESSAGES_LIMIT)
    .orderBy('createdAt', 'desc');

  useEffect(() => {
    addOneSignalEventListener();
    (async () => {
      if (!room) {
        const currUserData = {
          displayName: `${name} ${lastname}`,
          email: email,
        };
        if (photo) {
          currUserData.photoURL = photo;
        }
        const userBData = {
          displayName: userName,
          email: data?.email,
        };
        if (avatar) {
          userBData.photoURL = avatar;
        }

        // debugger;
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [email, data?.email],
        };
        try {
          await roomRef.set(roomData);
          const newData = await roomRef.get();
          console.log({newData});
          modifyContactWithNewRoom(idRoom, data?._id);
        } catch (error) {
          console.log('Set RoomData UserBData Error', error);
        }
      }
      const emailHash = `${email}:${data?.email}`;
      setRoomHash(emailHash);
      //   if (selectedImage && selectedImage.uri) {
      //     await sendImage(selectedImage.uri, emailHash);
      //   }
    })();
  }, []);

  useEffect(() => {
    setLastVisibleMessage(messages[messages.length - 1]);
  }, [messages]);

  useEffect(() => {
    if (data?.lastMessage) {
      roomRef.update({
        lastMessage: {...data.lastMessage, unread: false},
      });
    }
  }, [data?.lastMessage]);

  useEffect(() => {
    const unsubscribe = roomQuery.onSnapshot(querySnapshot => {
      if (querySnapshot) {
        const messagesFirestore = querySnapshot
          .docChanges()
          .filter(({type}) => type === 'added')
          .map(({doc}) => {
            const message = doc.data();
            return {
              ...message,
              id: doc.id,
              _id: doc.id,
              createdAt: message.createdAt.toDate(),
            };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        appendMessages(messagesFirestore);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const removeEventListener = () => {
    OneSignal.Notifications.removeEventListener('foregroundWillDisplay');
  };

  useEffect(() => {
    const unsuscribe = navigation.addListener('focus', () => {
      setInChatWith(userName);
      removeEventListener();
    });

    return () => {
      setInChatWith('');
      unsuscribe();
    };
  }, []);

  // Función para limpiar el contenido del mensaje
  const cleanMessageContent = content => {
    // Decodificar entidades HTML y eliminar etiquetas
    const decodedContent = decode(content);
    return striptags(decodedContent);
  };

  const appendMessages = useCallback(
    messages => {
      const decodedMessages = messages.map(message => ({
        ...message,
        text: cleanMessageContent(decodeURIComponent(message.text)),
      }));
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, decodedMessages),
      );
    },
    [messages],
  );

  async function onSend(messages = []) {
    const userB = {
      email: data?.email,
      fullname: `${data?.name} ${data?.lastname}`,
      image: avatar,
    };

    const writes = messages.map(m => roomMessagesRef.add({...m, userB}));
    const lastMessage = messages[messages.length - 1];

    const roomMessage = {
      lastMessage: {...lastMessage, userB, unread: true},
    };

    writes.push(roomRef.update(roomMessage));
    await Promise.all(writes);

    const pushNotification = {
      receiverID: data._id,
      name: `${name} ${lastname}`,
      message: lastMessage.text,
      senderID: mongoID,
    };

    await callEndpoint(sendChatMessage(pushNotification));
  }

  const handleViewImage = props => {
    setModalVisible(true);
    setSelectedViewImage(props.currentMessage.url);
  };

  const loadMoreMessages = async () => {
    const queryNextMessages = roomMessagesRef
      .limit(MESSAGES_LIMIT)
      .orderBy('createdAt', 'desc')
      .startAfter(lastVisibleMessage.createdAt);
    try {
      const firestoreMessages = await queryNextMessages.get();
      const nextMessages = [];
      firestoreMessages.forEach(message => {
        nextMessages.push({
          ...message.data(),
          createdAt: message.data().createdAt.toDate(),
        });
      });
      setLastVisibleMessage(
        firestoreMessages.docs[firestoreMessages.docs.length - 1],
      );
      setMessages(previousMessages =>
        GiftedChat.prepend(previousMessages, nextMessages),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuPicker = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUploadFile = async (downloadUrl, fileName, type) => {
    const message = {
      _id: `${fileName}-${nanoid()}`,
      text: fileName,
      createdAt: firestore.Timestamp.now(),
      user: {
        name: `${name} ${lastname}`,
        _id: uid,
        email,
      },
      userB: {
        email: data?.email,
        fullname: `${data?.name} ${data?.lastname}`,
        image: avatar,
      },
      url: downloadUrl,
      type,
    };
    const lastMessage = {
      ...message,
      text: fileName,
      unread: true,
    };
    const writes = [];
    writes.push(roomMessagesRef.add(message));
    writes.push(roomRef.update(lastMessage));
    await Promise.all(writes);
    setIsMenuOpen(false);
  };

  const handleFile = async () => {
    const {downloadUrl, fileName} = await handleFilePicker();
    const type = 'file';
    await handleUploadFile(downloadUrl, fileName, type);
  };

  const handleImage = async () => {
    const {imageUrl, imageName} = await handleImagePicker();
    const type = 'image';
    await handleUploadFile(imageUrl, imageName, type);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        on>
        <ImageViewer
          enableSwipeDown
          onSwipeDown={() => setModalVisible(false)}
          imageUrls={[{url: selectedViewImage}]}
        />
      </Modal>
      <ModalProgress
        isOpen={modalProgress}
        onClose={setModalProgress}
        progress={progress}
        uploading={uploading}
      />
      <ModalProgress
        isOpen={modalImageProgress}
        onClose={setModalImageProgress}
        progress={transferred}
        uploading={uploadingImage}
      />
      <View style={{flex: 1}}>
        <ChatHeader />
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} color={ChatColors.buttonBlue} />
            <Text>Cargando Chat</Text>
          </View>
        ) : (
          <GiftedChat
            onSend={onSend}
            messages={messages}
            user={senderUser}
            renderAvatar={null}
            loadEarlier
            onLoadEarlier={loadMoreMessages}
            bottomOffset={100}
            renderActions={props => (
              <>
                <View style={tw.style('absolute right-12 bottom-12')}>
                  <FadeInOut visible={isMenuOpen} duration={200}>
                    <View style={tw.style('bg-white shadow-md px-2 pt-2')}>
                      <TouchableOpacity
                        style={tw.style('mb-2 py-2 px-2')}
                        onPress={handleFile}>
                        <Text>Enviar Archivo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw.style('mb-2 py-2 px-2')}
                        onPress={handleImage}>
                        <Text>Enviar Imagen</Text>
                      </TouchableOpacity>
                    </View>
                  </FadeInOut>
                </View>
                <Actions
                  {...props}
                  containerStyle={styles.Chat__cameraicon}
                  onPressActionButton={handleMenuPicker}
                  // onPressActionButton={() => setModalProgress(true)}
                  on
                  icon={() => (
                    <Icon
                      name="paperclip"
                      size={30}
                      color={ChatColors.grayText}
                    />
                  )}
                />
              </>
            )}
            renderLoadEarlier={props => (
              <LoadEarlier
                {...props}
                wrapperStyle={{
                  backgroundColor: ChatColors.buttonBlue,
                }}
                textStyle={{fontSize: 14}}
                label="Cargar mensajes anteriores"
              />
            )}
            timeTextStyle={chatStyles.Chat__messageTime}
            renderSend={props => {
              const {text, messageIdGenerator, user, onSend} = props;
              return (
                <TouchableOpacity
                  style={styles.Chat__sendButton}
                  onPress={() => {
                    if (text && onSend) {
                      onSend(
                        {
                          text: text.trim(),
                          user: {
                            avatar: photo,
                            name: `${name} ${lastname}`,
                            _id: uid,
                            email,
                          },
                          userB: {
                            email: data?.email,
                            fullname: `${data?.name} ${data?.lastname}`,
                            image: avatar,
                          },
                          createdAt: firestore.Timestamp.now(),
                        },
                        true,
                      );
                    }
                  }}>
                  <IconFont name="send" color="white" size={16} />
                </TouchableOpacity>
              );
            }}
            renderInputToolbar={props => (
              <InputToolbar {...props} containerStyle={styles.Chat__toolbar} />
            )}
            renderBubble={props => {
              const {currentMessage} = props;
              if (currentMessage.type === 'image') {
                return (
                  <ImageMessage
                    onPress={() => handleViewImage(props)}
                    style={chatStyles.Chat__messages_image}
                    source={{uri: props.currentMessage.url}}
                  />
                );
              }
              return (
                <Bubble
                  {...props}
                  textStyle={chatStyles.Chat__messages}
                  wrapperStyle={chatStyles.Chat__messages_container}
                />
              );
            }}
            renderMessageImage={props => {
              return (
                <View style={{borderRadius: 15, padding: 2}}>
                  <TouchableOpacity onPress={() => handleViewImage(props)}>
                    <Image
                      resizeMode="contain"
                      style={chatStyles.Chat__messages_image}
                      source={{uri: props.currentMessage.image}}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const chatStyles = {
  Chat__messageTime: {
    right: {color: ChatColors.lightBlueBk},
    left: {color: ChatColors.grayText},
  },

  Chat__messages: {
    right: {color: ChatColors.sendedMessageText},
    left: {color: ChatColors.receivedMessageText},
  },

  Chat__messages_container: {
    left: {
      backgroundColor: ChatColors.receivedMessage,
      marginBottom: 4,
      marginLeft: 5,
      marginRight: 20,
    },
    right: {
      backgroundColor: ChatColors.sendedMessage,
      marginBottom: 4,
      marginRight: 5,
      marginLeft: 20,
    },
  },
  Chat__messages_image: {
    width: 200,
    height: 200,
    padding: 6,
    borderRadius: 15,
    resizeMode: 'cover',
  },
};

const styles = StyleSheet.create({
  Chat__cameraicon: {
    position: 'absolute',
    right: 52,
    bottom: 2,
    zIndex: 9999,
    width: 30,
  },
  Chat__sendButton: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: '#299EFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 3,
  },

  Chat__sendButton_icon: {
    width: 24,
    height: 24,
  },

  Chat__toolbar: {
    marginHorizontal: 10,
    marginBottom: Platform.OS === 'ios' ? -20 : 10,
    borderRadius: 20,
    paddingVertical: 5,
  },
});
