import React, { useEffect } from 'react';
import { getCookie, setTokenCookie } from '../../auth/cookie';
import { useNavigate } from 'react-router-dom';

type AuthProps = {
  
};

const Auth:React.FC<AuthProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    setTokenCookie(accessToken!);
    window.history.replaceState({}, document.title, '/');
    navigate('/');
  }, []);
  return <div>Have a good coding</div>;
}
export default Auth;
