const evaluationCoachAdapted = (evaluation) => ({
  id: evaluation._id,
  image: evaluation?.coachee?.urlImgCoachee,
  name: `${evaluation?.coachee?.name} ${evaluation?.coachee?.lastname}`,
  date: evaluation?.date,
  comment: evaluation?.commentCoachee,
  value: evaluation?.ratingCoachSessions
});

export default evaluationCoachAdapted;
