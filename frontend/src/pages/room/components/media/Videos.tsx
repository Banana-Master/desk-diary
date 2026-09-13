import React, { useEffect, useState } from 'react';
import {
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  AgoraVideoPlayer,
} from 'agora-rtc-react';
import DefaultScreen from './DefaultScreen';
import styled from 'styled-components';
import socket from '../../socketInstance';
import { RoomUserList } from '../../../../recoil/RoomAtom';
import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import { fetchUser } from '../../../../axios/api';
import { FaVideoSlash, FaVolumeMute } from 'react-icons/fa';
import { blue } from '../../../../images/character';
import loading from '../../../../images/loading.gif';

type VideosProps = {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  volumes: any;
};

type UserListPayload = {
  nickname: string;
  userListArr: { nickname: string; img: string; userId: number }[];
};

const Videos: React.FC<VideosProps> = ({ users, tracks, volumes }) => {
  const [roomUserList, setRoomUserList] = useRecoilState(RoomUserList);
  const [micsStatus, setMicsStatus] = useState<{ [uid: number]: boolean }>({});

  // userId를 사용해서 userList에서 닉네임 찾기
  const getNicknameByUserId = (userId: number) => {
    const user = roomUserList.find(user => user.userId === userId);
    return user ? user.nickname : null;
  };

  // 볼륨 레벨에 따라서 색상을 결정하는 함수
  const getBorderColorByVolume = (volume: number) => {
    // if (volume > 70) return 'red';
    // if (volume > 50) return 'orange'; // 볼륨이 5 이상이면 빨간색
    if (volume > 18) return 'green'; // 볼륨이 3 이상이면 주황색
    return 'var(--gray-09)'; // 그 외는 녹색
  };

  // 본인의 오디오 트랙 ID를 가져옴
  const myAudioTrackId = tracks[0].getTrackId();

  // 나가고 들어온 유저 닉네임 받아오기
  useEffect(() => {
    socket.on('user-list', (payload: UserListPayload) => {
      const { nickname, userListArr } = payload;
      setRoomUserList(userListArr);
    });

    return () => {
      socket.off('user-list');
      socket.off('left-user');
    };
  }, [socket]);

  const { data, isLoading, error } = useQuery('cam-user', fetchUser);
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생</div>;
  }

  return (
    <Container>
      <Video border={getBorderColorByVolume(volumes[myAudioTrackId] || 0)}>
        <AgoraVideoPlayer
          style={{
            height: '225px',
            width: '400px',
            backgroundColor: 'blue',
            zIndex: '5',
          }}
          className="video"
          videoTrack={tracks[1]}
        />
        <Nickname>{data.nickname}</Nickname>
      </Video>

      {users.length > 0 &&
        users.map(user => {
          if (user.videoTrack) {
            const volumeLevel = volumes[user.uid] || 0; // 기본 볼륨 값은 0으로 설정
            const borderColor = getBorderColorByVolume(volumeLevel);
            const nickname = getNicknameByUserId(+user.uid);
            return (
              <Video key={user.uid} border={borderColor}>
                <ClosedCam>
                  <FaVideoSlash
                    style={{ fontSize: '50px', color: '#e90000' }}
                  />
                </ClosedCam>

                <AgoraVideoPlayer
                  style={{
                    height: '225px',
                    width: '400px',
                    display: 'inline',
                    backgroundColor: 'black',
                    zIndex: '5',
                    backgroundImage: `url(${loading})`,
                    backgroundSize: '200px', // 이미지가 div에 꽉 차도록
                    backgroundPosition: 'center center', // 이미지가 div 중앙에 오도록
                    backgroundRepeat: 'no-repeat',
                  }}
                  className="video"
                  videoTrack={user.videoTrack}
                  key={user.uid}
                />
                {nickname && <Nickname type="button">{nickname}</Nickname>}
                {!user.audioTrack && (
                  <NonAudio>
                    <FaVolumeMute
                      style={{ fontSize: '25px', color: '#e90000' }}
                    />
                  </NonAudio>
                )}
              </Video>
            );
          } else {
            const nickname = getNicknameByUserId(+user.uid);
            const volumeLevel = volumes[user.uid] || 0; // 기본 볼륨 값은 0으로 설정
            const borderColor = getBorderColorByVolume(volumeLevel);
            return (
              <Video border={borderColor}>
                <DefaultScreen key={user.uid} />
                {nickname && <Nickname type="button">{nickname}</Nickname>}
                {!user.audioTrack && (
                  <NonAudio>
                    <FaVolumeMute
                      style={{ fontSize: '25px', color: '#e90000' }}
                    />
                  </NonAudio>
                )}
              </Video>
            );
          }
        })}
    </Container>
  );
};

const NonAudio = styled.div`
  position: absolute;
  bottom: 0;
  left: 10px;
  z-index: 100;
`;

const ClosedCam = styled.div`
  position: absolute;
  z-index: 5;
  top: 125px;
  left: 175px;
`;

const Nickname = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  z-index: 10;
  background-color: var(--gray-09);
  padding: 0 10px;
  display: flex;
  align-items: center;
  height: 35px;
  border-radius: 10px;
  border: none;
  cursor: auto;
`;

const Video = styled.div<{ border: string }>`
  width: 400px;
  height: 225px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid ${({ border }) => border};
  position: relative;
  background-color: blue;
  z-index: 0;
  object-fit: contain;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;

  overflow: scroll;
  overflow-y: hidden;
  align-items: center;
  margin-bottom: 100px;
  @media (max-width: 1700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1500px) {
    grid-template-columns: repeat(1, 1fr);
    margin-bottom: 0px;
  }
`;
export default Videos;
