import axios from "axios";

function useDepartmentsAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Fetch departments with pagination
  async function getDepartments(offset = 0, limit = 10) {
    const params = new URLSearchParams();
    params.append("offset", offset);
    params.append("limit", limit);
    return (await axios.get(`${endpoint}/departments?${params.toString()}`))
      .data;
  }

  // Add a new department
  async function addDepartment(name) {
    const body = {
      name,
    };

    return (await axios.post(`${endpoint}/departments`, body)).data;
  }

  // Fetch a specific department by its ID
  async function getDepartment(department_id) {
    return (await axios.get(`${endpoint}/departments/${department_id}`)).data;
  }

  // Update a department by its ID
  async function updateDepartment(department_id, details) {
    return (
      await axios.patch(`${endpoint}/departments/${department_id}`, details)
    ).data;
  }

  // Delete a department by its ID
  async function deleteDepartment(department_id) {
    return (await axios.delete(`${endpoint}/departments/${department_id}`))
      .data;
  }

  return {
    getDepartments,
    addDepartment,
    getDepartment,
    updateDepartment,
    deleteDepartment,
  };
}

export default useDepartmentsAPI;
