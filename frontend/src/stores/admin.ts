import { defineStore } from 'pinia';

// 用户信息类型定义
export interface UserInfo {
  adminId: string;
  adminName: string;
  adminPassword: string;
  adminEmail?: string;
  adminCreatedTime: string;
  adminImage: number;
  token: string;
  adminImageUrl: string;
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo') || '') : {},
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    clearAuth() {
      this.token = '';
      this.userInfo = {};
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  },
  getters: {
    isAuthenticated: (state) =>!!state.token,
    getUserInfo: (state) => state.userInfo
  }
});