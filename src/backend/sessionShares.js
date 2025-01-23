import axios from "axios";

function useSessionSharesAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Get shares for a session
  async function getSessionShares(session_id) {
    return (await axios.get(`${endpoint}/sessions/${session_id}/shares`)).data;
  }

  // Add a new session share
  async function addSessionShare(
    session_id,
    shared_with_email,
    editor = false
  ) {
    const body = { shared_with_email, editor }; // `editor` instead of `is_editor`
    return (await axios.post(`${endpoint}/sessions/${session_id}/shares`, body))
      .data;
  }

  // Update a session share (editor/viewer role)
  async function updateSessionShare(session_id, share_id, editor) {
    const body = { editor }; // The role change is sent in the body
    return (
      await axios.patch(
        `${endpoint}/sessions/${session_id}/shares/${share_id}`,
        body
      )
    ).data;
  }

  // Remove a session share
  async function removeSessionShare(session_id, share_id) {
    // No body needed, just send the share_id
    return (
      await axios.delete(
        `${endpoint}/sessions/${session_id}/shares/${share_id}`
      )
    ).data;
  }

  // Get all sessions shared with the current user with additional parameters
  async function getSharedSessions(
    limit = 10,
    offset = 0,
    show_thumbnails = false,
    search_query = null,
    sort_by = "created_at",
    sort_order = "DESC"
  ) {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    params.append("show_thumbnails", show_thumbnails);
    if (search_query) {
      params.append("search_query", search_query);
    }
    params.append("sort_by", sort_by);
    params.append("sort_order", sort_order);

    return (
      await axios.get(
        `${endpoint}/sessions/shared_with_me?${params.toString()}`
      )
    ).data;
  }

  return {
    getSessionShares,
    addSessionShare,
    updateSessionShare, // Expose this new method for updating share roles
    removeSessionShare,
    getSharedSessions,
  };
}

export default useSessionSharesAPI;
