import React from 'react';

const ChatBonumContext = React.createContext({
  rooms: [],
  setRooms: () => {},
  unfilteredRooms: [],
  setUnfilteredRooms: () => {},
  contacts: [],
  setContacts: () => {},
  inChatWith: '',
  setInChatWith: () => null,
  modifyContactWithNewRoom: () => null,
  handleNewMessage: () => null
});

export default ChatBonumContext;
