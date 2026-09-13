import React from 'react';
import styled from 'styled-components';
import SpeechBubble from './SpeechBubble';
import blue from '../../../../images/ranking/4th.svg';
import { hand_arrow, mark } from '../../../../images/room';

type InfoModalProps = {
  
};

const InfoModal:React.FC<InfoModalProps> = () => {
  
  return (
    <Container>
      <SpeechBubble
        width="180px"
        text={`안내를 다시 보고 싶다면\n도움말을 클릭 해 줘`}
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
  left: -50px;
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
  left: 380px;
  z-index: 100;
`;
export default InfoModal;