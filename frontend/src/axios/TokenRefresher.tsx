import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  getCookie,
  setTokenCookie,
  getRefreshTokenCookie,
  setRefreshTokenCookie,
} from '../auth/cookie';
import { useQuery } from 'react-query';
import { fetchUser } from './api';

type TokenRefresherProps = {};

const TokenRefresher: React.FC<TokenRefresherProps> = () => {
  const navigate = useNavigate();
  // const refreshToken = `Bearer ${getRefreshTokenCookie('refreshToken')}`;
  const refreshToken = getRefreshTokenCookie('refreshToken');

  const { data, refetch } = useQuery<user>('mypageUser', fetchUser, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const refreshAPI = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
      headers: { 'Content-Type': 'application/json' }, // header의 Content-Type을 JSON 형식의 데이터를 전송한다
    });

    console.log('로그인경로', data?.provider);
    if (data?.provider === 'local') {
      const interceptor = axios.interceptors.response.use(
        response => response,
        async error => {
          // console.log('error🤗🤗', error);
          const originalConfig = error.config; // 기존에 수행하려고 했던 작업
          const msg = error.response.data.message;
          const status = error.response.status;

          if (status == 401) {
            if (msg.includes('Unauthorized')) {
              try {
                const serverUrl = process.env.REACT_APP_SERVER_URL;

                // 리프레시 토큰을 서버에 보내 새 엑세스 토큰 요청
                const response = await axios.post(
                  `${serverUrl}/refresh`,
                  { refreshToken: refreshToken },
                  {
                    headers: {
                      Authorization: `Bearer ${refreshToken}`,
                    },
                  },
                );

                // 응답 헤더에서 새 엑세스 토큰 추출
                const newAccessToken =
                  response.headers['authorization'] ||
                  response.headers['Authorization'];
                if (newAccessToken) {
                  const token = newAccessToken.split(' ')[1];
                  setTokenCookie(token); // 새 토큰 저장

                  // 새 엑세스 토큰으로 원래 요청 재시도
                  originalConfig.headers['Authorization'] = `Bearer ${token}`;
                  return refreshAPI(originalConfig);
                }
              } catch (_error) {
                // 리프레시 토큰도 만료되었거나 유효하지 않을 때 로그인 페이지로 이동
                navigate('/login');
                return Promise.reject(_error);
              }
            }
          }
          return Promise.reject(error);
        },
      );
      // 클린업 함수로 인터셉터 해제하기
      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }
  }, [navigate, refreshToken]);

  return null;
};
export default TokenRefresher;
