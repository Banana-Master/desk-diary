import io from 'socket.io-client';

// 운영 환경에서는 nginx가 /socket.io/ 경로만 소켓 서버로 프록시해주므로
// REACT_APP_SERVER_URL 하나로 충분하지만, 로컬 개발 환경은 api(4000)와
// socket(4001)이 별도 포트로 떠 있어 프록시가 없으면 연결이 안 된다.
// REACT_APP_SOCKET_URL이 설정되어 있으면 그것을, 없으면 기존처럼
// REACT_APP_SERVER_URL을 사용한다.
const socketUrl =
  process.env.REACT_APP_SOCKET_URL ?? process.env.REACT_APP_SERVER_URL!;

const socket = io(socketUrl, {
  reconnection: true, // 재연결 시도 활성화
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
  transports: ['websocket']
});
export default socket;
