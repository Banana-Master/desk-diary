import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button_Play, audio_stop, back_button, front_button, volume_off, volume_up } from '../../../images/audio';
import audiotrack from '../../../images/audio/audiotrack.svg';
type AsmrPlayerProps = {};

const asmrList = [
  {
    title: '숲속강물소리',
    src: '/audio/숲속강물소리.mp3',
    img: '/images/asmr_river.jpg',
  },
  {
    title: '숲속새소리',
    src: '/audio/숲속새소리.mp3',
    img: '/images/asmr_bird.jpg',
  },
  {
    title: '장작타는소리',
    src: '/audio/장작타는소리.mp3',
    img: '/images/asmr_fire.jpg',
  },
  {
    title: '조금강한비소리',
    src: '/audio/조금강한비소리.mp3',
    img: '/images/asmr_rain.jpg',
  },
];

const AsmrPlayer: React.FC<AsmrPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // 초기 볼륨을 1로 설정 (최대 볼륨)
  const audioRef = React.createRef<HTMLAudioElement>();
  const [current, setCurrent] = useState<number>(0);
  // console.log(volume, audioRef, current)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextCurrentHandler = () => {
    if (current === asmrList.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  const backCurrentHandler = () => {
    if (current === 0) {
      setCurrent(asmrList.length - 1);
    } else {
      setCurrent(current - 1);
    }
  };


  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const setMaxVolume = () => {
    setVolume(1);
    if (audioRef.current) {
      audioRef.current.volume = 1; // 최대 볼륨인 1로 설정
    }
  };

  const isMuted = () => {
    setVolume(0);
    if (audioRef.current) {
      audioRef.current.volume = 0; // 최대 볼륨인 1로 설정
    }
  }; // 볼륨이 0이면 음소거 상태로 간주

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, current]);

  return (
    <Body>
      <Icon src={audiotrack} alt="" />
      <AudioImg src={asmrList[current].img} alt="" />
      <div>
        <Title>{asmrList[current].title}</Title>
        <audio ref={audioRef} src={asmrList[current].src} />
      </div>
      <PlayBox>
        <BackButton onClick={backCurrentHandler} img={back_button} />
        <PlayButton onClick={togglePlay} isplaying={isPlaying.toString()} />
        <FrontButton onClick={nextCurrentHandler} img={front_button} />
      </PlayBox>
      <VolumeBox>
        <MuteButton img={volume_off} onClick={isMuted} />
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <MaxSoundButton img={volume_up} onClick={setMaxVolume} />
      </VolumeBox>
    </Body>
  );
};

const Body = styled.div`
  width: 97%;
  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 10px;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.3);
`;

const Icon = styled.img`
  margin: 5px auto 0 5px;
  filter: grayscale(100%);
`

const AudioImg = styled.img`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 14px;
  color: white;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayBox = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
`;

const PlayButton = styled.button<{ isplaying: string }>`
  background-image: url(${props => (props.isplaying === 'true' ? audio_stop : Button_Play)});
  background-size: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
`;

const FrontButton = styled.button<{ img: any }>`
  background-image: url(${props => props.img});
  width: 16px;
  height: 20px;
  border: none;
  background-color: transparent;
`;

const BackButton = styled.button<{ img: any }>`
  background-image: url(${props => props.img});
  width: 16px;
  height: 20px;
  border: none;
  background-color: transparent;
`;

const VolumeBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 310px;
  margin-bottom: 16px;
`;

const VolumeSlider = styled.input`
  width: 200px;
  accent-color: var(--primary-01);
  height: 5px;
`;

const MuteButton = styled.button<{ img: any }>`
  background-image: url(${props => props.img});
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
`;

const MaxSoundButton = styled.button<{ img: any }>`
  background-image: url(${props => props.img});
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
`;

export default AsmrPlayer;
