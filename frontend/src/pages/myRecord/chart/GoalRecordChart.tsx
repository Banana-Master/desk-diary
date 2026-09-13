import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { GoalTime, MonthTime } from '../../../recoil/DeskAtom';
import { useQuery } from 'react-query';
import { getMonthData, getSevenData } from '../../../axios/historyApi';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type GoalRecordChartProps = {
  view7: boolean;
  view30: boolean;
};

const GoalRecordChart: React.FC<GoalRecordChartProps> = ({ view7, view30 }) => {
  const generateDateArray = (startDate: any, endDate: any) => {
    const dateArray = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      dateArray.push({ date: formattedDate, dayOfWeek: dayOfWeek });
    }
    return dateArray;
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const sevenDaysAgo = new Date(year, month, day - 6);
  const dateArray7 = generateDateArray(sevenDaysAgo, today);
  const thirtyDaysAgo = new Date(year, month, day - 29);
  const dateArray30 = generateDateArray(thirtyDaysAgo, today);

  const [weeklyHobby, setWeeklyHobby] = useState<any[]>([]);
  const [weeklyStudy, setWeeklyStudy] = useState<any[]>([]);
  const [monthlyHobby, setMonthlyHobby] = useState<any[]>([]);
  const [monthlyStudy, setMonthlyStudy] = useState<any[]>([]);
  const [goalTime, setGoalTime] = useRecoilState(GoalTime); // 목표시간
  const [monthTime, setMonthTime] = useRecoilState(MonthTime);
  useEffect(() => {
    const a = monthlyHobby.map(x => +x.totalHours);
    const b = monthlyStudy.map(x => +x.totalHours);
    const sumA = a.reduce((acc, curr) => acc + curr, 0);
    const sumB = b.reduce((acc, curr) => acc + curr, 0);

    setMonthTime(sumA + sumB);
  }, [monthlyHobby, monthlyStudy]);

  const {
    isLoading: loSevenData,
    isError: erSevenData,
    data: sevenData,
  } = useQuery('weeklyData', getSevenData);

  const { isLoading: loMonthData, isError: erMonthData, data: monthData } = useQuery('monthData', getMonthData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: '목표 달성 기록 모음',
      },
    },
  };

  const weeklyData = {
    labels: dateArray7.map(x => x.dayOfWeek),
    datasets: [
      {
        label: '취미',
        data: dateArray7.map((day, i) => {
          const correspondingHobby = weeklyHobby.find(
            x => x.dayName == day.dayOfWeek,
          );

          return correspondingHobby
            ? Math.floor(
                (Number(correspondingHobby.totalHours) /
                  Number(goalTime.goalTime)) *
                  100,
              )
            : 0;
        }),
        stack: 'stack1',
        backgroundColor: ['#00C5FF'],
      },
      {
        label: '스터디',
        data: dateArray7.map(day => {
          const correspondingStudy = weeklyStudy.find(
            x => x.dayName === day.dayOfWeek,
          );
          return correspondingStudy
            ? Math.floor(
                (Number(correspondingStudy.totalHours) /
                  Number(goalTime.goalTime)) *
                  100,
              )
            : 0;
        }),
        stack: 'stack1',
        backgroundColor: ['#1A81E8'],
      },
    ],
  };

  const monthlyData = {
    labels: dateArray30.map(x => x.date.slice(5)),
    datasets: [
      {
        label: '취미',
        data: dateArray30.map((day, i) => {
          const correspondingHobby = monthlyHobby.find(
            x => x.checkIn === day.date,
          );
          const totalHours = correspondingHobby
            ? Number(correspondingHobby.totalHours)
            : 0;
          const percentage =
            totalHours > 0
              ? Math.floor((totalHours / Number(goalTime.goalTime)) * 100)
              : 0;
          return percentage;
        }),
        stack: 'stack1',
        backgroundColor: ['#00C5FF'],
      },
      {
        label: '스터디',
        data: dateArray30.map(day => {
          const correspondingStudy = monthlyStudy.find(
            x => x.checkIn === day.date,
          );
          const totalHours = correspondingStudy
            ? Number(correspondingStudy.totalHours)
            : 0;
          const percentage =
            totalHours > 0
              ? Math.floor((totalHours / Number(goalTime.goalTime)) * 100)
              : 0;
          return percentage;
        }),
        stack: 'stack1',
        backgroundColor: ['#1A81E8'],
      },
    ],
  };

  useEffect(() => {
    if (!loSevenData && !erSevenData) {
      setWeeklyStudy(
        sevenData.weeklyStudy.map((x: any) => {
          const date = new Date(x.checkIn);
          const dayOfWeek = date.getDay();
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          const dayName = days[dayOfWeek];
          return { ...x, dayName: dayName };
        }),
      );
      setWeeklyHobby(
        sevenData.weeklyHobby.map((x: any) => {
          const date = new Date(x.checkIn);
          const dayOfWeek = date.getDay();
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          const dayName = days[dayOfWeek];
          return { ...x, dayName: dayName };
        }),
      );
    }
  }, [loSevenData, erSevenData, sevenData]);

  useEffect(() => {
    if (!loMonthData && !erMonthData) {
      setMonthlyHobby(monthData.monthlyHobby);
      setMonthlyStudy(monthData.monthlyStudy);
    }
  }, [loMonthData, erMonthData, monthData]);

  if (loMonthData) {
    return <p>한달 기록을 불러오는 중입니다...</p>;
  }
  if (erMonthData) {
    return <p>한달 기록을 불러오는 중 에러가 발생하였습니다.</p>;
  }
  if (loSevenData) {
    return <p>일주일 기록을 불러오는 중입니다...</p>;
  }
  if (erSevenData) {
    return <p>일주일 기록을 불러오는 중 에러가 발생하였습니다.</p>;
  }

  return (
    <Body>
      {view7 && goalTime.goalTime !== undefined && (
        <Bar options={options} data={weeklyData} width={730} height={240} />
      )}
      {view30 && goalTime.goalTime !== undefined && (
        <Bar options={options} data={monthlyData} width={730} height={240} />
      )}
      {goalTime.goalTime === undefined && <Text>목표를 설정해주세요</Text>}
    </Body>
  );
};

const Body = styled.div``;

const Text = styled.div`
  height: 230px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

export default GoalRecordChart;
