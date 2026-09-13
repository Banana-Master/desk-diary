import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logo_colorful, lendingImage } from '../../images';

type LendingProps = {};

const Lending: React.FC<LendingProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '책상일기 - 환영합니다'
    window.sessionStorage.setItem('visited', 'true');
  }, []);

  const goService = (event: any) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <Container>
      <BoxContents>
        <Logo src={logo_colorful} alt="logo" />
        <Title>
          <div>언제 어디든지</div>
          <div>나의 책상이 될 수 있는 곳에서 만나요</div>
        </Title>

        <Text>
          <div>공부,취미 혼자 시작하기 힘들다면</div>
          <div>같은 고민을 가진 사람들과 캠으로 소통하면서</div>
          <div>서로의 의지를 책상 위에서 응원 해주는 온라인 캠서비스</div>
          <div>책상일기</div>
        </Text>

        <LendingImg src={lendingImage} alt="lending-image" />
        <StartButton onClick={e => goService(e)}>서비스 시작하기</StartButton>
      </BoxContents>

      <Footer>
        <FooterBody>
          <FooterTitle>Site Map</FooterTitle>
          <FooterContents>
            <FooterContent>이용약관</FooterContent>
            <FooterContent>개인정보처리방침</FooterContent>
          </FooterContents>
          <hr />
          <FooterTitle>책상일기</FooterTitle>
          <FooterContents>
            <FooterContent>FE | 박서현 김성호</FooterContent>
            <FooterContent>BE | 남현재 서민정 손현원</FooterContent>
            <FooterContent>UIUX | 이다현</FooterContent>
          </FooterContents>
        </FooterBody>
      </Footer>
    </Container>
  );
};

const Title = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    color: white;
    height: 35px;
    font-size: 30px;
    font-weight: 700;
  }
  @media (max-width: 768px) {
    div {
      font-size: 1.5em;
    }
  }
  @media (max-width: 400px) {
    div {
      font-size: 1em;
    }
  }
`;

const LendingImg = styled.img`
  width: 800px;
  max-width: 80%;
  top: 150px;
`;

const Logo = styled.img`
  width: 50px;
`;

const FooterBody = styled.div`
  width: calc(100vw - 4rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin-right: 2rem;
  margin-left: 2rem;
  flex-wrap: wrap;
  > hr {
    width: 100%;
    margin: 15px 0;
  }
`;

const FooterContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
  gap: 30px;
  @media (max-width: 768px) {
    flex-direction: column; /* 모바일 화면에서는 컬럼(col)로 변경 */
    gap: 10px;
  }
`;

const FooterContent = styled.div`
  color: white;
  font-size: 13px;
  font-weight: 500;
`;

const FooterTitle = styled.div`
  color: white;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const Container = styled.div`
  width: 100vw; // calc(100vw - 10px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #1a81e8;

  position: relative;
`;

const Footer = styled.div`
  /* width: calc(100vw - 10px); */
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const BoxContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin-top: 100px;
  padding-bottom: 250px;
  position: relative;
`;

const Text = styled.div`
  color: var(--primary-01);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(26, 129, 232, 0.2);
  border-radius: 20px;
  margin-top: 10px;

  > div {
    height: 22px;
    font-size: 17px;
    font-weight: 500;
    color: white;
  }
  
  @media (max-width: 400px) {
    div {
      font-size: 0.7em;
    }
  }
`;

const StartButton = styled.div`
  width: 180px;
  height: 40px;
  font-size: 17px;
  font-weight: 500;
  color: white;
  border: 5px solid white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out; // 버튼이 움직이는 걸 부드럽게!
  background-color: #1a81e8;
  padding: 5px;
  /* z-index: 100; */
  margin-bottom: 40px;

  cursor: pointer;

  &:hover {
    background-color: #4a9cee;
  }

  box-shadow: 0 0 0 1px #6698cb inset, 0 0 0 2px rgba(255, 255, 255, 0.15) inset,
    0 8px 0 0 rgba(110, 164, 219, 0.7), 0 8px 0 1px rgba(0, 0, 0, 0.4),
    0 8px 8px 1px rgba(0, 0, 0, 0.5);

  &:active {
    transform: translateY(4px); // 버튼을 아래로 4px 움직여
    box-shadow: 0 0 0 1px #6191c2 inset,
      0 0 0 2px rgba(255, 255, 255, 0.15) inset,
      0 4px 0 0 rgba(110, 164, 219, 0.7), 0 4px 0 1px rgba(0, 0, 0, 0.4),
      0 4px 8px 1px rgba(0, 0, 0, 0.5);
  }
`;

export default Lending;
