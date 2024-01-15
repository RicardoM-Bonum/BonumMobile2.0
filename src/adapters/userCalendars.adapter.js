const userCalendars = calendars => {
  return calendars.data.map(calendar => ({
    _id: calendar._id,
    id: calendar.id,
    object: calendar.object,
    account_id: calendar.account_id,
    name: calendar.name,
    description: calendar.description,
    UserId: calendar.UserId,
    email: calendar.email,
    active: calendar.active
  }));
};

export default userCalendars;
