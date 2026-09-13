export interface IRoomRequest {
  nickname?: string;
  uuid?: string;
  img?: string;
  userId?: number;
}
export interface IMessage {
  time?: string;
  uuid: string;
  nickname: string;
  message: string;
  img: string;
}

export interface IWebRTCSignal {
  uuid: string;
  targetSocketId: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export interface IPeerMediaState {
  uuid: string;
  micOn: boolean;
  camOn: boolean;
}
