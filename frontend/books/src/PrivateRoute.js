import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router'

const PrivateRoute = ({component: Component, ...rest}) => {
    const {isAuthenticated} = rest;
    console.log('in private route', isAuthenticated)
    if(!isAuthenticated) {
        console.log('Not logged in')
        return (
            <Redirect to={{
                pathname: '/login',
              }}/>
        )
    }
  };

  
  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
    };
  }
  
  export default connect(mapStateToProps)(PrivateRoute);