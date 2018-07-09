import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './styles/App.css';
import * as firebase from 'firebase';
import Home from "./components/Home";
import Street from "./components/Street";
/*material-ui */
import IconAdd from 'material-ui/svg-icons/content/add';
import IconHome from 'material-ui/svg-icons/action/home';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import {IconMenu,MenuItem,AppBar,Avatar,Paper,RaisedButton,FlatButton,Dialog, RefreshIndicator } from 'material-ui';
/*material-ui end*/

/*redux*/
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {currentUser,streeterData,switchTab} from './redux/actions.js';
/**redux*/

const homeIcon = <IconHome />;
const addIcon = <IconAdd />;
const refresh = <RefreshIndicator
                  left={-10}
                  top={0}
                  status="loading"
                  style={{display: 'inline-block',position: 'relative',}}
                />;

class App extends Component {
  constructor(props){
    super(props);
      this.handleAuthChange = this.handleAuthChange.bind(this);
      this.state = {
      logged: false,
      selectedIndex: 0,
      loginOpen : false,
      authload : true,
      userDetails : null
    };
  }
  //method invoked when all the components are loaded
  componentDidMount(){
    firebase.auth().getRedirectResult().then(this.authSuccess).catch(this.authFail);
    firebase.auth().onAuthStateChanged(this.handleAuthChange);
    //listens for new streeters addition
    this.databaseRef = firebase.database().ref("streeter");
    this.databaseRef.on("child_added",(dataSnap) => {
      if(dataSnap.val()){
        var streeter_added = {};
        streeter_added[""+dataSnap.key ] = dataSnap.val();
        this.props.streeterData(streeter_added);
        //this.props.streeterData(dataSnap.val()); //for on value
      }
    })
    this.databaseRef.on("child_removed",(dataSnap) => {
      if(dataSnap.val()){
        debugger;
        //this.props.streeterData(streeter_added);
      }
    })
  }
  Logged = (props) => (
    <IconMenu
      {...props /*sets app the props passed to the method as props to IconMenu*/}
      iconButtonElement={
        <Avatar src={props.loggedUser.photoURL} />
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Refresh" />
      <MenuItem primaryText="Help" />
      <MenuItem onClick={()=>{     if (this.state.logged !== true)this.setState({visible : true});else firebase.auth().signOut();}} primaryText="Sign out" />
    </IconMenu>
  );
  // Logged.muiName = 'IconMenu';
  //invoked when the Auth state changes
  handleAuthChange(user){
    if (user !== null) {
      this.setState({logged : true,authload: false,userDetails : user});
      var CurrentUser = {};
      CurrentUser["uid"] = user.uid;
      CurrentUser["photoURL"] = user.photoURL;
      CurrentUser["displayName"] = user.displayName;
      CurrentUser["email"] = user.email;
      CurrentUser["phoneNumber"] = user.phoneNumber;
      this.props.currentUser(CurrentUser);
    } else {
      //this.databaseRef.off();
      this.setState({logged : false,authload: false});
      this.props.currentUser({});
    }
  }
  handleChange = (event, logged) => {
    this.setState({logged: logged});
  };

  loginModalToggle = () => {
    this.setState({loginOpen: !this.state.loginOpen});
  };

  loginbutton = <RaisedButton label="login"
      className={"center-button"}
      backgroundColor={"#Ffc50c"}
      onClick={this.loginModalToggle}/>;

  handleTabClick(index,tab_bool){
    if(this.state.selectedIndex !== index)
      this.props.switchTab();
    this.setState({selectedIndex: index})
  }
  /*auth start*/
  facebookLogin(){
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(() =>{
      console.log("login successful");
      this.loginModalToggle();
    }).catch((e) => {debugger;alert(e.message)});
  }
  googleLogin(){
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(() =>{
      console.log("login successful");
      this.loginModalToggle();
    }).catch((e) => {debugger;alert(e.message)});
  }
  /*auth end*/
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.loginModalToggle}
      />,
    ];
    return (
      <MuiThemeProvider>
      <div className="app-box">
        <div className="app-row header">
        <AppBar
          title={<Avatar style={{verticalAlign : "middle",width : "60px",height : "60px",marginBottom : "10px"}} src={"/phoenix.jpeg"} />}
          style={{backgroundColor : "#000000"}}
          showMenuIconButton={false}
          iconElementRight={this.state.authload ? refresh : (this.state.logged ? <this.Logged loggedUser={this.state.userDetails}/> : <div style={{marginTop : "6px",marginBottom : "auto"}}>{this.loginbutton}</div>)}
        />
        </div>
        <div style={{width : "100%"}} className="app-row content">
        {this.props.switch_tab ? <Home /> : <Street user={this.props.user}/>}
        </div>
        <div className="app-row footer">
        <Paper className="bottom-paper" zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="Street"
              icon={homeIcon}
              onClick={() => {this.handleTabClick(0,true)}}
            />
            <BottomNavigationItem
              label="Add"
              icon={addIcon}
              onClick={() => {this.handleTabClick(1,false)}}
            />
          </BottomNavigation>
        </Paper>
        </div>
        <Dialog
          style={{textAlign: "center"}}
          title="Login Window"
          actions={actions}
          modal={false}
          open={this.state.loginOpen}
          onRequestClose={this.handleClose}>
            <RaisedButton
              label="Login with Facebook"
              className="login-button"
              backgroundColor="#375593"
              labelColor="#ffffff"
              onClick={this.facebookLogin.bind(this)}
            />
            <br/>
            <RaisedButton
            style={{marginTop: '10px'}}
              className="login-button"
              label="Login with Google"
              labelColor="#ffffff"
              onClick={this.googleLogin.bind(this)}
              backgroundColor="#dd4b39"
            />
        </Dialog>
      </div>
      </MuiThemeProvider>
    );
  }
}
function mapStateToProps(state) {
  return {
    user : state.user,
    details_modal_data : state.details_modal_data,
    details_modal_show : state.details_modal_show,
    switch_tab : state.switch_tab
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    currentUser : currentUser,
    streeterData : streeterData,
    switchTab : switchTab},
    dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
