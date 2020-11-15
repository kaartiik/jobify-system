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
      <h3>Welcome to Jobify System</h3>
      <img src={require('../../assets/home_background.jpg')} />
    </div>
  );
}

const condition = (authUser) =>
  authUser &&
  (authUser.user_type === ROLES.EMPLOYER ||
    authUser.user_type === ROLES.JOB_SEEKER);

export default withAuthorization(condition)(HomePage);
