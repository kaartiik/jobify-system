import React, { useEffect, useState, forwardRef } from 'react';
import { Helmet } from 'react-helmet';
import MaterialTable from 'material-table';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  OpenInNew,
} from '@material-ui/icons';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

import UserDetailsModal from './UserDetailsModal';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Unit(s)', field: 'unit' },
  { title: 'Mobile', field: 'phone' },
  { title: 'Email', field: 'email' },
];

function UsersPage(props) {
  const [users, setUsers] = useState([]);
  const [userObj, setUserObj] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUsersList = () => {
    try {
      props.firebase.users().on('value', (snapshot) => {
        const data = snapshot.val();

        for (const property in data) {
          setUsers((exsiting) => [...exsiting, data[property]]);
        }
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <MaterialTable
        title="Users List"
        icons={tableIcons}
        columns={columns}
        data={users}
        actions={[
          {
            icon: OpenInNew,
            tooltip: 'View',
            onClick: (event, rowData) => {
              setUserObj(rowData);
              handleOpen();
            },
          },
        ]}
      />
      {open && (
        <UserDetailsModal
          userData={userObj}
          isOpen={open}
          toClose={handleClose}
        />
      )}
    </div>
  );
}

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(UsersPage);
