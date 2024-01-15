const useCloseSession = () => {
  type closeReason = 'CANCELED_BY_COACH' | 'ABSENT_COACHEE' | 'ALTERNATE_CALL';

  const closeSession = (session, reason: closeReason) => {
    console.log(
      '🚀 ~ file: useCloseSession.ts:7 ~ closeSession ~ reason:',
      reason
    );
    console.log(
      '🚀 ~ file: useCloseSession.ts:7 ~ closeSession ~ session:',
      session
    );
  };

  return { closeSession };
};

export default useCloseSession;
