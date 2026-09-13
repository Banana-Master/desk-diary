import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  cameraListState,
  choiceCameraState,
  choiceMicState,
  micListState,
} from '../../../recoil/CamAtom';
import { down } from '../../../images/mypage';

type MediaSetupProps = {};

const MediaSetup: React.FC<MediaSetupProps> = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCameraTesting, setCameraTesting] = useState(false);
  const [isMicTesting, setMicTesting] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const [cameras, setCameras] =
    useRecoilState<MediaDeviceInfo[]>(cameraListState);
  const [mics, setMics] = useRecoilState<MediaDeviceInfo[]>(micListState);

  const [choiceCamera, setChoiceCamera] = useRecoilState(choiceCameraState);
  const [choiceMic, setChoiceMic] = useRecoilState(choiceMicState);

  const choiceCameraHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChoiceCamera(e.target.value);
  };

  const choiceMicHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChoiceMic(e.target.value);
  };

  const navigate = useNavigate();

  const startCameraTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: choiceCamera } },
      });
      // console.log('카메라 시작 스트림', stream);
      setLocalStream(stream);
      setCameraTesting(true);
    } catch (error) {
      // console.error('Camera test failed:', error);
    }
  };

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: choiceMic } },
      });
      // console.log('마이크 시작 스트림', stream);
      setLocalStream(stream);
      setMicTesting(true);
    } catch (error) {
      // console.error('Microphone test failed:', error);
    }
  };

  const stopTest = () => {
    // console.log('테스트 종료 버튼 눌림');
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setCameraTesting(false);
      setMicTesting(false);
    }
  };

  const getCamerasAndMics = async () => {
    try {
      const cameraList = await AgoraRTC.getCameras();
      // console.log('카메라 목록', cameraList);
      setCameras(cameraList);
    } catch (error) {
      // console.error('카메라 목록을 가져오는 중 오류 발생:', error);
    }

    try {
      const micList = await AgoraRTC.getMicrophones();
      // console.log('마이크 목록:', micList);
      setMics(micList);
    } catch (error) {
      // console.error('마이크 목록을 가져오지 못했습니다.', error);
    }
  };

  useEffect(() => {
    getCamerasAndMics();
    setChoiceCamera(cameras[0]?.deviceId);
  }, []);

  useEffect(() => {
    startCameraTest();
  }, [choiceCamera]);

  useEffect(() => {
    startMicTest();
  }, [choiceMic]);
  return (
    <Container>
      {localStream ? (
        <Cam
          autoPlay
          muted
          playsInline
          ref={video => {
            if (video) {
              video.srcObject = localStream;
            }
          }}
        ></Cam>
      ) : (
        <Cam />
      )}

      <CamSetting>
        <ButonGroup>
          <TestButton onClick={startCameraTest} disabled={isCameraTesting}>
            Camera
          </TestButton>
          <Media>
            {/* <img src={cam} alt="cam setting" /> */}
            <img src={down} alt="cam list" />
            <MediaSelect
              name="cameraSelect"
              id=""
              value={choiceCamera}
              onChange={choiceCameraHandler}
            >
              {cameras.map(item => {
                return (
                  <option key={item.deviceId} value={item.deviceId}>
                    {item.label}
                  </option>
                );
              })}
            </MediaSelect>
          </Media>
        </ButonGroup>

        <ButonGroup>
          <TestButton onClick={startMicTest} disabled={isMicTesting}>
            Microphone
          </TestButton>
          <Media>
            {/* <img src={mic} alt="mic setting" /> */}
            <img src={down} alt="mic list" />
            <MediaSelect
              name="micSelect"
              id=""
              value={choiceMic}
              onChange={choiceMicHandler}
            >
              {mics.map(item => {
                return (
                  <option key={item.deviceId} value={item.deviceId}>
                    {item.label}
                  </option>
                );
              })}
            </MediaSelect>
          </Media>
        </ButonGroup>
      </CamSetting>
      <button onClick={stopTest} disabled={!localStream}>
        테스트 중지
      </button>
    </Container>
  );
};

const Media = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  height: 50px;
  border: 1px solid var(--primary-01);
  border-radius: 50px;
  position: relative;
  padding: 0 10px;
`;

const MediaSelect = styled.select`
  position: absolute;
  left: 35%;
  width: 30px;
  height: 30px;
  font-size: 12px;
  color: #6e6e6e;
  border: none;
  appearance: none;

  &:focus {
    outline: none;
  }
`;

const ButonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 5px;
`;

const TestButton = styled.button`
  background-color: #dbdbdb;
  padding: 5px 10px;
  border-radius: 5px;
  color: #6e6e6e;
  font-size: 15px;
  border: none;
  cursor: pointer;
`;

const Cam = styled.video`
  width: 250px;
  height: 160px;
  border-radius: 10px;
`;

const CamSetting = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 22px;
  width: 582px;
`;
export default MediaSetup;
