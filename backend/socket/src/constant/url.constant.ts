// main.ts가 dotenv/config보다 AppModule을 먼저 import하기 때문에, 이 파일이
// (RoomchatsService 등을 통해) AppModule 체인에서 먼저 평가되면 .env가 아직
// 로드되지 않은 상태일 수 있다. 그래서 import 순서와 무관하게 항상 환경변수가
// 로드되도록 여기서도 직접 dotenv를 로드한다.
import 'dotenv/config';

export const baseURL = process.env.API_SERVER_URL ?? 'http://localhost:4001';
