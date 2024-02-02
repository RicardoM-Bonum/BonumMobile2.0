export default interface JitsiJWT {
  context: {
    user: {
      avatar: string;
      name: string;
      email: string;
    };
  };
  role: string;
  sub: string;
  room: string;
}
