import React, { Component } from 'react'
import { connect } from 'react-redux';
import moment from 'moment'
import{ Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';
import {jsPDF} from 'jspdf'
import "jspdf-autotable";

export class Logs extends Component {

    //  Constructor
    constructor(props){
        super(props)
        this.handleDownload = this.handleDownload.bind(this)
    }

    //  Download all the Activities of the User
    handleDownload(){
        const title = this.props.auth?this.props.auth.user.first_name+"  Login Report - NEXTBOOKS":"";
        const headers = [["ID", "AGENT", "IP", "DATE"]];  
        const marginLeft = 40;
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation);

        doc.setFontSize(15);    
        if(this.props.auth){
            const data = this.props.auth.user.logs.map(elt=> [elt._id, elt.agent, elt.ip, moment(elt.last_login).format('LLL')]);  
            let content = {
                startY: 50,
                head: headers,
                body: data
              };
            doc.text(title,marginLeft, 40)
            doc.autoTable(content);
        }
        doc.save(this.props.auth?this.props.auth.user.first_name+"  Login Report":"");
    }
    render() {
        return (
          <div>
              <h3>Login Activity</h3>
              Here is your last 10 login activities log
              <Button type="primary" style={{ float: 'right' }} onClick={this.handleDownload}><DownloadOutlined />Download all activities as PDF</Button>
              <div className="container" style={{ marginTop: '30px' }}>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>User Agent</th>
                            <th>IP</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.auth?this.props.auth.user.logs.reverse().slice(0,10).map((data)=>{
                            return(
                                <tr key={data._id}>
                                    <td><p style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.agent}</p></td>
                                    <td>{data.ip?data.ip:"Ip Address Not Found"}</td>
                                    <td>{moment(data.last_login).format('LLL')}</td>
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

export default connect(mapStateToProps,)(Logs);