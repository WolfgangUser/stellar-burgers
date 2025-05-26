import { setCookie, getCookie } from './cookie';
import { TMenuItem, TPurchase, TPurchaseData, TAccount } from './types';

const API_URL = process.env.RESTAURANT_API_URL;

const validateResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TApiResponse<T> = {
  success: boolean;
} & T;

type TRefreshTokenResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshAccessToken = (): Promise<TRefreshTokenResponse> =>
  fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => validateResponse<TRefreshTokenResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithTokenRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await validateResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'token_expired') {
      const refreshData = await refreshAccessToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await validateResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TMenuResponse = TApiResponse<{
  items: TMenuItem[];
}>;

export type TPurchaseResponse = TApiResponse<{
  purchases: TPurchase[];
  total: number;
  todayTotal: number;
}>;

type TPurchasesResponse = TApiResponse<{
  items: TPurchase[];
}>;

export const getMenuItemsApi = () =>
  fetch(`${API_URL}/menu`)
    .then((res) => validateResponse<TMenuResponse>(res))
    .then((data) => {
      if (data?.success) return data.items;
      return Promise.reject(data);
    });

export const getPurchaseHistoryApi = () =>
  fetch(`${API_URL}/purchases/all`)
    .then((res) => validateResponse<TPurchaseResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getUserPurchasesApi = () =>
  fetchWithTokenRefresh<TPurchaseResponse>(`${API_URL}/purchases`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.purchases;
    return Promise.reject(data);
  });

export type TNewPurchaseResponse = TApiResponse<{
  purchase: TPurchase;
  name: string;
}>;

export const createPurchaseApi = (items: string[]) =>
  fetchWithTokenRefresh<TNewPurchaseResponse>(`${API_URL}/purchases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      items: items
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TPurchaseDetailsResponse = TApiResponse<{
  purchases: TPurchase[];
}>;

export const getPurchaseByNumberApi = (number: number) =>
  fetch(`${API_URL}/purchases/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => validateResponse<TPurchaseDetailsResponse>(res));

export type TRegistrationData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TApiResponse<{
  refreshToken: string;
  accessToken: string;
  user: TAccount;
}>;

export const registerAccountApi = (data: TRegistrationData) =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => validateResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginAccountApi = (data: TLoginData) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => validateResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const requestPasswordResetApi = (data: { email: string }) =>
  fetch(`${API_URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => validateResponse<TApiResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${API_URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => validateResponse<TApiResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TAccountResponse = TApiResponse<{ user: TAccount }>;

export const getAccountApi = () =>
  fetchWithTokenRefresh<TAccountResponse>(`${API_URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateAccountApi = (user: Partial<TRegistrationData>) =>
  fetchWithTokenRefresh<TAccountResponse>(`${API_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => validateResponse<TApiResponse<{}>>(res));