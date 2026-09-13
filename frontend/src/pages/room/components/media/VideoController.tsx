import React, { useCallback, useState } from 'react';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import {
  FaVolumeMute,
  FaVolumeUp,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import styled from 'styled-components';
import Screenshare from './Screenshare';
import { toast } from 'sonner';
import { blue } from '../../../../images/character';
import socket from '../../socketInstance';

type PeerMediaState = { micOn: boolean; camOn: boolean };

type VideoControllerProps = {
  localStream: MediaStream;
  localMediaState: PeerMediaState;
  setLocalMediaState: React.Dispatch<React.SetStateAction<PeerMediaState>>;
  peers: Map<string, RTCPeerConnection>;
  uuid: string;
};

const VideoController: React.FC<VideoControllerProps> = ({
  localStream,
  localMediaState,
  setLocalMediaState,
  peers,
  uuid,
}) => {
  const [screenshare, setScreenshare] = useState(false);

  const emitMediaState = (next: PeerMediaState) => {
    socket.emit('peer-media-state', { uuid, ...next });
  };

  const mute = (type: 'audio' | 'video') => {
    if (screenshare) {
      toast.error(
        type === 'audio'
          ? '화면 공유 중에는 마이크를 설정할 수 없습니다.'
          : '화면 공유 중에는 카메라를 설정할 수 없습니다.',
      );
      return;
    }

    if (type === 'audio') {
      const track = localStream.getAudioTracks()[0];
      track.enabled = !track.enabled;
      const next = { ...localMediaState, micOn: track.enabled };
      setLocalMediaState(next);
      emitMediaState(next);
    } else {
      const track = localStream.getVideoTracks()[0];
      track.enabled = !track.enabled;
      const next = { ...localMediaState, camOn: track.enabled };
      setLocalMediaState(next);
      emitMediaState(next);
    }
  };

  const handleScreenShare = useCallback(() => {
    setScreenshare(prev => !prev);
  }, []);

  return (
    <Controller>
      <button onClick={() => mute('audio')}>
        {localMediaState.micOn ? (
          <FaVolumeUp />
        ) : (
          <FaVolumeMute style={{ color: '#e90000' }} />
        )}
      </button>
      <button onClick={() => mute('video')}>
        {localMediaState.camOn ? (
          <FaVideo />
        ) : (
          <FaVideoSlash style={{ color: '#e90000' }} />
        )}
      </button>
      {!localMediaState.camOn && (
        <NonCam>
          <img src={blue} alt="" />
        </NonCam>
      )}
      <button onClick={handleScreenShare}>
        {screenshare ? (
          <MdScreenShare fill="#337CCF" />
        ) : (
          <MdStopScreenShare fill="#D8D9DA" />
        )}
      </button>
      {screenshare && (
        <Screenshare
          peers={peers}
          cameraTrack={localStream.getVideoTracks()[0]}
          setScreenshare={setScreenshare}
        />
      )}
    </Controller>
  );
};
const NonCam = styled.div`
  position: absolute;
  top: -113px;
  left: 148px;
`;

const Controller = styled.div`
  width: 400px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-left: 0px;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--gray-07);
    width: 35px;
    height: 30px;
    background-color: var(--gray-09);
    transition: 0.5;
    border: none;
    font-size: 17px;
    border-radius: 10px;
    color: #337ccf;
    &:hover {
      background-color: var(--gray-06);
    }
  }
`;
export default VideoController;
