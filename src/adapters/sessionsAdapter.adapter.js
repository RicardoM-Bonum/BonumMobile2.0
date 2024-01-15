const adaptedSession = (session) => ({
  ...session,
  number: session?.sessionNumber,
  date: session?.date,
  status: session?.status,
  id: session ? (session._id ? session._id : session.id) : null,
  assignations: session?.assignments,
  pointsSession: session?.pointsSession,
  coachPrivateComments: session?.coachPrivateComments,
  alternateCall: session?.alternateCall,
  evaluatedByCoach: session?.evaluatedByCoach,
  evaluatedByCoachee: session?.evaluatedByCoachee,
  coach: session?.coach,
  coachee: session?.coachee,
  callSession: session?.callSession,
  canceled: session?.canceled,
  coachCalendarEvent: session?.coachCalendarEvent
});

export default adaptedSession;
