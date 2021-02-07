import React, { Component } from 'react';
import { Card, Upload,Spin } from 'antd';
import {withRouter} from 'react-router'
import { connect } from 'react-redux';
import { Button } from 'antd'
import { message } from 'antd'
import { Divider } from 'antd';
import Logs from './Pages/Logs/Logs'
import PersonalInfo from './Pages/Personal/Info'
import Notifications from './Pages/Notifications/Notification'
import Security from './Pages/Security/Security'
import { storage } from "../../../Firebase/firebase";
import { updateUser } from '../../../Store/Action/auth'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ScreenLockPortraitIcon from '@material-ui/icons/ScreenLockPortrait';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EditIcon from '@material-ui/icons/Edit';

export class ProfilePage extends Component {

    //  Holds the State
    state = {
        menu: 0,
        profile_img: 'https://firebasestorage.googleapis.com/v0/b/nextbooks-1a9f0.appspot.com/o/Profile%2Funnamed.jpg?alt=media&token=26aa8e12-b869-4a2f-afde-ced8ebe2bf0e',
        is_loading: false,
    }

    //  Constructor
    constructor(props){
        super(props)
        this.handleNav = this.handleNav.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
    }
    
    //  Fired when the component recieves new props
    componentWillReceiveProps(nextProps){
        this.setState({ 
            profile_img: nextProps.auth?nextProps.auth.user.profile_img:"https://firebasestorage.googleapis.com/v0/b/nextbooks-1a9f0.appspot.com/o/Profile%2Funnamed.jpg?alt=media&token=26aa8e12-b869-4a2f-afde-ced8ebe2bf0e",
         })
    }

    //  Fired when the component mounts
    componentDidMount(){
        this.setState({ 
            profile_img: this.props.auth?this.props.auth.user.profile_img:"https://firebasestorage.googleapis.com/v0/b/nextbooks-1a9f0.appspot.com/o/Profile%2Funnamed.jpg?alt=media&token=26aa8e12-b869-4a2f-afde-ced8ebe2bf0e",
         })
    }


    //  Handles Menu Navigation
    handleNav(item){
        this.setState({
            menu: item,
        })
    }

    //  Uploads profile image to firebase storage
    handleUpload(e){
        this.setState({is_loading: true})
        const uploadTask = storage.ref(`/Profile/${this.props.auth?this.props.auth.user.email:""}`).put(e)
        uploadTask.on('state_changed', 
        (snapShot) => {

        }, (err) => {
            this.setState({is_loading: false})
            message(err)
        }, () => {
            storage.ref('Profile').child(this.props.auth?this.props.auth.user.email:"").getDownloadURL()
            .then(fireBaseUrl => {
            message.success(`Profile Image updated successfully.`);
            this.props.updateUser("",'','','',fireBaseUrl)
            this.setState({  
                profile_img: fireBaseUrl,
                is_loading: false
            })
            })
        })
    }
    
        
    render() {
        let menu;
        if(this.state.menu === 0){
            menu = <PersonalInfo />;
        }else if(this.state.menu === 1){
            menu = <Security />;
        }else if(this.state.menu === 2){
            menu = <Logs />;
        }else if(this.state.menu === 3) {
            menu = <Notifications />;
        }
        return(
            <div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Profile</a></li>
                        {this.state.menu === 0?<li class="breadcrumb-item active">Personal Information</li>:""}
                        {this.state.menu === 1?<li class="breadcrumb-item active">Security</li>:""}
                        {this.state.menu === 2?<li class="breadcrumb-item active">Logs</li>:""}
                    </ol>
                </nav>
                <div>
                    <div className="row" style={{ paddingLeft: '60px', paddingRight: '60px', paddingTop: '30px' }}>
                            <div className="col-4" style={this.state.is_loading?{opacity: '0.3'}:{}}>
                            <Card style={{ width: '400px', borderColor: 'white' }}>
                                <div style={{ width: '100%', float: 'right', textAlign: 'end' }}>
                                <Spin indicator={this.antIcon} spinning={this.state.is_loading} style={{ float: 'left' }}/>
                                <Upload accept=".png, .jpg, .jpeg" multiple={false} beforeUpload={this.handleUpload} showUploadList={false} style={{ float: 'right' }}><Button style={{ borderRadius: '50%', width: '20px' }} type="primary"><EditIcon style={{ marginLeft: '-9px', fontSize: '17px'}}/></Button></Upload>
                                </div>
                            <img
                                width="80%"
                                src={this.state.profile_img}
                            ></img>
                            <h3 style={{ fontWeight: 'normal', marginTop: '15px' }}>{this.props.auth?this.props.auth.user.first_name + this.props.auth.user.last_name:""}</h3>
                            <h6 style={{ color: '#525252', fontSize: '13', fontWeight: 'lighter' }}>{this.props.auth?this.props.auth.user.email:""}</h6>
                            <div style={{ marginTop: '20px', textAlign: 'justify' }}>
                            {this.props.auth?this.props.auth.user.bio === ''?"Hey there. Please Update your profile":this.props.auth.user.bio:"Hey there. Please Update your profile"}
                                <div style={{ marginTop: '20px', textAlign: 'justify' }}>
                                    <p>{this.props.auth?this.props.auth.user.mobile:""}</p>
                                </div>
                            </div>
                            <Divider />
                            <div className="menu-content" data-simplebar>
                                <li className="menu-label">Profile Settings</li>
                                <ul className="metismenu left-sidenav-menu" style={{ overflow: 'hidden' }}>
                                    <List component="nav" onClick={()=>this.handleNav(0)} style={{ paddingTop: '0px', paddingBottom: '0px'}}>
                                        <ListItem button>
                                            <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                                            <ListItemText primary="Personal Info" >
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                    <List component="nav" onClick={()=>this.handleNav(2)} style={{ paddingTop: '0px', paddingBottom: '0px'}}>
                                        <ListItem button>
                                            <ListItemIcon><LocalActivityIcon/></ListItemIcon>
                                            <ListItemText primary="Logs" >
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                    <List component="nav" onClick={()=>this.handleNav(3)} style={{ paddingTop: '0px', paddingBottom: '0px'}}> 
                                        <ListItem button>
                                            <ListItemIcon><NotificationsIcon/></ListItemIcon>
                                            <ListItemText primary="Notification" >
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                    <List component="nav" onClick={()=>this.handleNav(1)} style={{ paddingTop: '0px', paddingBottom: '0px'}}>
                                        <ListItem button>
                                            <ListItemIcon><ScreenLockPortraitIcon/></ListItemIcon>
                                            <ListItemText primary="Security" >
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </ul>
                            </div>
                            </Card>
                        </div>
                        <div className="col-8" >
                            <Card style={{ width: '100%', borderColor: 'white' }}>
                                {menu}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth.user,
    is_loading: state.auth.isLoading
  });

export default connect(mapStateToProps,{updateUser})(withRouter(ProfilePage));