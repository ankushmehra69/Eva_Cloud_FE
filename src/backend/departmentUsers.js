import axios from "axios";

function useDepartmentUsersAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Fetch users in a department with pagination
  async function getUsersInDepartment(departmentId, offset = 0, limit = 10) {
    const params = new URLSearchParams();
    params.append("offset", offset);
    params.append("limit", limit);

    return (
      await axios.get(
        `${endpoint}/departments/${departmentId}/users?${params.toString()}`
      )
    ).data;
  }

  // Update a user's role in the department
  async function updateUserInDepartment(departmentId, userId, role, isAdmin) {
    const body = {
      role,
      is_admin: isAdmin,
    };

    return (
      await axios.patch(
        `${endpoint}/departments/${departmentId}/users/${userId}`,
        body
      )
    ).data;
  }

  // Remove a user from the department
  async function removeUserFromDepartment(departmentId, userId) {
    return (
      await axios.delete(
        `${endpoint}/departments/${departmentId}/users/${userId}`
      )
    ).data;
  }

  return {
    getUsersInDepartment,
    updateUserInDepartment,
    removeUserFromDepartment,
  };
}

export default useDepartmentUsersAPI;
