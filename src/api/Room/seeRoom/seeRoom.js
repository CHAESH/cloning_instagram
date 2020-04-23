import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragment";

export default {
  Query: {
    seeRoom: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { id } = args;

      // 해당 채팅방(room) 존재하는지 확인
      const existingRoom = await prisma.$exists.room({
        participants_some: {
          id: user.id,
        },
      });
      if (existingRoom) {
        return prisma.room({ id }).$fragment(ROOM_FRAGMENT);
      } else {
        throw Error("You can't see this!");
      }
    },
  },
};
