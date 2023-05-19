import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGl, { Marker } from 'react-map-gl';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

const TOKEN = "pk.eyJ1IjoiZGFueWxvdXNlciIsImEiOiJjbGhldTBwZ2MwMmJrM25wZnZwcWVzY2tlIn0.49-qNb8NGNF_8YZiT4RGYw";

const MyMap = ({ coordinates }) => {
  const [viewport, setViewport] = useState({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    zoom: 16
  });

  useEffect(() => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }));
  }, [coordinates]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactMapGl
        {...viewport}
        mapboxAccessToken={TOKEN}
        width="100%"
        height="100%"
        transitionDuration={200}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onViewportChange={setViewport}
      >
        {coordinates && (
          <Marker
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            offsetLeft={-3.5 * viewport.zoom}
            offsetTop={-7 * viewport.zoom}
          >
            <RoomOutlinedIcon style={{ fontSize: 7 * viewport.zoom, color: 'tomato', cursor: 'pointer' }} />
          </Marker>
        )}
      </ReactMapGl>
    </div>
  );
};

export default MyMap;
