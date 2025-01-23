<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center overflow-y-auto"
    @click="handleOutsideClick"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 sm:mx-auto relative animate-fadeIn"
      ref="modalContent"
    >
      <div
        class="px-6 pt-6 pb-4 border-b border-gray-200 text-center sticky top-0 bg-white z-10 rounded-t-lg"
      >
        <h2 class="text-2xl font-bold text-gray-800">
          Session Report Details
        </h2>
        <p v-if="feedbackMessage" class="text-sm mt-2 text-green-600 font-medium">
          {{ feedbackMessage }}
        </p>
        <p v-if="errorMessage" class="text-sm mt-2 text-red-600 font-medium">
          {{ errorMessage }}
        </p>
      </div>
      <div class="px-6 py-4">
        <button
          @click="
            showTemplateEditor = true;
            fetchReportTemplate();
          "
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out w-full font-medium"
        >
          Edit Department Report Template
        </button>
      </div>
      <div class="px-6 py-4 max-h-[60vh] overflow-y-auto">
        <form @submit.prevent="updateSessionReport" class="space-y-6">
          <div
            v-for="field in reportFields"
            :key="field.name"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start"
          >
            <label
              :for="field.name"
              class="block text-sm font-medium text-gray-700 sm:mt-1"
            >
              {{ field.label }}
            </label>
            <div v-if="field.isLong" class="sm:col-span-2">
              <textarea
                v-model="reportData[field.name]"
                :id="field.name"
                rows="3"
                class="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
              ></textarea>
            </div>
            <div v-else>
              <input
                v-model="reportData[field.name]"
                :id="field.name"
                type="text"
                class="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
              />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Media Files
          </h3>
          <div
            v-for="media in mediaList"
            :key="media.media_id"
            class="border border-gray-200 rounded-md p-4 mb-4"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                v-if="media.thumbnailUrl"
                :src="media.thumbnailUrl"
                alt="Media Thumbnail"
                class="w-24 h-auto rounded-md shadow-sm"
              />
              <div class="flex-1 space-y-2 w-full">
                <input
                  v-model="media.description"
                  placeholder="Description"
                  class="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                />
                <div class="flex space-x-2">
                  <button
                    @click="
                      updateMediaDescription(media.media_id, media.description)
                    "
                    class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex-grow sm:flex-grow-0"
                  >
                    Update
                  </button>
                  <button
                    @click="removeMedia(media.media_id)"
                    class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out flex-grow sm:flex-grow-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="showMediaSelectionModal = true"
            class="bg-primary text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 transition w-full"
          >
            + Add Media
          </button>
        </form>
      </div>
      <div
        class="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end space-x-2 z-10 rounded-b-lg"
      >
        <button
          type="button"
          @click="close"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out font-medium"
          @click="updateSessionReport"
        >
          Save
        </button>
        <button
          type="button"
          @click="generateReport"
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out font-medium"
        >
          Generate Report
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="showTemplateEditor"
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 sm:mx-auto p-6 relative"
    >
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">
        Edit Department-Wide Report Template
      </h2>
      <textarea
        v-model="reportTemplate"
        rows="10"
        class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
      ></textarea>
      <p class="text-sm text-gray-600 mt-2 italic">
        *This template is department-wide and will affect all session
        reports in this department.
      </p>
      <div class="flex justify-end mt-4 space-x-2">
        <button
          @click="showTemplateEditor = false"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out font-medium"
        >
          Cancel
        </button>
        <button
          @click="resetToDefaultTemplate"
          class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out font-medium"
        >
          Reset to Default Template
        </button>
        <button
          @click="saveTemplate"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out font-medium"
        >
          Save Template
        </button>
      </div>
    </div>
  </div>
