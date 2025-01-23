import axios from "axios";

function useSessionReportAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Create a new session report
  async function createSessionReport(session_id, reportData = {}) {
    return (
      await axios.post(`${endpoint}/sessions/${session_id}/report`, reportData)
    ).data;
  }

  // Get a specific session report by ID
  async function getSessionReport(session_id) {
    return (await axios.get(`${endpoint}/sessions/${session_id}/report`)).data;
  }

  // Update a session report by ID
  async function updateSessionReport(session_id, reportData = {}) {
    return (
      await axios.patch(`${endpoint}/sessions/${session_id}/report`, reportData)
    ).data;
  }

  // Delete a session report by ID
  async function deleteSessionReport(session_id) {
    return (await axios.delete(`${endpoint}/sessions/${session_id}/report`))
      .data;
  }

  return {
    createSessionReport,
    getSessionReport,
    updateSessionReport,
    deleteSessionReport,
  };
}

export default useSessionReportAPI;