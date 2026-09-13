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
): (() => void) => {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let rafId: number;

  const tick = () => {
    analyser.getByteFrequencyData(data);
    const average = data.reduce((sum, v) => sum + v, 0) / data.length;
    onLevel(average);
    rafId = requestAnimationFrame(tick);
  };
  tick();

  return () => {
    cancelAnimationFrame(rafId);
    source.disconnect();
    audioContext.close();
  };
};