</template>




  
  <script setup>
  import { ref, watch } from "vue";
  import backend from "@/backend";
  import MediaSelectionModal from "@/components/MediaSelectionModal.vue";
  
  const props = defineProps({
    sessionId: {
      type: String,
      required: true,
    },
    departmentId: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(["close", "updated"]);
  
  const reportData = ref({});
  const feedbackMessage = ref("");
  const errorMessage = ref("");
  const mediaList = ref([]);
  const modalContent = ref(null);
  const showMediaSelectionModal = ref(false);
  const showTemplateEditor = ref(false);
  const reportTemplate = ref("");
  
  const reportFields = [
    { name: "patient_name", label: "Patient Name" },
    { name: "patient_dob", label: "Date of Birth" },
    { name: "patient_sex", label: "Sex" },
    { name: "medical_record_number", label: "Medical Record Number" },
    { name: "patient_number", label: "Patient Number" },
    { name: "title", label: "Title" },
    { name: "collected_date", label: "Collected Date" },
    { name: "received_date", label: "Received Date" },
    { name: "reported_date", label: "Reported Date" },
    { name: "diagnosis", label: "Diagnosis", isLong: true },
    { name: "notes", label: "Notes", isLong: true },
    { name: "clinical_history", label: "Clinical History", isLong: true },
    { name: "surgical_details", label: "Surgical Details", isLong: true },
    { name: "type_of_biopsy", label: "Type of Biopsy" },
    { name: "gross_description", label: "Gross Description", isLong: true },
    { name: "microscopic_findings", label: "Microscopic Findings", isLong: true },
    { name: "pathologist_name", label: "Pathologist Name" },
    { name: "chief_pathologist_name", label: "Chief Pathologist Name" },
    { name: "referred_by_name", label: "Referred By" },
  ];
  
  // Function to get the default template
  const getDefaultTemplate = () => {
    return `
  <html>
  <head>
    <title>Session Report</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        padding: 20px; 
        max-width: 800px; 
        margin: auto; 
        color: #333;
        line-height: 1.6;
      }
      h1 { 
        text-align: center; 
        color: #003366; 
        font-size: 2em; 
        margin-bottom: 5px; 
      }
      h2 { 
        text-align: center; 
        color: #555; 
        font-size: 1.5em; 
        margin-bottom: 20px; 
        border-bottom: 1px solid #ddd; 
        padding-bottom: 5px;
      }
      h3 { 
        color: #003366; 
        font-size: 1.2em; 
        margin-bottom: 10px; 
        border-left: 4px solid #003366; 
        padding-left: 8px; 
      }
      .header, .footer { 
        text-align: center; 
        font-size: 0.9em; 
        color: #666; 
      }
      .section { 
        margin-bottom: 20px; 
      }
      .field-label { 
        font-weight: bold; 
        color: #555; 
      }
      .content-section { 
        margin: 10px 0; 
        padding: 10px 15px; 
        border: 1px solid #eee; 
        border-radius: 5px; 
        background-color: #f9f9f9;
      }
      .content-heading { 
        font-weight: bold; 
        color: #003366; 
        margin-top: 10px;
      }
      .media-container { 
        display: flex; 
        flex-wrap: wrap; 
        gap: 15px; 
        margin-top: 10px; 
        justify-content: center;
      }
      .media-item { 
        width: 120px; 
        text-align: center; 
        font-size: 0.9em; 
      }
      .media-item img { 
        width: 100%; 
        border-radius: 5px; 
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
        margin-bottom: 5px;
      }
      .signature { 
        display: flex; 
        justify-content: space-between; 
        margin-top: 40px; 
        font-weight: bold; 
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
    </style>
  </head>
  <body>
    <!-- Report Header -->
    <div class="header">
      <h1>YOUR CLINIC NAME</h1>
      <p>Your clinic address line 1, City, Zip</p>
      <p><strong>Dr. Firstname Lastname, Degree</strong> &nbsp;|&nbsp; <strong>Dr. Another Name, Degree</strong></p>
    </div>
  
    <!-- Report Title -->
    <h2>{{title}}</h2>
  
    <!-- Patient Information -->
    <div class="section">
      <h3>Patient Information</h3>
      <p><span class="field-label">Name:</span> {{patient_name}}</p>
      <p><span class="field-label">Date of Birth:</span> {{patient_dob}}</p>
      <p><span class="field-label">Sex:</span> {{patient_sex}}</p>
      <p><span class="field-label">Medical Record Number:</span> {{medical_record_number}}</p>
      <p><span class="field-label">Patient Number:</span> {{patient_number}}</p>
      <p><span class="field-label">Referred By:</span> {{referred_by_name}}</p>
    </div>
  
    <!-- Report Dates -->
    <div class="section">
      <h3>Report Dates</h3>
      <p><span class="field-label">Collected Date:</span> {{collected_date}}</p>
      <p><span class="field-label">Received Date:</span> {{received_date}}</p>
      <p><span class="field-label">Reported Date:</span> {{reported_date}}</p>
    </div>
  
    <!-- Clinical Information -->
    <div class="section">
      <h3>Clinical Information</h3>
      <div class="content-section">
        <p class="content-heading">Clinical History</p>
        <p>{{clinical_history}}</p>
      </div>
      <div class="content-section">
        <p class="content-heading">Surgical Details</p>
        <p>{{surgical_details}}</p>
      </div>
      <p><span class="field-label">Type of Biopsy:</span> {{type_of_biopsy}}</p>
    </div>
  
    <!-- Pathology Findings -->
    <div class="section">
      <h3>Pathology Findings</h3>
      <div class="content-section">
        <p class="content-heading">Gross Description</p>
        <p>{{gross_description}}</p>
      </div>
      <div class="content-section">
        <p class="content-heading">Microscopic Findings</p>
        <p>{{microscopic_findings}}</p>
      </div>
    </div>
  
    <!-- Diagnosis and Notes -->
    <div class="section">
      <h3>Diagnosis and Notes</h3>
      <div class="content-section">
        <p class="content-heading">Diagnosis</p>
        <p>{{diagnosis}}</p>
      </div>
      <div class="content-section">
        <p class="content-heading">Notes to the Clinician</p>
        <p>{{notes}}</p>
      </div>
    </div>
  
    <!-- Media Files Section -->
    <div class="section">
      <h3>Attached Media Files</h3>
      <div class="media-container">
        {{#mediaList}}
        <div class="media-item">
          <img src="{{thumbnailUrl}}" alt="Media Thumbnail" />
          <p>{{description}}</p>
        </div>
        {{/mediaList}}
      </div>
    </div>
  
    <!-- Signatures -->
    <div class="signature">
      <div>Pathologist: {{pathologist_name}}</div>
      <div>Chief Pathologist: {{chief_pathologist_name}}</div>
    </div>
  
    <!-- Footer with Contact Information -->
    <div class="footer">
      <p>Contact Number: [Your Contact Number] &nbsp;|&nbsp; Email: [Your Email Address]</p>
    </div>
  </body>
  </html>
    `;
  };
  
  // Fetch department report template
  const fetchReportTemplate = async () => {
    try {
      const department = await backend.departments.getDepartment(
        props.departmentId
      );
      if (!department.report_template) {
        // Set to default template
        reportTemplate.value = getDefaultTemplate();
        // Save it to the department using update
        await backend.departments.updateDepartment(props.departmentId, {
          report_template: reportTemplate.value,
        });
      } else {
        reportTemplate.value = department.report_template;
      }
    } catch (error) {
      errorMessage.value = "Failed to load report template.";
    }
  };
  
  // Reset to default template
  const resetToDefaultTemplate = () => {
    reportTemplate.value = getDefaultTemplate();
  };
  
  // Save report template
  const saveTemplate = async () => {
    try {
      // Update the department with the new report template
      await backend.departments.updateDepartment(props.departmentId, {
        report_template: reportTemplate.value,
      });
  
      feedbackMessage.value = "Report template saved successfully!";
      showTemplateEditor.value = false; // Close the template editor
    } catch (error) {
      errorMessage.value = "Failed to save report template.";
    }
  };
  
  const fetchReportData = async () => {
    try {
      const report = await backend.session_report.getSessionReport(
        props.sessionId
      );
      reportData.value = report;
      await fetchMediaList(); // Ensure this only runs once when report data is fetched
    } catch (error) {
      errorMessage.value = "Failed to load session report details.";
    }
  };
  
  const fetchMediaList = async () => {
    try {
      const media = await backend.session_report_media.getMediaForSessionReport(
        reportData.value.id
      );
      mediaList.value = media.map((item) => ({
        media_id: item.media_id,
        description: item.description,
        thumbnailUrl: null, // Will be lazy-loaded
      }));
      loadThumbnails();
    } catch (error) {
      errorMessage.value = "Failed to load media files.";
    }
  };
  
  const loadThumbnails = async () => {
    for (const media of mediaList.value) {
      if (!media.thumbnailUrl) {
        const url = (await backend.media.getMedia(media.media_id))?.url;
        media.thumbnailUrl = url;
      }
    }
  };
  
  const updateMediaDescription = async (mediaId, description) => {
    try {
      await backend.session_report_media.updateMediaDescriptionForSessionReport(
        props.sessionId,
        mediaId,
        description
      );
      feedbackMessage.value = "Description updated successfully!";
    } catch (error) {
      errorMessage.value = "Failed to update description.";
    }
  };
  
  const removeMedia = async (mediaId) => {
    try {
      await backend.session_report_media.removeMediaFromSessionReport(
        props.sessionId,
        mediaId
      );
      mediaList.value = mediaList.value.filter(
        (media) => media.media_id !== mediaId
      );
      feedbackMessage.value = "Media removed successfully!";
    } catch (error) {
      errorMessage.value = "Failed to remove media.";
    }
  };
  
  const updateSessionReport = async () => {
    try {
      await backend.session_report.updateSessionReport(
        props.sessionId,
        reportData.value
      );
      feedbackMessage.value = "Session report updated successfully!";
      emit("updated");
    } catch (error) {
      errorMessage.value = "Failed to update session report.";
    }
  };
  
  const handleMediaAdded = ({ mediaId, description }) => {
    mediaList.value.push({ media_id: mediaId, description, thumbnailUrl: null });
    loadThumbnails(); // Load thumbnail for the new media
    showMediaSelectionModal.value = false;
  };
  
  const close = () => {
    emit("close");
    feedbackMessage.value = ""; // Clear feedback message on close
  };
  
  const handleOutsideClick = (event) => {
    if (modalContent.value && !modalContent.value.contains(event.target)) {
      close();
    }
  };
  
  // Enhanced template processor
  const processTemplate = (template, data) => {
    // Process arrays
    template = template.replace(
      /{{#(\w+)}}([\s\S]*?){{\/\1}}/g,
      (match, arrayName, innerTemplate) => {
        const items = data[arrayName];
        if (Array.isArray(items)) {
          return items
            .map((item) => {
              // Replace each placeholder within the array item context
              return innerTemplate.replace(
                /{{(\w+)}}/g,
                (m, key) => item[key] || "[missing data]"
              );
            })
            .join("");
        } else {
          return ""; // If not an array, return empty
        }
      }
    );
  
    // Replace single-value placeholders
    template = template.replace(/{{(\w+)}}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : "[missing data]";
    });
  
    return template;
  };
  
  const generateReport = async () => {
    await fetchReportTemplate();
    const data = { ...reportData.value, mediaList: mediaList.value };
    const reportContent = processTemplate(reportTemplate.value, data);
  
    // Open a new tab for the report content
    const reportWindow = window.open("", "_blank");
    if (
      !reportWindow ||
      reportWindow.closed ||
      typeof reportWindow.closed === "undefined"
    ) {
      errorMessage.value =
        "Popup blocker is preventing the report from being generated. Please allow popups for this site.";
      return;
    }
  
    reportWindow.document.open();
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  
    // Ensure the new window focuses after content loads
    reportWindow.focus();
  };
  
  // Remove onMounted and rely solely on watch with immediate: true
  watch(() => props.sessionId, fetchReportData, { immediate: true });
  </script>
  
  <style scoped>
  @media (min-width: 768px) {
    .modal-content {
      width: 70%;
    }
  }
  
  @media (min-width: 1024px) {
    .modal-content {
      width: 60%;
    }
  }
  </style>
  