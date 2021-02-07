import React, { Component } from 'react'
import { connect } from 'react-redux';
import moment from 'moment'
import{ Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';
import {jsPDF} from 'jspdf'
import "jspdf-autotable";

export class Notifications extends Component {

    //  Constructor
    constructor(props){
        super(props)
        this.handleDownload = this.handleDownload.bind(this)
    }

    //  Download all the Activities of the User
    handleDownload(){
        const title = this.props.auth?this.props.auth.user.first_name+"  Notification Report - NEXTBOOKS":"";
        const headers = [["ID", "Notification Typ", "Message", "date"]];  
        const marginLeft = 40;
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation);

        doc.setFontSize(15);    
        if(this.props.auth){
            const data = this.props.auth.user.notifications.map(elt=> [elt._id, elt.type, elt.message, moment(elt.last_login).format('LLL')]);  
            let content = {
                startY: 50,
                head: headers,
                body: data
              };
            doc.text(title,marginLeft, 40)
            doc.autoTable(content);
        }
        doc.save(this.props.auth?this.props.auth.user.first_name+"  Notification Report":"");
    }
    render() {
        return (
          <div>
              <h3>All Notifications</h3>
              Here is your last 10 notifications
              <Button type="primary" style={{ float: 'right' }} onClick={this.handleDownload}><DownloadOutlined />Download all notifications as PDF</Button>
              <div className="container" style={{ marginTop: '30px' }}>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Notification Type</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.auth?this.props.auth.user.notifications.reverse().slice(0,10).map((data)=>{
                            console.log(moment(data.created).format('LLL'))
                            return(
                                <tr key={data._id}>
                                    <td><p style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.type}</p></td>
                                    <td>{data.message?data.message:"No message"}</td>
                                    <td>{moment(data.created).format('LLL')}</td>
                                </tr>
                            )
                        }):"No data"}
                    </tbody>
                </table>
              </div>
          </div>
        )
    }
  
}

const mapStateToProps = (state) => ({
    auth: state.auth.user
});

export default connect(mapStateToProps,)(Notifications);