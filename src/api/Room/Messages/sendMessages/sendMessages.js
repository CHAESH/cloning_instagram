import { prisma } from "../../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../../fragment";

export default {
  Mutation: {
    sendMessages: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      // roomId가 없으면 내 id와 to id를 연결한 새로운 room
      if (roomId === undefined) {
        // 내 자신에게 메세지 보내는 것 방지
        if (user.id !== toId) {
          room = await prisma
            .createRoom({
              participants: {
                connect: [{ id: toId }, { id: user.id }],
              },
            })
            .$fragment(ROOM_FRAGMENT);
        }
      } else {
        // roomId 존재하면 해당 room 넣기/ 문제: toId를 알 수 없음 -> getTo
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);
      }
      // room 존재하지 않으면 error
      if (!room) {
        throw Error("Room not found");
      }
      // 위에서 생성된 room의 participants의 id 중 내 id(user.id)를 제외한 id(toId)만 추출
      const getTo = room.participants.find(
        (participant) => participant.id !== user.id
      );
      // create message
      return prisma.createMessage({
        text: message,
        from: {
          connect: { id: user.id },
        },
        to: {
          // roomId가 존재하면 toId를 알 수 없었기에 getTo를 통해 id 가져오고, 존재하지 않으면 입력 toId가져오기
          connect: { id: roomId ? getTo.id : toId },
        },
        room: {
          // 위에서 생성된 room의 id가져오기
          connect: { id: room.id },
        },
      });
    },
  },
};
