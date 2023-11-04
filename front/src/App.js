import logo from './logo.svg';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  return (
    // <MapContainer center={[31.95160, 35.93935]} zoom={13} style={{height:"400px", width:"400px"}}>
    //   <TileLayer
    //     url="https://(s).tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //   />
    // </MapContainer>
    <MapComponent />
  );
}

export default App;
