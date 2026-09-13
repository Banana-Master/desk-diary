import io from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SERVER_URL!}`, {
  reconnection: true, // 재연결 시도 활성화
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
  transports: ['websocket']
});
export default socket;
