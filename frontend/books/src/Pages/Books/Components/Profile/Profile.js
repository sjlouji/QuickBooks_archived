import React from 'react'
import {logout} from '../../../../Store/Action/auth'
import { connect } from 'react-redux';
import {withRouter} from 'react-router'

export class Profile extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <li class="nav-item dropdown nav-profile">
                <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={this.props.img} alt="profile"/>
                </a>
                <div class="dropdown-menu" aria-labelledby="profileDropdown">
                <div class="dropdown-header d-flex flex-column align-items-center">
                    <div class="figure mb-3">
                    <img src={this.props.img} alt=""/>
                    </div>
                    <div class="info text-center">
                    <p class="name font-weight-bold mb-0">{this.props.data?this.props.data.user.first_name + this.props.data.user.last_name:""}</p>
                    <p class="email text-muted mb-3">{this.props.data?this.props.data.user.email:""}</p>
                    </div>
                </div>
                <div class="dropdown-body">
                    <ul class="profile-nav p-0 pt-3">
                    <li class="nav-item">
                        <a onClick={()=> this.props.nav.push('/profile')} class="nav-link">
                            <i data-feather="user"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a onClick={()=>this.props.location()} style={{cursor: "pointer"}} class="nav-link">
                        <i data-feather="log-out"></i>
                        <span>Log Out</span>
                        </a>
                    </li>
                    </ul>
                </div>
                </div>
            </li>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth
  });

export default connect(mapStateToProps, {logout})(withRouter(Profile));