const coacheeOnboardingAdapter = (onboarding, user) => ({
  name: onboarding.aboutYou.name,
  surname: onboarding.aboutYou.surname,
  charge: onboarding.aboutYou.charge,
  departament: onboarding.aboutYou.departament,
  focusAreas: onboarding.focusAreas,
  firebaseUID: user.uid,
  evaluators: onboarding.evaluation,
  email: user.email,
  coach: user.coach
});

export default coacheeOnboardingAdapter;
