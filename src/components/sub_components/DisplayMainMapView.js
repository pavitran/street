import React,{Component} from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
const MapView = withScriptjs(withGoogleMap(props =>{
      return <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 17.6868, lng: 83.2185 }}
        onBoundsChanged={function functionName(bounds) {
          props.setBounds(this.getBounds());
          props.setBoundSwitch(true);
        }}
      >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={60}
          defaultTitle="apples"
          onClusteringEnd={function functionName(end){
            //props.setUnClusteredMarker().some([{"a": 1}, {"b": 2}], {"b": 2})
            if(props.bound_switch){
              var other_markers_count = 0;
              var visible_markers = [];
              var clusters = this.getClusters();
              clusters.forEach(function(cluster) {
                if (cluster.getMarkers().length <= 1) {
                  var current_marker = {
                    latitude : cluster.getMarkers()[0].getPosition().lat(),
                    longitude : cluster.getMarkers()[0].getPosition().lng()
                  }
                  visible_markers.push(current_marker);
                }else{
                  other_markers_count += cluster.getMarkers().length;
                }
              });
              props.setUnClusteredMarker({
                other_markers_count : other_markers_count,
                visible_markers : visible_markers
              })
              props.setBoundSwitch(false);
            }else{
            }
          }}
        >
          {props.markers ? props.markers.map((marker,index) => (
            <Marker
              key={index}
              position={{ lat: marker.location.latitude, lng: marker.location.longitude }}
              data={marker}
              onClick={(data,e) => {console.log(data);}}
            />
          )) : ""}
        </MarkerClusterer>
      </GoogleMap>}
));

class MainMapView extends Component {
  render() {
    return (
        <div>
        <MapView
          center={this.props.location}
          markers={this.props.markers}
          bound_switch={this.props.bound_switch}
          setBounds={this.props.setBounds}
          setBoundSwitch={this.props.setBoundSwitch}
          setUnClusteredMarker={this.props.setUnClusteredMarker}
          containerElement={<div style={{ height: `400px`}} />}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBU2YQ1BoJfjnXpyXr2AQBZlvYq7HjW42k"
          loadingElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        </div>
    )
  }
}

export default MainMapView;
