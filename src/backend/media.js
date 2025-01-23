import axios from "axios";

function useMediaAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Add media to a session
  async function addMedia(session_id, media_type, name = null) {
    const body = { media_type, name };
    return (await axios.post(`${endpoint}/sessions/${session_id}/media`, body))
      .data;
  }

  // List media for a session, with optional thumbnails
  async function listMedia(
    session_id,
    limit = 10,
    offset = 0,
    show_thumbnails = false
  ) {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    params.append("show_thumbnails", show_thumbnails);

    return (
      await axios.get(
        `${endpoint}/sessions/${session_id}/media?${params.toString()}`
      )
    ).data;
  }

  // Get media file
  async function getMedia(media_id) {
    return (await axios.get(`${endpoint}/media/${media_id}`)).data;
  }

  // Delete media file
  async function deleteMedia(media_id) {
    return (await axios.delete(`${endpoint}/media/${media_id}`)).data;
  }

  async function updateMedia(media_id, details) {
    return (await axios.patch(`${endpoint}/media/${media_id}`, details)).data;
  }

  return {
    addMedia,
    listMedia,
    getMedia,
    deleteMedia,
    updateMedia,
  };
}

export default useMediaAPI;
