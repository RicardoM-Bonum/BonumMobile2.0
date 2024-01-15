import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import ChatColors from '../../constants/chatColors';
import Avatar from './components/Avatar';

export default function ListItem({
  type,
  description,
  user,
  style,
  time,
  room,
  image
}) {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const navigation = useNavigation();

  const handleNavigate = () => {
    // navigation.setOptions({ headerTitle: ( props ) => <ChatHeader {...props}/>})
    navigation.navigate('chat', { user, room, image });
  };

  const getUnreadMessage = () => {
    if (!user?.lastMessage) return false;
    if (!user.lastMessage.unread) return false;
    if (user.lastMessage.userB.email !== user.email) return true;
  };

  useEffect(() => {
    setHasUnreadMessages(getUnreadMessage());
  }, [user]);

  return (
    <TouchableOpacity
      style={{
        height: 80,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        ...style
      }}
      onPress={handleNavigate}
    >
      <Grid style={{ maxHeight: 80 }}>
        <Col
          style={{
            width: 80,
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}
        >
          <Avatar user={user} size={type === 'contacts' ? 40 : 65} />
        </Col>
        <Col style={{ marginLeft: 10 }}>
          <Row style={{ alignItems: 'center' }}>
            <Col>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: ChatColors.darkBlue
                }}
              >
                {user?.name} {user?.lastName} {user?.displayName}
              </Text>
            </Col>
            {time && (
              <Col style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: ChatColors.darkBlue, fontSize: 11 }}>
                  {new Date(time.seconds * 1000).toLocaleDateString()}
                </Text>
                {hasUnreadMessages && (
                  <View
                    style={{
                      backgroundColor: 'black',
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                      marginTop: 10,
                      marginBottom: -20
                    }}
                  />
                )}
              </Col>
            )}
          </Row>
          {description && (
            <Row style={{ marginTop: -5 }}>
              <Text
                style={{
                  color: hasUnreadMessages ? 'black' : ChatColors.darkBlue,
                  fontSize: 13
                }}
              >
                {description}
              </Text>
            </Row>
          )}
        </Col>
        <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          {hasUnreadMessages && (
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: '#f94015',
                borderRadius: 100
              }}
            />
          )}
        </Col>
      </Grid>
    </TouchableOpacity>
  );
}
