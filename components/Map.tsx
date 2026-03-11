'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for Leaflet default icon issues in Next.js
const fixLeafletIcon = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

interface MapProps {
    center?: [number, number];
    zoom?: number;
    onPolygonCreated?: (geojson: any) => void;
    ndviLayerUrl?: string;
}

export default function Map({
    center = [51.505, -0.09],
    zoom = 13,
    onPolygonCreated,
    ndviLayerUrl
}: MapProps) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            fixLeafletIcon();
        }
    }, []);

    if (typeof window === 'undefined') {
        return <div className="h-[500px] w-full bg-slate-50 animate-pulse rounded-xl" />;
    }

    const _onCreated = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const geojson = layer.toGeoJSON();
            if (onPolygonCreated) onPolygonCreated(geojson);
        }
    };

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <MapContainer
                key={typeof window !== 'undefined' ? 'map-initialized' : 'map-loading'}
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full"
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {ndviLayerUrl && (
                    <TileLayer
                        url={ndviLayerUrl}
                        opacity={0.7}
                        attribution="Sentinel Hub"
                    />
                )}

                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={_onCreated}
                        draw={{
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: false,
                        }}
                    />
                </FeatureGroup>
            </MapContainer>
        </div>
    );
}
