export const isAuthenticated = (request) => {
  if (!request.user) {
    throw Error("You need to log in to perform this action!");
  }
  return;
};

export const AuthenticatedUser = (request) => {
  const auth = request.headers.authorization || "";
  console.log(auth);
  return null;
};
