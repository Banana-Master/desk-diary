import React from 'react';
import styled from 'styled-components';
import { profile } from '../../../../images';

type ChatProps = {
  message: {
    message: string;
    nickname: string;
    img: string;
    time: string;
    roomId: string;
  };
};

const Chat: React.FC<ChatProps> = ({ message }) => {
  return (
    <Container>
      {message && (
        <>
          <UserImg src={message.img ? message.img : profile} />
          <ChatDetails>
            <Metadata>
              <UserName>{message.nickname}</UserName>
              <Time>{message.time}</Time>
            </Metadata>

            <Message>{message.message}</Message>
          </ChatDetails>
        </>
      )}
    </Container>
  );
};

const NewUser = styled.div``

const Metadata = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
`;

const Time = styled.div`
  color: var(--gray-05);
  font-size: 12px;
  margin-left: auto;
`;

const Message = styled.div`
  font-size: 15px;
  word-wrap: break-word;
  word-break: break-word;
  width: 100%;
  color: white;

  /* @media (min-width: 768px) {
    width: 300px;
  } */
`;

const UserName = styled.div`
  color: #9e9e9e;
  font-size: 15px;
`;

const ChatDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 5px;

  width: 100%;
  /* @media (min-width: 768px) {
    width: 300px;
  } */
`;

const UserImg = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  width: 95%;
  gap: 8px;
  /* overflow: wrap; */

  width: 100%;
`;
export default Chat;
