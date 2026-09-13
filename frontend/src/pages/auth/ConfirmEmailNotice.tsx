import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../images/logo-2.svg';

type ConfirmEmailNoticeProps = {};

const ConfirmEmailNotice: React.FC<ConfirmEmailNoticeProps> = () => {
  return (
    <Container>
      <img src={logo} alt="logo" />
      <Content>
        <p>제출하신 이메일로 확인 메일을 발송했습니다.</p>
        <p>메일을 확인하신 후,</p>
      </Content>
      <Content>
        <p>
          아래의 <LoginText>로그인하기</LoginText> 버튼을 클릭해 주세요.
        </p>
      </Content>

      <ButtonGroup>
        <Button to="/login" buttonType="login">
          로그인하러가기
        </Button>
        <Button to="/join" buttonType="join">
          회원가입 다시하기
        </Button>
      </ButtonGroup>
    </Container>
  );
};

const LoginText = styled.span`
  background-color: var(--primary-01);
  padding: 8px;
  font-size: 17px;
  width: 80px;
  opacity: 0.7;
  color: white;
  border-radius: 10px;
  cursor: default;
`;

const Content = styled.div`
  text-align: center;
  gap: 20px;
  margin-bottom: 20px;
  > p {
    font-size: 24px;
    height: 35px;
    cursor: default;
  }
`;

const Button = styled(Link)<{ buttonType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 50px;
  border: 2px solid var(--primary-01);
  border-radius: 10px;
  background-color: ${props =>
    props.buttonType === 'login' ? 'var(--primary-01)' : 'white'};
  color: ${props =>
    props.buttonType === 'join' ? 'var(--primary-01)' : 'white'};
  font-size: 17px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 100px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  > img {
    width: 100px;
    margin-bottom: 100px;
  }
`;
export default ConfirmEmailNotice;
