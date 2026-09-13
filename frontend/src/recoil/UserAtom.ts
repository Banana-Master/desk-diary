import { atom } from 'recoil';

export const UserAtom = atom({
  key: 'userAtom', // 아톰의 이름. 전역적으로 unique 해야 함
  default: { email: '', password: '', nickname: '', file: '' },
});

export const ProfiltUpdate = atom({
  key: 'profiltUpdate',
  default: { open: false, nickname: '' },
});
