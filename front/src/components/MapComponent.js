// import React from 'react';
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';

function MapComponent() {
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState({
    lat: "",
    lan: "",
    name: "",
    note: "",
  });
  const [selectedMarker, setSelectedMarker] = useState({
    lat: "",
    lan: "",
    name: "",
    note: "",
  });
  const position = [31.95160, 35.93935];
  const [draggable, setDraggable] = useState(false);
  const toggleDraggable = () => {
    setDraggable((d) => !d);
  };
  const [movingposition, setMovingPosition] = useState(null);

  const eventHandlers = {
    dragend(event) {
      const latLng = event.target.getLatLng();
      setMovingPosition(latLng);
      setSelectedMarker((prevState) => ({
        ...prevState,
        lat: latLng.lat,
        lan: latLng.lng,
      }));
      console.log("slected markkkker");
      console.log(selectedMarker);
    }

  };

  useEffect(() => {
    axios.get("http://localhost:3500/marker").then((response) => {
      setMarkers(response.data.data);
      console.log('testeeeeeeeeeeeeee');
      console.log(response);
    });
  }, []);


  const customIcon = new Icon({
    iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST27k71woi81hDh5k79ST7KOtkVENfC35p78rPoUR315-3gcAhVtM4-hjmY9SG8Ttg9sE&usqp=CAU",
    iconSize: [38, 38]
  });

  const handleDeleteMarker = (id) => {
    console.log("delete id");
    console.log(id);
    // Send a DELETE request to your API to delete the marker by ID
    axios.delete(`http://localhost:3500/marker/${id}`)
      .then(() => {
        // Remove the deleted marker from the state
        setMarkers(markers.filter(marker => marker.ID !== id));
      })
      .catch(error => {
        console.error("Error deleting marker:", error);
      });
  };

  const handleSelectedMarker = (marker) => {
    setSelectedMarker({
      ID: marker.ID,
      lat: marker.lat,
      lan: marker.lan,
      name: marker.name,
      note: marker.note,
    });
  }


  const MapEvents = () => {
    useMapEvents({
      click(e) {

        console.log("lat" + e.latlng.lat);
        console.log("lan" + e.latlng.lng);
        const lat = e.latlng.lat;
        const lan = e.latlng.lng;
        setNewMarker({ ...newMarker, lat, lan });
      },
    });
    return false;
  }

  const handleAddMarker = async () => {
    if (newMarker.lat === "" || newMarker.lan === "") {
      alert("Please click on the map to set the latitude and longitude.");
      return;
    }

    try {
      // const { lat, lan, name, note } = newMarker;

      const response = await axios.post("http://localhost:3500/marker", newMarker);

      setMarkers([...markers, newMarker]);

      setNewMarker({ lat: "", lan: "", name: "", note: "" });
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  const handleUpdateMarker = async () => {
    try {
      console.log("t1t1t1t1t1t1t1t1t1t");
      console.log(selectedMarker);
      console.log(selectedMarker.ID);
      await axios.put(`http://localhost:3500/marker/${selectedMarker.ID}`, selectedMarker);

      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.ID === selectedMarker.ID ? selectedMarker : marker
        )
      );

      setSelectedMarker(null);
      setMovingPosition(null);

    } catch (error) {
      console.error("Error updating marker:", error);
    }
  }


  return (
    <div>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <MarkerClusterGroup chunkedLoading> */}
        {markers.map((marker) => (
          // marker.lat && marker.lan ? (
          <Marker key={marker.ID} position={
            movingposition
              ? movingposition
              : [marker.lat, marker.lan]
          } icon={customIcon}
            draggable={draggable}
            eventHandlers={eventHandlers}
          // eventHandlers={{
          //   click: () => handleSelectedMarker(marker),

          // }}

          >
            <Popup>
              <div>
                <p>Name: {marker.name}</p>
                <p>Note: {marker.note}</p>
                <button onClick={() => handleDeleteMarker(marker.ID)}>Delete</button>
                <button onClick={() => {
                  handleSelectedMarker(marker);
                  toggleDraggable();
                }}>Update</button>
              </div>
            </Popup>
          </Marker>
          // ) : null
        ))}
        {/* </MarkerClusterGroup> */}

        <MapEvents />
      </MapContainer><br></br><br></br>
      <div className="row">
        <div className="col border-end">
          <h3>Adding Marker</h3>
          <small style={{marginBottom:"20px"}}>Click on any place on the map to get the coordinates</small>
          <form className="mb-3">
            <div className="mb-3">
              <label htmlFor="latitude" className="form-label">Latitude</label>
              <input
                type="text"
                className="form-control"
                id="latitude"
                placeholder="Latitude"
                value={newMarker.lat}
                onChange={(e) => setNewMarker({ ...newMarker, lat: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="longitude" className="form-label">Longitude</label>
              <input
                type="text"
                className="form-control"
                id="longitude"
                placeholder="Longitude"
                value={newMarker.lan}
                onChange={(e) => setNewMarker({ ...newMarker, lan: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
                value={newMarker.name}
                onChange={(e) => setNewMarker({ ...newMarker, name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="note" className="form-label">Note</label>
              <input
                type="text"
                className="form-control"
                id="note"
                placeholder="Note"
                value={newMarker.note}
                onChange={(e) => setNewMarker({ ...newMarker, note: e.target.value })}
              />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleAddMarker}>Add Marker</button>
          </form>
        </div>

        <div className="col">
          <h3>Editing Marker</h3>
          <form className="mb-3">
            <div className="mb-3">
              <label htmlFor="selectedLatitude" className="form-label">Latitude</label>
              <input
                type="text"
                className="form-control"
                id="selectedLatitude"
                placeholder="Latitude"
                value={selectedMarker ? selectedMarker.lat : ""}
                onChange={(e) => setSelectedMarker({ ...selectedMarker, lat: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="selectedLongitude" className="form-label">Longitude</label>
              <input
                type="text"
                className="form-control"
                id="selectedLongitude"
                placeholder="Longitude"
                value={selectedMarker ? selectedMarker.lan : ""}
                onChange={(e) => setSelectedMarker({ ...selectedMarker, lan: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="selectedName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="selectedName"
                placeholder="Name"
                value={selectedMarker ? selectedMarker.name : ""}
                onChange={(e) => setSelectedMarker({ ...selectedMarker, name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="selectedNote" className="form-label">Note</label>
              <input
                type="text"
                className="form-control"
                id="selectedNote"
                placeholder="Note"
                value={selectedMarker ? selectedMarker.note : ""}
                onChange={(e) => setSelectedMarker({ ...selectedMarker, note: e.target.value })}
              />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleUpdateMarker}>Update Marker</button>
          </form>
        </div>

      </div>




    </div>

  );
}

export default MapComponent;
