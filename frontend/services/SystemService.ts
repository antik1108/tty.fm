const API_BASE = '/api';

export interface RawSystemStats {
  cpu: number;
  mem: string;
  time: string;
  uptime: string;
  platform: string;
  arch: string;
}

export const SystemService = {
  async getStats(): Promise<RawSystemStats> {
    const response = await fetch(`${API_BASE}/system/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch system stats: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
};
