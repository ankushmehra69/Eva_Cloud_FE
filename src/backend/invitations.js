import axios from "axios";

function useInvitationsAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}/api`;

  // Fetch invitations for a department
  async function getInvitationsForDepartment(department_id) {
    return (
      await axios.get(`${endpoint}/departments/${department_id}/invitations`)
    ).data;
  }

  // Create a new invitation
  async function createInvitation(
    department_id,
    email,
    role,
    is_admin = false
  ) {
    const body = {
      email,
      role,
      is_admin,
    };
    return (
      await axios.post(
        `${endpoint}/departments/${department_id}/invitations`,
        body
      )
    ).data;
  }

  // Delete an invitation
  async function deleteInvitation(invite_id) {
    return (await axios.delete(`${endpoint}/invitations/${invite_id}`)).data;
  }

  // Accept an invitation
  async function acceptInvitation(invite_id) {
    return (await axios.post(`${endpoint}/invitations/${invite_id}/accept`))
      .data;
  }

  // Fetch invitations for the logged-in user
  async function getInvitationsForUser() {
    return (await axios.get(`${endpoint}/invitations`)).data;
  }

  return {
    getInvitationsForDepartment,
    createInvitation,
    deleteInvitation,
    acceptInvitation,
    getInvitationsForUser,
  };
}

export default useInvitationsAPI;
