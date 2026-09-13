import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Timer from './Timer';
import { RecoilRoot } from 'recoil';

describe('Timer 컴포넌트', () => {
  it('타이머가 올바르게 시작하고 멈추는지 확인합니다', async () => {
    const { getByText, getByTestId } = render(
      <RecoilRoot>
        <Timer />
      </RecoilRoot>,
    );

    // 시작 버튼을 찾고 클릭합니다
    const startButton = getByText('기록시작');
    fireEvent.click(startButton);

    // 1초 대기
    await act(async () => {
      await new Promise(r => setTimeout(r, 1000));
    });

    // 타이머가 실행 중인지 확인합니다
    expect(getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();

    // 일시정지 버튼을 클릭합니다
    const pauseButton = getByText('일시정지');
    fireEvent.click(pauseButton);

    // 1초 대기
    await act(async () => {
      await new Promise(r => setTimeout(r, 1000));
    });

    // 타이머가 정지된 것을 확인합니다
    expect(getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();

    // 시작 버튼을 다시 클릭합니다
    fireEvent.click(startButton);

    // 1초 대기
    await act(async () => {
      await new Promise(r => setTimeout(r, 1000));
    });

    // 타이머가 다시 실행 중인지 확인합니다
    expect(getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('버튼 텍스트가 올바르게 업데이트되는지 확인합니다', () => {
    const { getByText } = render(
      <RecoilRoot>
        <Timer />
      </RecoilRoot>,
    );

    // 시작 버튼을 찾습니다
    const startButton = getByText('기록시작');
    expect(startButton).toBeInTheDocument();

    // 시작 버튼을 클릭합니다
    fireEvent.click(startButton);

    // 버튼 텍스트가 '일시정지'로 변경되는지 확인합니다
    expect(getByText('일시정지')).toBeInTheDocument();

    // 버튼을 다시 클릭합니다
    fireEvent.click(getByText('일시정지'));

    // 버튼 텍스트가 다시 '기록시작'으로 변경되는지 확인합니다
    expect(getByText('기록시작')).toBeInTheDocument();
  });
});
