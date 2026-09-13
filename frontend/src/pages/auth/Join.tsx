import styled from '@emotion/styled';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { logo_colorful, x } from '../../images';
import 아이디저장o from '../../images/radio_button_checked.svg';
import 아이디저장x from '../../images/radio_button_unchecked.svg';

import { UserAtom } from '../../recoil/UserAtom';

import { useMutation } from 'react-query';
import Kakao from './components/Kakao';
import Google from './components/Google';
import { toast } from 'sonner';
import { getCookie } from '../../auth/cookie';

type JoinProps = {};

const Join: React.FC<JoinProps> = () => {
  useEffect(() => {
    document.title = '책상일기 - 회원가입';
  }, []);
  const navigate = useNavigate();
  const token = getCookie('token');

  const [user, setUser] = useRecoilState(UserAtom);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [matchPasswordError, setMatchPasswordError] = useState<string | null>(
    null,
  );

  const [focusedInput, setFocusedInput] = useState<
    'email' | 'password' | 'confirmPassword' | 'nickname' | null
  >(null);

  const handleClearInput = (
    type: 'email' | 'password' | 'confirmPassword' | 'nickname',
  ) => {
    switch (type) {
      case 'email':
        setUser(prevUser => ({ ...prevUser, email: '' }));
        break;
      case 'password':
        setUser(prevUser => ({ ...prevUser, password: '' }));
        break;
      case 'confirmPassword':
        setConfirmPassword('');
        break;
      case 'nickname':
        setUser(prevUser => ({ ...prevUser, nickname: '' }));
        break;
    }
  };

  const onClickAgree = () => {
    setIsAgreeChecked(!isAgreeChecked);
  };

  const blurConfirmHandler = async () => {
    if (confirmPassword !== user.password) {
      setMatchPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setMatchPasswordError(null);
    }
    return;
  };

  const handleFocusInput = (
    type: 'email' | 'password' | 'confirmPassword' | 'nickname',
  ) => {
    setFocusedInput(type);
  };

  const handleBlurInput = () => {
    setFocusedInput(null);
  };

  const joinMutation = useMutation(
    (userData: typeof user) =>
      axios.post(`${process.env.REACT_APP_SERVER_URL!}/auth/join`, userData),
    {
      onSuccess: () => {
        navigate('/confirm-email');
      },
      onError: (error: any) => {
        if (error.response) {
          const message = error.response.data.error;
          switch (true) {
            case message.includes('이메일이 이미'):
              setEmailError('이메일이 이미 사용중입니다.');
              break;
            case message.includes('이메일 형식이'):
              setEmailError('이메일 형식이 아닙니다');
              break;
            case message.includes('이메일이 비어'):
              setEmailError('이메일이 비어 있으면 안됩니다.');
              break;
            case message.includes('닉네임이 비어 있으면 안됩니다.'):
              setNicknameError('닉네임이 비어 있으면 안됩니다.');
              break;
            case message.includes(
              '닉네임은 한글, 알파벳, 숫자만 포함해야 합니다',
            ):
              setNicknameError('닉네임은 특수문자가 포함될 수 없습니다.');
              break;
            case message.includes('nickname must be'):
              setNicknameError(
                '닉네임은 2개 이상 5개 이하의 문자로 이루어져야 합니다.',
              );
              break;
            case message.includes('닉네임이 이미'):
              setNicknameError('이미 사용중인 닉네임입니다.');
              break;
            case message.includes('비밀번호가 비어 있으면 안됩니다.'):
              setPasswordError('비밀번호가 비어 있으면 안됩니다.');
              break;
            case message.includes(
              '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다',
            ):
              setPasswordError(
                '영문 대소문자, 숫자,특수기호 포함 8~16글자를 입력해주세요.',
              );
              break;
            case message.includes('비밀번호는 8자 이상이어야 합니다'):
              setPasswordError('비밀번호는 8자 이상이어야 합니다');
              break;
            default:
          }
        }
      },
    },
  );

  const onSubmitJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    joinMutation.mutate(user);
  };

  useEffect(() => {
    if (token) {
      toast.error('이미 로그인이 되어있습니다.');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    return () => {
      setUser({
        email: '',
        password: '',
        nickname: '',
        file: '',
      });
      setConfirmPassword('');
    };
  }, []);

  return (
    <JoinForm onSubmit={onSubmitJoin}>
      <LoginLink to="/login">로그인</LoginLink>
      <Logo to="/"></Logo>
      <Title>회원가입</Title>
      <JoinList>
        <Joincontent>
          <JoinLabel focused={focusedInput === 'email'}>이메일</JoinLabel>
          <InputBox focused={focusedInput === 'email'}>
            <JoinInput
              type="text"
              placeholder="예시 ) deskdiary@deskdiary.com"
              onChange={e => setUser({ ...user, email: e.target.value })}
              onFocus={() => handleFocusInput('email')}
              onBlur={() => {
                setEmailError(null);
                handleBlurInput();
              }}
              value={user.email}
              required
            />
            {user.email.length !== 0 && (
              <Clear type="button" onClick={() => handleClearInput('email')}>
                <img src={x} />
              </Clear>
            )}
          </InputBox>
          <Relative>
            {emailError ? <ErrorMessage>{emailError}</ErrorMessage> : null}
          </Relative>
        </Joincontent>

        <Joincontent>
          <JoinLabel focused={focusedInput === 'password'}>비밀번호</JoinLabel>
          <InputBox focused={focusedInput === 'password'}>
            <JoinInput
              type="password"
              placeholder="영어 대소문자,숫자,특수문자 포함 8자 이상"
              onChange={e => setUser({ ...user, password: e.target.value })}
              onFocus={() => handleFocusInput('password')}
              onBlur={() => {
                setPasswordError(null);
                blurConfirmHandler();
                handleBlurInput();
              }}
              value={user.password}
              required
            />
            {user.password.length !== 0 && (
              <Clear type="button" onClick={() => handleClearInput('password')}>
                <img src={x} />
              </Clear>
            )}
          </InputBox>

          <Relative>
            {passwordError ? (
              <ErrorMessage>{passwordError}</ErrorMessage>
            ) : null}
          </Relative>
        </Joincontent>

        <Joincontent>
          <JoinLabel focused={focusedInput === 'confirmPassword'}>
            비밀번호 확인
          </JoinLabel>
          <InputBox focused={focusedInput === 'confirmPassword'}>
            <JoinInput
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocusInput('confirmPassword')}
              onBlur={() => {
                blurConfirmHandler();
                handleBlurInput();
              }}
              required
            />
            {confirmPassword.length !== 0 && (
              <Clear
                type="button"
                onClick={() => handleClearInput('confirmPassword')}
              >
                <img src={x} />
              </Clear>
            )}
          </InputBox>
          <Relative>
            {matchPasswordError ? (
              <ErrorMessage>{matchPasswordError}</ErrorMessage>
            ) : null}
          </Relative>
        </Joincontent>

        <Joincontent>
          <JoinLabel focused={focusedInput === 'nickname'}>닉네임</JoinLabel>
          <InputBox focused={focusedInput === 'nickname'}>
            <JoinInput
              type="text"
              placeholder="2자 이상 5자 이하"
              onFocus={() => handleFocusInput('nickname')}
              onChange={e => setUser({ ...user, nickname: e.target.value })}
              onBlur={() => {
                setNicknameError(null);
                handleBlurInput();
              }}
              value={user.nickname}
              required
            />
            {user.nickname.length !== 0 && (
              <Clear type="button" onClick={() => handleClearInput('nickname')}>
                <img src={x} />
              </Clear>
            )}
          </InputBox>
          <Relative>
            {nicknameError ? (
              <ErrorMessage>{nicknameError}</ErrorMessage>
            ) : null}
          </Relative>
        </Joincontent>

        <AgreeBox>
          <AgreeCheck type="checkbox" onClick={onClickAgree}></AgreeCheck>
          <AgreeLink to='https://velog.velcdn.com/images/p_seo_hn/post/cf04de05-31e3-4d19-bb46-1df730bb62de/image.pdf' target="_blank">
            <span>(필수)</span>통합서비스 이용약관 및 개인정보 처리방침에 동의
            합니다.
          </AgreeLink>
        </AgreeBox>
      </JoinList>
      <JoinButton type="submit" disabled={!isAgreeChecked}>
        JOIN
      </JoinButton>
      <SocialLoginText>SNS 계정으로 시작하기</SocialLoginText>
      <SocialLoginGroup>
        <Kakao />
        <Google />
      </SocialLoginGroup>
    </JoinForm>
  );
};

