import React, { Component } from 'react'
import { connect } from 'react-redux';
import { resetPassword } from '../../../Store/Action/auth';
import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export class ForgotPasswordPage extends Component {

    //  Holds all the state variables
    state = {
        email: '',
        error: '',
        success: '',
    }

    //  Constructor to bind function with state
    constructor(props) {
        super(props)
        this.handleForgotPassword = this.handleForgotPassword.bind(this)
        this.handleError = this.handleError.bind(this)
        this.flushError = this.flushError.bind(this)
        this.onChange = this.onChange.bind(this)
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
        console.log(nextProps)
        if(nextProps.success !== undefined) {
            if(nextProps.success.msg !== undefined) {
                this.setState({success: nextProps.success.msg})
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
        this.setState({success: ''})
    }

    //  Handles Password Reset
    handleForgotPassword(e){
        e.preventDefault();
        if(this.state.email === ''){this.handleError('Email can not be Empty')}
        else if(!email_regex.test(this.state.email)) {this.handleError('Invalid Email Format')}
        else{
            this.flushError()
            const body = {email: this.state.email}
            this.props.resetPassword(body)
        }
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
                                                <h5 className="text-muted font-weight-normal mb-4">Welcome! Reset you account password.</h5>
                                                {this.props.authLoading?
                                                    <div style={{height: "100%", textAlign: "center"}}>
                                                        <CircularProgress size={40} thickness={4}/>
                                                    </div>
                                                :""}
                                                <form className="forms-sample" onSubmit={this.handleForgotPassword}>
                                                    {this.state.error?
                                                    <div>
                                                        <div class="alert alert-danger" role="alert">
                                                            {this.state.error}
                                                        </div>
                                                    </div>
                                                    :""}      
                                                    {this.state.success?
                                                    <div>
                                                        <div class="alert alert-success" role="alert">
                                                            {this.state.success}
                                                        </div>
                                                    </div>
                                                    :""}                                                    
                                                    <div className="form-group">
                                                        <label>Email address</label>
                                                        <input type="text" className="form-control" id="email" name="email" onChange={this.onChange} value={this.state.email} placeholder="Email"/>
                                                    </div>
                                                    <div className="mt-3">
                                                        <input type="submit" style={{ float: 'right' }} className="btn btn-primary mr-2 mb-2 mb-md-0" value="Reset Password"/>
                                                    </div>
                                                    <a href="/auth/login" className="d-block mt-3 text-muted">Know your Password? Login</a>
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
    error: state.auth.error,
    success: state.auth.reset
  });
  

export default connect(mapStateToProps, {resetPassword})(withRouter(ForgotPasswordPage));