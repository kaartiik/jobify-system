import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function HomePage() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <p>Welcome to MPMC Visitor Management System</p>
    </div>
  );
}

const condition = (authUser) =>
  authUser &&
  (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.SECURITY]);

export default withAuthorization(condition)(HomePage);
