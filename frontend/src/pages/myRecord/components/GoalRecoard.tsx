import React, { useState } from 'react';
import styled from 'styled-components';
import GoalRecordChart from '../chart/GoalRecordChart';

type GoalRecoardProps = {};

const GoalRecoard: React.FC<GoalRecoardProps> = () => {
  const [view7, setView7] = useState<boolean>(true);
  const [view30, setView30] = useState<boolean>(false);

  const view7OnclickHandler = () => {
    setView7(true);
    setView30(false);
  };
  const view30OnclickHandler = () => {
    setView7(false);
    setView30(true);
  };
  return (
    <Container>
      <TitleBox>
        <Titile>목표 달성 기록 모음 (%)</Titile>
        <GoalButtonBox>
          <ButtonState7
            onClick={view7OnclickHandler}
            viewstate={`${view7}`}
          >
            일주일 기록 보기
          </ButtonState7>
          <ButtonState30
            onClick={view30OnclickHandler}
            viewstate={`${view30}`}
          >
            한달 기록 보기
          </ButtonState30>
        </GoalButtonBox>
      </TitleBox>
      <GoalRecordChart view7={view7} view30={view30}/>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  width: 786px;
  height: 319px;
  border-radius: 20px;
  background: var(--bw-whtie);
  box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.25);
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

const GoalButtonBox = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
`;

const ButtonState7 = styled.button<{ viewstate: string }>`
  color: ${props => (props.viewstate === 'true' ? 'black' : 'rgba(0, 0, 0, 0.5)')};
  text-decoration: ${props => (props.viewstate === 'true' ? 'underline' : 'none')};
`;

const ButtonState30 = styled.button<{ viewstate: string }>`
  color: ${props => (props.viewstate === 'true' ? 'black' : 'rgba(0, 0, 0, 0.5)')};
  text-decoration: ${props => (props.viewstate === 'true' ? 'underline' : 'none')};
`;

const Titile = styled.div`
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

export default GoalRecoard;
