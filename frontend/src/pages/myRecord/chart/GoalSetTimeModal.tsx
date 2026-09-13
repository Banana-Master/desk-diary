import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { getCookie } from '../../../auth/cookie';
import { GoalTimeModalState } from '../../../recoil/DeskAtom';

type GoalSetTimeModalProps = {};

const GoalSetTimeModal: React.FC<GoalSetTimeModalProps> = () => {
  const [GoalModal, setGoalModal] = useRecoilState<boolean>(GoalTimeModalState);
  const token = getCookie('token');
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [목표시간sec, set목표시간sec] = useState<number>(0);
  const hourOnchangeHandler = (e: any) => {
    setHour(e.target.value);
  };
  const minuteOnchangeHandler = (e: any) => {
    setMinute(e.target.value);
  };

  const onClickSetTime = () => {
    목표시간설정();
  };

  

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const 목표시간설정 = async () => {
    if (hour * 3600 + minute * 60 < 86400) {
      try {
        const response = await axios.post(
          `${serverUrl}/me/history/goaltime`,
          { goalTime: hour * 3600 + minute * 60 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setGoalModal(false);

      } catch (error) {
        // console.error(error);
      }
    } else {
      alert(`24시간 이내로 설정해주세요.`);
    }
  };

  

  return (
    <BlackBgDiv>
      <Modal>
        <p>목표시간 수정</p>
        <TimeBox>
          <input
            type="number"
            max={24}
            min={0}
            value={hour}
            onChange={hourOnchangeHandler}
          />
          <p>시간</p>
          <input
            type="number"
            max={59}
            min={0}
            value={minute}
            onChange={minuteOnchangeHandler}
          />
          <p>분</p>
        </TimeBox>
        <ButtonBox>
          <button onClick={onClickSetTime}>수정완료</button>
          <button
            onClick={() => {
              setGoalModal(false);
            }}
          >
            취소
          </button>
        </ButtonBox>
      </Modal>
    </BlackBgDiv>
  );
};

const BlackBgDiv = styled.div`
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(7.5px);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 613px;
  height: 417px;
  border-radius: 50px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 36px;
  flex-direction: column;
  p {
    color: var(--primary-01);
    font-size: 24px;
    font-weight: 700;
  }
`;

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    width: 81px;
    height: 48px;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid var(--gray-06);
    font-size: 16px;
  }
  input:focus {
    outline: 2px solid var(--primary-01);
    border: none;
  }
  p {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-01);
  }
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  button {
    width: 200px;
    height: 60px;
    padding: 10px;

    font-size: 24px;
    font-weight: 700;
  }
  button:first-child {
    background-color: var(--primary-01);
    color: white;
  }
  button:last-child {
    background-color: white;
    color: var(--primary-01);
  }
`;
export default GoalSetTimeModal;
