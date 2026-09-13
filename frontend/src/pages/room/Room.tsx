import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getCookie } from '../../auth/cookie';
import history from '../../history';

import { RoomAtom, RoomUUIDAtom } from '../../recoil/RoomAtom';
// import AsmrPlayer from './components/AsmrPlayer';
import RoomHeader from './components/RoomHeader';
import RoomSideBar from './components/RoomSideBar';
import RoomUnderBar from './components/RoomUnderBar';
import ChatBox from './components/chat/ChatBox';
import SetMediaModal from './components/SetMediaModal';
import VideoContainer from './components/media/VideoContainer';
import arrow from '../../images/red-arrow.png';
import { createGlobalStyle } from 'styled-components';
import { RoomModalAtom } from '../../recoil/RoomAtom';
import RoomModal from './components/RoomModal';
import socket from './socketInstance';

type RoomProps = {
  children?: React.ReactNode;
};

const AsmrPlayer = lazy(() => import('./components/AsmrPlayer'));

const Room: React.FC<RoomProps> = () => {
  const [roomInfo, setRoomInfo] = useRecoilState(RoomAtom);
  const [roomUUID, setRoomUUID] = useRecoilState(RoomUUIDAtom);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isArrow, setIsArrow] = useState(false);
  const [outModalState, setOutModalState] =
    useRecoilState<boolean>(RoomModalAtom);
  const [test, setTest] = useState(0);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const location = useLocation();
  const token = getCookie('token');
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    setRoomUUID(location.pathname.split('/')[2]);
    getRoomInfo();
  }, []);
  const navigate = useNavigate();

  const listenBackEvent = () => {
    setOutModalState(true);
    console.log(outModalState);
  };

  const roomOutHandler = async () => {
    try {
      const token = getCookie('token');
      const data = {
        checkIn: "0000-00-00T00:00:00.000Z",
        checkOut: "0000-00-00T00:00:00.000Z",
        totalHours: "00:00:00",
        historyType: roomInfo.category, // study, hobby
      };
      // console.log('❤️roomInfo.category', roomInfo);
      
      const response = await axios.post(
        `${serverUrl}/room/${roomUUID}/leave`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      sessionStorage.removeItem('checkIn');
      setOutModalState(false);
      alert(test)
      navigate('/');
      // window.location.reload();
    } catch (error) {
      // console.error(error);
    }

    socket.emit(
      'leave-room',
      {
        uuid: roomUUID,
      },
      (response: any) => {
        // 서버로부터의 응답을 여기서 처리
        if (response.success) {
          // console.log('방에서 나가기 성공!✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨');
        } else {
          // console.log('방 나가기 실패😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭');
        }
      },
    );
    localStorage.removeItem('room');
  };

  const unlistenHistoryEvent = history.listen((location) => {
    const listenBackEvent = () => {
      setOutModalState(true);
      console.log('=+=+')
    };
    
    if (history.action === 'POP') {
      listenBackEvent();
    }
  });

  console.log(test)

  useEffect(() => {
    unlistenHistoryEvent();

    return unlistenHistoryEvent();
  }, [history]);

  const getRoomInfo = async () => {
    const url = `${serverUrl}/room/${location.pathname.split('/')[2]}`;
    // console.log('url', url);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.findRoom;
      setRoomInfo({
        agoraAppId: data.agoraAppId,
        agoraToken: data.agoraToken,
        category: data.category,
        count: data.count,
        createdAt: data.createdAt,
        maxHeadcount: data.maxHeadcount,
        note: data.note,
        nowHeadcount: data.nowHeadcount,
        ownerId: data.ownerId,
        roomId: data.roomId,
        roomThumbnail: data.roomThumbnail,
        title: data.title,
        updatedAt: data.updatedAt,
        uuid: data.uuid,
      });
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    setIsOpenModal(true);
    // window.onbeforeunload = null;
  }, []);

  return (
    <Main>
      <GlobalStyle />
      <Container>
        <RoomSideBar maxUser={roomInfo.maxHeadcount} />
        <Content>
          <RoomHeader />
          <Area>
            <CamAreaDiv>
              <VideoContainer setInCall={setInCall} />
            </CamAreaDiv>
            <ChattingAreaDiv>
              <Suspense fallback={<div>Loading AsmrPlayer...</div>}>
                <AsmrPlayer />
              </Suspense>
              <ChatBox roomId={roomInfo.uuid} />
            </ChattingAreaDiv>
          </Area>
        </Content>
      </Container>
      <RoomUnderBar note={roomInfo.note} roomId={roomInfo.uuid} />
      {isOpenModal && (
        <SetMediaModal setIsOpen={setIsOpenModal} room={roomInfo} />
      )}
      {isArrow && (
        <ArrowModal>
          <Background />
          <Arrow src={arrow} alt="arrow" />
        </ArrowModal>
      )}
      {outModalState && <RoomModal />}
    </Main>
  );
};

const GlobalStyle = createGlobalStyle`
  * {
    /* &::-webkit-scrollbar {
    display: none; // 스크롤바를 숨기고 싶으면 이렇게 할 수 있어. */
  /* } */
  }
  `;

const Main = styled.div`
  width: 100vw;
  height: 100vh;
  /* box-sizing: border-box;  */
  background-color: #424242;
  /* border: 3px solid tomato; */
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowModal = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 100;
`;

const Arrow = styled.img`
  width: 100px;
  position: fixed;
  transform: rotate(90deg);
  bottom: 50px;
  left: 50px;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 70px);
  background: var(--gray-09);
  @media (max-width: 768px) {
    flex-direction: column;
    height: 1000px;
  }
`;

const Content = styled.div`
  width: 100%;
`;

const Area = styled.div`
  display: flex;
  height: calc(100vh - 156px);
  justify-content: space-between;
  @media (max-width: 768px) {
    height: 300px;
    /* border: 1px solid tomato; */
    flex-direction: column;
  }
`;

const CamAreaDiv = styled.div`
  width: calc(100% - 380px);
  height: calc(100vh - (217px - 61px));
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 61px;
  overflow: auto;
  overflow-x: hidden;
  @media (max-width: 768px) {
    margin: 0px;
    width: 100vw;
    min-height: 350px;
  }

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

const ChattingAreaDiv = styled.div`
  width: 380px;
  height: 98%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 768px) {
    margin-top: 10px;
    width: 100vw;
  }
`;

export default Room;
