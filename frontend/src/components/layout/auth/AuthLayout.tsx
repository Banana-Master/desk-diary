import styled from '@emotion/styled';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthHeader } from '../index';

type SideLayoutProps = {};

const SideLayout: React.FC<SideLayoutProps> = () => {
  return (
    <Wrap>
      <Outlet />
    </Wrap>
  );
};

const Wrap = styled.div`
  min-height: 100vh;
  position: relative;
  width: 100vw;
  display: flex;
  justify-content: center;
`;
export default SideLayout;

const index = 10;

const arr = Array.from({length:index}).fill(0);

