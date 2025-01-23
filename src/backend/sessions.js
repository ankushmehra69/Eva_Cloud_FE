import axios from "axios";

function useSessionsAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Create a new session
  async function createSession(
    android_id,
    name = "",
    sample_id = "",
    patient_id = "",
    remarks = "",
    tags = "",
    is_public = false
  ) {
    const body = {
      android_id,
      name,
      sample_id,
      patient_id,
      remarks,
      tags,
      is_public,
    };

    return (await axios.post(`${endpoint}/sessions`, body)).data;
  }

  // Get a specific session by ID
  async function getSession(session_id) {
    return (await axios.get(`${endpoint}/sessions/${session_id}`)).data;
  }

  // Update a session by ID
  async function updateSession(
    session_id,
    name = null,
    sample_id = null,
    patient_id = null,
    remarks = null,
    tags = null,
    is_public = null
  ) {
    const body = {
      name,
      sample_id,
      patient_id,
      remarks,
      tags,
      is_public,
    };

    return (await axios.patch(`${endpoint}/sessions/${session_id}`, body)).data;
  }

  // Get all sessions, optionally filtered by department ID, with pagination, optional thumbnails, search, and sorting
  async function getSessions(
    department_id = null,
    limit = 10,
    offset = 0,
    show_thumbnails = false,
    search_query = null,
    sort_by = "created_at",
    sort_order = "DESC"
  ) {
    const params = new URLSearchParams();
    if (department_id) {
      params.append("department_id", department_id);
    }
    params.append("limit", limit);
    params.append("offset", offset);
    params.append("show_thumbnails", show_thumbnails);
    if (search_query) {
      params.append("search_query", search_query);
    }
    params.append("sort_by", sort_by);
    params.append("sort_order", sort_order);

    return (await axios.get(`${endpoint}/sessions?${params.toString()}`)).data;
  }

  async function deleteSession(session_id) {
    return (await axios.delete(`${endpoint}/sessions/${session_id}`)).data;
  }

  return {
    createSession,
    getSession,
    updateSession,
    getSessions,
    deleteSession,
  };
}

export default useSessionsAPI;
