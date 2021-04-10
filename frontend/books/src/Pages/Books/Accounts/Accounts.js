import React, { Component } from 'react'
import { AccountTable } from './Components/AccountTable'

export class AccountsPage extends Component {

    render() {
        return(
            <div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">Accounts</li>
                    </ol>
                </nav>
                <AccountTable />
            </div>
        );
    }
}

export default AccountsPage