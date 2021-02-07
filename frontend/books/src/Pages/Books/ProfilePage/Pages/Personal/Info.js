import React, { Component } from 'react'
import { Button, Input } from 'antd';
import { connect } from 'react-redux';
import { updateUser } from '../../../../../Store/Action/auth'
import { message } from 'antd'
const { TextArea } = Input;

// Success Messge Box
const success = () => {
    message.success('This is a success message');
};
  
// Error Message Box
const error = (data) => {
    message.error(data);
};
export class PersonalInfo extends Component {

    //  Holds the state
    state = {
        first_name: '',
        last_name: '',
        mobile: '',
        bio: ''
    }

    //  Constructor
    constructor(props){
        super(props)
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    //  Fired when the component mounts
    componentDidMount(){
        this.setState({
            first_name: this.props.auth?this.props.auth.user.first_name:"",
            last_name: this.props.auth?this.props.auth.user.last_name:"",
            mobile: this.props.auth?this.props.auth.user.mobile:"",
            bio: this.props.auth?this.props.auth.user.bio === ''?"Hey there. Please Update your profile":this.props.auth.user.bio:"Hey there. Please Update your profile"
        })
    }

    //  Fired when the component recieves new props
    componentWillReceiveProps(nextProps){
        this.setState({ 
            first_name: nextProps.auth?nextProps.auth.user.first_name:"",
            last_name: nextProps.auth?nextProps.auth.user.last_name:"",
            mobile: nextProps.auth?nextProps.auth.user.mobile:"",
            bio: nextProps.auth?nextProps.auth.user.bio:"",
         })
        if(nextProps.error !== undefined){
            if(nextProps.error.message === 'Network Error'){
                error(nextProps.error.message)
            }else{
                error(nextProps.error.response.data.error)
            }
        }
    }

    //  Error validation and hits the update API
    handleUpdate(){
        if(this.state.first_name === ''){error('First Name field can not be empty')}
        else if(this.state.last_name === ''){error('Last Name field can not be empty')}
        else if(this.state.mobile === ''){error('Mobile Number field can not be empty')}
        else if(this.state.mobile.length !== 10){error('Invalid Mobile Format')}
        else if(this.state.bio === ''){error('Bio field can not be empty')}
        else{this.props.updateUser(this.state.first_name,this.state.last_name,this.state.mobile,this.state.bio)}
    }
    
    //  Update State
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    
    render() {
        return (
          <div>
            <h3>Personal Information</h3>
            Basic info, like your name and mobile, that you use on NextBooks Platform
            <div className="container">
                <div className="row" style={{ marginLeft: '200px', marginRight: '200px' }}>
                    <Input
                        placeholder="Id"
                        allowClear
                        disabled
                        value={this.props.auth?this.props.auth.user._id:""}
                        style={{  marginTop: '40px' }}
                        enterButton="Update"
                        size="medium"
                    />
                </div>
                <div className="row" style={{ marginLeft: '200px', marginRight: '200px' }}>
                    <Input
                        placeholder="First Name"
                        allowClear
                        name="first_name"
                        onChange={this.onChange}
                        value={this.state.first_name}
                        onClick={this.handleUpdate}
                        style={{  marginTop: '20px' }}
                        enterButton="Update"
                        size="medium"
                    />
                </div>
                <div className="row" style={{ marginLeft: '200px', marginRight: '200px' }}>
                    <Input
                        placeholder="Last Name"
                        allowClear
                        name="last_name"
                        onChange={this.onChange}
                        onClick={this.handleUpdate}
                        value={this.state.last_name}
                        style={{  marginTop: '20px' }}
                        enterButton="Update"
                        size="medium"
                    />
                </div>
                <div className="row" style={{ marginLeft: '200px', marginRight: '200px' }}>
                    <Input
                        placeholder="Mobile"
                        allowClear
                        name="mobile"
                        onChange={this.onChange}
                        value={this.state.mobile}
                        onClick={this.handleUpdate}
                        style={{ marginTop: '20px' }}
                        enterButton="Update"
                        size="medium"
                    />
                </div>
                <div className="row" style={{ marginLeft: '200px', marginRight: '200px' }}>
                    <Input
                        placeholder="Email"
                        disabled
                        allowClear
                        value={this.props.auth?this.props.auth.user.email:""}
                        style={{ marginTop: '20px' }}
                        enterButton="Update"
                        size="medium"
                    />
                </div>
                <div className="row" style={{ marginLeft: '200px', marginRight: '200px' }}>
                    <TextArea autoSize={{ minRows: 10, maxRows: 15 }} autoSize style={{ marginTop: '20px' }} name="bio" onChange={this.onChange} value={this.state.bio}></TextArea>
                    <div style={{ width: '100%' }}>
                        <Button style={{ float: 'right', width: '20%', marginTop: '15px' }} onClick={this.handleUpdate} type="primary">Update Bio</Button>
                    </div>
                </div>
            </div>
          </div>
        )
    }
  
}
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    auth: state.auth.user,
    update: state.auth.update,
    error: state.auth.error
  });
  

export default connect(mapStateToProps,{updateUser})(PersonalInfo);