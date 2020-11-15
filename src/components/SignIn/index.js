import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  formSpacing: {
    margin: 15,
  },
  errorText: {
    color: 'red',
  },
};

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInPage extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div className={classes.root}>
        <form onSubmit={this.onSubmit}>
          <div className={classes.root}>
            <div className={classes.formSpacing}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
              />
            </div>

            <div className={classes.formSpacing}>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
              />
            </div>

            <div className={classes.formSpacing}>
              <Button
                className={classes.button}
                disabled={isInvalid}
                variant="contained"
                color="secondary"
                type="submit"
              >
                Sign In
              </Button>
            </div>

            {error && <p className={classes.errorText}>{error.message}</p>}
          </div>
        </form>

        <PasswordForgetLink />

        <SignUpLink />
      </div>
    );
  }
}

export const SignInLink = () => (
  <p>
    Have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

export default compose(
  withRouter,
  withFirebase,
  withStyles(styles)
)(SignInPage);
