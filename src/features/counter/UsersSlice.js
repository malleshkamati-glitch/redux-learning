import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


function waiting() {

  return new Promise((res, rej) => {
    setTimeout(res, 10000);
  })
}
// 1️⃣ Create async thunk
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState }) => {
    // 1. Fetch Users with _page and _limit for pagination
    console.log("getState", getState());
    const page = getState().users.page;
    const LIMIT = 4;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${LIMIT}`);
    const users = await response.json();

    // 2. Fetch specific posts for each User using their ID concurrently
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        try {
          const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
          const posts = await postResponse.json();
          // Store the title of their last post
          const lastPost = posts.length > 0 ? posts[posts.length - 1].title : "No posts";
          return { ...user, lastPost };
        } catch (err) {
          return { ...user, lastPost: "Failed to load post" };
        }
      })
    );

    return { results: usersWithPosts, page };
  },
  {
    condition: (page, { getState }) => {
      const { users } = getState();
      if (users.loading) {
        // If it's already fetching, don't execute the payload creator
        console.log("Fetch already in progress, skipping...");
        return false;
      }
    }
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
          id: u.id, // jsonplaceholder uses 'id' instead of login.uuid
          username: u.username,
          email: u.email,
          lastPost: u.lastPost // The extra fetch we made
        }));

        if (page === 1) {
          state.users = mappedUsers;
        } else {
          state.users.push(...mappedUsers);
        }

        state.page = page + 1;
        state.hasMore = results.length === 4; // Limit per page is 3
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  }
});

export default usersSlice.reducer;