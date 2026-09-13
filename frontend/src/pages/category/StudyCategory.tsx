import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import profileDefaultImg from '../../images/profile.png';
import first from '../../images/ranking/1st.svg';
import second from '../../images/ranking/2nd.svg';
import third from '../../images/ranking/3rd.svg';
import fourth from '../../images/ranking/4th.svg';
import fifth from '../../images/ranking/5th.svg';
import RoomList from '../home/components/RoomList';
type StudyCategoryProps = {};
type RankingList = {
  totalHours: number | string;
  historyType: string;
  nickname: string;
  profileImage: null | string;
};
const StudyCategory: React.FC<StudyCategoryProps> = () => {
  useEffect(() => {
    document.title = '책상일기 - 스터디룸';
  }, []);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const rankingImg = [
    { borderColor: 'rgba(253, 104, 4, 1)', img: first },
    { borderColor: 'rgba(255, 187, 0, 1)', img: second },
    { borderColor: 'rgba(185, 151, 228, 1)', img: third },
    { borderColor: 'rgba(26, 129, 232, 1)', img: fourth },
    { borderColor: 'rgba(79, 72, 145, 1)', img: fifth },
  ];
  const [rankingList, setRankingList] = useState<RankingList[]>([]);
  // console.log(rankingList);
  const studyRanking = async () => {
    try {
      const response = await axios.get(`${serverUrl}/study-room/rankings`);

      setRankingList(response.data);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    studyRanking();
  }, []);

  const timeFormat = (num: number | string) => {
    const totalSeconds = Math.floor(Number(num)); // 정수 부분만 남기기
    const hour = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minute = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0',
    );
    const second = String(totalSeconds % 60).padStart(2, '0');
    return `${hour}시간${minute}분${second}초`;
  };

  return (
    <Container>
      <Info>
        <RankingInfo>랭킹 순위는 일주일 누적시간 기준입니다.</RankingInfo>
        {rankingList.map((item, i: number) => {
          return (
            <User key={`${i + 1}위`}>
              <p>{i + 1}위</p>
              <UserImage
                $bordercolor={rankingImg[i].borderColor}
                $imgsrc={item.profileImage}
              >
                <RankingImg src={rankingImg[i].img} alt={`${i + 1}등이미지`} />
              </UserImage>
              <p>{item.nickname}</p>
              <p>{timeFormat(item.totalHours)}</p>
            </User>
          );
        })}
      </Info>

      <Rooms>
        <RoomList label="전체 스터디룸" show="fetchStudy" />
      </Rooms>
    </Container>
  );
};

const RankingInfo = styled.div`
  position: absolute;
  top: -50px;
  padding: 5px 20px;
  background-color: white;
  color: var(--gray-07);
  font-weight: 500;
  text-align: center;
  box-shadow: 2px 2px 4px 2px rgba(207, 207, 207, 0.3);
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.5s, visibility 0.5s;
`;

const Rooms = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 1200px;
  height: 100%;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 190px;
  gap: 24px;
  position: relative;
  &:hover {
    ${RankingInfo} {
      opacity: 1;
    }
  }
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 145px;
  height: 183px;
  text-align: center;
  gap: 4px;
  p:nth-child(1) {
    font-size: 24px;
    font-weight: 700;
  }

  p:nth-child(3) {
    color: var(--gray-07, #757575);
    font-size: 15px;
  }
  p:nth-child(4) {
    font-size: 18px;
    font-weight: 700;
  }
`;

const UserImage = styled.div<{ $bordercolor: string; $imgsrc: null | string }>`
  width: 100px;
  height: 100px;
  border: 2px solid ${props => props.$bordercolor};
  border-radius: 50%;
  background-image: url(${props => props.$imgsrc !== null ? props.$imgsrc : profileDefaultImg});
  background-size: cover;
  background-position: center;
`;
const RankingImg = styled.img`
  margin-top: 50px;
  margin-left: 60px;
`;
export default StudyCategory;
