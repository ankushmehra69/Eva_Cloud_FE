import axios from "axios";

function useSessionReportMediaAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Link media to a session report
  async function addMediaToSessionReport(
    report_id,
    media_id,
    description = ""
  ) {
    const body = { media_id, description };
    return (
      await axios.post(`${endpoint}/session_reports/${report_id}/media`, body)
    ).data;
  }

  // Get all media linked to a specific session report
  async function getMediaForSessionReport(report_id) {
    return (await axios.get(`${endpoint}/session_reports/${report_id}/media`))
      .data;
  }

  // Update media description in a session report
  async function updateMediaDescriptionForSessionReport(
    report_id,
    media_id,
    description
  ) {
    const body = { description };
    return (
      await axios.patch(
        `${endpoint}/session_reports/${report_id}/media/${media_id}`,
        body
      )
    ).data;
  }

  // Remove media from a session report
  async function removeMediaFromSessionReport(report_id, media_id) {
    return (
      await axios.delete(
        `${endpoint}/session_reports/${report_id}/media/${media_id}`
      )
    ).data;
  }

  return {
    addMediaToSessionReport,
    getMediaForSessionReport,
    updateMediaDescriptionForSessionReport,
    removeMediaFromSessionReport,
  };
}

export default useSessionReportMediaAPI;