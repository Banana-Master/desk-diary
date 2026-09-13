import axios from 'axios';
import { getCookie } from '../auth/cookie';

const serverUrl = process.env.REACT_APP_SERVER_URL;
// 초를 [시, 분]으로 계산
const secToHourMinute = (time: number) => {
  const hour = Math.floor(time / 3600);
  const minute = Math.floor((time % 3600) / 60);
  return [hour, minute];
};

// 1일 학습 기록 조회
const todayLerningHistoryHome = async () => {
  try {
    const token = getCookie('token');
    const response = await axios.get(
      `${serverUrl}/learning-history/today`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = response.data;
    if (data.message === '등록된 목표시간이 없습니다.') {
      return [0, 0, 0, 0, 0, 0]; // 목표시, 목표분, 총 시, 총 분, 목표시간, 총 초
    } else {
      const goalTime = Number(data.goaltime);
      const hobbyTotalHours = Number(data.hobbyTotalHours);
      const studyTotalHours = Number(data.studyTotalHours);
      const [goalTimeHour, goalTimeMinute] = secToHourMinute(goalTime);
      const totalSecond = hobbyTotalHours + studyTotalHours;
      const [totalHours, totalMinute] = secToHourMinute(totalSecond);
      return [
        goalTimeHour,
        goalTimeMinute,
        totalHours,
        totalMinute,
        goalTime,
        totalSecond,
      ];
    }
  } catch (error) {
    return [0, 0, 0, 0, 0, 0];
  }
};
// 책상 기록 - 한달 기록 보기
const getMonthData = async () => {
  const token = getCookie('token');
  const response = await axios.get(
    `${serverUrl}/learning-history/monthly`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = response.data;
  return data;
};

// 책상 기록 - 일주일 기록 보기
const getSevenData = async () => {
  const token = getCookie('token');
  const response = await axios.get(
    `${serverUrl}/learning-history/weekly`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = response.data;
  return data;
};

export { todayLerningHistoryHome, getMonthData, getSevenData };
