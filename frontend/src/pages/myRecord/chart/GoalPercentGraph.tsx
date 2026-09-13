import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import axios from 'axios';
import { useRecoilState } from 'recoil';
import { getCookie } from '../../../auth/cookie';
import { GoalTime, GoalTimeModalState } from '../../../recoil/DeskAtom';
import graph from '../../../images/desk/graph.png';
import help from '../../../images/room/help_outline.svg'

type GoalPercentGraphProps = {};
const GoalPercentGraph: React.FC<GoalPercentGraphProps> = () => {
  const [GoalModal, setGoalModal] = useRecoilState<boolean>(GoalTimeModalState);
  const [목표시간, set목표시간] = useState<string>('??시간 ??분');
  const [목표시간sec, set목표시간sec] = useState<number>(0);
  const [취미누적시간, set취미누적시간] = useState<string>('??시간 ??분');
  const [스터디누적시간, set스터디누적시간] = useState<string>('??시간 ??분');
  const [percent, setPercent] = useState(0);
  const [goalTime, setGoalTime] = useRecoilState(GoalTime); // 목표시간
  useEffect(() => {
    const time = +취미누적시간 + +스터디누적시간;
    setPercent(Math.floor((time / 목표시간sec) * 100));
  }, [목표시간, 취미누적시간, 스터디누적시간]);

  const 누적시간forMatter = (취미누적시간: string, 스터디누적시간: string) => {
    const time = +취미누적시간 + +스터디누적시간;
    if (time >= 0) {
      const hour = Math.floor(time / 3600)
        .toString()
        .padStart(2, '0');
      const minute = Math.floor((time % 3600) / 60)
        .toString()
        .padStart(2, '0');
      return `${hour}시간 ${minute}분`;
    } else {
      return `00시간 00분`;
    }
  };

  const goalModalOnclickHandler = () => {
    setGoalModal(!GoalModal);
  };
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const token = getCookie('token');
  const 목표시간조회 = async () => {
    try {
      const response = await axios.get(`${serverUrl}/me/history/goaltime`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoalTime(response.data);
      const time = response.data.goalTime;
      set목표시간sec(time);
      const hour = Math.floor(time / 3600)
        .toString()
        .padStart(2, '0');
      const minute = ((time % 3600) / 60).toString().padStart(2, '0');
      // console.log('time', time);
      if (time >= 0) {
        set목표시간(`${hour}시간 ${minute}분`);
      } else {
        set목표시간(`00시간 00분`);
      }
    } catch (error) {
      // console.error(error);
    }
  };
  const 누적시간조회 = async () => {
    try {
      const response = await axios.get(`${serverUrl}/learning-history/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      set취미누적시간(data.hobbyTotalHours + '');
      set스터디누적시간(data.studyTotalHours + '');
    } catch (error) {
      // console.error(error);
    }
  };
  useEffect(() => {
    목표시간조회();
    누적시간조회();
  }, [GoalModal]);

  return (
    <Body>
      {목표시간sec > 0 ? (
        <Text>
          <p>오늘 목표시간 중</p>
          <p>
            <span>{percent}%</span> 를
          </p>
          <p>해냈어요</p>
        </Text>
      ) : (
        <Text>
          <p>
            <br />
          </p>
          <p>목표를 설정해주세요</p>
          <p>
            <br />
          </p>
        </Text>
      )}

      <Image src={graph} alt="그래프" percent={`${percent}`} />

      <DetailTimeInfo>
        <DetailTimeInfoPBox>
          <p>목표시간</p>
          <p>{목표시간}</p>
        </DetailTimeInfoPBox>
        <DetailTimeInfoPBox>
          <p>누적시간</p>
          <p>{누적시간forMatter(취미누적시간, 스터디누적시간)}</p>
        </DetailTimeInfoPBox>
      </DetailTimeInfo>

      <PageMoveButton
        onClick={goalModalOnclickHandler}
        goalnotset={`${목표시간sec > 0}`}
      >
        <span>목</span>
        <span>표</span>
        <span>시</span>
        <span>간</span>
        &nbsp;
        <span>수</span>
        <span>정</span>
        <span>하</span>
        <span>기</span>
      </PageMoveButton>
      {/* <Help>
        <img src={help} alt="help" />
        <p>목표시간을 설정하면 누적시간에 따라서 목표달성 이미지가 노란색으로 점점 차게 됩니다.</p>
      </Help> */}
      <GraphInfo>목표 시간을 설정하면 목표달성 글자에 색이 차올라요</GraphInfo>
      
    </Body>
  );
};

const GraphInfo = styled.div`
  position: absolute;
  bottom: -50px;
  right: 0;
  background-color: #ffffffa2;
  color: var(--gray-07);
  font-weight: 500;
  width: 100%;
  text-align: center;
  box-shadow: 2px 2px 4px 2px rgba(207, 207, 207, 0.3);
  border-radius: 10px;
  padding: 5px;
  opacity: 0;
  transition: opacity 0.5s, visibility 0.5s;
`;

const Body = styled.div`
  width: 378px;
  height: 478px;
  border-radius: 20px;
  background-color: #1a81e8;
  box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.25);
  padding: 20px;
  position: relative;
  &:hover {
    ${GraphInfo} {
      opacity: 1;
    }
  }
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 27px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 18px;
    line-height: 123.5%;
    letter-spacing: 0.25px;
    font-weight: 400;
    color: white;
  }
  p > span {
    color: white;
    font-size: 40px;
    font-weight: 700;
    line-height: 123.5%;
    letter-spacing: 0.25px;
  }
`;

const Image = styled.img<{ percent: string }>`
  margin-top: 24px;
  display: flex;
  width: 200px;
  height: 196px;
  margin-left: auto;
  margin-right: auto;
  background-image: linear-gradient(
    to bottom,
    white,
    white ${props => 100 - Number(props.percent)}%,
    #ffbb00,
    #ffbb00 ${props => 100 - Number(props.percent)}%
  );
  background-color: ${props => 
    isNaN(Number(props.percent)) && 'white'
  };
`;

const DetailTimeInfo = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailTimeInfoPBox = styled.div`
  display: flex;
  justify-content: space-between;
  p:first-child {
    font-size: 16px;
    font-weight: 700;
    color: white;
  }
  p:last-child {
    font-size: 22px;
    font-weight: 700;
    color: white;
  }
`;

const PageMoveButton = styled.button<{ goalnotset: string }>`
  margin-left: 221px;
  margin-top: 18px;
  border: none;
  font-size: 16px;
  align-self: flex-end;
  color: white;

  span {
    position: relative;
    top: 2px;
    display: inline-block;
    animation: bounce 0.3s ease infinite alternate;
    color: #fff;
  }
  span:nth-child(2) {
    animation-delay: 0.1s;
  }
  span:nth-child(3) {
    animation-delay: 0.2s;
  }
  span:nth-child(4) {
    animation-delay: 0.3s;
  }
  span:nth-child(5) {
    animation-delay: 0.4s;
  }
  span:nth-child(6) {
    animation-delay: 0.5s;
  }
  span:nth-child(7) {
    animation-delay: 0.6s;
  }

  @keyframes bounce {
    100% {
      top: -2px;
    }
  }
  ${props =>
    props.goalnotset === 'true' &&
    css`
      animation: none;
      span {
        animation: none;
      }
    `}
`;

const Help = styled.div`
  display: flex;
  gap: 10px;
  p {
    font-size: 12px;
    line-height: 100%;
    color: white;
    display: none;
  }
  &:hover {
    p {
      display: flex;
    }
  }
  img {
    margin-left: -12px;
  }
`
export default GoalPercentGraph;
