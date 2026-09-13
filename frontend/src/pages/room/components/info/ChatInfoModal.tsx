import React from 'react';
import styled from 'styled-components';
import SpeechBubble from './SpeechBubble';
import blue from '../../../../images/ranking/4th.svg';
import { hand_arrow, mark } from '../../../../images/room';

type ChatInfoModalProps = {
  
};

const ChatInfoModal:React.FC<ChatInfoModalProps> = () => {
  
  return (
    <Container>
      <SpeechBubble
        width="250px"
        text={`방 안의 사람들과 채팅을 할 수 있어!\n새로고침을 하거나 방에서 나가면\n지난 채팅 기록을 볼 수 없다는걸\n유의해!`}
      />
      <Caracter src={blue} />
      <Arrow src={mark} />
    </Container>
  );
}

const Arrow = styled.img`
  position: absolute;
  width: 100px;
  bottom: -20px;
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
  bottom: 50px;
  right: 380px;
  z-index: 100;
`;
export default ChatInfoModal;