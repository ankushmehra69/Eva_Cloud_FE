import axios from "axios";

function useDevicesAPI() {
  const endpoint = `${import.meta.env.VITE_HTTP_API_URL}api`;

  // Create a new device
  async function createDevice(android_id, name, linked_department_id) {
    const body = {
      android_id,
      name,
      linked_department_id,
    };

    return (await axios.post(`${endpoint}/devices`, body)).data;
  }

  // Get a specific device by ID
  async function getDevice(device_id) {
    return (await axios.get(`${endpoint}/devices/${device_id}`)).data;
  }

  // Update a device by ID
  async function updateDevice(device_id, name, linked_department_id) {
    const body = {
      name,
      linked_department_id,
    };

    return (await axios.patch(`${endpoint}/devices/${device_id}`, body)).data;
  }

  // Delete a device by ID
  async function deleteDevice(device_id) {
    return (await axios.delete(`${endpoint}/devices/${device_id}`)).data;
  }

  // Get all devices, optionally filtered by department ID and Android ID
  async function getDevices(
    department_id = null,
    limit = 10,
    offset = 0,
    android_id = null
  ) {
    const params = new URLSearchParams();
    if (department_id) {
      params.append("department_id", department_id);
    }
    if (android_id) {
      params.append("android_id", android_id);
    }
    params.append("limit", limit);
    params.append("offset", offset);

    return (await axios.get(`${endpoint}/devices?${params.toString()}`)).data;
  }

  // Get storage summary for all devices linked to the user
  async function getStorage() {
    return (await axios.get(`${endpoint}/storage`)).data;
  }

  return {
    createDevice,
    getDevice,
    updateDevice,
    deleteDevice,
    getDevices,
    getStorage,
  };
}

export default useDevicesAPI;
