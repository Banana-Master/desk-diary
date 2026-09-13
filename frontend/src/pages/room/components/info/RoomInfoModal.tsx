import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalBackground from '../../../../components/ModalBackground';
import TimerInfoModal from './TimerInfoModal';
import PrecautionsModal from './PrecautionsModal';
import AsmrInfoModal from './AsmrInfoModal';
import ChatInfoModal from './ChatInfoModal';
import InfoModal from './InfoModal';
import { useRecoilState } from 'recoil';
import { RoomInfoModalAtom } from '../../../../recoil/RoomAtom';

type RoomInfoModalProps = {};

const RoomInfoModal: React.FC<RoomInfoModalProps> = () => {
  const [modalsOpen, setModalsOpen] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const [IsOpenInfoModal, setIsOpenInfoModal] =
    useRecoilState<boolean>(RoomInfoModalAtom);

  const onClickInfoModal = () => {
    setModalsOpen(prevModals => {
      const nextModals = prevModals.slice(); // 배열을 복사
      const currentIndex = nextModals.findIndex(open => open); // 현재 열린 모달 찾기
      if (currentIndex >= 0 && currentIndex < nextModals.length - 1) {
        nextModals[currentIndex] = false; // 현재 모달 닫기
        nextModals[currentIndex + 1] = true; // 다음 모달 열기
      } else if (currentIndex === nextModals.length - 1) {
        nextModals[currentIndex] = false; // 마지막 모달인 경우, 모달 닫기
        setIsOpenInfoModal(false);
      }
      return nextModals; // 새로운 모달 상태 배열 반환
    });
  };

  return (
    <Container onClick={onClickInfoModal}>
      <ModalBackground blur="none" height="calc(100vh - 60px)" />
      {modalsOpen[0] && <TimerInfoModal />}
      {modalsOpen[1] && <AsmrInfoModal />}
      {modalsOpen[2] && <ChatInfoModal />}
      {modalsOpen[3] && <PrecautionsModal />}
      {modalsOpen[4] && <InfoModal />}
      <Text>화면을 클릭하면 다음 안내로 넘어갑니다.</Text>
    </Container>
  );
};

const Text = styled.div`
  color: white;
  position: absolute;
  top: 50vh;
  text-align: center;
  font-size: 40px;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: calc(100vh - 60px);
`;
export default RoomInfoModal;
