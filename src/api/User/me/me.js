import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    me: async (_, __, { request, isAuthenticated, AuthenticatedUser }) => {
      // console.log("user parent", _);
      isAuthenticated(request);
      const { user } = request;
      return await prisma.user({ id: user.id });
    },
  },
};
