import styled from '@emotion/styled';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import CreateRoomButton from '../../CreateRoomButton2';

type MainLayoutProps = {};

const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <Wrap>
      <SideBar />
      <Outlet />
      <CreateRoomButton />
    </Wrap>
  );
};

const Wrap = styled.div`
  min-height: calc(100vh - 160px);
  position: relative;
  width: calc(100vw - 90px);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  margin-left: 80px;
  padding-top: 80px;
  padding-bottom: 80px;
  @media (max-width: 768px) {
    margin-top: 80px;
    margin-left: 0px;
    width: 100vw;
  }
`;
export default MainLayout;
