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

  const evalscript = `
    //VERSION=3
    function setup() {
      return {
        input: ["B04", "B08", "dataMask"],
        output: [
          { id: "default", bands: 1 },
          { id: "dataMask", bands: 1 }
        ]
      };
    }
    function evaluatePixel(samples) {
      let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
      return {
        default: [ndvi],
        dataMask: [samples.dataMask]
      };
    }
  `;

  const payload = {
    input: {
      bounds: {
        geometry: polygon.geometry || polygon,
        properties: {
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        }
      },
      data: [
        {
          type: "sentinel-2-l2a",
          dataFilter: {
            timeRange: {
              from: `${dateFrom}T00:00:00Z`,
              to: `${dateTo}T23:59:59Z`
            },
            mosaickingOrder: "leastCC"
          }
        }
      ]
    },
    aggregation: {
      timeRange: {
        from: `${dateFrom}T00:00:00Z`,
        to: `${dateTo}T23:59:59Z`
      },
      aggregationInterval: {
        of: "P1M"
      },
      evalscript: evalscript
    }
  };

  try {
    console.log('--- SENTINEL HUB REQUEST START ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      'https://services.sentinel-hub.com/api/v1/statistics',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('--- SENTINEL HUB RESPONSE SUCCESS ---');

    if (!response.data || !response.data.data) {
      console.error('Empty data in response:', response.data);
      throw new Error('Sentinel Hub returned an empty dataset. Try a different area or date range.');
    }

    // Map the statistics to our chart format
    const stats = response.data.data.map((item: any) => {
      // Statistical API results usually have an output name
      // If we don't name it, it defaults to 'default' or the first available key
      const outputs = item.outputs || {};
      const output = outputs.default || Object.values(outputs)[0] as any;
      const meanValue = output?.bands?.B0?.stats?.mean;

      return {
        date: item.interval.from.split('T')[0],
        value: typeof meanValue === 'number' ? meanValue : null
      };
    }).filter((item: any) => item.value !== null && !isNaN(item.value));

    if (stats.length === 0) {
      console.warn('No valid NDVI values found in the response.');
    }

    return stats;

  } catch (error: any) {
    const errorData = error.response?.data;
    console.error('--- SENTINEL HUB ERROR ---');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(errorData, null, 2));

    // Construct a helpful error message
    let message = 'Failed to fetch NDVI data.';
    if (errorData?.error?.message) message += ` ${errorData.error.message}`;
    if (error.response?.status === 401) message = 'Authentication failed. Please check your Sentinel Hub credentials in .env.local.';
    if (error.response?.status === 403) message = 'Access denied. Your Sentinel Hub account might not have access to this data or region.';

    throw new Error(message);
  }
}
