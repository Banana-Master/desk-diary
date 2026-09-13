import React from 'react';
import styled from 'styled-components';
import SpeechBubble from './SpeechBubble';
import blue from '../../../../images/ranking/4th.svg';
import { hand_arrow, mark } from '../../../../images/room';

type PrecautionsModalProps = {};

const PrecautionsModal: React.FC<PrecautionsModalProps> = () => {
  return (
    <Container>
      <SpeechBubble
        width="230px"
        text={`이 방의 유의사항을 확인 해 봐!`}
      />
      <Caracter src={blue} />
      <Arrow src={mark} />
    </Container>
  );
};

const Arrow = styled.img`
  position: absolute;
  width: 100px;
  bottom: -20px;
  left: -20px;
  transform: rotate(270deg);
`;

const Caracter = styled.img`
  width: 100px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  bottom: 50px;
  left: 250px;
  z-index: 100;
`;
export default PrecautionsModal;
