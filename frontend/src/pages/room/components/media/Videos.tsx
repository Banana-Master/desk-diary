import React from 'react';
import DefaultScreen from './DefaultScreen';
import styled from 'styled-components';
import { RoomUserList } from '../../../../recoil/RoomAtom';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'react-query';
import { fetchUser } from '../../../../axios/api';
import { FaVideoSlash, FaVolumeMute } from 'react-icons/fa';
import loading from '../../../../images/loading.gif';

type PeerMediaState = { micOn: boolean; camOn: boolean };

type VideosProps = {
  localStream: MediaStream;
  localMediaState: PeerMediaState;
  remoteStreams: Record<string, MediaStream>;
  mediaState: Record<string, PeerMediaState>;
  volumes: Record<string, number>;
};

const DEFAULT_PEER_MEDIA_STATE: PeerMediaState = { micOn: true, camOn: true };

const Videos: React.FC<VideosProps> = ({
  localStream,
  localMediaState,
  remoteStreams,
  mediaState,
  volumes,
}) => {
  const roomUserList = useRecoilValue(RoomUserList);

  const getNicknameBySocketId = (socketId: string) => {
    const user = roomUserList.find(user => user.socketId === socketId);
    return user ? user.nickname : null;
  };

  // 볼륨 레벨에 따라서 색상을 결정하는 함수
  const getBorderColorByVolume = (volume: number) => {
    if (volume > 18) return 'green';
    return 'var(--gray-09)';
  };

  const { data, isLoading, error } = useQuery('cam-user', fetchUser);
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생</div>;
  }

  return (
    <Container>
      <Video border={getBorderColorByVolume(volumes.local || 0)}>
        {localMediaState.camOn ? (
          <LocalVideo
            autoPlay
            playsInline
            muted
            ref={el => {
              if (el && el.srcObject !== localStream) {
                el.srcObject = localStream;
              }
            }}
          />
        ) : (
          <DefaultScreen />
        )}
        <Nickname>{data.nickname}</Nickname>
        {!localMediaState.micOn && (
          <NonAudio>
            <FaVolumeMute style={{ fontSize: '25px', color: '#e90000' }} />
          </NonAudio>
        )}
      </Video>

      {Object.entries(remoteStreams).map(([socketId, stream]) => {
        const { micOn, camOn } =
          mediaState[socketId] ?? DEFAULT_PEER_MEDIA_STATE;
        const volumeLevel = volumes[socketId] || 0;
        const borderColor = getBorderColorByVolume(volumeLevel);
        const nickname = getNicknameBySocketId(socketId);

        if (camOn) {
          return (
            <Video key={socketId} border={borderColor}>
              <ClosedCam>
                <FaVideoSlash style={{ fontSize: '50px', color: '#e90000' }} />
              </ClosedCam>
              <RemoteVideo
                autoPlay
                playsInline
                style={{
                  backgroundImage: `url(${loading})`,
                  backgroundSize: '200px',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
                ref={el => {
                  if (el && el.srcObject !== stream) {
                    el.srcObject = stream;
                  }
                }}
              />
              {nickname && <Nickname type="button">{nickname}</Nickname>}
              {!micOn && (
                <NonAudio>
                  <FaVolumeMute style={{ fontSize: '25px', color: '#e90000' }} />
                </NonAudio>
              )}
            </Video>
          );
        }

        return (
          <Video key={socketId} border={borderColor}>
            <DefaultScreen />
            {nickname && <Nickname type="button">{nickname}</Nickname>}
            {!micOn && (
              <NonAudio>
                <FaVolumeMute style={{ fontSize: '25px', color: '#e90000' }} />
              </NonAudio>
            )}
          </Video>
        );
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

const LocalVideo = styled.video`
  height: 225px;
  width: 400px;
  background-color: blue;
  z-index: 5;
  object-fit: cover;
  transform: scaleX(-1);
`;

const RemoteVideo = styled.video`
  height: 225px;
  width: 400px;
  display: inline;
  background-color: black;
  z-index: 5;
  object-fit: cover;
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
