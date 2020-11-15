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

import ApplicationDetailsModal from './ApplicationDetailsModal';

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
  { title: 'Company', field: 'company_name' },
  { title: 'Job Title', field: 'job_title' },
  { title: 'Job Type', field: 'job_type' },
  { title: 'Status', field: 'application_status' },
];

function ApplicationStatus(props) {
  const authUser = useContext(AuthUserContext);
  const [applications, setApplications] = useState([]);
  const [jobObj, setJobObj] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    props.firebase.getApplications(authUser.uuid).on('value', (snapshot) => {
      const data = snapshot.val();

      for (const property in data) {
        setApplications((exsiting) => [...exsiting, data[property]]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>Application Status</title>
      </Helmet>
      <MaterialTable
        title="Application List"
        icons={tableIcons}
        columns={columns}
        data={applications}
        actions={[
          {
            icon: OpenInNew,
            tooltip: 'View',
            onClick: (event, rowData) => {
              setJobObj(rowData);
              handleOpen();
            },
          },
        ]}
      />
      {open && (
        <ApplicationDetailsModal
          jobData={jobObj}
          isOpen={open}
          toClose={handleClose}
        />
      )}
    </div>
  );
}

const condition = (authUser) =>
  authUser && authUser.user_type === ROLES.JOB_SEEKER;

export default compose(
  withAuthorization(condition),
  withFirebase
)(ApplicationStatus);
