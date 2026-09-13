import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  IAgoraRTCRemoteUser,
  createMicrophoneAndCameraTracks,
} from 'agora-rtc-react';
import VideoController from './VideoController';
import Videos from './Videos';
import { getCookie } from '../../../../auth/cookie';
import { useClient } from './config';
import { useQuery } from 'react-query';
import { fetchUser } from '../../../../axios/api';
import { useRecoilState } from 'recoil';
import { RoomInfo, RoomUserList } from '../../../../recoil/RoomAtom';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

type RoomSideBarProps = {};

type VideoContainerProps = {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
};
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoContainer: React.FC<VideoContainerProps> = ({ setInCall }) => {
  const token = getCookie('token');
  const getUUID = window.location.pathname.split('/room/')[1];
  const [recoilRoomInfo, setRecoilRoomInfo] = useRecoilState(RoomInfo);
  const [userVolumes, setUserVolumes] = useState<{ [uid: number]: number }>({});
  const [roomInfo, setRoomInfo] = useState({
    agoraAppId: '',
    agoraToken: '',
    category: '',
    count: 0,
    createdAt: '',
    maxHeadcount: 0,
    note: '',
    nowHeadcount: 0,
    ownerId: 0,
    roomId: 0,
    roomThumbnail: '',
    title: '',
    updatedAt: '',
    uuid: '',
  });

  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const navigate = useNavigate();
  const APP_ID = roomInfo.agoraAppId;
  const TOKEN = roomInfo.agoraToken;
  const CHANNEL = roomInfo.uuid;

  const client = useClient();

  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const { data, isLoading, isError } = useQuery('cam-user', fetchUser);

  {
    isLoading && <>로딩중</>;
  }
  {
    isError && <>에러</>;
  }

  /**
   * get room방 정보 가져옴
   */
  const getRoomInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/room/${getUUID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data.findRoom;
      setRoomInfo(data);
      setRecoilRoomInfo(data);
    } catch (error) {
      // alert('잘못된 경로입니다.');

      navigate('/no-room');
      window.location.reload();
    }
  };

  /**
   * 유저 방에서 떠남
   * @param currentTracks
   */
  const handleUserLeft = async (currentTracks: any) => {
    if (currentTracks) {
      for (const track of currentTracks) {
        if (track) {
          try {
            await track.stop();
            await track.close();
            await client.leave();
          } catch (error) {
            // console.error('Error stopping or closing track:', error);
          }
        }
      }
    }
  };

  useEffect(() => {
    const init = async (name: string) => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
          setUsers(prevUsers => [...new Set([...prevUsers, user])]);
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();

          client.enableAudioVolumeIndicator();

          client.on('volume-indicator', volumes => {
            setUserVolumes(prevVolumes => {
              const newUserVolumes = { ...prevVolumes };

              volumes.forEach((volume: any) => {
                newUserVolumes[volume.uid] = volume.level;
              });

              return newUserVolumes;
            });
          });
        }
      });

      client.on('user-unpublished', (user, type) => {
        if (type === 'audio') {
          user.audioTrack?.stop();
        }
        if (type === 'video') {
          user.videoTrack?.stop();
        }
      });

      client.on('user-left', user => {
        setUsers(prevUsers => {
          return prevUsers.filter(User => User.uid !== user.uid);
        });
      });

      await client.join(APP_ID, name, TOKEN, data.userId);
      try {
        client.on('token-privilege-will-expire', async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/room/generate-aFreshToken/${getUUID}`,
          );
          const agoraToken = response.data.token;
          await client.renewToken(agoraToken);
        });
      } catch (error) {
        console.error('Error renewing Agora token:', error);
      }

      client.on('token-privilege-did-expire', async () => {
        // 서버에 새 토큰 요청
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/room/generate-aFreshToken/${getUUID}`,
        );
        const newToken = response.data.token;

        await client.renewToken(newToken);
      });

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    // 초기화 함수
    if (ready && tracks) {
      // console.log('init ready');
      init(CHANNEL);
    }

    return () => {
      handleUserLeft(tracks);
    };
  }, [CHANNEL, client, ready, tracks]);

  useEffect(() => {
    getRoomInfo();
    // window.onbeforeunload = null;
  }, []);

  return (
    <Container>
      <Controller>
        {ready && tracks && (
          <VideoController
            tracks={tracks}
            setStart={setStart}
            setInCall={setInCall}
          />
        )}
      </Controller>

      {start && tracks && (
        <Videos users={users} tracks={tracks} volumes={userVolumes} />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Controller = styled.div`
  position: absolute;
  top: 190px;
  left: 10px;
  z-index: 10;
`;
export default VideoContainer;
