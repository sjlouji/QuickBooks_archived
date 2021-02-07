import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    UPDATE_SUCCESS,
    DEACTIVATE_SUCCESS,
    AUTH_INIT
  } from '../Action/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
    authLoading: false,
    user: null,
  };

  export default function (state = initialState ,action) {
    switch (action.type) {

      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
          authLoading: false,
          user: action.payload,
        };
      case LOGIN_SUCCESS:
        localStorage.setItem('token', action.payload.Token);
        return {
          ...state,
          user: action.payload,
          isAuthenticated: true,
          authLoading: false,
          isLoading: false,
        };
      case REGISTER_SUCCESS:
        localStorage.setItem('token', action.payload.Token)
        return {
          ...state,
          user: action.payload,
          isAuthenticated: true,
          isLoading: false,
          authLoading: false
        };
      case AUTH_ERROR:
        return {
          ...state,
          error: action.payload,
          authLoading: false
        }
      case LOGIN_FAIL:
      case LOGOUT_SUCCESS:
        localStorage.removeItem('token');
        return{
          logout: 'SUCCESS',
          authLoading: false
        }
      case RESET_PASSWORD:
        return{
          ...state,
          reset: action.payload,
          authLoading: false
        };
      case CHANGE_PASSWORD:
        return{
          ...state,
          authLoading: false,
          reset: action.payload
        };
      case REGISTER_FAIL:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          authLoading: false
        };
      case UPDATE_SUCCESS:
        return{
          ...state,
          user: action.payload,
          isAuthenticated: true,
          isLoading: false,
        }
      case DEACTIVATE_SUCCESS:
        return{
          ...state,
          isAuthenticated: false,
          isLoading: false
        }
      case AUTH_INIT:
        return{
          isAuthenticated: false,
          authLoading: true,
          user: null,
        }   
      default:
        return state;
    }
  }