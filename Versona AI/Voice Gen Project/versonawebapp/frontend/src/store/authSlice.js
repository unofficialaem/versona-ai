import { createSlice } from '@reduxjs/toolkit';

// Try to get initial state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    return {
      token: token || null,
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      isAuthenticated: !!token,
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {
      token: null,
      userInfo: null,
      isAuthenticated: false,
    };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user_info } = action.payload;
      state.token = token;
      state.userInfo = user_info;
      state.isAuthenticated = true;
      
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user_info));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.isAuthenticated = false;
      
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      try {
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      } catch (error) {
        console.error('Error updating userInfo in localStorage:', error);
      }
    },
  },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;