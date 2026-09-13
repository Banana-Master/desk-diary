import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styled, { createGlobalStyle } from 'styled-components';
import { getCookie } from '../../../auth/cookie';
import { fetchUser } from '../../../axios/api';
import { hobby, home, mydesk, study } from '../../../images/main';
import logo from '../../../images/logo-2.svg';
import profile from '../../../images/main/profile.svg';

type SideBarProps = {};

const navItems = [
  {
    id: 1,
    title: '홈',
    icon: home,
    url: '/',
  },
  {
    id: 2,
    title: '스터디룸',
    icon: study,
    url: '/study',
  },
  {
    id: 3,
    title: '취미룸',
    icon: hobby,
    url: '/hobby',
  },
];

const SideBar: React.FC<SideBarProps> = () => {
  const token = getCookie('token');
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const { data, refetch } = useQuery<user>('mypageUser', fetchUser, {
    refetchOnWindowFocus: false,
  });

  const delayedRedirect = (path: string) => {
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

  const mydeskHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isClicked) return;
    setIsClicked(true);
    if (!token) {
      e.preventDefault(); // NavLink의 기본 이동을 막아줌

      toast.error('로그인이 필요합니다.', {
        style: {
          backgroundColor: '#ffdcdc',
          opacity: 0.6,
          color: 'white',
        },
      });
      delayedRedirect('/login');
    }
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <Sidebar>
      <GlobalStyle />
      <SidebarInner>
        <SidebarHeader to="/">
          <Logo src={logo} alt="Logo" />
        </SidebarHeader>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarButton key={item.id} to={item.url}>
              <img src={item.icon} alt="menu icon" />
              <p>{item.title}</p>
            </SidebarButton>
          ))}
          <SidebarButton
            to={token ? '/mydesk' : '/login'}
            onClick={e => mydeskHandler(e)}
          >
            <img src={mydesk} alt="menu icon" />
            <p>책상 기록</p>
          </SidebarButton>
        </SidebarMenu>
        <SidebarButton className="mypage" to={token ? '/mypage' : '/login'}>
          {token ? (
            <>
              <img
                src={data?.profileImage ? data.profileImage : profile}
                alt="menu icon"
              ></img>
              <p>{data?.nickname}</p>
            </>
          ) : (
            <>
              <img src={profile} alt="menu icon"></img>
              <p>로그인</p>
            </>
          )}
        </SidebarButton>
      </SidebarInner>
    </Sidebar>
  );
};

const SidebarButton = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 60px;
  width: 60px;
  background-color: transparent;
  transition: width 0.4s, background-color 0.3s;

  font-size: 16px;
  line-height: 1;
  border-radius: 50px;
  margin-left: 5px;
  position: relative;
  z-index: 50;

  ::before {
    content: '';
    position: absolute;
    top: -0px;
    left: -100px;
    right: -100px;
    bottom: -0px;
  }

  color: white;
  opacity: 0.5;

  &.active {
    opacity: 1;
    > img {
      filter: grayscale(0); /* 회색조 */
    }
    > p {
      color: white;
    }
  }

  @media (min-width: 768px) {
    &:hover {
      width: 85%;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  &:hover {
    opacity: 1;

    > img {
      filter: grayscale(0);
    }

    > p {
      color: white;
      font-weight: 500;
    }

    &.mypage {
      background-color: rgba(255, 255, 255, 0);
    }
  }

  > img {
    height: 25px;
    border-radius: 50%;
    filter: grayscale(100%);
    padding: 0 15px;
  }

  > p {
    width: 80px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
    color: white;
  }

  &.mypage {
    margin-left: 15px;
    opacity: 1;
    background-color: none;
    > img {
      height: 35px;
      width: 35px;
      padding: 0;
      margin-left: 7px;
      margin-right: 10px;
      border-radius: 50%;
      filter: grayscale(0);
      object-fit: cover;
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    margin: 0;

    ::before {
      content: '';
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
    > p {
      display: none;
    }
  }
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 30px;
  margin-top: 50px;
  margin-bottom: 50px;

  @media (min-width: 768px) {
    &:hover {
      width: 180px;
      ${SidebarButton} img {
        transition: 0.3s;
      }
    }
  }

  @media (max-width: 768px) {
    gap: 0;
    flex-direction: row;
    margin: 0;
  }
`;

const Logo = styled.img`
  height: 70px;
  padding: 10px;
  @media (max-width: 768px) {
    margin-left: 20px;
    width: 100%;
    height: 100%;
  }
`;

const SidebarHeader = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  width: 80px;
  margin-top: 10px;
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const SidebarInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 80px;
  height: 100vh;
  background: #004891;
  transition: width 0.4s;
  z-index: 50;

  ${SidebarHeader} {
    transition: width 0.3s; // 이걸 추가해!
  }
  @media (min-width: 768px) {
    &:hover {
    width: 180px;

    ${SidebarHeader} {
      width: 160px;
    }

    ${SidebarButton} p {
      opacity: 1;
    }
  }
  }


  @media (max-width: 768px) {
    width: 100vw;
    height: 100px;
  }
`;

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  } 

  body {
    margin: 0;
  }

  button {
    background: transparent;
    border : 0;
    padding: 0;
    cursor: pointer;
  }
`;

export default SideBar;
