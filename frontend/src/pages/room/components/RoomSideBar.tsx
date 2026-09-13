import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { fetchUser } from '../../../axios/api';
import logo from '../../../images/logo-2.svg';
import Timer from './Timer';
import profile from '../../../images/profile.png';
import { RoomUserList } from '../../../recoil/RoomAtom';
import socket from '../socketInstance';
import { MaxUser } from '../../../images/room';
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import { RoomModalAtom } from '../../../recoil/RoomAtom';

type RoomSideBarProps = {
  maxUser: number;
};

type UserListPayload = {
  nickname: string;
  userListArr: { nickname: string; img: string; userId: number }[];
};

const RoomSideBar: React.FC<RoomSideBarProps> = ({maxUser}) => {
  // const [timerState, setTimerState] = useState<boolean>(false);

  // const timerButtonHandler = () => {
  //   setTimerState(!timerState);
  // };

  const navigate = useNavigate();

  const [roomUserList, setRoomUserList] = useRecoilState(RoomUserList);
  // console.log('사이드바', roomUserList);
  const [outModalState, setOutModalState] =
  useRecoilState<boolean>(RoomModalAtom);

  const { data } = useQuery<user>('room-user', fetchUser);

  // 나가고 들어온 유저 닉네임 받아오기
  useEffect(() => {
    socket.on('user-list', (payload: UserListPayload) => {
      const { nickname, userListArr } = payload;
      setRoomUserList(userListArr);
      // console.log('리코일', roomUserList);
    });

    return () => {
      socket.off('user-list');
      socket.off('left-user');
    };
  }, [socket]);

  return (
    <Container>
      <LogoImg
        src={logo}
        alt="로고이미지"
        onClick={() => {
          // toast.error('방에 나갈 때는 방 나가기 버튼을 이용해주세요.');
          setOutModalState(true);
        }}
      />
      <UserInfoBox>
        <img
          src={data?.profileImage ? data.profileImage : profile}
          alt="profile image"
        ></img>
        <p>{data?.nickname}</p>
      </UserInfoBox>
      <TimerBox>
        <Timer />
      </TimerBox>
      <JoinPeopleBox>
        <UserCount>
          <p>참여인원</p>
          <DetailCount>
            <img src={MaxUser} alt="인원수" />
            <p>{roomUserList.length} / {maxUser}</p>
          </DetailCount>
        </UserCount>
        {roomUserList.map((user, index) => (
          <UserList key={index}>
            <img src={user.img ? user.img : profile} alt="사용자프로필이미지" />
            <p>{user.nickname}</p>
          </UserList>
        ))}
      </JoinPeopleBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: calc(100vh - 60);
  margin-left: 10px;

  @media (max-width: 768px) {
    flex-direction: row;
    height: 40px;
    width: calc(100vw - 32px);
    margin-left: 0px;
    flex-wrap: wrap;
    align-items: start;
    margin: 16px;
  }
`;

const LogoImg = styled.img`
  margin: 16px;
  width: 60px;
  height: 73px;
  flex-shrink: 0;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 30px;
    height: 36.5px;
    /* border: 2px solid tomato; */
    margin: 0px 20px 0px 0px;
  }
  @media (max-width: 500px) {
    margin: 0px 15px 0px 0px;
  }
`;
const UserInfoBox = styled.div`
  width: 152px;
  height: 164px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  p {
    margin: 16px;
    color: white;
    text-align: center;
  }
  img {
    margin-top: 24px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  @media (max-width: 768px) {
    margin: 0px;
    height: 36.5px;
    flex-direction: row;
    width: 30px;
    
    img {
      margin: 0px;
      width: 30px;
      height: 30px;
    }
    p {
      display: none;
    }
  }
`;

const TimerBox = styled.div`
  margin-top: 16px;
  width: 200px;
  height: 70px;
  /* padding: 24px; */
  margin: 24px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  /* border: 2px solid tomato; */
  p {
    color: var(--bw-whtie);
    font-size: 24px;
  }
  @media (max-width: 768px) {
    margin-top: 0px;
    height: 36.5px;
    width: 170px;
  }
`;

const JoinPeopleBox = styled.div`
  margin-top: 50px;
  width: 152px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 8px;
  color: white;
  height: 400px;
  /* border: 2px solid tomato; */
  @media (max-width: 768px) {
    width: 80px;
    height: 36.5px;
    margin-top: 0px;
    flex-direction: row;
  }
`;

const UserCount = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  p {
    color: white;
    font-size: 12px;
  }
`;

const DetailCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  img {
    width: 24px;
    height: 24px;
  }
  p {
    font-size: 12px;
    color: white;
    
  }
`;

const UserList = styled.div`
  display: flex;
  width: 100%;
  height: 25px;
  gap: 8px;
  align-items: start;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  p {
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 768px) {
      display: none;
    }
`;

export default RoomSideBar;
