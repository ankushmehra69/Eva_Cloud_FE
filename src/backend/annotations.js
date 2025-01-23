import axios from "axios";

function useAnnotationsAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Create an annotation for media
  async function createMediaAnnotation(
    mediaId,
    annotationType,
    points,
    label,
    color
  ) {
    const body = {
      annotation_type: annotationType,
      points,
      label,
      color,
    };

    return (await axios.post(`${endpoint}/media/${mediaId}/annotations`, body))
      .data;
  }

  // Get annotations for media
  async function getMediaAnnotations(mediaId) {
    return (await axios.get(`${endpoint}/media/${mediaId}/annotations`)).data;
  }

  // Update an annotation
  async function updateAnnotation(
    annotationId,
    points = null,
    label = null,
    color = null
  ) {
    const body = {
      points,
      label,
      color,
    };

    return (await axios.patch(`${endpoint}/annotations/${annotationId}`, body))
      .data;
  }

  // Delete an annotation
  async function deleteAnnotation(annotationId) {
    return (await axios.delete(`${endpoint}/annotations/${annotationId}`)).data;
  }

  return {
    createMediaAnnotation,
    getMediaAnnotations,
    updateAnnotation,
    deleteAnnotation,
  };
}

export default useAnnotationsAPI;
