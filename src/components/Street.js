import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import {RaisedButton,Checkbox,MenuItem,Paper,SelectField,TextField,RefreshIndicator} from 'material-ui';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import InputMapView from "./sub_components/InputCordMapView";
import * as firebase from 'firebase';//firebase
/*redux*/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {currentLocation,switchTab} from '../redux/actions.js';
/*redux*/
const refresh = <RefreshIndicator
                  left={-10}
                  top={0}
                  status="loading"
                  style={{display: 'inline-block',position: 'relative',}}
                />;

class Street extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location : null,
      activeItem : 'editorials',
      condition_value: null,
      status_value : null
    }
  }

  handleChange = (event, index, value) => this.setState({condition_value : value});
  handleStatusChange = (event, index, value) => this.setState({status_value : value});
  handleStreeterAdd = (event) => {
    event.preventDefault();
    if(!this.props.location.latitude || !this.props.location.longitude){
      alert("you haven't selected the location yet, please select location and try again")
      return false;
    }
    this.setState({disable_submit : true});
    var streeter_image = event.target.file.files[0];
    var streeter_name = event.target.name.value;
    var streeter_age = parseInt(event.target.age.value,10);
    var streeter_gender = event.target.gender.value;
    var streeter_location = this.props.location;
    var streeter_condition = this.state.condition_value;
    var streeter_addictions = event.target.addictions.value;
    var streeter_income = event.target.income.value;
    var streeter_status = this.state.status_value;
    var streeter_skills = event.target.skills.value.toLowerCase();
    var why = (event.target.why !== undefined) ? event.target.why.value : "not applicable";


    this.databaseRef = firebase.database().ref("streeter");
    var streeter_key = this.databaseRef.push().key;
    var streeter_image_name = streeter_image.name.split(".");
    streeter_image_name[0] = streeter_key;
    streeter_image_name = "images/" + streeter_image_name.join(".");
    var streeter_data = {
      name : streeter_name,
      age : streeter_age,
      gender : streeter_gender,
      location : streeter_location,
      condition : streeter_condition,
      status : streeter_status,
      skills : streeter_skills,
      addictions : streeter_addictions,
      stay : event.target.stay.value,
      education : event.target.education.value,
      family_status : event.target.family_status.value,
      why_homeless : event.target.why_homeless.value,
      history : event.target.history.value,
      income : streeter_income,
      why : why,
      image : streeter_image_name
    };
    var streeter_object = {};
    streeter_object["" + streeter_key] = streeter_data;
    this.storageRef = firebase.storage().ref();
    var streeterImageRef = this.storageRef.child(streeter_image_name);
    streeterImageRef.put(streeter_image).then((data) => {
      this.databaseRef.update(streeter_object).then(() => {
        console.log("added streeter");
        this.props.switchTab();
      })
    });
  }

  componentDidMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({location : position.coords});
          var location = {};
          location["latitude"] = position.coords.latitude;
          location["longitude"] = position.coords.longitude;
          this.props.currentLocation(location);
        },
        err => {
          if(!this.props.location)
            alert("We need your location to help people better, please change your location settings and continue");
          else
            this.props.currentLocation({
              latitude : 17.7425,
              longitude : 83.3389
            });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
    } else {
      console.error("Geo Location not supported with your device")
    }
  }

  render() {
    return (
      <div style={{ width : "100%"}} className="App">
        <Container>
          {(Object.keys(this.props.user).length !== 0) ?
            (<form style={ { textAlign: 'center', marginTop: 10 } } onSubmit={ this.handleStreeterAdd}>
              {this.state.selected_img_src && <img src={this.state.selected_img_src} style={{margin: "auto",display: "block",maxWidth: 265,width: "100%", height: "auto"}} /> }
              <div className="inputWrapper">
                  <label>{!this.state.selected_img_src ? 'Image of needy around you' : "Change"}</label>
                  <input
                    required
                    className="fileInput"
                    type="file"
                    name="file"
                    onChange={(event) => {
                      debugger;
                      this.setState({selected_img_src: event.target.value});
                      if (event.target.files && event.target.files[0]) {
                          let reader = new FileReader();
                          reader.onload = (e) => {
                              this.setState({selected_img_src: e.target.result});
                          };
                          reader.readAsDataURL(event.target.files[0]);
                      }
                    }}
                    />
              </div>
              {/*<RaisedButton
                 style={{marginTop : "14px"}}
                 containerElement='label'
                 label={!this.state.selected_img_src ? 'Image of needy around you' : "Change"}>
                  <input
                    style={{display : "none"}}
                    required
                    type="file"
                    name="file"
                    onChange={(event) => {
                      debugger;
                      this.setState({selected_img_src: event.target.value});
                      if (event.target.files && event.target.files[0]) {
                          let reader = new FileReader();
                          reader.onload = (e) => {
                              this.setState({selected_img_src: e.target.result});
                          };
                          reader.readAsDataURL(event.target.files[0]);
                      }
                    }} />
              </RaisedButton>*/}
            <br />
            <TextField tabIndex={1} required name='name' hintText="Enter Name of needy around you" floatingLabelText="Name" />
            <br />
            <TextField tabIndex={2} required min="5" max="65" type={"number"} name='age' hintText="Enter the Age" floatingLabelText="Age" />
            <br />
            <RadioButtonGroup
              required
              name="gender"
              defaultSelected="male"
              style={{width : "256px",margin : "auto"}}>
              <RadioButton
                tabIndex={3}
                value="male"
                label="Male"
              />
              <RadioButton
                value="female"
                label="Female"
              />
            </RadioButtonGroup>
            <br />
            <TextField tabIndex={4} required name='skills' hintText="Skills seperated by comma(,)" floatingLabelText="Skills of needy around you" />
            <br />
            <TextField tabIndex={5} required name='addictions' hintText="Addictions" floatingLabelText="Addictions if any" />
            <br />
            <TextField tabIndex={6} required name='income' type={"number"} hintText="Income" floatingLabelText="Income per day" />
            <br />
            <Checkbox
              label="Food Availability"
              tabIndex={7}
              style={{width : "256px",margin : "auto",marginTop : "16"}}
              name="food-availability"
            />
            <br />
            <SelectField
              tabIndex={8}
              style={{textAlign : "left"}}
              floatingLabelText="Condition?"
              value={this.state.condition_value}
              onChange={this.handleChange}
            >
            <MenuItem value={"fit"} primaryText="Fit" />
            <MenuItem value={"old"} primaryText="Old" />
            <MenuItem value={"handicapped"} primaryText="Handicapped" />
            </SelectField>
            <br />
            <TextField tabIndex={9} required name='stay' hintText="Where do you stay" floatingLabelText="Place of stay" />
            <br />
            <Grid centered>
            <Grid.Column mobile={16} computer={8}>
              {this.props.location &&
              <InputMapView currentLocation={this.props.currentLocation} location={this.props.location} />}
            </Grid.Column>
            </Grid>
            <br />
            <SelectField
              tabIndex={10}
              style={{textAlign : "left"}}
              floatingLabelText="Status?"
              value={this.state.status_value}
              onChange={this.handleStatusChange}
            >
            <MenuItem value={"working"} primaryText="Working" />
            <MenuItem value={"not_working"} primaryText="Not Working" />
            <MenuItem value={"need_job"} primaryText="Need A Job" />
            <MenuItem value={"won't_work"} primaryText="Won't Work" />
            <MenuItem value={"will_beg"} primaryText="Will Beg" />
            </SelectField>
            <br />
            {(this.state.status_value === "will_beg" || this.state.status_value === "won't_work") &&
            <TextField
              tabIndex={11}
              name="why"
              required
              hintText="if selected last two, Specify why?"
              multiLine={true}
              rows={2}
              rowsMax={5}
            />}
            <br />
            <TextField
              tabIndex={12}
              name="history"
              hintText="Background history"
              multiLine={true}
              rows={2}
              rowsMax={5}
            />
            <br />
            <TextField tabIndex={13} name='education' hintText="Educational Qualification" floatingLabelText="Have any Qualifications" />
            <br />
            <TextField tabIndex={14} name='family_status' hintText="Family Status" floatingLabelText="Does the needy have a family" />
            <br />
            <TextField tabIndex={15} name='why_homeless' hintText="Why Homeless" floatingLabelText="What help is He/She looking for?" />
            <br />
            <TextField tabIndex={16} name='how_can_help' hintText="How can we help" floatingLabelText="How can we help you?" />
            <br />
            {!this.state.disable_submit ? <RaisedButton tabIndex={17} type={"submit"} disable={this.state.disable_submit} label="Add" backgroundColor='green' primary={ true } style={ { margin: 12 } } /> : refresh}
          </form>) :
          (<Paper style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}>
            <p style={{padding : "10px"}}>You must be logged in to add a Streeter</p>
          </Paper>)}
        </Container>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    location : state.location,
    user : state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    currentLocation : currentLocation,
    switchTab : switchTab
  },dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Street);
