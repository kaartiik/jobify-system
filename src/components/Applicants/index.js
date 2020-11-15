import React, { useEffect, useState, forwardRef, useContext } from 'react';
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
import { withAuthorization, AuthUserContext } from '../Session';
import * as ROLES from '../../constants/roles';

import ApplicantDetailsModal from './ApplicantDetailsModal';

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
  { title: 'Name', field: 'user_fullname' },
  { title: 'Job Title', field: 'job_title' },
  { title: 'Job Type', field: 'job_type' },
  { title: 'Mobile', field: 'user_phone_number' },
  { title: 'Email', field: 'user_email' },
];

function Applicants(props) {
  const authUser = useContext(AuthUserContext);
  const [users, setUsers] = useState([]);
  const [userObj, setUserObj] = useState();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (status !== '') {
      try {
        props.firebase.changeApplicantStatus(
          authUser.uuid,
          userObj.application_uid,
          status
        );
        props.firebase.changeApplicationStatus(
          userObj.user_uid,
          userObj.application_uid,
          status
        );
      } catch (error) {
        alert('Error updating applicant status. Please try again.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    props.firebase.getApplicants(authUser.uuid).on('value', (snapshot) => {
      if (snapshot.val() !== null || snapshot.val() !== undefined) {
        const data = snapshot.val();

        for (const property in data) {
          setUsers((exsiting) => [...exsiting, data[property]]);
        }
      } else {
        setUsers([]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>Applicants</title>
      </Helmet>
      <MaterialTable
        title="Applicants List"
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
        <ApplicantDetailsModal
          userData={userObj}
          isOpen={open}
          toClose={handleClose}
          status={status}
          onStatusChange={setStatus}
        />
      )}
    </div>
  );
}

const condition = (authUser) =>
  authUser && authUser.user_type === ROLES.EMPLOYER;

export default compose(withAuthorization(condition), withFirebase)(Applicants);
