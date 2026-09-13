export const RoomResponseExample = {
  example: {
    createdRoom: {
      roomId: 5,
      uuid: 'af26275a-f5e3-4d9c-8211-166f7d25aef6',
      title: '새벽스터디',
      note: 'string',
      ownerId: 2,
      nowHeadcount: 0,
      maxHeadcount: 5,
      roomThumbnail:
        'https://heavy-hips-s3.s3.ap-northeast-2.amazonaws.com/room-thumbnails/1697553592689-rabbit.png',
      category: 'study',
      count: 0,
      createdAt: '2023-10-16T00:05:10.753Z',
      updatedAt: '2023-10-16T00:05:10.753Z',
    },
    owner: {
      userId: 2,
      email: 'user12@example.com',
      nickname: '무엉이',
      password: '$2b$10$i/bUpl5BAIVshyA6aws8HuTcaNh8L7vwrjIrwUz55ib8APJ/B415a',
      profileImage: null,
      snsId: null,
      provider: 'local',
      type: 'user',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjk3NDExNTUyLCJleHAiOjE2OTgwMTYzNTJ9.ttpRAQsn-6fYFxCQhlftC_0jFRxpixuNgPzeOZbNGrE',
      createdAt: '2023-10-15T23:06:32.698Z',
      updatedAt: '2023-10-15T23:12:32.749Z',
    },
  },
};

export const RoomlistResponseExample = {
  example: [
    {
      uuid: '1d0eeb55-1435-4d49-b4da-0c1f13165fd5',
      title: '새벽스터디1',
      category: 'study',
      ownerId: 1,
    },
    {
      uuid: 'e1b0edff-3a29-4358-bd7c-214d62c59e84',
      title: '새벽스터디2',
      category: 'study',
      ownerId: 1,
    },
    {
      uuid: 'd397f5a8-50f9-4224-8093-afda86ee227f',
      title: '새벽스터디3',
      category: 'study',
      ownerId: 2,
    },
    {
      uuid: 'af26275a-f5e3-4d9c-8211-166f7d25aef6',
      title: '새벽스터디4',
      category: 'study',
      ownerId: 2,
    },
  ],
};

export const roomLeaveResponseExample = {
  example: {
    isLeaveRoom: true,
    record: {
      historyId: 1,
      UserId: 3,
      RoomId: 6,
      checkIn: '2023-10-16T14:00:00.000Z',
      checkOut: '2023-10-16T16:30:00.000Z',
      totalHours: 9000,
      historyType: '취미',
    },
  },
};
