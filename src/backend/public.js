import axios from "axios";

function usePublicAPI() {
  const endpoint = `${import.meta.env.VITE_PUBLIC_HTTP_API_URL}public/api`;

  // Fetch public session details
  async function getPublicSession(session_id) {
    return (await axios.get(`${endpoint}/sessions/${session_id}`)).data;
  }

  /// Fetch public media for a session with pagination and optional thumbnails
  async function listPublicMedia(
    session_id,
    limit = 10,
    offset = 0,
    showThumbnails = false
  ) {
    const params = new URLSearchParams({
      limit,
      offset,
      show_thumbnails: showThumbnails.toString(),
    });

    return (
      await axios.get(`${endpoint}/sessions/${session_id}/media?${params}`)
    ).data;
  }

  // Fetch individual public media file (presigned URL)
  async function getPublicMedia(media_id) {
    return (await axios.get(`${endpoint}/media/${media_id}`)).data;
  }

  return {
    getPublicSession,
    listPublicMedia,
    getPublicMedia,
  };
}

export default usePublicAPI;
