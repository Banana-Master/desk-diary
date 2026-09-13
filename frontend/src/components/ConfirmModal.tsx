import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

import axios from 'axios';
import { getCookie } from '../auth/cookie';
import { useRecoilState } from 'recoil';
import { RefetchAtom } from '../recoil/RoomAtom';
import ConfirmInput from './ConfirmInput';
import socket from '../pages/room/socketInstance';
import { useQuery } from 'react-query';
import { toast } from 'sonner';

type ConfirmModalProps = {
  title: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uuid?: string;
  userId?: number;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  uuid,
  title,
  setIsOpen,
  userId,
}) => {
  const navigate = useNavigate();
  const [isRefetch, setIsRefetch] = useRecoilState(RefetchAtom);
  const [isDeleteUser, setIsDeleteUser] = useState(false);

  // 방 삭제
  const handleDeleteRoom = async (uuid: string, userId:number) => {
    try {
      socket.emit('removeRoom', { uuid: uuid, userId:userId });
      toast.error('방 삭제 성공했습니다.');
      // console.log(uuid, '...', userId);
      const token = getCookie('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL!}/room/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setIsRefetch(true);
      setIsOpen(false);
    } catch (error: any) {
      // console.error(error);
    }
  };

  // 회원탈퇴
  const handleDeleteUser = async (userId:number) => {
    try {
      socket.emit('withdrawal', { userId:userId });
      toast.error('회원탈퇴에 성공하였습니다.');
      const token = getCookie('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL!}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response);
      setIsOpen(false);

      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // 여기서 추가로 로그아웃 처리 로직을 넣을 수 있어. 예를 들면 페이지 리디렉션 같은 것!
      navigate('/');
      window.location.reload();
    } catch (error) {
      // console.error(error);
    }
  };

  // 로그아웃
  const handleLogoutUser = async () => {
    socket.emit('log-out', { userId: userId });
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  };

  useEffect(() => {
    socket.on('log-out', () => {
      // console.log('log-out 소켓');
      toast.message('로그아웃에 성공하였습니다.');
      navigate('/');
    });
  }, [socket]);

  useEffect(() => {
    if (title === '회원탈퇴') {
      setIsDeleteUser(true);
    }
  }, []);

  const handleButton = (title: string) => {
    switch (title) {
      case '로그아웃':
        handleLogoutUser();

        break;
      case '삭제':
        handleDeleteRoom(uuid!, userId!);
        break;
      case '회원탈퇴':
        handleDeleteUser(userId!);
        break;
    }
  };

  return (
    <Container>
      <BackGround />
      <ModalContent>
        <Title>{title}</Title>
        <Text>{title} 하시겠어요?</Text>
        <ButtonGroup>
          <Button type="button" onClick={() => handleButton(title)}>
            {title}
          </Button>
          {isDeleteUser && (
            <ConfirmInput
              setIsOpen={setIsOpen}
              setIsDeleteUser={setIsDeleteUser}
            />
          )}
          <Button
            type="button"
            buttontype="cancel"
            onClick={() => setIsOpen(false)}
          >
            취소
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Container>
  );
};
const Text = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-top: 30px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button<{ buttontype?: string }>`
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius:  100px;
  background-color: ${props =>
    props.buttontype === 'cancel' ? '' : 'var(--primary-01)'};
  color: ${props =>
    props.buttontype === 'cancel' ? 'var(--primary-01)' : 'white'};
  border: 1px solid
    ${props => (props.buttontype === 'cancel' ? 'var(--primary-01)' : '')};
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

  width: 400px;
  height: 250px;
  /* background-color: rgba(255, 255, 255, 0.8); */
  background-color: white;
  border-radius: 20px;
  z-index: 50;
  position: absolute;
  padding: 60px 0;
  box-shadow: 4px 4px 6px 0px rgba(0, 0, 0, 0.2);
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
export default ConfirmModal;
