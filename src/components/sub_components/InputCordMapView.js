import React,{Component} from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
const MapView = withScriptjs(withGoogleMap(props =>{
      return <GoogleMap
        defaultZoom={18}
        defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
        center={props.location ? {lat : props.location.latitude, lng : props.location.longitude} : undefined}
        position={props.location}
        onDragEnd={function getPosition(){
          props.currentLocation(
              {
                latitude : this.center.lat(),
                longitude : this.center.lng()
              }
          );
        }}
      >
        {props.location && <Marker
              key={423}
              draggable
              icon={"dot-small.png"}
              position={{lat : props.location.latitude,lng : props.location.longitude}}
              onMouseUp={(data) => {
                if (data.latLng.lat() && data.latLng.lng()) {
                  props.currentLocation(
                      {
                        latitude : data.latLng.lat(),
                        longitude : data.latLng.lng()
                      }
                  );
                }
              }}
            />}
      </GoogleMap>}
));

class InputMapView extends Component {
  render() {
    return (
        <div>
        <MapView
          center={this.props.location}
          location={this.props.location}
          currentLocation={this.props.currentLocation}
          containerElement={<div style={{ height: `400px`}} />}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBU2YQ1BoJfjnXpyXr2AQBZlvYq7HjW42k"
          loadingElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <p style={{textAlign : "center"}}>Adjust you location accordingly by moving the marker</p>
        </div>
    )
  }
}

export default InputMapView;
