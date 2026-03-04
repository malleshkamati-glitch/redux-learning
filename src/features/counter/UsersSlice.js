import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


function waiting(){

  return new Promise((res,rej)=>{
    setTimeout(res,10000);
  })
}
// 1️⃣ Create async thunk
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page = 1) => {
    console.log("fetching ")
    await waiting();
    const response = await fetch(`https://randomuser.me/api/?results=10&page=${page}&seed=abc`);
    const data = await response.json();
    return { results: data.results, page }; // This becomes action.payload
  }
);

const logger = (store) => (next) => (action) => {
  console.log("Dispatching:", action.type);
  return next(action);
};



const initialState = {
  users: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};


const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),

  extraReducers: (builder) => {

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const { results, page } = action.payload;

        const mappedUsers = results.map(u => ({
          id: u.login.uuid,
          username: u.login.username,
          email: u.email
        }));

        if (page === 1) {
          state.users = mappedUsers;
        } else {
          state.users.push(...mappedUsers);
        }

        state.page = page + 1;
        state.hasMore = state.users.length < 20;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  }
});

export default usersSlice.reducer;