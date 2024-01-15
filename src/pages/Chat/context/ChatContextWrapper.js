import { filter, find, map } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatContext from './ChatContext';

function ChatContextWrapper({ children }) {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { email } = useSelector((state) => state.user);

  const handleAddChat = (conversationToAdd) => {
    const alreadyAdded = find(
      conversations,
      (chat) => chat._id === conversationToAdd._id
    );
    if (!alreadyAdded) setConversations([...conversations, conversationToAdd]);
  };

  const handleRemoveChat = (chatToRemove) => {
    const filtered = filter(
      conversations,
      (conversation) => conversation._id !== chatToRemove._id
    );
    setConversations(filtered);
  };

  const modifyContactWithNewRoom = (room, contactId) => {
    const filtered = map(contacts, (contact) => {
      if (contact?._id === contactId) {
        return { ...contact, roomId: room };
      }
      return contact;
    });
    setContacts(filtered);
  };

  const handleNewMessage = ({ lastMessage, id }) => {
    const newContacts = map(contacts, (contact) => {
      if (contact.roomId !== id) return contact;
      return { ...contact, lastMessage };
    });

    setContacts(newContacts);
  };

  const getHasUnreadMessage = () => {
    const finded = find(contacts, (contact) => {
      if (contact?.lastMessage?.unread) {
        if (contact?.lastMessage?.user?.email !== email) return true;
      }
    });

    if (finded) {
      setHasUnreadMessages(true);
      return;
    }

    setHasUnreadMessages(false);
  };

  useEffect(() => {}, [conversations, hasUnreadMessages]);

  useEffect(() => {
    getHasUnreadMessage();
  }, [contacts]);

  const ChatContextValue = useMemo(
    () => ({
      isContactsOpen,
      conversations,
      contacts,
      hasUnreadMessages,
      setIsContactsOpen,
      setContacts,
      handleAddChat,
      handleRemoveChat,
      modifyContactWithNewRoom,
      handleNewMessage
    }),
    [conversations, isContactsOpen, contacts, hasUnreadMessages]
  );

  return (
    <ChatContext.Provider value={ChatContextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContextWrapper;
