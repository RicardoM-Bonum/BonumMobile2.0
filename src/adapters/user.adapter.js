const userAdapted = (response) => {
  const user = response.data;

  return {
    name: user.name,
    lastname: user.lastname,
    activeUser: user.activeUser,
    email: user.email,
    uid: user.firebaseUID,
    role: user.role,
    photo: user.role === 'coach' ? user.urlImgCoach : user.urlImgCoachee,
    focusAreas: user.focusAreas,
    onboardingCompleted: user.onboardingCompleted,
    coach: user.coach,
    sessions: user?.sessions ? user?.sessions : [],
    calendar: user.calendar,
    mongoID: user._id,
    providers: user.providers,
    coachees: user.role === 'coach' && user.coachees,
    evaluators: user.evaluators,
    company: user?.company?.name,
    department: user?.department,
    cohort: user?.cohort && {
      program: user?.cohort.Program,
      startedOn: user?.cohort.StartDate
    },
    phone: user?.phone,
    alternateCall: user?.linkExternalCall,
    timezone: user?.timezone,
    ratingSessionsCoach: user?.RatingSessionsCoach,
    ratingCoach: user?.RatingCoach,
    languages: user?.languages,
    address: user.address,
    video: user.role === 'coach' && user.urlVideoCoach,
    emailpaypal: user.role === 'coach' && user.emailpaypal,
    resume: user.role === 'coach' && user.resume,
    howWork: user.role === 'coach' && user.howWork,
    additionalSessions: user?.additionalSessions ? user?.additionalSessions : 0
  };
};
export default userAdapted;
