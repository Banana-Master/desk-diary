import styled from '@emotion/styled';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getCookie } from '../../../auth/cookie';
import {
  RoomAtom,
  RoomUUIDAtom,
} from '../../../recoil/RoomAtom';
import MediaSetup from '../../home/components/MediaSetup';
import BasicPrecautions from '../../home/components/BasicPrecautions';
import { useQuery } from 'react-query';
import { fetchUser } from '../../../axios/api';
import socket from '../socketInstance';
import { toast } from 'sonner';
import ModalBackground from '../../../components/ModalBackground';

type SetMediaModal = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: {
    agoraAppId: string;
    agoraToken: string;
    category: string;
    count: number;
    createdAt: string;
    maxHeadcount: number;
    note: string;
    nowHeadcount: number;
    ownerId: number;
    uuid: string;
    roomThumbnail: string | null;
    title: string;
    updatedAt: string;
    roomId: number;
  };
};

const SetMediaModal: React.FC<SetMediaModal> = ({ setIsOpen, room }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [joinUUID, setJoinUUID] = useRecoilState<string>(RoomUUIDAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(RoomAtom);
  const [isClicked, setIsClicked] = useState(false);

  const { data } = useQuery<user>('joinRoomUserInfo', fetchUser);
  const token = getCookie('token');

  const renderNoteWithBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const onClickJoinRoom = async () => {
    if (isClicked) return;
    setIsClicked(true);
    try {
      const token = getCookie('token');
      const response = await axios.post(
        `${serverUrl}/room/${room.uuid}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRoomInfo({
        agoraAppId: room.agoraAppId,
        agoraToken: room.agoraToken,
        category: room.category,
        count: room.count,
        createdAt: room.createdAt,
        maxHeadcount: room.maxHeadcount,
        note: room.note,
        nowHeadcount: room.nowHeadcount,
        ownerId: room.ownerId,
        roomId: room.roomId,
        roomThumbnail: room.roomThumbnail ? room.roomThumbnail : '',
        title: room.title,
        updatedAt: room.updatedAt,
        uuid: room.uuid,
      });
      setJoinUUID(room.uuid);

      socket.emit(
        'joinRoom',
        {
          nickname: data!.nickname,
          uuid: room.uuid,
          img: data!.profileImage,
          userId: data!.userId,
        },
        (response: any) => {},
      );
      setIsClicked(false);
    } catch (error) {
      // console.error(error);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    socket.on('joinError', (message: string) => {
      toast.error(message);
      navigate('/');
    });
  }, [socket]);

  // useEffect(() => {
  //   window.onbeforeunload = null;
  // });

  return (
    <Container>
      {/* <BackGround /> */}
      <ModalBackground blur='5px' height="100vh"/>
      <ModalContent>
        <Title>{room.title}</Title>

        <Content>
          <Label>방 입장 시 유의 사항</Label>
          <BasicPrecautions />
          <Note>{renderNoteWithBreaks(room.note)}</Note>
        </Content>
        <EnterRoomButton onClick={onClickJoinRoom}>확인</EnterRoomButton>
      </ModalContent>
    </Container>
  );
};

const Note = styled.div`
  font-size: 15px;
  color: var(--gray-07);
  margin-right: auto;
  margin-bottom: 50px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 15px;
  display: flex;
  width: 400px;
  margin-top: 14px;
  max-height: 500px;

  overflow-y: auto;
`;

const Label = styled.div`
  padding: 10px 0;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 400px;
`;

const EnterRoomButton = styled.button`
  width: 400px;
  height: 50px;
  border: none;
  border-radius: 30px;
  background-color: var(--primary-01);
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-top: auto;
`;

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(
    5px
  ); // 블러 정도 설정. 숫자를 조절해서 블러 정도를 변경할 수 있어.
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 600px;
  /* height: 600px; */
  /* background-color: rgba(255, 255, 255, 0.8); */
  background-color: white;
  border-radius: 20px;
  z-index: 50;
  position: absolute;
  padding: 60px 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: col;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5000;
  cursor: auto;
`;

export default SetMediaModal;
