import { atom } from 'recoil';

export const timerState = atom({
  key: 'timerState', // 고유 id
  default: 0, // 기본(초기)값
});
