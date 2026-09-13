import React, { useEffect, useState, useReducer } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { pause, timerImg } from '../../../images/room';
import { timerState } from '../../../recoil/TimeAtom';

type TimerProps = {};

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime =
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(remainingSeconds).padStart(2, '0');

  return formattedTime;
}

export const getKoreanTime = () => {
  const now = new Date();
  let [dayOfWeek, month, day, year, time, time2] =`${now}`.split(' ');
  if (month === 'Jan') {
    month = '01';
  } else if (month === 'Feb') {
    month = '02';
  } else if (month === 'Mar') {
    month = '03';
  } else if (month === 'Apr') {
    month = '04';
  } else if (month === 'May') {
    month = '05';
  } else if (month === 'Jun') {
    month = '06';
  } else if (month === 'Jul') {
    month = '07';
  } else if (month === 'Aug') {
    month = '08';
  } else if (month === 'Sep') {
    month = '09';
  } else if (month === 'Oct') {
    month = '10';
  } else if (month === 'Nov') {
    month = '11';
  } else if (month === 'Dec') {
    month = '12';
  }
  return [`${year}-${month}-${day}T${time}.000Z`, `${month}월 ${day}일 ${time}`];
};

const Timer: React.FC<TimerProps> = () => {
  const [timerButtonState, setTimerButtonState] = useState<boolean>(false);
  const sessionData_checkIn = JSON.parse(sessionStorage.getItem('checkIn') || '[]');
  const [checkIn, setCheckIn] = useState<string[]>(sessionData_checkIn);
  const [timer, setTimer] = useRecoilState<number>(timerState);
  
  useEffect(() => {
    setCheckIn([...checkIn, getKoreanTime().toString()]);
  }, []);

  useEffect(() => {
  sessionStorage.setItem('checkIn', JSON.stringify(checkIn));
  }, [checkIn])

  const countReducer = (oldCount: any, action: any) => {
    if (action === 'START') {
      setTimer(oldCount + 1)
      return oldCount + 1;
    } else if (action === 'STOP') {
      return oldCount;
    }
  };
  const [count, countDispatch] = useReducer(countReducer, 0);

  const start = () => {
    countDispatch('START');
  };
  const stop = () => {
    countDispatch('STOP');
  };

  let intervalId: NodeJS.Timeout | null = null;

  const startButtonOnclickHandler = () => {
    setTimerButtonState(!timerButtonState);
  };

  useEffect(() => {
    if (timerButtonState) {
      intervalId = setInterval(() => start(), 1000);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerButtonState]);

  return (
    <Container>
      <p>{formatTime(count)}</p>
      <StartButton
        timerbuttonstate={`${timerButtonState}`}
        onClick={startButtonOnclickHandler}
      >
        <img src={timerButtonState ? pause : timerImg} alt="" />
        <p>{timerButtonState ? '일시정지' : '기록시작'}</p>
      </StartButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const StartButton = styled.button<{ timerbuttonstate: string }>`
  width: 180px;
  height: 48px;
  border: none;
  display: flex;
  padding: 10px 5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: ${(props) =>
    props.timerbuttonstate === 'true' ? 'none' : 'var(--primary-01)'};
  p {
    color: var(--gray-01);
    font-size: 16px;
    @media (max-width: 768px) {
      display: none;
    }
  }
  border-radius: 24px;
  @media (max-width: 768px) {
    flex-direction: row;
    width: 30px;
    height: 30px;
    padding: 20px;
}
`;

export default Timer;
