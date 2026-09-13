import React from 'react';
import styled from 'styled-components';

type BasicPrecautionsProps = {};

const BasicPrecautions: React.FC<BasicPrecautionsProps> = () => {
  return (
    <>
      <BoxGroup>
        <Number>1.</Number>
        <span>
          화상 채팅 중에도 개인 정보를 보호해야 합니다. 화상 채팅 중에
          화면을 녹화하거나 스크린샷을 찍지 않도록 주의 해 주세요.
        </span>
      </BoxGroup>
      <BoxGroup>
        <Number>2.</Number>
        <span>
          다른 사용자를 존중하고 예의를 갖춰 모욕, 비방, 또는 공격적인 언어
          사용을 피해주세요.
        </span>
      </BoxGroup>
      <BoxGroup>
        <Number>3.</Number>
        <span>
          가능한 조용한 환경에서 화상 채팅을 하도록 노력하며, 배경 소음을
          최소화해주세요.
        </span>
      </BoxGroup>
    </>
  );
};

const Number = styled.div`
  font-size: 15px;
  color: var(--gray-07);
  width: 15px;
  height: 100%;
  margin-right: 2px;
`;

const BoxGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  > span {
    font-size: 15px;
    color: var(--gray-07);
  }
`;
export default BasicPrecautions;
