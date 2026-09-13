import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { help_outline, error_outline, logout } from '../../../images/room';
import { RoomModalAtom, RoomInfoModalAtom } from '../../../recoil/RoomAtom';
import RoomModal from './RoomModal';
import BasicPrecautions from '../../home/components/BasicPrecautions';
import RoomInfoModal from './info/RoomInfoModal';


type RoomUnderBarProps = { roomId: string; note: string };

const RoomUnderBar: React.FC<RoomUnderBarProps> = ({ roomId, note }) => {
  const [showNote, setShowNote] = useState(false);
  const [IsOpenInfoModal, setIsOpenInfoModal] = useRecoilState<boolean>(RoomInfoModalAtom);
  const [outModalState, setOutModalState] =
    useRecoilState<boolean>(RoomModalAtom);

  const roomOutButtonHandler = () => {
    // 에러 메시지 리스너 추가
    // const errorHandler = (message: string) => {
    //   console.error(message);
    //   console.log('🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈', message);
    // };

    setOutModalState(true);
  };

  const showNoteHandler = () => {
    setShowNote(!showNote);
  };

  const renderNoteWithBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const onClickHelp = () => {
    setIsOpenInfoModal(!IsOpenInfoModal)
  }

  return (
    <Container>
      {outModalState && <RoomModal />}
      {IsOpenInfoModal && <RoomInfoModal />}

      <Body>
        <OutRoomButton onClick={roomOutButtonHandler}>
          <img src={logout} alt="방나가기" />
          <p>방 나가기</p>
        </OutRoomButton>
        <SettingList>
          <List onClick={showNoteHandler}>
            <img src={error_outline} alt="" />
            <p>유의사항</p>
            {showNote && (
              <Note>
                <span>📢 유의사항 　</span>
                <BasicPrecautions />
                {renderNoteWithBreaks(note)}
              </Note>
            )}
          </List>
          <List onClick={onClickHelp}>
            <img src={help_outline} alt="" />
            <p>도움말</p>
            {showNote && (
              <Note>
                <span>📢 유의사항 　</span>
                <BasicPrecautions />
                {renderNoteWithBreaks(note)}
              </Note>
            )}
          </List>
        </SettingList>
      </Body>
    </Container>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;

  img {
    width: 24px;
    height: 24px;
  }
  p {
    color: white;
    font-size: 12px;
  }
`;

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
`;

const Note = styled.div`
  background-color: var(--gray-03);
  border-radius: 10px;
  opacity: 0.8;
  position: fixed;
  bottom: 70px;
  left: 30px;
  padding: 10px;
  font-size: 15px;
  color: var(--gray-07);
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  width: 500px;
  text-align: left;
  z-index: 5000;

  > span {
    margin: 10px auto;
    color: var(--gray-09);
    font-size: 15px;
    font-weight: 700;
  }
`;

const Body = styled.div`
  width: 100%;
  height: 60px;
  background-color: var(--gray-09);
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    width: 100vw;
  }
`;

const OutRoomButton = styled.button`
  background-color: var(--gray-09);
  display: flex;
  width: 180px;
  height: 48px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
  /* border: 1px solid var(--primary-01); */
  background-color: white;
  border-radius: 24px;
  img {
    width: 24px;
    height: 24px;
  }
  p {
    color: var(--primary-01);
    font-weight: 600;
  }
`;

const SettingList = styled.div`
  margin-left: 50px;
  display: flex;
  gap: 30px;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

export default RoomUnderBar;
