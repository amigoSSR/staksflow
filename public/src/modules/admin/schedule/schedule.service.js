import { apiFetch } from '../../../common/utils/api.js';

export const scheduleService = {
  async getSchedules() {
    const res = await apiFetch('/api/community/schedules');
    if (!res) return [];
    const json = await res.json();
    return json.data || [];
  },
  
  async createSchedule(data) {
    const res = await apiFetch('/api/community/schedules', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res) return null;
    return await res.json();
  },

  async updateSchedule(id, data) {
    const res = await apiFetch(`/api/community/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res) return null;
    return await res.json();
  },

  async deleteSchedule(id) {
    const res = await apiFetch(`/api/community/schedules/${id}`, {
      method: 'DELETE'
    });
    if (!res) return null;
    return await res.json();
  }
};
