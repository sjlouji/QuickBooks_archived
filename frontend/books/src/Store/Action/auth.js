import axios from 'axios';
import {
  USER_LOADED,
  USER_LOADING,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  AUTH_ERROR,
  UPDATE_SUCCESS,
  DEACTIVATE_SUCCESS,
  AUTH_INIT
} from './types';


const api = axios.create({
  baseURL: `http://localhost:8000`
})

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  api
    .get(`/auth/secret`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
        console.log(err)
    });
};

// LOGIN USER
export const login = ({email, password}) => (dispatch) => {
  dispatch({ type: AUTH_INIT });
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // Request Body
  const body = JSON.stringify({ email, password });

  api
    .post('/auth/login', body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      })
    });
};

// REGISTER USER
export const register = ({ first_name,last_name, password, email, mobile }) => (dispatch) => {
  dispatch({ type: AUTH_INIT });
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Request Body
  const body = JSON.stringify({ first_name,last_name, email, password, mobile });

  api
    .post('/auth/register', body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      })
    });
};

// RESET PASSWORD USER
export const resetPassword = ({email}) => (dispatch) => {
  dispatch({ type: AUTH_INIT });

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ email });

  api
    .post('/auth/reset', body, config)
    .then((res) => {
      dispatch({
        type: RESET_PASSWORD,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      })
    });
};

// PASSWORD CHANGE
export const changePassword = ({newpassword, resetLink}) => (dispatch) => {
  dispatch({ type: AUTH_INIT });

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resetLink}`,
    
    },
  };
  // Request Body
  const body = JSON.stringify({ newpassword, resetLink });
  api
    .put('/auth/reset', body, config)
    .then((res) => {
      dispatch({
        type: CHANGE_PASSWORD,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      })
    });
};

// UPDATE USER
export const updateUser = ( first_name, last_name, mobile, bio, profile_img ) => (dispatch,getState) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ first_name, last_name, mobile, bio, profile_img });
  api
    .put('/auth/update', body, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      })
    });
};

// DEACTIVATE USER
export const deactivateUser = () => (dispatch,getState) => {
  // Request Body
  const body = JSON.stringify({  });
  api
    .put('/auth/deactivate', body ,tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DEACTIVATE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
        console.log(err)
    });
};

// CHANGE PASSWORD USER
export const passwordChangeUI = (password) => (dispatch,getState) => {
  // Request Body
  const body = JSON.stringify({ password });
  api
    .put('/auth/passwordChange', body ,tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      })
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  dispatch({
    type: LOGOUT_SUCCESS,
    payload: "he"
  });
};

// Setup config with token - helper function
export const tokenConfig = (getState) => {
  const token = getState().auth.token;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};