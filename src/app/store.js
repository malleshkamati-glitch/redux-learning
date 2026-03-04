import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import todoReducer from '../features/todo/todoSlice'
import usersReducer from '../features/counter/UsersSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todo: todoReducer,
    users: usersReducer,
  },
})
