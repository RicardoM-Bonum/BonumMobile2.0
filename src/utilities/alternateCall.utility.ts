import { io, Socket } from 'socket.io-client';
import displayToast from './toast.utility';
import Config from 'react-native-config';

const alternateCallSocket = io(Config.ALTERNATECALL_URL, {
  path: '/session',
  transports: ['websocket'],
  reconnection: true
});

alternateCallSocket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err}`);
});

const makeAlternateCall = (user, nextSession) => {
  if (!user.alternateCall) {
    displayToast('No tienes tu link de llamada alterna configurado', 'error');
    return;
  }

  alternateCallSocket.emit('make-alternate-call', {
    link: user.alternateCall,
    room: user.mongoID,
    coachee: nextSession.coachee._id,
    session: nextSession
  });
};

const endByAlternatecall = (session, coach, coachee) => {
  alternateCallSocket.emit('end-alternate-call', {
    session,
    room: coach,
    coachee
  });
};

const connectToAlternateCallSocket = (user) => {
  if (user.mongoID) {
    if (user.role === 'coachee' && user?.coach) {
      alternateCallSocket.emit('join-alternate-call-room', {
        room: user.coach._id
      });
    }

    if (user.role === 'coach') {
      alternateCallSocket.emit('join-alternate-call-room', {
        room: user.mongoID
      });
    }
  }
};

export {
  alternateCallSocket,
  makeAlternateCall,
  connectToAlternateCallSocket,
  endByAlternatecall
};
