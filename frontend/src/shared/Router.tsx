import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SideLayout from '../components/layout/auth/AuthLayout';
import MainLayout from '../components/layout/main/MainLayout';


import { Suspense, lazy } from 'react';
import TokenRefresher from '../axios/TokenRefresher';
const Lending = lazy(() => import('../pages/auth/Lending'));
const ConfirmEmailNotice = lazy(() => import('../pages/auth/ConfirmEmailNotice'));
const Help = lazy(() => import('../pages/help/Help'));
const Mypage = lazy(() => import('../pages/mypage/Mypage'));
const Login = lazy(() => import('../pages/auth/Login'));
const Auth = lazy(() => import('../pages/auth/Auth'));
const Error = lazy(() => import('../pages/Error'));
const Home = lazy(() => import('../pages/home/Home'));
const Room = lazy(() => import('../pages/room/Room'));
const Join = lazy(() => import('../pages/auth/Join'));
const HobbyCategory = lazy(() => import('../pages/category/HobbyCategory'));
const StudyCategory = lazy(() => import('../pages/category/StudyCategory'));
const MyRecord = lazy(() => import('../pages/myRecord/MyDesk'));


const Router = () => {
  return (
    <BrowserRouter>
      <TokenRefresher />
      <Routes>
        <Route path="/lending" element={<Lending />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={ <Suspense fallback={ <div></div>}><Home /></Suspense> } />
          <Route path="/study" element={ <Suspense fallback={<div></div>}><StudyCategory /></Suspense> } />
          <Route path="/hobby" element={ <Suspense fallback={<div></div>}><HobbyCategory /></Suspense> } />
          <Route path="/mydesk" element={ <Suspense fallback={<div></div>}><MyRecord /></Suspense> } />
          <Route path="/mypage" element={ <Suspense fallback={<div></div>}><Mypage /></Suspense> } />
        </Route>

        <Route element={<SideLayout />}>
          <Route path="/login" element={<Suspense fallback={<div></div>}><Login /></Suspense> } />
          <Route path="/join" element={<Suspense fallback={<div></div>}><Join /></Suspense>} />
        </Route>

        <Route path="/room/:id" element={ <Suspense fallback={<div style={{backgroundColor:'var(--gray-09)'}}></div>}><Room /></Suspense>} />
        <Route path="/auth" element={ <Suspense fallback={<div></div>}><Auth /></Suspense> } />

        <Route path="/confirm-email" element={ <Suspense fallback={<div></div>}><ConfirmEmailNotice /></Suspense>} />
        <Route path="/help" element={ <Suspense fallback={<div></div>}><Help /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<div></div>}><Error /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
