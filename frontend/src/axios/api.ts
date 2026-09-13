import axios from 'axios';
import { getCookie } from '../auth/cookie';

const token = getCookie('token');

// user 프로필 가져오기
export const fetchUser = async () => {
  const token = getCookie('token');
  if (!token) {
    // console.log("fetchUser 로그인이 필요해요!");
    return null;
  }
  const { data } = await axios.get(
    `${process.env.REACT_APP_SERVER_URL!}/me/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 토큰을 헤더에 추가해줘
      },
    },
  );
  // console.log('❤️user 프로필 가져오기')
  return data;
};

// 내가 참여한 방 조회
export const fetchJoinRoom = async () => {
  const token = getCookie('token');
  const { data } = await axios.get(
    `${process.env.REACT_APP_SERVER_URL!}/my-rooms`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 토큰을 헤더에 추가해줘
      },
    },
  );
  // console.log('❤️내가 참여한 방 조회')
  return data;
};

// 내가 만든 방 조회
export const fetchCreatedRoom = async () => {
  const token = getCookie('token');
  const { data } = await axios.get(
    `${process.env.REACT_APP_SERVER_URL!}/rooms/my-created`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 토큰을 헤더에 추가해줘
      },
    },
  );
  // console.log('❤️내가 만든 방 조회')
  return data;
};

// 전체방 인기순
export const fetchRoomPopular = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL!}/rooms/popular`,
    );
    // console.log('❤️전체방 인기순')
    return data;
  } catch (error) {
    // console.error('전체방 인기순 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 전체방 최신순
export const fetchRoomLatest = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL!}/rooms/latest`,
    );
    // console.log('❤️전체방 최신순')
    return data;
  } catch (error) {
    // console.error('전체방 최신순 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 전체방 인기순 top10
export const fetchRoomTopPopular = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL!}/rooms/popular-top`,
    );
    // console.log('❤️전체방 인기순 top10')
    return data;
  } catch (error) {
    // console.error('전체방 인기순 top10 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 전체방 최신순 top10
export const fetchRoomTopLatest = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL!}/rooms/latest-top`,
    );
    // console.log('❤️전체방 최신순 top10')
    return data;
  } catch (error) {
    // console.error('전체방 최신순 top10 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 스터디 인기순
export const fetchStudyPopular = async (num: number) => {
  // console.log(num);
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/study-rooms/popular?page=${num}&perPage=20`, // cursor=div개수
    );
    return data;
  } catch (error) {
    console.error('스터디 인기순 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 취미룸 인기순
export const fetchHobbyPopular = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/hobby-rooms/popular?page=${num}&perPage=20`,
    );
    // console.log(data);
    return data;
  } catch (error) {
    // console.error('취미 인기순 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 스터디 최신순
export const fetchStudyLatest = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/study-rooms/latest?page=${num}&perPage=20`,
    );
    // console.log('❤️스터디 최신순')
    return data;
  } catch (error) {
    // console.error('스터디 최신순 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 취미룸 최신순
export const fetchHobbyLatest = async (num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/hobby-rooms/latest?page=${num}&perPage=20`,
    );
    // console.log('❤️취미룸 최신순')
    return data;
  } catch (error) {
    // console.error('취미 최신순 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 스터디 top10
export const fetchTopStudy = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL!}/study-rooms/popular-top`,
    );
    // console.log('❤️스터디 top10')
    return data;
  } catch (error) {
    // console.error('스터디 top10 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 취미룸 top10
export const fetchTopHobby = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL!}/hobby-rooms/popular-top`,
    );
    // console.log('❤️취미룸 top10')
    return data;
  } catch (error) {
    // console.error('취미 top10 정보를 불러오는 데 실패했어요!', error);
    return null;
  }
};

// 스터디룸 인기순 검색
export const fetchStudyPopularSearch = async (search: string, num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/study-rooms/search?filter=popularity&search=${search}&page=${num}&perPage=20`,
    );
    return data;
  } catch (error) {}
};

// 취미 인기순 검색
export const fetchHobbyPopularSearch = async (search: string, num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/hobby-rooms/search?filter=popularity&search=${search}&page=${num}&perPage=20`,
    );
    return data;
  } catch (error) {}
};

// 스터디 최신순 검색
export const fetchStudyLatestSearch = async (search: string, num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/study-rooms/search?filter=latest&search=${search}&page=${num}&perPage=20`,
    );
    return data;
  } catch (error) {}
};

// 취미 최신순 검색
export const fetchHobbyLatestSearch = async (search: string, num: number) => {
  try {
    const { data } = await axios.get(
      `${process.env
        .REACT_APP_SERVER_URL!}/hobby-rooms/search?filter=latest&search=${search}&page=${num}&perPage=20`,
    );
    return data;
  } catch (error) {}
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  // 요청을 보내기 전 수행되는 함수
  function (config) {
    // console.log("인터셉터 요청 성공");
    return config;
  },
  // 오류 요청을 보내기 전 수행되는 함수
  function (error) {
    // console.log("인터셉터 요청 오류");
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  // 응답을 내보내기 전 수행되는 함수
  function (response) {
    // console.log("인터셉터 응답 받았습니다");
    return response;
  },
  // 오류 응답을 내보내기 전 수행되는 함수
  function (error) {
    // console.log("인터셉터 응답 오류 발생");
    return Promise.reject(error);
  },
);

export default instance;
