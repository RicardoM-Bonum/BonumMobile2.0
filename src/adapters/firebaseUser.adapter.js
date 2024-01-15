const firebaseUser = (user, info) => ({
  name: user.displayName,
  email: user.email,
  uid: user.uid,
  role: info.type
});

export default firebaseUser;
