import { defineStore } from 'pinia'
import request from '../utils/request'
export const useUserStore = defineStore('user', {
  state: () => ({ token: localStorage.getItem('token') || '', user: JSON.parse(localStorage.getItem('user') || 'null') }),
  getters: {
    role: s => s.user?.role,
    isAdmin: s => s.user?.role === 'ADMIN',
    isSender: s => s.user?.role === 'SENDER',
    isSpecialist: s => s.user?.role === 'SPECIALIST'
  },
  actions: {
    async login(form) { const data = await request.post('/api/auth/login', form); this.token = data.token; this.user = data.user; localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); return data },
    logout() { this.token=''; this.user=null; localStorage.clear() }
  }
})
