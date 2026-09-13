import React, {useEffect} from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchJoinRoom, fetchCreatedRoom } from '../../../axios/api';
import RoomCard from '../../home/components/RoomCard';
import { getCookie } from '../../../auth/cookie';
import { useRecoilState } from 'recoil';
import { RefetchAtom } from '../../../recoil/RoomAtom';

type RoomListProps = {
  label: string;
  mydesk: string;
};

const fetchFunctions = {
  fetchJoinRoom: fetchJoinRoom,
  fetchCreatedRoom: fetchCreatedRoom,
};

const RoomList: React.FC<RoomListProps> = ({ label, mydesk }) => {
  const token = getCookie('token');
  const [isRefetch, setIsRefetch] = useRecoilState(RefetchAtom);

  let fetchName = mydesk;

  const { data, refetch } = useQuery<room[], Error>(
    fetchName,
    async () => {
      const fetchFunc =
        fetchFunctions[fetchName as keyof typeof fetchFunctions];
      if (fetchFunc) {
        const result = await fetchFunc();
        return result;
      } else {
        throw new Error('Invalid fetchName');
      }
    },
    {
      refetchInterval: 5000,
    }
  );


  return (
    <List>
      <ListTitle>{label}</ListTitle>

      {Array.isArray(data) && (
        <JoinedRooms>
          {data.map(room => {
            return <RoomCard key={room.uuid} room={room} fetch={fetchName}/>;
          })}
          {data.length === 0 && <Empty>방 목록이 비어있어요</Empty>}
        </JoinedRooms>
      )}
    </List>
  );
};

const Empty = styled.div`
  width: 1200px;
  height:150px;
  display: flex;
  align-items: center;
  justify-content:center;
  font-size: 30px;
  background-color: white;
  opacity: 0.5;
`

const ListTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
  font-size: 24px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  margin-top: 40px;
  height: 100%;
  width: 100%;

  @media (max-width: 1400px) {
    width: 1000px;
  }
  @media (max-width: 1200px) {
    width: 800px;
  }
  @media (max-width: 768px) {
    width: 500px;
  }
`;

const JoinedRooms = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  width: 1200px;


  @media (max-width: 1400px) {
    width: 1000px;
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1200px) {
    width: 800px;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    width: 500px;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default RoomList;
