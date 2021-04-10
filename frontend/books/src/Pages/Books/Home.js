import React, { Component,Suspense } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Search } from './Components/Search/Search';
import { Notification } from './Components/Notification/Notification';
import { Profile } from './Components/Profile/Profile';
import AppsIcon from '@material-ui/icons/Apps';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import {withRouter} from 'react-router'
import { logout } from '../../Store/Action/auth'
import  PrivateRoute  from '../../PrivateRoute';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
export class HomePage extends Component {

    state = {
        profile_img: '',
        notifications: '',
    }

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout() {
        console.log(this.props)
        this.props.logout()
    }

    //  Fired when the component recieves new props
    componentWillReceiveProps(nextProps){
        this.setState({ 
            profile_img: nextProps.user?nextProps.user.user.profile_img:"https://firebasestorage.googleapis.com/v0/b/nextbooks-1a9f0.appspot.com/o/Profile%2Funnamed.jpg?alt=media&token=26aa8e12-b869-4a2f-afde-ced8ebe2bf0e",
            notifications: nextProps.user?nextProps.user.user.notifications.reverse().slice(0,6):"",
        })
    }

    //  Fired when the component mounts
    componentDidMount(){
        if(!this.props.isAuthenticated) {
            this.props.history.push('/auth/login')
        }
        this.setState({ 
            profile_img: this.props.user?this.props.user.user.profile_img:"https://firebasestorage.googleapis.com/v0/b/nextbooks-1a9f0.appspot.com/o/Profile%2Funnamed.jpg?alt=media&token=26aa8e12-b869-4a2f-afde-ced8ebe2bf0e",
            notifications: this.props.user?this.props.user.user.notifications.reverse().slice(0,6):"",
        })
    }

    render() {
        return(
            <div className="main-wrapper loaded sidebar-folded" id="app" >
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <a href="#" className="sidebar-brand">
                        Noble<span>UI</span>
                        </a>
                        <div className="">
                            <div style={{ color: '#031a61', fontSize: '20px', fontWeight: '900' }}>
                                QB
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-body">
                        <ul className="nav">
                            <li className={this.props.location.pathname==="/"?"nav-item active":"nav-item"}>  
                                <a onClick={()=>this.props.history.push('/')} className="nav-link">
                                    <AppsIcon style={this.props.location.pathname!=="/"?{color: '#727cf5'}:{}}/>
                                    <span className="link-title">Dashboard</span>
                                </a>
                            </li>
                            <li style={{ marginTop: '20px' }} className={this.props.location.pathname==="/accounts"?"nav-item active":"nav-item"}>  
                                <a onClick={()=>this.props.history.push('/accounts')} className="nav-link">
                                    <MenuBookIcon style={this.props.location.pathname!=="/accounts"?{color: '#727cf5'}:{}}/>
                                    <span className="link-title">Accounts</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="page-wrapper">  
                    <nav class="navbar">
                        <div class="navbar-content">
                            <Search location={this.props}/>
                            <ul class="navbar-nav">
                                <Notification notifications = {this.state.notifications}/>
                                <Profile location={this.handleLogout} data = {this.props.user} img = {this.state.profile_img} nav={this.props.history}/>
                            </ul>
                        </div>
                    </nav>
                    <div class="page-content">
                        <Suspense fallback={<div>Loading..</div>} >
                            {renderRoutes(this.props.route.routes)}
                        </Suspense>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  });

export default connect(mapStateToProps, {logout})(withRouter(HomePage));