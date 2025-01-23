import axios from "axios";

function useCommentsAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Create a comment for a session
  async function createSessionComment(
    sessionId,
    content,
    parentCommentId = null,
    coordinates = null
  ) {
    const body = {
      content,
      parent_comment_id: parentCommentId,
      coordinates,
    };

    return (
      await axios.post(`${endpoint}/sessions/${sessionId}/comments`, body)
    ).data;
  }

  // Create a comment for media
  async function createMediaComment(
    mediaId,
    content,
    parentCommentId = null,
    coordinates = null
  ) {
    const body = {
      content,
      parent_comment_id: parentCommentId,
      coordinates,
    };

    return (await axios.post(`${endpoint}/media/${mediaId}/comments`, body))
      .data;
  }

  // Get comments for a session
  async function getSessionComments(sessionId) {
    return (await axios.get(`${endpoint}/sessions/${sessionId}/comments`)).data;
  }

  // Get comments for media
  async function getMediaComments(mediaId) {
    return (await axios.get(`${endpoint}/media/${mediaId}/comments`)).data;
  }

  // Update a comment
  async function updateComment(commentId, content = null, coordinates = null) {
    const body = {
      content,
      coordinates,
    };

    return (await axios.patch(`${endpoint}/comments/${commentId}`, body)).data;
  }

  // Delete a comment
  async function deleteComment(commentId) {
    return (await axios.delete(`${endpoint}/comments/${commentId}`)).data;
  }

  return {
    createSessionComment,
    createMediaComment,
    getSessionComments,
    getMediaComments,
    updateComment,
    deleteComment,
  };
}

export default useCommentsAPI;
