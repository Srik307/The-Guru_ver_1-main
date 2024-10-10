import {create} from 'zustand';
import { Storeit } from '../controllers/LocalStorage';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (authState) => set({ isAuthenticated: authState }),
}));

export const ip="http://192.168.204.220:3000";
//"https://eternal-unduly-lizard.ngrok-free.app";
//'https://the-guru-ver-1.onrender.com';
//'http://192.168.190.220:3000'
//44.233.151.27
//'https://the-guru-ver-1.onrender.com';
//34.211.200.85';

export const useDataStore=create((set)=>({
    token:"",
    user:{
        name: '',
        email: '',
        age: '',
        profession: '',
        sex: '',
        routines:['1','2','3']
      },
    setUser: (userData) => set({ user: userData }),
    setToken:(token)=>set({token:token})
}));


export const useSchedule=create((set)=>({
    schedules:{},
    setSchedule: (schedule) => {set({ schedules: schedule });
       Storeit("@schedule",schedule);},
}));
