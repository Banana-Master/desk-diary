import { useEffect } from 'react';

import styled from 'styled-components';

import { useNavigate } from 'react-router';
import { getCookie } from '../../auth/cookie';
import userIntro from '../../images/main/userIntro.svg';
import { Goal, NonUserIntro } from './components';
import RoomList from './components/RoomList';

const Home = () => {
  const navigate = useNavigate();

  const token = getCookie('token');

  useEffect(() => {
    const visited = window.sessionStorage.getItem('visited');
    if (visited === null) {
      navigate('/lending');
    }
  }, []);

  useEffect(() => {
    document.title = '책상일기'
  }, []);

  return (
    <Container>
      <Info>
        {token ? (
          <User>
            <Goal />
            <Img>
              <img src={userIntro} alt="user " />
            </Img>
          </User>
        ) : (
          <NonUserIntro />
        )}
      </Info>

      <RoomList label="엉덩이들이 많이 찾는 TOP 10" show="fetchRoomTop" />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 1200px;
  min-height: calc(100vh - 120px);
`;

const Img = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 165px;
  background-color: var(--primary-01);
  border-radius: 10px;
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.25);

  @media (max-width: 1400px) {
    width: 1000px;
  }

  @media (max-width: 1200px) {
    width: 800px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
  

  > Img {
    height: 165px;
    @media (max-width: 768px) {
    width: 100%;
  }
  }
`;

const User = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  gap: 10px;

  height: 100%;
  width: 100%;

  @media (max-width: 1400px) {
    width: 1000px;
    grid-template-columns: repeat(1, 1fr);
    gap: 0px;
  }
  @media (max-width: 768px) {
    width: 500px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;


  width: 100%;
  height: 190px;

  @media (max-width: 1400px) {
    width: 1000px;
    height: 400px;
  }

  @media (max-width: 1200px) {
    width: 800px;
  }
  @media (max-width: 768px) {
    width: 500px;
  }
`;

export default Home;
