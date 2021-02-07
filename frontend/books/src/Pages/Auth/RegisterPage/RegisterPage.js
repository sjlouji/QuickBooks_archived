import React, { Component } from 'react';
import { connect } from 'react-redux';
import { register } from '../../../Store/Action/auth';
import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export class RegisterPage extends Component {

    //  Holds all the state variables
    state = {
        email: '',
        password: '',
        mobile: '',
        first_name: '',
        last_name: '',
        error: '',
        hidden: true
    }

    //  Constructor to bind function with state
    constructor(props) {
        super(props)
        this.handleRegister = this.handleRegister.bind(this)
        this.handleError = this.handleError.bind(this)
        this.flushError = this.flushError.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handlePasswordToogle = this.handlePasswordToogle.bind(this)
    } 

    //  Recieves new props. Primarily used for Error Handling
    componentWillReceiveProps(nextProps){
        if(nextProps.error !== undefined){
            if(nextProps.error.message === 'Network Error'){
                this.setState({error: nextProps.error.message})
            }else{
                this.setState({error: nextProps.error.response.data.error})
            }
        }
    }

    //  Handles Error
    handleError(error) {
        this.setState({error: error})
    }

    // Makes Error null
    flushError() {
        this.setState({error: ''})
    }

    //  Handles Login
    handleRegister(e){
        e.preventDefault();
        console.log(this.state.mobile.length <= 9)
        if(this.state.first_name === ''){this.handleError('Name can not be Empty')}
        else if(this.state.last_name === ''){this.handleError('Name can not be Empty')}
        else if(this.state.email === ''){this.handleError('Email can not be Empty')}
        else if(!email_regex.test(this.state.email)) {this.handleError('Invalid Email Format')}
        else if(this.state.mobile === ''){this.handleError('Mobile can not be Empty')}
        else if(this.state.mobile.length !== 10 ){this.handleError('Invalid Mobile Number')}
        else if(this.state.password === ''){this.handleError('Password can not be Empty')}
        else{
            this.flushError()
            const body = { first_name: this.state.first_name, last_name: this.state.last_name, email: this.state.email, password: this.state.password, mobile: this.state.mobile, }
            this.props.register(body)
        }
    }

    //Handle Password Visibility
    handlePasswordToogle() {
        this.setState({ hidden: !this.state.hidden });
    }

    //  Hadles change of text in textfield 
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    render() {
        if(this.props.isAuthenticated){
            this.props.history.push('/')
        }
        return(
            <div className="main-wrapper" id="app">
                <div className="page-wrapper full-page">
                    <div className="page-content d-flex align-items-center justify-content-center">
                        <div className="row w-60 mx-0 auth-page">
                            <div className="col-md-8 col-xl-6 mx-auto">
                                <div className="card">
                                    <div className="row">
                                        <div className="col-md-12 pl-md-4">
                                            <div className="auth-form-wrapper px-5 py-5" style={this.props.authLoading?{opacity: 0.4, pointerEvents: "none"}:{}}>
                                                <a href="#" className="books-ui-logo d-block mb-2">Quick<span>Books</span></a>
                                                <h5 className="text-muted font-weight-normal mb-4">Welcome back! Log in to your account.</h5>
                                                {this.props.authLoading?
                                                    <div style={{height: "100%", textAlign: "center"}}>
                                                        <CircularProgress size={40} thickness={4}/>
                                                    </div>
                                                :""}
                                                <form className="forms-sample" onSubmit={this.handleRegister}>
                                                    {this.state.error?
                                                        <div class="alert alert-danger" role="alert">
                                                            {this.state.error}
                                                        </div>
                                                    :""}
                                                    <div className="row form-group">
                                                        <div className="col-md-6">
                                                            <label>First Name</label>
                                                            <input type="text" className="form-control" id="first_name" name="first_name" onChange={this.onChange} value={this.state.first_name} placeholder="First Name"/>    
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label>Last Name</label>
                                                            <input type="text" className="form-control" id="last_name" name="last_name" onChange={this.onChange} value={this.state.last_name} placeholder="Last Name"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Email address</label>
                                                        <input type="text" className="form-control" id="email" name="email" onChange={this.onChange} value={this.state.email} placeholder="Email"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Mobile</label>
                                                        <input type="text" className="form-control" id="mobile" name="mobile" onChange={this.onChange} value={this.state.mobile} placeholder="Mobile"/>
                                                        <span style={{ color: 'grey', fontSize: '11px'}}>Indian mobile numbers are only allowed</span>
                                                    </div>
                                                    <div class="form-group" style={{ position: 'relative' }}>
                                                        <label>Password</label>
                                                        <input type={this.state.hidden?"password":"text"} className="form-control" id="password" name="password" onChange={this.onChange} value={this.state.password} placeholder="Password"/>
                                                        {this.state.hidden?<VisibilityIcon onClick={this.handlePasswordToogle} style={{ position: 'absolute', right: '0', top: '30px', padding: '9px 8px', transition: '0.3s', fontSize: '36px', cursor: 'pointer' }}/>:<VisibilityOffIcon onClick={this.handlePasswordToogle} style={{ position: 'absolute', right: '0', top: '30px', padding: '9px 8px', transition: '0.3s', fontSize: '36px', cursor: 'pointer' }}/>}
                                                        <span style={{ color: 'grey', fontSize: '11px'}}>Use 6 or more characters with a mix of letters, numbers & symbols</span>
                                                    </div>
                                                    <div className="mt-3">
                                                        <input type="submit" style={{ float: 'right' }} className="btn btn-primary mr-2 mb-2 mb-md-0" value="Register"/>
                                                    </div>
                                                    <a href="/auth/login" className="d-block mt-3 text-muted">Have an Account? Login</a>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>        
                    </div>
                </div>
          </div>
        );
    }
}

//  Map state to props
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    authLoading: state.auth.authLoading,
    error: state.auth.error
  });
  

export default connect(mapStateToProps, {register})(withRouter(RegisterPage));