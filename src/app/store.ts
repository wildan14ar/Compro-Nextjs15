import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../feature/userSlice';
import postReducer from '../feature/postSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;