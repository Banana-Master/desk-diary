import React from 'react';
import styled from 'styled-components';

type DeskRecoderProps = {};

const DeskRecoder: React.FC<DeskRecoderProps> = () => {
  return (
    <Container>
      <Title>최근 책상 기록</Title>
      <Content>
        <NoContent>아직 기록된 책상시간이 없습니다.</NoContent>
      </Content>
    </Container>
  );
};

const NoContent = styled.div`
  margin-bottom: 99px;
  margin-top: auto;
  font-size: 24px;
  font-weight: 500;
  line-height: 150%; /* 36px */
  letter-spacing: -0.24px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 750px;
  height: 243px;
  background-color: #d9d9d9;
  padding: 0;
`;

const Title = styled.div`
  margin: 16px auto 0 16px;
  font-size: 24px;
  font-weight: 500;
  line-height: 150%; /* 36px */
  letter-spacing: -0.24px;
`;

export default DeskRecoder;
