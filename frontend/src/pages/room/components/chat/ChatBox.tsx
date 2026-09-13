import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { fetchUser } from '../../../../axios/api';
import { chat } from '../../../../images/room';
import { yellow } from '../../../../images/character';
import { RoomUserList } from '../../../../recoil/RoomAtom';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../../auth/cookie';
import socket from '../../socketInstance';
import Chat from './Chat';
import { toast } from 'sonner';

type ChatBoxProps = { roomId: string };

type MessageData = {
  message: string;
  nickname: string;
  img: string;
  time: string;
  roomId: string;
};

type UserListPayload = {
  nickname: string;
  userListArr: {
    nickname: string;
    img: string;
    userId: number;
    socketId: string;
  }[];
};

type AllChatItem =
  | { type: 'message'; data: MessageData }
  | { type: 'new-user'; data: string }
  | { type: 'left-user'; data: string };

const ChatBox: React.FC<ChatBoxProps> = ({ roomId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [allChatList, setAllChatList] = useState<AllChatItem[]>([]);
  const [roomUserList, setRoomUserList] = useRecoilState(RoomUserList);
  const navigate = useNavigate();

  const { data } = useQuery<user>('room-user', fetchUser, {
    refetchOnWindowFocus: false,
  });

  let serverUserId;

  if (data) {
    serverUserId = data?.userId;
  }

  const historyRoom = localStorage.getItem('room');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유저가 서버에게 메세지 보냄
    const messageData = {
      message: newMessage,
      nickname: data?.nickname,
      img: data?.profileImage,
      uuid: roomId,
    };

    // console.log('전송전', messageData);

    const trimNewMessage = newMessage.trim();
    if (!trimNewMessage) {
      toast.error('메세지를 입력해주세요');
      return;
    }

    newMessage !== ''
      ? socket.emit('msgToServer', messageData)
      : toast.error('메세지를 입력해주세요');
    setNewMessage('');

    setNewMessage('');
  };

  // 서버에서 유저애개 메세지를 보냄
  useEffect(() => {
    socket.on('msgToClient', (message: MessageData) => {
      // console.log('받은 메시지:', message); // 이 부분을 추가해줘!
      setAllChatList(prevAllChatList => [
        ...prevAllChatList,
        { type: 'message', data: message },
      ]);
    });

    return () => {
      // console.log('off');
      socket.off('msgToClient');
    };
  }, [socket]);

  // 나가고 들어온 유저 닉네임 받아오기
  useEffect(() => {
    socket.on('new-user', (payload: UserListPayload) => {
      const { nickname, userListArr } = payload;
      setAllChatList(prevAllChatList => [
        ...prevAllChatList,
        { type: 'new-user', data: nickname },
      ]);
      setRoomUserList(userListArr);
    });

    socket.on('leave-user', (payload: UserListPayload) => {
      const { nickname, userListArr } = payload;
      setAllChatList(prevAllChatList => [
        ...prevAllChatList,
        { type: 'left-user', data: nickname },
      ]);
      setRoomUserList(userListArr);
    });

    socket.on('log-out', (userId: any) => {
      const socketUser = userId.logoutUser;
      const serverUserId = data?.userId;
      // console.log('socketUser 소켓', socketUser, '===', serverUserId);
      if (socketUser === serverUserId) {
        // console.log('log-out 소켓', userId);
        toast.message('로그아웃에 성공하였습니다.');
        navigate('/');
      }
    });

    socket.on('error-room', error => {
      // 사용자에게 에러 메시지를 보여줌
      alert(error.message);
    });

    socket.on('remove-users', () => {
      // 사용자를 방 목록 페이지로 리다이렉트
      navigate('/');
      // 알림 메시지 표시
      toast.message('방장이 방을 삭제하였습니다.');
    });

    socket.on('kick-room', (msg: string) => {
      // 사용자를 방 목록 페이지로 리다이렉트
      navigate('/');
      // 알림 메시지 표시
      toast.message(msg);
    });

    return () => {
      socket.off('new-user');
      socket.off('leave-user');
      socket.off('error-room');
      socket.off('remove-users');
      socket.off('kick-room');
    };
  }, [socket, data]);

  useEffect(() => {
    socket.on('disconnect_user', (byeUser: string) => {
      setAllChatList(prevAllChatList => [
        ...prevAllChatList,
        { type: 'left-user', data: byeUser },
      ]);
      // console.log('😭나간 유저', byeUser);
    });
  }, [socket]);

  const chatListRef = useRef<HTMLDivElement>(null); // ref 생성

  // 채팅이 올라올 때 마다 채팅리스트의 맨 아래로 이동
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight; // 스크롤을 아래로 이동
    }
  }, [allChatList]); // allChatList가 업데이트될 때마다 실행

  useEffect(() => {
    // window.onbeforeunload = null;
  }, []);

  return (
    <Container>
      <ChatImg src={chat} />
      <ChatList ref={chatListRef}>
        {allChatList.map((chat, index) => {
          if (chat.type === 'message') {
            return <Chat key={index} message={chat.data} />;
          } else if (chat.type === 'new-user') {
            return (
              <Message key={index}>
                <span>{chat.data}</span> 님이 입장하셨습니다.
              </Message>
            );
          } else if (chat.type === 'left-user') {
            return (
              <Message key={index}>
                <span>{chat.data}</span> 님이 나가셨습니다.
              </Message>
            );
          }
        })}
      </ChatList>
      <ChatUnder>
        <ChatForm onSubmit={handleSubmit}>
          <UserInput
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="메세지를 입력 해 주세요"
          ></UserInput>
          <SendButton type="submit">
            <img src={yellow} alt="send" />
          </SendButton>
        </ChatForm>
      </ChatUnder>
    </Container>
  );
};

const ChatUnder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;

  > button {
    background-color: var(--gray-09);
    border: none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    font-size: 20px;
    color: white;
  }
`;

const Message = styled.div`
  margin: 0 auto;
  background-color: var(--gray-08);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: var(--gray-05);
  > span {
    color: white;
  }
`;

const ChatImg = styled.img`
  margin: 5px auto 0 5px;
  filter: grayscale(100%);
`;

const SendButton = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  background-color: transparent;
  margin-right: 20px;
  cursor: pointer;
  > img {
    width: 35px;
  }
`;

const UserInput = styled.input`
  width: 100%;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  font-size: 15px;
  &:focus {
    outline: none;
  }
  background-color: transparent;
  color: var(--gray-01);

  ::placeholder {
    color: var(--gray-01);
  }
`;

const ChatForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  height: 42px;
  width: 100%;
  margin: 12px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  /* background-color: var(--gray-05); */
  box-shadow: inset 2px -2px 4px 2px rgba(0, 0, 0, 0.2);
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 15px;
  height: 100%;
  width: calc(100% - 40px);
  padding: 10px;
  overflow: scroll;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  border-radius: 10px;

  width: 97%;
  min-height: calc(100% - 160px);
  /* border-left: 1px solid var(--gray-07); */
  position: relative;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

export default ChatBox;
