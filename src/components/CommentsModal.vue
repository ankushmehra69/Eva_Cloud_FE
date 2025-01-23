<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-30 md:pl-44 bg-transparent bg-opacity-50 flex md:items-center pb-16 items-end justify-center"
    @click="handleOutsideClick"
  >
    <div
      class="bg-white md:p-6 p-4 md:rounded-2xl rounded-t-2xl w-full md:max-w-lg relative animate-fadeIn"
      ref="modalContent"
    >
      <!-- Close Button -->
      <div class="flex justify-end">
        <button
          @click="closeModal"
          class="md:-mt-3 md:-mr-3 text-3xl text-gray-600 hover:text-secondary transition transform hover:scale-110"
        >
          &times;
        </button>
      </div>
      <!-- <h2 class="text-2xl font-semibold text-gray-900 mb-6">Comments</h2> -->

      <!-- List of Comments (scrollable) -->
      <div
        v-if="comments?.length"
        class="mb-6 pr-3 -mr-4 space-y-5 max-h-80 overflow-y-auto"
      >
        <div
          v-for="comment in props.selectedCommentId
            ? comments.filter((c) => c.id === props.selectedCommentId)
            : comments"
          :key="comment.id"
          class="transition-all"
          :class="
            comment.id === parentCommentId
              ? 'bg-primary/10 hover:bg-primary/10 p-3 rounded-lg'
              : ''
          "
        >
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-3">
              <div
                class="size-10 flex items-center justify-center font-light text-sm bg-primary text-white rounded-full flex-shrink-0"
              >
                {{ comment.user_name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-secondary">
                  {{ comment.user_name }}
                </p>
                <p class="text-xs text-grey-100 leading-none font-light">
                  {{ formatDate(comment.updated_at) }}
                </p>
                <button
                  @click="replyToComment(comment.id)"
                  class="text-green-500 hover:text-green-600 font-medium text-xs"
                >
                  Reply
                </button>
              </div>
            </div>
            <div
              v-if="comment.can_edit || comment.can_delete"
              class="flex space-x-4"
            >
              <!-- <button
                v-if="comment.can_edit"
                @click="editComment(comment)"
                class="text-primary hover:text-blue-700 font-medium text-sm"
              >
                Edit
              </button> -->
              <button
                v-if="comment.can_delete"
                @click="deleteComment(comment.id)"
                class="text-secondary hover:text-danger"
              >
                <TrashIcon class="size-5" />
              </button>
            </div>
          </div>
          <p class="text-secondary text-sm leading-relaxed">
            {{ comment.content }}
          </p>

          <!-- Replies (if any) -->
          <div
            v-if="commentReplies[comment.id]?.length"
            class="ml-5 mt-4 border-l-2 border-gray-200"
          >
            <div
              v-for="reply in commentReplies[comment.id]"
              :key="reply.id"
              class="px-4 mb-3"
            >
              <div class="flex justify-between items-center mb-2">
                <div>
                  <p class="font-semibold text-secondary">
                    {{ reply.user_name }}
                  </p>
                  <p class="text-xs text-grey-100 leading-none font-light">
                    {{ formatDate(reply.updated_at) }}
                  </p>
                </div>
                <div
                  v-if="reply.can_edit || reply.can_delete"
                  class="flex space-x-4"
                >
                  <!-- <button
                    v-if="reply.can_edit"
                    @click="editComment(reply)"
                    class="text-primary hover:text-blue-700 font-medium text-sm"
                  >
                    Edit
                  </button> -->
                  <button
                    v-if="reply.can_delete"
                    @click="deleteComment(reply.id)"
                    class="text-secondary hover:text-danger"
                  >
                    <TrashIcon class="size-5" />
                  </button>
                </div>
              </div>
              <p class="text-gray-600">{{ reply.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-600 text-center">No comments yet.</p>

      <!-- Conditionally render the Add/Edit/Reply section -->
      <div
        class="mt-6 flex items-start gap-2"
        v-if="isEditing || parentCommentId || !props.selectedCommentId"
      >
        <div
          class="size-10 flex items-center justify-center font-light text-sm bg-primary text-white rounded-full flex-shrink-0"
        >
          {{ user.name.charAt(0) }}
        </div>
        <div class="relative w-full">
          <textarea
            v-model="newComment"
            class="w-full min-h-10 pl-4 pr-8 py-2.5 text-sm placeholder:text-secondary bg-grey-200 border border-grey-200 rounded-lg focus:outline-none focus:border-primary transition"
            rows="1"
            :placeholder="
              isEditing
                ? 'Update Comment'
                : parentCommentId
                ? 'Reply'
                : 'Add Comment'
            "
            @keydown.enter="
              $event.shiftKey
                ? null
                : ($event.preventDefault(), newComment && submitComment())
            "
          ></textarea>
          <button
            :disabled="!newComment"
            @click="submitComment"
            class="text-grey-100 hover:text-primary transition-all duration-150 absolute bottom-4 pb-0.5 right-2 disabled:hover:text-grey-100"
          >
            <PaperAirplaneIcon class="size-5 -rotate-45" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import backend from "@/backend";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/vue/24/outline";

// Props and event emitters
const props = defineProps({
  sessionId: {
    type: String,
    required: false,
  },
  mediaId: {
    type: Number,
    required: false,
  },
  selectedCommentId: {
    type: Number,
    required: false,
  },
  commentCoordinates: {
    required: false,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const user = ref({
  name: "",
});
onMounted(async () => {
  try {
    const response = await backend.users.getUser("self");
    user.value = { ...response };
  } catch (e) {
    error.value = "Failed to load profile data.";
  }
});

const emit = defineEmits(["close", "refresh"]);

// Data properties
const comments = ref([]);
const commentReplies = ref({});
const newComment = ref("");
const isEditing = ref(false);
const editingCommentId = ref(null);
const parentCommentId = ref(null);
const modalContent = ref(null);

// Fetch comments for the session or media and group replies
const fetchComments = async () => {
  try {
    let allComments;
    if (props.mediaId) {
      allComments = await backend.comments.getMediaComments(props.mediaId);
    } else if (props.sessionId) {
      allComments = await backend.comments.getSessionComments(props.sessionId);
    }

    // Ensure allComments is always an array
    const commentsArray = Array.isArray(allComments) ? allComments : [];

    // Filter out comments with no parent_comment_id for top-level comments
    comments.value = commentsArray.filter((c) => !c.parent_comment_id);

    // Group replies by parent_comment_id
    commentReplies.value = commentsArray.reduce((acc, comment) => {
      if (comment.parent_comment_id) {
        if (!acc[comment.parent_comment_id]) {
          acc[comment.parent_comment_id] = [];
        }
        acc[comment.parent_comment_id].push(comment);
      }
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to load comments", error);
  }
};

// Submit a new or updated comment
const submitComment = async () => {
  try {
    if (isEditing.value) {
      await backend.comments.updateComment(
        editingCommentId.value,
        newComment.value
      );
    } else {
      if (props.mediaId) {
        await backend.comments.createMediaComment(
          props.mediaId,
          newComment.value,
          parentCommentId.value,
          props.commentCoordinates
        );
      } else {
        await backend.comments.createSessionComment(
          props.sessionId,
          newComment.value,
          parentCommentId.value
        );
      }
    }
    newComment.value = "";
    isEditing.value = false;
    editingCommentId.value = null;
    parentCommentId.value = null;
    fetchComments(); // Reload comments after submission
  } catch (error) {
    console.error("Failed to submit comment", error);
  }

  emit("refresh");
};

// Edit an existing comment or reply
const editComment = (comment) => {
  isEditing.value = true;
  editingCommentId.value = comment.id;
  newComment.value = comment.content;
  parentCommentId.value = null; // Reset reply state
};

// Reply to a comment
const replyToComment = (commentId) => {
  parentCommentId.value = commentId;
  newComment.value = ""; // Clear the input for the reply
};

// Delete a comment or reply
const deleteComment = async (commentId) => {
  try {
    await backend.comments.deleteComment(commentId);
    fetchComments(); // Reload comments after deletion
  } catch (error) {
    console.error("Failed to delete comment", error);
  }

  emit("refresh");
};

// Close modal and reset state
const closeModal = () => {
  emit("close");
  isEditing.value = false;
  newComment.value = "";
  editingCommentId.value = null;
  parentCommentId.value = null;
};

// Handle clicks outside the modal content to close the modal
const handleOutsideClick = (event) => {
  if (modalContent.value && !modalContent.value.contains(event.target)) {
    closeModal();
  }
};

// Format the date to a more user-friendly format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// Fetch comments on component mount
onMounted(() => {
  fetchComments();
});

defineExpose({ fetchComments });
</script>

<style scoped>
/* Scrollable container for the comments */
.max-h-80 {
  max-height: 20rem;
}
.overflow-y-auto {
  overflow-y: auto;
}

/* Modal animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Custom scrollbar for the comment section */
.max-h-80 {
  max-height: 20rem;
}

.max-h-80::-webkit-scrollbar {
  width: 8px;
}

.max-h-80::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.max-h-80::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
