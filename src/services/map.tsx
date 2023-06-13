import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

const Map = () => {
  const initialPosition = { lat: -15.7916087, lng: -47.8830865 };

  const mapPinIcon = L.icon({
    iconUrl: "/images/pinMap.png",
    iconSize: [150, 150],
    iconAnchor: [80, 120],
    popupAnchor: [0, 10],
  });

  return (
    <MapContainer
      center={initialPosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX}`}
      />
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      <Marker icon={mapPinIcon} position={initialPosition}>
        <Popup>CENTRO MÉDICO E DE IMPLANTES COMUNITÁRIOS</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
