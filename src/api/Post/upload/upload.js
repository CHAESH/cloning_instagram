import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    upload: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { caption, files } = args;
      // image 먼저 생성
      const post = await prisma.createPost({
        caption,
        user: {
          connect: {
            id: user.id,
          },
        },
      });
      files.forEach(async (file) => {
        await prisma.createFile({
          url: file,
          post: {
            connect: {
              id: post.id,
            },
          },
        });
      });
      return post;
    },
  },
};
