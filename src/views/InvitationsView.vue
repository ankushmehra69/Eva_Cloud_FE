<template>
  <div>
    <div class="pt-3">
      <MobileHeader
        title="Invitations"
        description="See if you've been invited to join a department. Review and accept pending invitations below."
      />
      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      >
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <div
        class="md:bg-white rounded-2xl overflow-hidden space-y-3 md:space-y-0"
      >
        <div
          v-for="(invite, index) in invitations"
          :key="index"
          class="flex items-center justify-between md:!border-b md:py-5 p-4 md:px-6 bg-white rounded-2xl md:rounded-none border md:border-0 border-grey-200"
        >
          <div class="flex items-center">
            <!-- User Avatar -->
            <div
              class="hidden flex-shrink-0 w-12 h-12 bg-grey-400 rounded-full md:flex items-center justify-center text-lg font-bold text-grey-500 font-inter uppercase"
            >
              {{ invite.invited_by_user_name[0]
              }}{{ invite.invited_by_user_name[1] }}
            </div>

            <!-- Invitation Details -->
            <div class="md:ml-4">
              <p class="text-secondary font-light">
                You have been invited to join the department
                <span class="font-semibold capitalize">{{
                  invite.department_name
                }}</span>
                as a <span class="font-semibold">{{ invite.role }}</span
                >.
              </p>
              <p class="text-secondary font-light" v-if="invite.is_admin">
                You have also been assigned as an
                <span class="font-semibold">Admin</span>.
              </p>
              <p class="text-xs text-grey-100 md:my-2 font-light">
                Invited by {{ invite.invited_by_user_name }} on
                {{ new Date(invite.created_at).toLocaleDateString() }}
              </p>
              <div class="flex space-x-2 !mt-3">
                <button
                  class="btn btn-sm btn-primary !rounded-lg"
                  @click="acceptInvitation(invite.id)"
                >
                  Accept
                </button>
                <button
                  class="btn btn-sm btn-outline !rounded-lg"
                  @click="showConfirmModal(invite.id)"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
        </div>
      </div>
    </div>

    <!-- Decline Invitation Modal -->
    <DeleteModal
      v-if="isConfirmModalVisible"
      title="Are you sure you want to cancel this invitation?"
      @close="isConfirmModalVisible = false"
      @remove="confirmCancelInvitation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import backend from "@/backend";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import MobileHeader from "@/components/MobileHeader.vue";

const invitations = ref([]);
const errorMessage = ref("");
const isConfirmModalVisible = ref(false);
const selectedInvitationId = ref(null);

const showConfirmModal = (invitationId) => {
  selectedInvitationId.value = invitationId;
  isConfirmModalVisible.value = true;
};

const confirmCancelInvitation = async () => {
  try {
    await backend.invitations.deleteInvitation(selectedInvitationId.value);
    fetchInvitations(); // Refresh the list after canceling
    isConfirmModalVisible.value = false; // Close the modal
  } catch (error) {
    errorMessage.value = "Failed to cancel the invitation.";
  }
};

// Fetch the invitations for the logged-in user
const fetchInvitations = async () => {
  try {
    invitations.value = await backend.invitations.getInvitationsForUser();
  } catch (error) {
    errorMessage.value = "Failed to fetch invitations.";
  }
};

// Accept the invitation
const acceptInvitation = async (invitationId) => {
  try {
    await backend.invitations.acceptInvitation(invitationId);
    fetchInvitations(); // Refresh the list after accepting
  } catch (error) {
    errorMessage.value = "Failed to accept the invitation.";
  }
};

onMounted(fetchInvitations);
</script>
