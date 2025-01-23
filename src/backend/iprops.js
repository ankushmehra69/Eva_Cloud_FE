import axios from "axios";

function useIpropsAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Create image properties for media
  async function createMediaIprops(
    mediaId,
    brightness = null,
    contrast = null,
    saturation = null,
    sharpness = null
  ) {
    const body = {
      brightness,
      contrast,
      saturation,
      sharpness,
    };

    return (await axios.post(`${endpoint}/media/${mediaId}/iprops`, body)).data;
  }

  // Update image properties for media
  async function updateMediaIprops(
    mediaId,
    brightness = null,
    contrast = null,
    saturation = null,
    sharpness = null
  ) {
    const body = {
      brightness,
      contrast,
      saturation,
      sharpness,
    };

    return (await axios.patch(`${endpoint}/media/${mediaId}/iprops`, body))
      .data;
  }

  // Get image properties for media
  async function getMediaIprops(mediaId) {
    return (await axios.get(`${endpoint}/media/${mediaId}/iprops`)).data;
  }

  // Delete image properties for media
  async function deleteMediaIprops(mediaId) {
    return (await axios.delete(`${endpoint}/media/${mediaId}/iprops`)).data;
  }

  return {
    createMediaIprops,
    updateMediaIprops,
    getMediaIprops,
    deleteMediaIprops,
  };
}

export default useIpropsAPI;
