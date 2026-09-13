import React, { useEffect, useRef } from 'react';

type ScreenshareProps = {
  peers: Map<string, RTCPeerConnection>;
  cameraTrack: MediaStreamTrack | null;
  setScreenshare: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * 화면 공유 중에는 각 피어 커넥션의 비디오 sender 트랙을 화면 공유 트랙으로
 * 바꿔치기(replaceTrack)하고, 중지되면 원래 카메라 트랙으로 되돌린다.
 * 본인 화면(로컬 미리보기)은 그대로 카메라를 보여주므로 건드리지 않는다.
 */
const Screenshare: React.FC<ScreenshareProps> = ({
  peers,
  cameraTrack,
  setScreenshare,
}) => {
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (cancelled) {
          screenTrack.stop();
          return;
        }

        screenTrackRef.current = screenTrack;
        peers.forEach(pc => {
          const sender = pc
            .getSenders()
            .find(sender => sender.track?.kind === 'video');
          sender?.replaceTrack(screenTrack);
        });

        // 브라우저 자체의 "공유 중지" 버튼을 눌렀을 때도 원래 카메라로 복귀
        screenTrack.onended = () => setScreenshare(false);
      } catch (error) {
        setScreenshare(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      const screenTrack = screenTrackRef.current;
      if (screenTrack) {
        peers.forEach(pc => {
          const sender = pc
            .getSenders()
            .find(sender => sender.track === screenTrack);
          if (cameraTrack) sender?.replaceTrack(cameraTrack);
        });
        screenTrack.stop();
        screenTrackRef.current = null;
      }
    };
  }, [peers, cameraTrack, setScreenshare]);

  return null;
};
export default Screenshare;
