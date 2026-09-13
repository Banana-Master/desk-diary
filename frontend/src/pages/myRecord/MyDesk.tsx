import React, { useEffect } from 'react';

import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { GoalTimeModalState } from '../../recoil/DeskAtom';
import GoalSetTimeModal from './chart/GoalSetTimeModal';
import RecordGraph from './chart/RecordGraph';
import RoomList from './components/RoomList';
import { DeleteRoomAtom, RoomUUIDAtom } from '../../recoil/RoomAtom';
import ConfirmModal from '../../components/ConfirmModal';
import { useQuery } from 'react-query';
import { fetchUser } from '../../axios/api';

type MyDeskProps = {

};

const MyDesk: React.FC<MyDeskProps> = () => {
  useEffect(() => {
    document.title = '책상일기 - 책상기록'
  }, []);
  const [isOpenDeleteRoomModal, setIsOpenDeleteRoomModal] =
  useRecoilState(DeleteRoomAtom);
  const { data } = useQuery<user, Error>('mypageUser', fetchUser, {
    refetchOnWindowFocus: false,
  });
  const [roomUUID, setRoomUUID] = useRecoilState(RoomUUIDAtom);
  const [GoalModal, setGoalModal] = useRecoilState<boolean>(GoalTimeModalState);
  return (
    <Container>
      <MyDeskTop>
        <RecordGraph />
      </MyDeskTop>

      <List>
      <RoomList label="최근에 들어간 방 목록" mydesk="fetchJoinRoom" />
      <RoomList label="내가 만든 방 목록" mydesk="fetchCreatedRoom" />
      {GoalModal && <GoalSetTimeModal />}
      
      {isOpenDeleteRoomModal && (
        <ConfirmModal
          title="삭제"
          uuid={roomUUID}
          userId={data?.userId}
          setIsOpen={setIsOpenDeleteRoomModal}
        />
      )}
      </List>

      
    </Container>
  );
};

const MyDeskTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin: 30px 0 24px 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 30px;
  width: 100%;
  padding-bottom: 100px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 1200px;
  min-height: 100vh;
`;

const JoinedRooms = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  width: 100%;

  // 화면 크기에 따라 카드 개수 변경
  @media (max-width: 1500px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export default MyDesk;
