import React, { useEffect } from 'react';
import AlternateCoacheeModal from './components/alternateCoacheeModal';
import { connectToAlternateCallSocket } from '../../utilities/alternateCall.utility';
import AlternateCoachModal from './components/alternateCoachModal';

function AlternateCall({ user }) {
  useEffect(() => {
    connectToAlternateCallSocket(user);
  }, [user]);

  return (
    <>
      <AlternateCoacheeModal user={user} />
      <AlternateCoachModal user={user} />
    </>
  );
}

export default AlternateCall;
