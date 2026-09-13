import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { blue, orange, purple, yellow } from '../../../images/character';
import { RoomInfo } from '../../../recoil/RoomAtom';

type Props = {};


function RoomHeader({}: Props) {

  const [roomInfo, setRoomInfo] = useRecoilState(RoomInfo);
  // console.log('헤더',roomInfo) 
  return (
    <HeaderBG>
      <RoomName>{roomInfo.title}</RoomName>
      <IconDiv>
        <img src={yellow} alt="yello" />
        <img src={orange} alt="orange" />
        <img src={purple} alt="purple" />
        <img src={blue} alt="blue" />

      </IconDiv>
    </HeaderBG>
  );
}

const HeaderBG = styled.div`
  height: 96px;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    height: 30px;
  }
`;

const IconDiv = styled.div`
  display: flex;
  width: 350px;
  height: 100%;
  align-items: end;
  gap: 24px;
  justify-content: space-around;
  img {
    width: 50px;
    height: 50px;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const RoomName = styled.p`
  font-size: 18px;
  text-align: left;
  margin-left: 70px;
  margin-right: auto;
  width: 50%;
  /* border: 1px solid green; */
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 768px) {
    margin-right: 0px;
    margin-left: 15px;
    width: 100vw;

  }
`;


export default RoomHeader;
