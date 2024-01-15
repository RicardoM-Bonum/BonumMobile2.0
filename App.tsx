import React, {useRef} from 'react';

import {JitsiMeeting} from '@jitsi/react-native-sdk/index';

const App = () => {
  const jitsiMeeting = useRef(null);

  const room = 'bonumTest2024';

  return (
    // @ts-ignore
    <JitsiMeeting
      ref={jitsiMeeting}
      style={{flex: 1}}
      room={room}
      serverURL={'https://meet.jit.si/'}
    />
  );
};

export default App;
