export const setTokenCookie = (token: string) => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  const expirationDate = new Date();
  // console.log(expirationDate);
  expirationDate.setMinutes(expirationDate.getMinutes() + 3);


  // 쿠키에 토큰을 저장합니다.
  document.cookie = `token=${token}; expires=${expirationDate}; path=/`;
};

export const setRefreshTokenCookie = (refreshToken: string) => {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  // 쿠키에 토큰을 저장합니다.
  document.cookie = `refreshToken=${refreshToken}; expires=${expirationDate}; path=/`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie;
  // console.log('cookies', cookies);
  const cookieArray = cookies.split(';');
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    // console.log(cookieName, cookieValue);
    if (cookieName === 'token') {
      // console.log(cookieValue)
      return cookieValue;
    }
  }
  return null;
};

export const getRefreshTokenCookie = (name: string) => {
  const cookies = document.cookie;
  // console.log('cookies', cookies);
  const cookieArray = cookies.split(';');
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    // console.log(cookieName, cookieValue);
    if (cookieName === 'refreshToken') {
      // console.log(cookieValue)
      return cookieValue;
    }
  }
  return null;
};

