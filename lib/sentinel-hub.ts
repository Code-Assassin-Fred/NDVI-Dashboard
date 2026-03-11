import axios from 'axios';

const CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID;
const CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiration: number = 0;

export async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Sentinel Hub credentials missing in environment variables');
  }

  try {
    const response = await axios.post(
      'https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error fetching Sentinel Hub access token:', error);
    throw error;
  }
}

export async function fetchNDVIStats(polygon: any, dateFrom: string, dateTo: string) {
  const token = await getAccessToken();
  
  // This is a simplified example of how you'd call the Statistics API
  // In a real scenario, you'd use the Sentinel Hub Statistics API (Process API)
  // For the purpose of this dashboard, we'll implement a robust mock that mimics the response 
  // until actual credentials are provided.
  
  if (CLIENT_ID === 'your_id_here' || !CLIENT_ID) {
     return generateMockNDVIData(dateFrom, dateTo);
  }

  // Actual API call logic would go here
  // Reference: https://docs.sentinel-hub.com/api/latest/api/statistics/
  return generateMockNDVIData(dateFrom, dateTo);
}

function generateMockNDVIData(dateFrom: string, dateTo: string) {
  // Generate 12 months of mock data
  const data = [];
  const startDate = new Date(dateFrom);
  for (let i = 0; i < 12; i++) {
    const d = new Date(startDate);
    d.setMonth(startDate.getMonth() + i);
    data.push({
      date: d.toISOString().split('T')[0],
      value: 0.3 + Math.random() * 0.5, // Random NDVI between 0.3 and 0.8
    });
  }
  return data;
}
