import { createContext } from 'react';

const ChatContext = createContext({
  isContactsOpen: false,
  conversations: [],
  contacts: [],
  hasUnreadMessages: false,
  setContacts: () => null,
  setIsContactsOpen: () => null,
  handleAddChat: () => null,
  handleRemoveChat: () => null,
  modifyContactWithNewRoom: () => null,
  handleNewMessage: () => null
});

export default ChatContext;
