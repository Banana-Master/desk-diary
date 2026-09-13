import React from 'react';
import styled from '@emotion/styled';
import { kakao } from '../../../images/main';
import { Link } from 'react-router-dom';


type KakaoProps = {};

const Kakao: React.FC<KakaoProps> = () => {
  
  return (
    <SocialLoginLink
      to="/"
      onClick={() => {
        const SERVER_URL = process.env.REACT_APP_SERVER_URL;

        const kakaoOauthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&redirect_uri=${encodeURIComponent(
          `${SERVER_URL}/kakao-callback`,
        )}&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}`;

        window.location.href = kakaoOauthURL;
      }}
    >
      <img src={kakao} alt="KaKao Login" />
    </SocialLoginLink>
  );
};

const SocialLoginLink = styled(Link)`
  width: 72px;
  height: 72px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
export default Kakao;
