import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCookie } from '../../../auth/cookie';
import { fetchUser } from '../../../axios/api';
import cloud from '../../../images/cloud.png';
import addroom from '../../../images/main/addroom.svg';
import profile from '../../../images/profile.png';
import CreateRoomModal from '../../../pages/home/components/CreateRoomModal';

import { useQuery } from 'react-query';

type MainTopProps = {};

const MainTop: React.FC<MainTopProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [user, setUser] = useState<user>();
  const navigate = useNavigate();

  const token = getCookie('token');

  const [nickname, setNickname] = useState('');

  const onClickCreateRoomButton = () => {
    if (token) {
      setOpenCreateRoom(!openCreateRoom);
    } else {
      navigate('/login');
    }
  };

  const clickSearch = () => {
    setIsFocused(true);
  };

  const blurSearch = () => {
    setIsFocused(false);
  };

  const onclickSearch = () => {
    toast.message('search click');
  };

  const { data } = useQuery<user>('user', fetchUser, {
    refetchOnWindowFocus: false,
  });
  // console.log('MainTop 렌더링');

  return (
    <NavHeader>
      {token ? (
        <User to="/mypage">
          <img
            src={data?.profileImage ? data.profileImage : profile}
            alt="profile image"
          ></img>
          <p>{data?.nickname}</p>
          {/* <span>마이페이지</span> */}
        </User>
      ) : (
        <User to="/login">
          <img src={profile} alt="login"></img>
          <p>로그인이 필요합니다.</p>
        </User>
      )}

      {/* <Search isFocused={isFocused} justify="space-between">
        <SearchInput
          onFocus={clickSearch}
          onBlur={blurSearch}
          placeholder="검색어입력"
        />
        <SearchButton onClick={onclickSearch}>
          <SearchIcon />
        </SearchButton>
      </Search> */}

      {token ? (
        <CreateRoomButton type="button" onClick={onClickCreateRoomButton}>
          <img src={addroom} alt="add room button" />
          방만들기
        </CreateRoomButton>
      ) : (
        <UserAuthGroup>
          <AuthLink to="/login">로그인</AuthLink>
          <AuthLink to="/join">회원가입</AuthLink>
        </UserAuthGroup>
      )}

      {openCreateRoom && (
        <CreateRoomModal setOpenCreateRoom={setOpenCreateRoom} />
      )}
    </NavHeader>
  );
};

const UserAuthGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const AuthLink = styled(Link)`
  font-size: 15px;
  color: var(--gray-07)
`;

const User = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-07);
  width: 250px;

  > img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 10px;
  }

  > p {
    font-size: 16px;
    color: black;
    overflow: hidden;
  }

  > span {
    margin-left: auto;
  }
`;

const CreateRoomButton = styled.button`
  display: flex;
  width: 200px;

  padding: 15px 10px;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-01);
  border: none;
  font-size: 14px;
  background: url(${cloud}) ;
  background-size: cover;
  background-position: center;

  min-width: 100px;
  /* color: var(--bw-whtie); */

  > img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;

const NavHeader = styled.div`
  width: 1200px;

  padding-top: 20px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Search = styled.div<{ isFocused: boolean }>`
  width: 50%;
  height: 48px;
  border: 2px solid var(--gray-06);
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 19px;
  border: none;
  font-size: 15px;
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: rgba(0, 0, 0, 0.2);
  }
`;

const SearchButton = styled.div`
  cursor: pointer;
  opacity: 0.5;
`;

export default MainTop;
