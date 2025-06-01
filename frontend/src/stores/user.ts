import { defineStore } from 'pinia';

export interface user {
    userId: string;
    userName: string;
    userImage: number;
    userBack: number;
    userSignature: string;
    userSex: number;
    userViolation: number;
    userCreateTime: string;
    userStatus: number;
  }

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as user | null
  }),
  actions: {
    setCurrentUser(user: user) {
      this.currentUser = user;
    },
    clearUser() {
        this.currentUser = null;
      }
  }
});