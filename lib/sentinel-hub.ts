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

export async function fetchStats(
  polygon: any,
  dateFrom: string,
  dateTo: string,
  dataSource: 'optical' | 'radar' = 'optical'
) {
  const token = await getAccessToken();

  let evalscript = '';
  let dataFilterType = '';
  let dataFilterConditions = {};

  if (dataSource === 'optical') {
    dataFilterType = 'sentinel-2-l2a';
    dataFilterConditions = { mosaickingOrder: 'leastCC' };
    evalscript = `
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
  } else {
    // Radar NDVInc implementation based on typical VV/VH ratios
    dataFilterType = 'sentinel-1-grd';
    dataFilterConditions = {
      acquisitionMode: 'IW',
      polarization: 'DV',
      resolution: 'HIGH',
      orbitDirection: 'DESCENDING'
    };
    evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: ["VV", "VH", "dataMask"],
          output: [
            { id: "default", bands: 1 },
            { id: "dataMask", bands: 1 }
          ]
        };
      }
      function evaluatePixel(samples) {
        // Simple synthetic NDVI proxy using Radar (RVI / VH/VV ratios modified)
        // Note: Real NDVInc uses trained models, this is a prototype index mapping.
        let vv = samples.VV;
        let vh = samples.VH;
        
        let ndvinc = Math.max(0, Math.min(1, (vh - vv) / (vh + vv) + 0.3));
        return {
          default: [ndvinc],
          dataMask: [samples.dataMask]
        };
      }
    `;
  }

  const coords = polygon.geometry ? polygon.geometry.coordinates[0] : polygon.coordinates[0];
  let minX = 180, maxX = -180, minY = 90, maxY = -90;
  coords.forEach((coord: number[]) => {
    minX = Math.min(minX, coord[0]);
    maxX = Math.max(maxX, coord[0]);
    minY = Math.min(minY, coord[1]);
    maxY = Math.max(maxY, coord[1]);
  });
  const maxDim = Math.max(maxX - minX, maxY - minY);
  let res = Math.max(0.0001, maxDim / 500);
  if (res > 0.01) res = 0.01;

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
          type: dataFilterType,
          dataFilter: {
            timeRange: {
              from: `${dateFrom}T00:00:00Z`,
              to: `${dateTo}T23:59:59Z`
            },
            ...dataFilterConditions
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
        of: "P1M" // Monthly for chart aggregation
      },
      resx: res,
      resy: res,
      evalscript: evalscript
    }
  };

  try {
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

    if (!response.data || !response.data.data) {
      throw new Error('Sentinel Hub returned an empty dataset.');
    }

    const stats = response.data.data.map((item: any) => {
      const outputs = item.outputs || {};
      const output = outputs.default || Object.values(outputs)[0] as any;
      const meanValue = output?.bands?.B0?.stats?.mean;

      return {
        date: item.interval.from.split('T')[0],
        value: typeof meanValue === 'number' ? meanValue : null
      };
    }).filter((item: any) => item.value !== null && !isNaN(item.value));

    return stats;

  } catch (error: any) {
    let message = 'Failed to fetch data.';
    if (error.response?.data?.error?.message) message += ` ${error.response.data.error.message}`;
    throw new Error(message);
  }
}

export async function getProcessUrl(
  polygon: any,
  dateFrom: string,
  dateTo: string,
  dataSource: 'optical' | 'radar',
  layerType: 'trueColor' | 'index'
) {
  const token = await getAccessToken();

  let evalscript = '';
  let dataFilterType = '';
  let dataFilterConditions = {};

  if (dataSource === 'optical') {
    dataFilterType = 'sentinel-2-l2a';
    dataFilterConditions = { mosaickingOrder: 'leastCC' };

    if (layerType === 'trueColor') {
      evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["B02", "B03", "B04", "dataMask"],
            output: { id: "default", bands: 4 }
          };
        }
        function evaluatePixel(sample) {
          return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02, sample.dataMask];
        }
      `;
    } else {
      evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "dataMask"],
            output: { id: "default", bands: 4 }
          };
        }
        const cmap = [
          [-0.2, 0x000000], [0, 0xa50026], [0.1, 0xd73027], [0.2, 0xf46d43], [0.3, 0xfdae61],
          [0.4, 0xfee08b], [0.5, 0xffffbf], [0.6, 0xd9ef8b], [0.7, 0xa6d96a], [0.8, 0x66bd63],
          [0.9, 0x1a9850], [1.0, 0x006837]
        ];
        const visualizer = new ColorRampVisualizer(cmap);

        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
          let rgb = visualizer.process(ndvi);
          return [...rgb, sample.dataMask];
        }
      `;
    }
  } else {
    dataFilterType = 'sentinel-1-grd';
    dataFilterConditions = {
      acquisitionMode: 'IW',
      polarization: 'DV',
      resolution: 'HIGH',
      orbitDirection: 'DESCENDING'
    };

    if (layerType === 'trueColor') {
      evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["VV", "VH", "dataMask"],
            output: { id: "default", bands: 4 }
          };
        }
        function evaluatePixel(samples) {
          const vv = samples.VV;
          const vh = samples.VH;
          const ratio = Math.max(0, Math.min(1, vh / vv));
          return [vv * 2.0, vh * 2.0, ratio, samples.dataMask];
        }
      `;
    } else {
      evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["VV", "VH", "dataMask"],
            output: { id: "default", bands: 4 }
          };
        }
        const cmap = [
          [0, 0xa50026], [0.2, 0xf46d43], [0.4, 0xfee08b],
          [0.6, 0xd9ef8b], [0.8, 0x66bd63], [1.0, 0x006837]
        ];
        const visualizer = new ColorRampVisualizer(cmap);
        
        function evaluatePixel(samples) {
          let vv = samples.VV;
          let vh = samples.VH;
          let ndvinc = Math.max(0, Math.min(1, (vh - vv) / (vh + vv) + 0.3));
          let rgb = visualizer.process(ndvinc);
          return [...rgb, samples.dataMask];
        }
      `;
    }
  }

  const payload = {
    input: {
      bounds: {
        geometry: polygon.geometry || polygon,
        properties: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" }
      },
      data: [
        {
          type: dataFilterType,
          dataFilter: {
            timeRange: {
              from: `${dateFrom}T00:00:00Z`,
              to: `${dateTo}T23:59:59Z`
            },
            ...dataFilterConditions
          }
        }
      ]
    },
    output: {
      width: 512,
      height: 512,
      responses: [
        {
          identifier: "default",
          format: { type: "image/png" }
        }
      ]
    },
    evalscript: evalscript
  };

  try {
    const response = await axios.post(
      'https://services.sentinel-hub.com/api/v1/process',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'image/png'
        },
        responseType: 'arraybuffer'
      }
    );

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error: any) {
    console.error('Process API error', error.response?.data?.toString());
    throw new Error('Failed to generate image');
  }
}
