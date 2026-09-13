import React from 'react';
import styled from 'styled-components';
import SpeechBubble from './SpeechBubble';
import blue from '../../../../images/ranking/4th.svg';
import { hand_arrow, mark } from '../../../../images/room';

type AsmrInfoModalProps = {
  
};

const AsmrInfoModal:React.FC<AsmrInfoModalProps> = () => {
  
  return (
    <Container>
      <SpeechBubble
        width="250px"
        text={`집중이 필요하다면 ASMR을\n이용할 수 있어!\n우리가 준비 한 ASMR중\n원하는걸 골라봐!`}
      />
      <Caracter src={blue} />
      <Arrow src={mark} />
    </Container>
  );
}

const Arrow = styled.img`
  position: absolute;
  width: 100px;
  bottom: 10px;
  right: -20px;
  transform: scaleX(-1);
`;

const Caracter = styled.img`
  width: 100px;
  transform: scaleX(-1);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 90px;
  right: 380px;
  z-index: 100;
`;
export default AsmrInfoModal;