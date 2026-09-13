import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getCookie } from '../../../../auth/cookie';
import { fetchUser } from '../../../../axios/api';
import { RoomInfo, RoomUserList } from '../../../../recoil/RoomAtom';
import socket from '../../socketInstance';
import VideoController from './VideoController';
import Videos from './Videos';
import { createPeerConnection, createVolumeMeter } from './webrtc';

type VideoContainerProps = {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
};

type PeerMediaState = { micOn: boolean; camOn: boolean };
type RoomUser = { nickname: string; img: string; userId: number; socketId: string };
type UserListPayload = { nickname: string; userListArr: RoomUser[] };

const VideoContainer: React.FC<VideoContainerProps> = () => {
  const getUUID = window.location.pathname.split('/room/')[1];
  const [, setRecoilRoomInfo] = useRecoilState(RoomInfo);
  const [, setRoomUserList] = useRecoilState(RoomUserList);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [start, setStart] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [mediaState, setMediaState] = useState<Record<string, PeerMediaState>>({});
  const [localMediaState, setLocalMediaState] = useState<PeerMediaState>({
    micOn: true,
    camOn: true,
  });
  const [volumes, setVolumes] = useState<Record<string, number>>({});

  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const volumeCleanupRef = useRef<Map<string, () => void>>(new Map());

  const navigate = useNavigate();
  useQuery('cam-user', fetchUser);

  const getRoomInfo = async () => {
    try {
      const token = getCookie('token');
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/room/${getUUID}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRecoilRoomInfo(response.data.findRoom);
    } catch (error) {
      navigate('/no-room');
      window.location.reload();
    }
  };

  const attachVolumeMeter = (key: string, stream: MediaStream) => {
    if (volumeCleanupRef.current.has(key)) return;
    const cleanup = createVolumeMeter(stream, level =>
      setVolumes(prev => ({ ...prev, [key]: level })),
    );
    volumeCleanupRef.current.set(key, cleanup);
  };

  // 특정 상대(socketId)와의 RTCPeerConnection을 새로 만들고 로컬 트랙을 붙인다
  const createConnectionToPeer = (targetSocketId: string): RTCPeerConnection => {
    const pc = createPeerConnection();

    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', {
          uuid: getUUID,
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = event => {
      const [stream] = event.streams;
      setRemoteStreams(prev => ({ ...prev, [targetSocketId]: stream }));
      attachVolumeMeter(targetSocketId, stream);
    };

    peersRef.current.set(targetSocketId, pc);
    return pc;
  };

  const closeConnectionToPeer = (socketId: string) => {
    peersRef.current.get(socketId)?.close();
    peersRef.current.delete(socketId);
    volumeCleanupRef.current.get(socketId)?.();
    volumeCleanupRef.current.delete(socketId);

    setRemoteStreams(prev => {
      const next = { ...prev };
      delete next[socketId];
      return next;
    });
    setMediaState(prev => {
      const next = { ...prev };
      delete next[socketId];
      return next;
    });
    setVolumes(prev => {
      const next = { ...prev };
      delete next[socketId];
      return next;
    });
  };

  // 이미 방에 있는 참가자들에게 내가 먼저 offer를 보낸다 (글레어 방지: 새로 들어온 쪽이 항상 offer 발신자)
  const offerToPeers = async (peers: RoomUser[]) => {
    for (const peer of peers) {
      if (peer.socketId === socket.id) continue;
      if (peersRef.current.has(peer.socketId)) continue;

      const pc = createConnectionToPeer(peer.socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('webrtc-offer', {
        uuid: getUUID,
        targetSocketId: peer.socketId,
        sdp: offer,
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);
        setStart(true);
        attachVolumeMeter('local', stream);

        // 입장 시점에 이미 방에 있던 참가자들에게 offer를 보냄
        socket.emit('get-room-users', { uuid: getUUID });
      } catch (error) {
        // 카메라/마이크 권한이 없는 경우 등
      }
    };
    init();

    const peers = peersRef.current;
    const volumeCleanups = volumeCleanupRef.current;

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peers.forEach(pc => pc.close());
      peers.clear();
      volumeCleanups.forEach(cleanup => cleanup());
      volumeCleanups.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRoomInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleRoomUsers = ({ userListArr }: { userListArr: RoomUser[] }) => {
      offerToPeers(userListArr);
    };

    const handleNewUser = ({ userListArr }: UserListPayload) => {
      setRoomUserList(userListArr);
    };

    const handleLeaveUser = ({ userListArr }: UserListPayload) => {
      setRoomUserList(userListArr);
      const remainingSocketIds = new Set(userListArr.map(user => user.socketId));
      peersRef.current.forEach((_pc, socketId) => {
        if (!remainingSocketIds.has(socketId)) {
          closeConnectionToPeer(socketId);
        }
      });
    };

    const handleOffer = async ({
      fromSocketId,
      sdp,
    }: {
      fromSocketId: string;
      sdp: RTCSessionDescriptionInit;
    }) => {
      const pc = peersRef.current.get(fromSocketId) ?? createConnectionToPeer(fromSocketId);
      await pc.setRemoteDescription(sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc-answer', {
        uuid: getUUID,
        targetSocketId: fromSocketId,
        sdp: answer,
      });
    };

    const handleAnswer = async ({
      fromSocketId,
      sdp,
    }: {
      fromSocketId: string;
      sdp: RTCSessionDescriptionInit;
    }) => {
      await peersRef.current.get(fromSocketId)?.setRemoteDescription(sdp);
    };

    const handleIceCandidate = async ({
      fromSocketId,
      candidate,
    }: {
      fromSocketId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      if (!candidate) return;
      try {
        await peersRef.current.get(fromSocketId)?.addIceCandidate(candidate);
      } catch (error) {
        // ICE candidate 추가 실패는 타이밍상 흔히 발생할 수 있어 무시
      }
    };

    const handlePeerMediaState = ({
      socketId,
      micOn,
      camOn,
    }: {
      socketId: string;
      micOn: boolean;
      camOn: boolean;
    }) => {
      setMediaState(prev => ({ ...prev, [socketId]: { micOn, camOn } }));
    };

    socket.on('room-users', handleRoomUsers);
    socket.on('new-user', handleNewUser);
    socket.on('leave-user', handleLeaveUser);
    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleIceCandidate);
    socket.on('peer-media-state', handlePeerMediaState);

    return () => {
      socket.off('room-users', handleRoomUsers);
      socket.off('new-user', handleNewUser);
      socket.off('leave-user', handleLeaveUser);
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleIceCandidate);
      socket.off('peer-media-state', handlePeerMediaState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Controller>
        {start && localStream && (
          <VideoController
            localStream={localStream}
            localMediaState={localMediaState}
            setLocalMediaState={setLocalMediaState}
            peers={peersRef.current}
            uuid={getUUID}
          />
        )}
      </Controller>

      {start && localStream && (
        <Videos
          localStream={localStream}
          localMediaState={localMediaState}
          remoteStreams={remoteStreams}
          mediaState={mediaState}
          volumes={volumes}
        />
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
