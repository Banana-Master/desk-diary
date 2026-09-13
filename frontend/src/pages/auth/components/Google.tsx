import React from 'react';
import styled from 'styled-components';
import {google} from '../../../images/main'
import { Link } from 'react-router-dom';

type GoogleProps = {
  
};

const Google:React.FC<GoogleProps> = () => {
  
  return (
    <SocialLoginLink
      to="/"
      onClick={() => {
        const googleOauthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(
          process.env.REACT_APP_GOOGLE_CALLBACK_URL!,
        )}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&scope=${process.env.REACT_APP_GOOGLE_SCOPE_PROFILE} ${process.env.REACT_APP_GOOGLE_SCOPE_EMAIL}`;

        window.location.href = googleOauthURL;
      }}
    >
      <img src={google} alt="Google Login" />
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
export default Google;