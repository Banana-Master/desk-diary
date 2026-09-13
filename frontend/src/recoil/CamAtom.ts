import { atom } from 'recoil';

export const cameraListState = atom<MediaDeviceInfo[]>({
  key: 'cameraListState',
  default: [],
});

export const micListState = atom<MediaDeviceInfo[]>({
  key: 'micListState',
  default: [],
});

export const choiceCameraState = atom<string>({
  key: 'choiceCameraState',
  default: '',
});

export const choiceMicState = atom<string>({
  key: 'choiceMicState',
  default: '',
});

export const isScreenshare = atom<boolean>({
  key: 'isScreenshare',
  default: false,
});