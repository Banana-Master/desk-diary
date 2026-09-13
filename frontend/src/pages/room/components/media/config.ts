import {
  createClient,
  ClientConfig,
  createScreenVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  AgoraRTCError,
} from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-sdk-ng';

/**
 * 0: 디버그. 모든 API 로그를 출력합니다.
 * 1: 정보. INFO, WARNING, ERROR 수준의 로그를 출력합니다.
 * 2: 경고. WARNING 및 ERROR 수준의 로그를 출력합니다.
 * 3: 오류. ERROR 수준의 로그를 출력합니다.
 * 4: 없음. 로그를 출력하지 않습니다.
 */
AgoraRTC.setLogLevel(3);

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

const useClient = createClient(config);

/**
 * 
 * @returns 화면공유를 위한 비디오 트랙을 생성하고 관리하는 커스텀 훅
 */
const useScreenVideoTrack = (): {
  /**
   * 화면 공유 가 준비 되었는지 여부를 나타냄 (boolean)
   */
  ready: boolean;
  /**
   * 화면 공유 비디오와 오디오 트랙을 모두 포함하는 배열
   */
  tracks: ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack];
  /**
   * 화면공유에서 에러가 발생했을 경우 에러를 나타냄
   */
  error: AgoraRTCError | null;
} => {
  const screenShare = createScreenVideoTrack(
    {
      encoderConfig: '1080p_1', // 해상도와 프레임 레이트
      optimizationMode: 'detail', // 화면공유 최적화 모드
    },
    'disable', // 오디오 트랙 비활겅화 옵션
  );
  return screenShare();
};

export { useClient, useScreenVideoTrack };
