import React from 'react';
import styled from 'styled-components';
import { ProfiltUpdate } from '../../../recoil/UserAtom';
import { useRecoilState } from 'recoil';

type MypageToggleProps = {};

const MypageToggle: React.FC<MypageToggleProps> = () => {
  const [edit, setEdit] = useRecoilState(ProfiltUpdate);

  const onClickEdicProfile = () => {
    // console.log(edit.open);
    setEdit(prevEdit => ({ ...prevEdit, open: true }));
  };

  const onClickLogout = () => {
    alert('로그아웃');
  };

  console.log(edit.open);

  const DeleteUser = () => {
    alert('회원탈퇴');
  };

  return (
    <Container>
      <p onClick={onClickEdicProfile}>닉네임 수정</p>
      <p onClick={onClickLogout}>로그아웃</p>
      <p onClick={DeleteUser}>회원탈퇴</p>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  width: 100%;
  margin-top: 10px;
  margin-left: 30px;

  > p {
    margin: 5px 0;
    cursor: pointer;
    color: var(--gray-06);
    &:hover {
      border-bottom: 1px solid var(--gray-07);
      color: var(--gray-07);
    }
  }
`;
export default MypageToggle;
