import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logo from '../../images/logo-2.svg';
import goalGraphPercent from './image/goalGraphPercent.png';
type HelpProps = {};

const Help: React.FC<HelpProps> = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  useEffect(() => {
    document.title = '책상일기 - 문의';
  }, []);

  const handleQuestionClick = (question: string) => {
    if (selectedQuestion === question) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(question);
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <img src={logo} alt="로고" />
          <p>고객센터</p>
        </div>
        <div>
          <p>자주 묻는 질문</p>
          <p>공지사항</p>
        </div>
      </Header>
      <Search>
        <p>책상일기 고객센터</p>
        <div>
          <input type="text" placeholder="무엇이든 찾아보세요" />
        </div>
        <div>
          <p>추천 키워드</p>
          <button>방 만들기</button>
          <button>방 조회</button>
          <button>이용방법</button>
          <button>가격</button>
        </div>
      </Search>
      <Contents>
        <Questions>
          <p>자주 묻는 질문</p>
          {questions.map(question => (
            <QuestionList key={question.title[1]}>
              <QuestionTitle
                onClick={() => handleQuestionClick(question.title[1])}
              >
                {question.title.map((x: string) => {
                  return <p>{x}</p>;
                })}
              </QuestionTitle>
              {selectedQuestion === question.title[1] && (
                <QuestionContent>
                  {question.content.map((x: any) => {
                    return <p>{x}</p>;
                  })}
                </QuestionContent>
              )}
            </QuestionList>
          ))}
        </Questions>

        <Questions>
          <p>공지사항</p>
          {notice.map(question => (
            <QuestionList key={question.title[1]}>
              <QuestionTitle
                onClick={() => handleQuestionClick(question.title[1])}
              >
                {question.title.map((x: string) => {
                  return <p>{x}</p>;
                })}
              </QuestionTitle>
              {selectedQuestion === question.title[1] && (
                <QuestionContent>
                  {question.content.map((x: any) => {
                    return <p>{x}</p>;
                  })}
                </QuestionContent>
              )}
            </QuestionList>
          ))}
        </Questions>
      </Contents>
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

const questions = [
  {
    title: ['책상기록', '책상 기록의 레벨은 어떻게 측정되나요?'],
    content: [
      '책상 기록의 레벨 측정 방식은 다음과 같습니다.',
      'Lv 0. 1달 기준 누적시간 기록이 없을 때',
      'Lv 1. 1달 기준 누적시간 기록이 있을 때',
      'Lv 2. 1달 기준 누적시간 기록이 24시간 이상일 때',
      'Lv 3. 1달 기준 누적시간 기록이 168(7일)시간 이상일 때',
      'Lv 4. 1달 기준 누적시간 기록이 336(14일)시간 이상일 때.',
    ],
  },
  {
    title: [
      '책상기록',
      '전 아직 서비스를 이용하지 않았는데 목표 달성이라는 글씨가 보여요',
    ],
    content: [
      '서비스를 이용하지 않았는데 목표 달성이라는 글씨가 보이는 이유는 다음과 같습니다.',
      '목표 달성이 0%이면 흰색 목표 달성 그림이 나오고 %가 올라가면 아래에서부터 노란색이 찹니다.',
      <img src={goalGraphPercent} width={'300px'} />,
    ],
  },
];

const notice = [
  {
    title: ['이벤트', '책상일기 만족도 조사 당첨자 공지'],
    content: [
      '안녕하세요',
      '학습&취미 캠스터디 서비스 책상일기입니다. 📹📚🤱',
      '책상일기 서비스를 더욱 빛나게 만들어 주신 여러분의 유저 테스트 참여에 진심으로 감사드립니다.',
      '여러분이 남겨주신 소중한 피드백은 저희 서비스가 한 단계 더 성장하는 데 큰 힘이 되었습니다. ✨',
      <br />,
      '🎁 11월 7일 화요일 당첨자 발표',
      <br />,
      '🥇 꼼꼼상 - 원하는 치킨 브랜드 기프티콘 (3명)',
      '노*현 : 0405',
      '이*다 : 8828',
      '이*일 : 7214',
      <br />,
      '🥈 버그잡이상 - 스타벅스 아아(10명)',
      '진*지 : 0801',
      '이*권 : 9706',
      '신*철 : 4463',
      '홍*형 : 9692',
      '박*현 : 1450',
      '신*철 : 4463',
      '신*현 : 6142',
      '한*성 : 6302',
      '신*영 : 9436',
      '소*진 : 3776',
      '이*형 : 1497',
      <br />,
      '🥉 고맙상 - 바나나 우유',
      '이 외의 피드백을 남겨주신 엉덩이 유저님들께 드립니다.',
      <br />,
      '📢 모든 사은품은 오늘 중으로 발송될 예정입니다.'
    ],
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100vw;
  min-height: 100vh;
`;
const Header = styled.div`
  padding: 10px 50px;
  display: flex;
  background-color: #1a81e8;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: calc(100vw - 100px);
  div {
    display: flex;
    align-items: center;
    gap: 10px;
    p {
      color: white;
    }
  }
  div:first-child {
    img {
      width: 30px;
    }
  }
`;
const Search = styled.div`
  margin-top: 55px;
  background-color: #1a81e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  > p:first-child {
    font-size: 40px;
    font-weight: 700;
    color: white;
  }
  div {
    display: flex;
  }
  div:nth-child(2) {
    width: 40%;
    height: 56px;
    border-radius: 28px;
    padding: 0px 40px;
    background-color: white;
  }
  width: 100vw;
  height: 450px;
  div > p {
    color: white;
    font-weight: 600;
  }
  button {
    color: white;
    background-color: transparent;
    border: none;
  }
  input {
    border: none;
    width: 100%;
    @media (max-width: 500px) {
      width: 90%;
    }
  }
  input:focus {
    outline: none;
    width: 100%;
    @media (max-width: 500px) {
      width: 90%;
    }
  }
`;

const Contents = styled.div`
  margin-right: 150px;
  margin-left: 150px;
  @media (max-width: 768px) {
    margin: 10px;
  }
`;
const Questions = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  margin-bottom: 50px;
  > p {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 50px;
  }
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
`;
const QuestionTitle = styled.div`
  display: flex;
  gap: 20px;
  font-size: 18px;
  border-bottom: 1px solid rgb(129, 137, 143);
  padding: 10px 15px;
  p {
    color: rgb(58, 62, 65);
  }
`;
const QuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  padding: 10px 15px;
  gap: 3px;
  p {
    color: rgb(58, 62, 65);
  }
`;

const Footer = styled.div`
  margin-top: 50px;
  background-color: black;
  padding: 30px 0px;
`;

const FooterContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
  gap: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
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
export default Help;
