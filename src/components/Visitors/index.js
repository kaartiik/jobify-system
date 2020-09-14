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

import VisitorDetailsModal from './VisitorDetailsModal';

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
  { title: 'Name', field: 'fullName' },
  { title: 'IC', field: 'icNumber' },
  { title: 'Passport', field: 'passportNumber' },
  { title: 'Mobile', field: 'mobile' },
  { title: 'Vehicle No', field: 'vehicleNo' },
  { title: 'Time', field: 'time' },
  { title: 'Date', field: 'date', defaultSort: 'desc' },
  { title: 'Visiting', field: 'placeVisiting' },
  { title: 'Unit', field: 'unit' },
];

function Visitors(props) {
  const [visitors, setVisitors] = useState([]);
  const [visitorObj, setVisitorObj] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dateFromStr = (str) => new Date('1970/01/01 ' + str);

  const getVisitorsList = () => {
    try {
      props.firebase.getVisitors().on('value', (snapshot) => {
        const data = snapshot.val();
        let toSortArr = [];
        for (const property in data) {
          toSortArr.push(data[property]);
        }
        toSortArr.sort((a, b) => dateFromStr(b.time) - dateFromStr(a.time));
        setVisitors(toSortArr);
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getVisitorsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>Visitors</title>
      </Helmet>
      <MaterialTable
        title="Visitors List"
        icons={tableIcons}
        columns={columns}
        data={visitors}
        actions={[
          {
            icon: OpenInNew,
            tooltip: 'View',
            onClick: (event, rowData) => {
              setVisitorObj(rowData);
              handleOpen();
            },
          },
        ]}
        options={{
          sorting: true,
          filtering: true,
          exportButton: true,
          pageSize: 20,
          pageSizeOptions: [20, 40, 60, 80, 100],
          toolbar: true,
          paging: true,
        }}
      />
      {open && (
        <VisitorDetailsModal
          visitorData={visitorObj}
          isOpen={open}
          toClose={handleClose}
        />
      )}
    </div>
  );
}

const condition = (authUser) =>
  authUser &&
  (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.SECURITY]);

export default compose(withAuthorization(condition), withFirebase)(Visitors);
