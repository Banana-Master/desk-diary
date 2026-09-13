import React, { useEffect, useRef, useState } from 'react';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';
import { useClient, useScreenVideoTrack } from './config';
import { isScreenshare } from '../../../../recoil/CamAtom';
import { useRecoilState } from 'recoil';

type ScreenshareProps = {
  preTracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  trackState: { video: boolean; audio: boolean };
  screenshare: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setScreenshare: React.Dispatch<React.SetStateAction<boolean>>;
};

const Screenshare: React.FC<ScreenshareProps> = ({
  preTracks, // 이전에 사용된 오디오와 비디오 트랙을 포함하는 배열
  trackState, // 현재 비디오와 오디오의 상태(켜짐/꺼짐)를 나타내는 객체
  screenshare, // 화면 공유가 활성화되어 있는지 나타내는 boolean
  setStart, // 화면 공유를 시작할 때 상태를 나타내는 함수
  setScreenshare, // 화면 공유 상태를 설정하는 함수
}) => {
  const client = useClient();
  const { ready, tracks, error } = useScreenVideoTrack();
  const [screenShareTrack, setScreenShareTrack] = useRecoilState(isScreenshare);

  /**
   * 첫 렌더링을 확인. 컴포넌트가 마운트된 후 첫 업데이트가 일어났는지 여부 추적
   */
  const firstRenderRef = useRef(true);

  const unpublish = async () => {
    if (!Array.isArray(tracks) && tracks !== undefined) {
      await client.unpublish(tracks);
      tracks.close();

      setTimeout(() => {
        if (trackState.video) {
          client.publish(preTracks[1]);
        }
      }, 3000);

    } else {
      // console.log('else');
    }
  };

  useEffect(() => {
    // console.log('useEffect');
    const pulishScreenShare = async () => {
      // await client.unpublish(preTracks[1]) // 현재 공유되고 있는 비디오 트랙을 비공개
      // await client.publish(tracks) // 새로운 화면 공유 트랙을 공개
      try {
        // 기존 비디오 트랙을 비공개하고 완료될 때까지 기다립니다.
        await client.unpublish(preTracks[1]);

        // 새로운 화면 공유 트랙을 공개합니다.
        setTimeout(() => {
          client.publish(tracks);
          // console.log('새 화면 공유 트랙 공개 성공');
        }, 3000);
      } catch (error) {
        // console.error('화면 공유 트랙 처리 중 오류 발생:', error);
        // 에러 핸들링을 여기에서 해주세요.
      }
    };

    if (ready && tracks) {
      // console.log('❗화면공유 함수실행');
      pulishScreenShare(); // 화면공유의 ready, tracks가 준비되면 (트랙 사용이 가능하면) 함수 실행
    }

    if (error) {
      // console.log('useEffect 아래 에러');
      setScreenshare(false);
    }

    return () => {
      // console.log('클리어함수');
      unpublish();
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }
      if (!error && !Array.isArray(tracks)) {
        client.unpublish(tracks);
        tracks.close();
      }
    };
  }, [
    setStart,
    setScreenshare,
    screenshare,
    client,
    preTracks,
    trackState,
    tracks,
    ready,
    error,
  ]);

  return <div></div>;
};
export default Screenshare;
