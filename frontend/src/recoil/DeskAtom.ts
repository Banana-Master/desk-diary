import { atom } from 'recoil';

export const GoalTimeModalState = atom({
  key: 'GoalTimeModalState',
  default: false,
});

export const GoalTime = atom({
  key: 'GoalTime',
  default: {
    goalTime: 0,
  },
});

export const MonthTime = atom({
  key: 'MonthTime',
  default: 0,
});
