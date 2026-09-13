/**
 * P2P WebRTC 연결에 사용할 ICE 서버 설정.
 * TURN 서버가 있다면 REACT_APP_TURN_* 환경변수로 추가할 수 있고,
 * 없으면 공개 STUN 서버만으로 동작한다 (같은 네트워크 밖 NAT 환경에서는
 * 연결이 실패할 수 있음).
 */
const getIceServers = (): RTCIceServer[] => {
  const iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
  ];

  const turnUrl = process.env.REACT_APP_TURN_URL;
  if (turnUrl) {
    iceServers.push({
      urls: turnUrl,
      username: process.env.REACT_APP_TURN_USERNAME,
      credential: process.env.REACT_APP_TURN_CREDENTIAL,
    });
  }

  return iceServers;
};

export const createPeerConnection = (): RTCPeerConnection => {
  return new RTCPeerConnection({ iceServers: getIceServers() });
};

/**
 * 원격 오디오 스트림의 대략적인 볼륨 레벨(0~100)을 주기적으로 알려주는 미터.
 * Agora의 `volume-indicator` 이벤트를 대체한다.
 */
export const createVolumeMeter = (
  stream: MediaStream,
  onLevel: (level: number) => void,
  intervalMs = 200,
): (() => void) => {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  // 매 프레임(60fps)이 아니라 일정 주기로만 상태를 갱신한다.
  // 자주 갱신하면 리액트 리렌더가 잦아져 영상 <video> 엘리먼트의
  // srcObject가 반복 재할당되며 화면이 깜빡이는 문제가 생길 수 있다.
  const intervalId = setInterval(() => {
    analyser.getByteFrequencyData(data);
    const average = data.reduce((sum, v) => sum + v, 0) / data.length;
    onLevel(average);
  }, intervalMs);

  return () => {
    clearInterval(intervalId);
    source.disconnect();
    audioContext.close();
  };
};
