import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import error from '../images/error/error.svg';

type ErrorProps = {};

const Error: React.FC<ErrorProps> = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Text>
        <p>404 ERROR</p>
        <p>페이지를 찾을 수 없습니다.</p>
      </Text>
      <img
        src={error}
        alt="error"
        style={{ width: '255px', height: '289px' }}
      />

      <Text2>
        <p>
          페이지가 존재하지 않거나, <br />
          사용할 수 없는 페이지입니다.
        </p>
        <p>
          입력하신 주소가 정확한지 <br />
          다시 한번 확인해주세요.
        </p>
      </Text2>
      <ButtonBox>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          이전 페이지로 이동하기
        </button>
        <button
          onClick={() => {
            navigate('/');
          }}
        >
          메인으로 돌아가기
        </button>
      </ButtonBox>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  p:first-child {
    color: #d32f2f;
    text-align: center;
    font-family: Pretendard;
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 1.8px;
  }
  p:last-child {
    color: var(--gray-10, #212121);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.8px;
  }
  margin-bottom: 40px;
`;

const Text2 = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  p {
    text-align: center;
  }
  p:first-child {
    font-size: 20px;
    font-weight: 500;
  }
  p:last-child {
    font-size: 16px;
  }
`;

const ButtonBox = styled.div`
  margin-top: 54px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
  button {
    width: 380px;
    font-size: 24px;
    padding: 10px;
    text-align: center;
    font-weight: 700;
    height: 60px;
  }
  button:first-child {
    background-color: white;
    border: 1px solid var(--primary-01);
    color: var(--primary-01);
  }
  button:last-child {
    background-color: var(--primary-01);
    border: none;
    color: white;
  }
`;

export default Error;
