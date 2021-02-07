import React from 'react'
import NotificationsIcon from '@material-ui/icons/Notifications';
import Moment from 'moment';

export class Notification extends React.Component {

    getNotiType(type) {
        if(type === 'Auth') {return 'AU'}
        if(type === 'Account') {return 'AC'}
        if(type === 'Transcation') {return 'TC'}
        if(type === 'Profile') {return 'PR'}
        return 'GN'
    }

    render() {
        return(
            <li class="nav-item dropdown nav-notifications">
                <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <NotificationsIcon />
                </a>
                <div class="dropdown-menu" aria-labelledby="notificationDropdown">
                <div class="dropdown-header d-flex align-items-center justify-content-between">
                    <p class="mb-0 font-weight-medium">New Notifications</p>
                </div>
                <div class="dropdown-body" style={{height: '100%'}}>
                    {this.props.notifications?this.props.notifications.map((data)=>{
                        var notiType = this.getNotiType(data.type)
                        return(
                            <a href="javascript:;" class="dropdown-item">
                                <div class="icon">
                                    <i data-feather="">{notiType}</i>
                                </div>
                                <div class="content">
                                    <p>{data.message}</p>
                                    <p class="sub-text text-muted">{Moment(data.created).startOf('sec').fromNow()}</p>
                                </div>
                            </a>
                        )
                    }):""}
                </div>
                </div>
            </li>
        );
    }
}

export default Notification