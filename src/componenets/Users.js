import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/counter/UsersSlice";
import "./Users.css";


const Users = () => {

  const dispatch = useDispatch();

  const { users, loading, error, page, hasMore } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (page === 1 && users.length === 0) {
      dispatch(fetchUsers(1));
    }
  }, [dispatch, page, users.length]);

  const handleScroll = useCallback(() => {
    // If we're loading or no more items, stop
    if (loading || !hasMore) return;

    // Check if scrolled near bottom
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      dispatch(fetchUsers(page));
    }
  }, [loading, hasMore, page, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (loading && users.length === 0) return <h2>Loading...</h2>;
  if (error && users.length === 0) return <h2>{error}</h2>;

  return (
    <div className="users-container">
      <h1 className="header-title">User Directory</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Last Post</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.lastPost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="status-message">Loading more users...</div>}
      {!hasMore && <div className="status-message end-message">No more users</div>}
    </div>
  );
};

export default Users;