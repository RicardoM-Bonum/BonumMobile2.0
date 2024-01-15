const assignationsAdapted = (assignation) => ({
  id: assignation._id,
  title: assignation.title,
  session: assignation?.sessionId?.sessionNumber,
  user: assignation.user,
  status: assignation.status,
  date: assignation?.sessionId?.date
});

export default assignationsAdapted;