const LoginLink = styled(Link)`
  margin-left: auto;
`;

const Logo = styled(Link)`
  background: url(${logo_colorful}) no-repeat center;
  background-size: 60px;
  width: 62px;
  height: 73px;
`;

const Clear = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: none;
  cursor: pointer;
`;

const InputBox = styled.div<{ focused: boolean }>`
  display: flex;
  width: 370px;
  height: 28px;
  padding: 7px 10px;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid
    ${props => (props.focused ? 'var(--primary-01)' : 'var(--gray-07)')};
  background-color: white;

  &:focus {
    outline-color: var(--primary-01);
  }
`;

const ErrorMessage = styled.div`
  width: 400px;
  padding: 5px 0 10px 5px;
  color: red;
  font-size: 14px;
  font-weight: 400;

  top: 85px;
`;

const AgreeBox = styled.div`
  height: 48px;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-betweet;
  align-items: center;
`;

const SocialLoginLink = styled(Link)`
  width: 72px;
  height: 72px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 130px;
`;

const SocialLoginText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 48px;
  margin-top: 8px;
`;

const SocialLoginGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const JoinButton = styled.button<{ disabled: boolean }>`
  width: 400px;
  height: 60px;
  padding: 10px;
  justify-content: center;
  align-items: center;

  border: none;
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  line-height: 123.5%; /* 29.64px */

  border-radius:  100px;

  background-color: rgba(
    26,
    129,
    232,
    ${props => (props.disabled ? '0.5' : '1.0')}
  );
  cursor: ${props => (props.disabled ? 'auto' : 'pointer')};
`;

