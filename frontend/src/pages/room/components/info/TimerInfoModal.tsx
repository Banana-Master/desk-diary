import React from 'react';
import styled from 'styled-components';
import SpeechBubble from './SpeechBubble';
import blue from '../../../../images/ranking/4th.svg';
import {hand_arrow, mark} from '../../../../images/room'

type TimerInfoModalProps = {};

const TimerInfoModal: React.FC<TimerInfoModalProps> = () => {
  return (
    <Container>
      <SpeechBubble width='220px' text={`기록 시작, 일시정지를 이용하여\n나의 시간을 체크하고,\n책상기록에서 확인 해 보자!`} />
      <Caracter src={blue} />
      <Arrow src={mark} />
    </Container>
  );
};

const Arrow = styled.img`
  position: absolute;
  width: 100px;
  bottom: -20px;
  left: -50px;
`

const Caracter = styled.img`
  width: 100px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 180px;
  left: 250px;
  z-index: 100;
`;
export default TimerInfoModal;