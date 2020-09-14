import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSpacing: {
    marginLeft: 25,
  },
}));

function AccountPage() {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>Account</title>
      </Helmet>
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div className={classes.container}>
            <h1 className={classes.formSpacing}>Account: {authUser.email}</h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        )}
      </AuthUserContext.Consumer>
    </>
  );
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(AccountPage);