const AgreeLink = styled(Link)`
  font-size: 14px;
  width: 100%;
  color: var(--primary-01);
  text-decoration: underline;
  font-weight: 500;
  line-height: 123.5%;
  letter-spacing: 0.25px;
  > span {
    color: var(--gray-07);
  }
`;

const AgreeCheck = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--primary-01);
  display: inline-block;
  background: url(${아이디저장x}) no-repeat center;
  //체크했을 때의post 스타일
  &:checked {
    background: url(${아이디저장o}) no-repeat center;
  }
`;

const JoinForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 400px;
  height: 100%;
  padding-top: 50px;
`;

const JoinLabel = styled.div<{ focused: boolean }>`
  width: 380px;
  margin-bottom: 5px;
  color: ${props => (props.focused ? 'var(--primary-01)' : 'var(--gray-07)')};
  font-size: 15px;
`;

const Joincontent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const Relative = styled.div`
  height: 40px;
`;

const JoinInput = styled.input`
  width: 100%;
  height: 26px;
  border-radius: 5px;
  border: none;
  background: #fff;
  font-size: 15px;

  ::placeholder {
    opacity: 0.3;
    font-weight: 400;
  }

  &:focus {
    outline: none;
  }
`;

const JoinList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const Title = styled.div`
  text-align: center;
  font-size: 32px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
`;

export default Join;
