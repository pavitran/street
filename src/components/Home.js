import React, { Component } from 'react';
import '../styles/App.css';
import {  Container, Grid, Image } from 'semantic-ui-react';
/*list*/
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { darkBlack} from 'material-ui/styles/colors';
/*list*/
import {Dialog, Divider, Paper } from 'material-ui';
import MainMapView from "./sub_components/DisplayMainMapView";
import * as firebase from "firebase";
import {streeterData,setBounds,
  setUnClusteredMarker,setBoundSwitch,} from '../redux/actions.js';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVisibleStreeter : [],
      images : {},
      details_modal_show : false,
      details_modal_data : null
    }
    //this.renderCurrentStreeterList = this.renderCurrentStreeterList.bind(this);
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps){
      var self = this;
      if(nextProps.unclustered_markers){
        var visibleMarkers = nextProps.unclustered_markers.visible_markers.map((element) => {
        return nextProps.data.filter((marker) => {
            if(marker.location.latitude.toFixed(7) === element.latitude.toFixed(7) && marker.location.longitude.toFixed(7) === element.longitude.toFixed(7)){
              return marker;
            }
            return false;
          })
        });
        if(visibleMarkers)
        this.setState({currentVisibleStreeter : visibleMarkers.map((marker) => {
          marker = marker[0];
          var marker_id = marker.image.split("/")[1].split(".")[0];
          if(self.state.images["" +marker_id] !== "https://storage.googleapis.com/street-71812.appspot.com/loading.png" && self.state.images[marker_id] === undefined){
            var imageRef = firebase.storage().ref(marker.image);
            var temp_image = self.state.images;
            temp_image["" + marker_id] = "https://storage.googleapis.com/street-71812.appspot.com/loading.png";
            self.setState({...self.state.images,...temp_image })
            imageRef.getDownloadURL().then(url => {
              temp_image["" + marker_id] = url;
              self.setState({...self.state.images,...temp_image });
            });
          }
          debugger;
          return<div key={marker_id}>
          <ListItem
            leftAvatar={<Avatar src={self.state.images[marker_id]} />}
            primaryText={<strong>{marker.name + " " + marker.age + " " + marker.gender}</strong>}
            onClick={() => {;this.setState({details_modal_data : marker, details_modal_show : true});}}
            secondaryText={
              <p>
                <span style={{color: darkBlack}}><strong>{marker.condition}</strong> and  <strong>{marker.status ? marker.status.replace("_"," ") : "N/A"}</strong></span>
                {(marker.why !== "not applicable") ? " -- " + marker.why : ""}
              </p>
            }
            secondaryTextLines={2}
          />
          <Divider inset={true} /></div>
        })});
      }
  }
  render() {
    return (
      <div style={{ width : "100%"}} className="App">
        <Container style={{marginTop : "30px"}}>
          <Grid reversed='mobile'>
              <Grid.Column mobile={16} computer={8}>
                  <Paper zDepth={1} >
                  <List>
                    {this.state.currentVisibleStreeter}
                    {(this.props.unclustered_markers && this.props.unclustered_markers.other_markers_count >= 2) ? <ListItem primaryText={this.props.unclustered_markers.other_markers_count + " more hidden under the cluster..."}/> : ""}
                    {(this.props.unclustered_markers
                       && this.props.unclustered_markers.other_markers_count < 2
                       && this.state.currentVisibleStreeter.length === 0) && <ListItem primaryText={"No Steeters in the current location"}/> }
                  </List>
                  </Paper>
              </Grid.Column>
              <Grid.Column mobile={16} computer={8}>
                <MainMapView
                  setBounds={this.props.setBounds}
                  setBoundSwitch={this.props.setBoundSwitch}
                  setUnClusteredMarker={this.props.setUnClusteredMarker}
                  bound_switch={this.props.bound_switch}
                  markers={this.props.data}
                />
              </Grid.Column>
          </Grid>
        </Container>
        {this.state.details_modal_show &&
          <Dialog
            modal={false}
            open={this.state.details_modal_show}
            className="detail-dialog"
            onRequestClose={() => {this.setState({details_modal_show : !this.state.details_modal_show})}}
          >
          <Grid centered columns={2}>
            <Grid.Column>
              <Image src={this.state.images[this.state.details_modal_data.image.split("/")[1].split(".")[0]]} />
              <h2 style={{textAlign : "center"}}>{this.state.details_modal_data.name}</h2>
            </Grid.Column>
            <Grid.Row centered columns={4}>
              <Grid.Column computer={4} mobile={8}>
                <p>Age : <strong>{this.state.details_modal_data.age} {this.state.details_modal_data.gender}</strong></p>
              </Grid.Column>
              <Grid.Column computer={4} mobile={8}>
                <p>Status : <strong>{this.state.details_modal_data.status ? this.state.details_modal_data.status.replace("_"," ") : "N/A"}</strong></p>
              </Grid.Column>
              <Grid.Column computer={4} mobile={8}>
                <p>Skills : <strong>{this.state.details_modal_data.skills}</strong></p>
              </Grid.Column>
              <Grid.Column computer={4} mobile={8}>
                <p>Condition : <strong>{this.state.details_modal_data.condition}</strong></p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Dialog>}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    data : Object.keys(state.data).map(function(key) {
       return state.data[key];
    }),
    current_bounds : state.current_bounds,
    bound_switch : state.bound_switch,
    unclustered_markers : state.unclustered_markers
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      streeterData : streeterData,
      setBounds : setBounds,
      setUnClusteredMarker : setUnClusteredMarker,
      setBoundSwitch : setBoundSwitch,
    },
    dispatch
  );
}

export default connect(mapStateToProps,matchDispatchToProps)(Home);
