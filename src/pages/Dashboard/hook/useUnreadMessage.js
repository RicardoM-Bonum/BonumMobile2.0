import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { find } from 'lodash';

export const useUnreadMessage = () => {
  const [contacts, setContacts] = useState([]);
  const { coachees, role, coach, email } = useSelector((state) => state.user);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [rooms, setRooms] = useState([]);

  const isCoach = role === 'coach';

  const chatsQuery = firestore()
    .collection('rooms')
    .where('participantsArray', 'array-contains', email || '');

  useEffect(() => {
    const unsubscribe = chatsQuery.onSnapshot((querySnapshot) => {
      if (querySnapshot) {
        const [roomChange] = querySnapshot
          .docChanges()
          .filter(({ type }) => type === 'modified')
          .map(({ doc }) => {
            const message = doc.data();
            return { ...message, id: doc.id };
          });

        if (roomChange?.lastMessage?.unread) {
          setHasUnreadMessages(true);
        }

        const parsedChats = querySnapshot?.docs?.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          userB: doc.data().participants.find((p) => p.email !== email),
          lastMessage: doc.data().lastMessage
        }));
        setRooms(parsedChats);
      }
    });
    return () => unsubscribe();
  }, []);

  const getCoachContacts = (roomsAux) => {
    if (rooms.length < 1) {
      setContacts(coachees);
      return;
    }

    const coachedContacts = [];

    coachees.forEach((coachee) => {
      const room = roomsAux.find(
        (room) => room?.userB?.email === coachee?.email
      );

      if (room) {
        coachedContacts.push({
          ...coachee,
          roomId: room.id,
          lastMessage: room.lastMessage
        });
        return;
      }

      coachedContacts.push(coachee);
    });

    setContacts(coachedContacts);
  };

  const getCoacheeContacts = (rooms) => {
    if (rooms.length < 1) {
      setContacts([coach]);
      return;
    }

    const coacheeContacts = [
      { ...coach, roomId: rooms[0].id, lastMessage: rooms[0].lastMessage }
    ];
    setContacts(coacheeContacts);
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

  useEffect(() => {
    if (isCoach) {
      getCoachContacts(rooms);
    } else {
      getCoacheeContacts(rooms);
    }
  }, [rooms]);
  useEffect(() => {
    getHasUnreadMessage();
  }, [contacts]);

  return {
    hasUnreadMessages
  };
};
