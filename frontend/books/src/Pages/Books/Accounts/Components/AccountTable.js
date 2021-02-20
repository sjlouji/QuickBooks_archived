import React, { Component } from 'react'
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const data = [
  {
    key: '1',
    account_name: 'Indian Bank',
    type: 'Bank Account',
    balance: '100',
    created_at: '7th Dec'
  },
  {
    key: '2',
    account_name: 'ICICI Bank',
    type: 'Bank Account',
    balance: '15000',
    created_at: '7th Dec'
  },
  {
    key: '3',
    account_name: 'Paytm Wallet',
    type: 'Wallet',
    balance: '8000',
    created_at: '7th Dec'
  },
  {
    key: '4',
    account_name: 'Gpay',
    type: 'UPI',
    balance: '2000',
    created_at: '7th Dec'
  },
  {
    key: '5',
    account_name: 'ICICI pay',
    type: 'UPI',
    balance: '100',
    created_at: '7th Dec'
  },

];

export class AccountTable extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    sortedInfo: null,
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: 'Account Name',
        dataIndex: 'account_name',
        key: 'account_name',
        width: '20%',
        ...this.getColumnSearchProps('account_name'),
      },
      {
        title: 'Account Type',
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        ...this.getColumnSearchProps('balance'),
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        ...this.getColumnSearchProps('balance'),
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        ...this.getColumnSearchProps('created_at'),
      },
    ];
    return <Table columns={columns} dataSource={data} />;
  }
}

export default AccountTable;