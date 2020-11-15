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

import VacancyDetailsModal from './VacancyDetailsModal';

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
  { title: 'Company', field: 'fullname' },
  { title: 'Job Title', field: 'job_title' },
  { title: 'Job Description', field: 'job_description' },
  { title: 'Job Type', field: 'job_type' },
];

function JobVacancies(props) {
  const authUser = useContext(AuthUserContext);
  const [vacancies, setVacancies] = useState([]);
  const [jobObj, setJobObj] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const applyJob = (jobDetails) => {
    const key = props.firebase.generateApplicantKey();
    const companyUid = jobDetails.company_uid;

    const applicantObject = {
      ...jobDetails,
      application_uid: key,
      application_status: 'Processing',
      user_uid: authUser.uuid,
      user_fullname: authUser.fullname,
      user_email: authUser.email,
      user_phone_number: authUser.phone_number,
    };

    try {
      props.firebase.applyJob(companyUid, key, applicantObject);

      props.firebase.saveAppliedJobForUser(authUser.uuid, key, applicantObject);

      alert('Application sent successfully!');
    } catch (error) {
      alert('Error in job application! Please try again.');
    }
  };

  useEffect(() => {
    props.firebase.getAllVacancies().on('value', (snapshot) => {
      const data = snapshot.val();

      for (const property in data) {
        setVacancies((exsiting) => [...exsiting, data[property]]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>Job Vacancies</title>
      </Helmet>
      <MaterialTable
        title="Vacancies List"
        icons={tableIcons}
        columns={columns}
        data={vacancies}
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
        <VacancyDetailsModal
          jobData={jobObj}
          isOpen={open}
          toClose={handleClose}
          applyJob={applyJob}
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
)(JobVacancies);
