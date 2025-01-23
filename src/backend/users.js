import axios from "axios";

function useUsersAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  async function getUser(user_id) {
    return (await axios.get(`${endpoint}/users/${user_id}`)).data;
  }

  async function updateUser(user_id, details) {
    return (await axios.patch(`${endpoint}/users/${user_id}`, details)).data;
  }

  async function deleteUser(user_id) {
    return (await axios.delete(`${endpoint}/users/${user_id}`)).data;
  }

  return {
    getUser,
    updateUser,
    deleteUser,
  };
}

export default useUsersAPI;
