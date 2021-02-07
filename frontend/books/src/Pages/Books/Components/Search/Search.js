import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField, InputAdornment} from '@material-ui/core';
import {withRouter} from 'react-router'
import { connect } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { home: 'Home', icon: "home"},
    { home: 'Profile', icon: "book-open"},
    { home: 'Account', icon: "book-open"},
    { home: 'Expense', icon:"book-open"},
    { home: 'Tags', icon: "book-open"},
  ];

export class Search extends React.Component {

    componentDidMount(){
        console.log(this.props.location.history)
    }

    redirect(route) {
        if(route === 'Home'){this.props.location.history.push('/')}
        else if(route === 'Profile'){this.props.location.history.push('/profile')}
    }

    render() {
        return(
            <form class="search-form">
                <div class="input-group">
                    <Autocomplete
                        multiple
                        id="free-solo-demo"
                        freeSolo
                        options={top100Films}
                        getOptionLabel={(option) => option.home}
                        onChange={(event,input)=>{
                            this.redirect(event.target.innerText)
                        }}
                        renderOption={(option, { selected }) => (
                            <React.Fragment>
                                <div>
                                    <i data-feather={option.icon}></i> {option.home}
                                </div>
                            </React.Fragment>
                        )}
                        style={{ width: 500 }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Search"  InputProps={{...params.InputProps, disableUnderline: true, startAdornment: (<InputAdornment position="start"><SearchIcon /> </InputAdornment> ) }}/>
                        )}
                        />
                </div>
            </form>
        );
    }
}

export default connect(withRouter(Search))