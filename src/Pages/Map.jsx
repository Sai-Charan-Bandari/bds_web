import React from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_AT

// function Map({coords, destCoords}) {
function Map() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [coords, setCoords] = useState([77.664493, 12.8537078]);
    const [destCoords, setDestCoords] = useState([77.685, 12.85]);
    const [zoom, setZoom] = useState(9);
    const [routeDirections, setRouteDirections] = useState(null);
    const [loading, setLoading] = useState(false);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);

    function makeRouterFeature(coordinates) {
        let routerFeature = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
            },
          ],
        };
        return routerFeature;
      }

    async function createRouterLine(routeProfile) {
        setLoading(true)
        console.log("fetching router line")
        const startCoords = `${coords[0]},${coords[1]}`;
        const endCoords = `${destCoords[0]},${destCoords[1]}`;
        // const endCoords = `${destinationCoords}`;
        const geometries = 'geojson';
        const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${import.meta.env.VITE_MAPBOX_AT}`;
        try {
            let response = await fetch(url);
            let json = await response.json();
            setDistance((json.routes[0].distance / 1000).toFixed(2));
            setDuration((json.routes[0].duration / 3600).toFixed(2));
            let coordinates = json['routes'][0]['geometry']['coordinates'];
            if (coordinates.length) {
                const routerFeature = makeRouterFeature([...coordinates]);
                setRouteDirections(routerFeature);
            }
            setLoading(false);
            console.log("fetched router line")
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    useEffect(() => {
        if (mapRef.current) return; // initialize map only once
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coords,
            zoom: zoom
        });

        mapRef.current.on('mousemove', (e) => {
                // `e.point` is the x, y coordinates of the `mousemove` event
                // relative to the top-left corner of the map.
                // `e.lngLat` is the longitude, latitude geographical position of the event.
                console.log(JSON.stringify(e.point),JSON.stringify(e.lngLat.wrap()));
                let c = e.lngLat.wrap()
                setDestCoords([c.lng,c.lat])
        });
    

        // mapRef.current.on('move', () => {
        //     setLng(mapRef.current.getCenter().coords[0].toFixed(4));
        //     setLat(mapRef.current.getCenter().coords[1].toFixed(4));
        //     setZoom(mapRef.current.getZoom().toFixed(2));
        //   });

        new mapboxgl.Marker().setLngLat(coords).addTo(mapRef.current)
        new mapboxgl.Marker({ color: 'red' }).setLngLat(destCoords).addTo(mapRef.current)

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");


        // Clean up on unmount
        return () => mapRef.current.remove();
    });

useEffect(()=>{
    if(destCoords && mapRef){
        // createRouterLine('driving');
    }
},[destCoords])

    return (
        <div>
            <div className="sidebar">
                Longitude: {coords[0]} | Latitude: {coords[1]} | Zoom: {zoom} | {distance && distance} | {duration && duration}
            </div>
            {routeDirections && (
                <div>
                     {/* <MapboxGL.ShapeSource id="line1" shape={routeDirections}>
            <MapboxGL.LineLayer
              id="routerLine01"
              style={{
                lineColor: '#FA9E14',
                lineWidth: 4,
              }}
            />
          </MapboxGL.ShapeSource> */}
                </div>
        )}
            <div ref={mapContainer} className="map-container" />
            {loading && (
        <div>loading</div>
      )}
        </div>
    );
}

export default Map