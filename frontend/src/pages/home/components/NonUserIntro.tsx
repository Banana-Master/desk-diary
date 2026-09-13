import React from 'react';
import styled from 'styled-components';
import nonUserIntro from '../../../images/main/nonUserIntro.svg'
import { blue, orange, purple, yellow } from '../../../images/character';

type NonUserIntroProps = {};

const NonUserIntro: React.FC<NonUserIntroProps> = () => {

  const characters = [ blue, orange, purple, yellow];
  return (
    <Container>
      <Blue>
        <img src={blue} alt="character" />
      </Blue>
      <Orange>
        <img src={orange} alt="character" />
      </Orange>
      <Purple>
        <img src={purple} alt="character" />
      </Purple>
      <Yellow>
        <img src={yellow} alt="character" />
      </Yellow>
      <img src={nonUserIntro} alt="user intro"/>
    </Container>
  );
};

const Blue = styled.div`
  position : absolute;
  top: -60px;
  left: 0px;
  >img{
    width: 70%;
  }
`

const Orange = styled.div`
  position : absolute;
  top: -85px;
  right: 0px;
  >img{
    width: 70%;
  }
`

const Purple = styled.div`
  position : absolute;
  top: -60px;
  right: 250px;
  >img{
    width: 70%;
  }
`

const Yellow = styled.div`
  position : absolute;
  top: -75px;
  left: 200px;
  >img{
    width: 70%;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-top: 30px;

  position: relative;

  >img{
    width: 100%;
  }
`;

export default NonUserIntro;
