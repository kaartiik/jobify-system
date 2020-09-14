import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvedHeader: {
    display: 'flex',
    flexDirection: 'column',
    height: 150,
    width: '100%',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declinedHeader: {
    display: 'flex',
    flexDirection: 'column',
    height: 150,
    width: '100%',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvalText: {
    color: 'white',
  },
  formSpacing: {
    margin: 25,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  flexCol: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitorImg: {
    width: theme.spacing(35),
    height: theme.spacing(35),
    marginTop: 10,
  },
}));

const VisitorStatus = (props) => {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [redirectLink, setRedirectLink] = useState(null);
  let visitorObject;

  if (props.location.state !== undefined) {
    visitorObject = props.location.state.vistorObjectState;
  }

  const redirectTo = (link) => {
    setRedirectLink(link);
    setRedirect(true);
  };

  return (
    <div>
      {redirect && <Redirect to={redirectLink} />}
      <Helmet>
        <title>Visitor Approval Status</title>
      </Helmet>
      <div className={classes.container}>
        {props.location.state !== undefined ? (
          <>
            <div className={classes.approvedHeader}>
              <h1 className={classes.approvalText}>Approved</h1>
              <div className={classes.flexRow}>
                <h2 className={classes.approvalText}>
                  Entry: {visitorObject.time}, {visitorObject.date}
                </h2>
              </div>
            </div>

            <Avatar
              alt="Visitor"
              variant="rounded"
              src={visitorObject.image}
              className={classes.visitorImg}
            />
            <div>
              <h3>Full Name: {visitorObject.fullName}</h3>

              {visitorObject.icNumber ? (
                <h3>IC: {visitorObject.icNumber}</h3>
              ) : (
                <h3>Passport: {visitorObject.passportNumber}</h3>
              )}

              <h3>Mobile: {visitorObject.mobile}</h3>

              {visitorObject.vehicleNo && (
                <h3>Vehicle Number: {visitorObject.vehicleNo}</h3>
              )}

              {visitorObject.purpose === 'OTHERS' ? (
                <h3>Other Purpose: {visitorObject.others}</h3>
              ) : (
                <h3>Purpose: {visitorObject.purpose}</h3>
              )}

              <h3>Visiting: {visitorObject.placeVisiting}</h3>

              {visitorObject.placeVisiting === 'UNIT' && (
                <h3>Unit: {visitorObject.unit}</h3>
              )}

              <h3>Time of Entry: {visitorObject.time}</h3>

              <h3>Date of Entry: {visitorObject.date}</h3>
            </div>
          </>
        ) : (
          <>
            <div className={classes.declinedHeader}>
              <div className={classes.flexRow}>
                <h1 className={classes.approvalText}>Declined</h1>
              </div>
              <div className={classes.flexRow}>
                <h3 className={classes.approvalText}>
                  Please register for entry aproval!
                </h3>
              </div>
            </div>
          </>
        )}
        <div className={classes.flexRow}>
          <div className={classes.formSpacing}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={() => redirectTo(ROUTES.VISITOR_REGISTRATION)}
            >
              Visitor Registration
            </Button>
          </div>

          <div className={classes.formSpacing}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={() => redirectTo(ROUTES.VISITORS)}
            >
              Visitors
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const condition = (authUser) =>
  authUser &&
  (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.SECURITY]);

export default compose(
  withAuthorization(condition),
  withFirebase
)(VisitorStatus);
