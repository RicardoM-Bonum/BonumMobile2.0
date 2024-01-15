import React, { useEffect, useState } from 'react';
import ChatBonumContext from './ChatBonumContext';
import { map } from 'lodash';

export default function ChatBonumWrapper(props) {
  const [rooms, setRooms] = useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [inChatWith, setInChatWith] = useState('');

  useEffect(() => {}, [inChatWith]);

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

  const contextValue = {
    rooms,
    setRooms,
    unfilteredRooms,
    setUnfilteredRooms,
    contacts,
    setContacts,
    inChatWith,
    setInChatWith,
    modifyContactWithNewRoom,
    handleNewMessage
  };

  return (
    <ChatBonumContext.Provider value={contextValue}>
      {props.children}
    </ChatBonumContext.Provider>
  );
}
