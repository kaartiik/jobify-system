import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { SignInLink } from '../SignIn';

import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';

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
  displayInRow: {
    display: 'flex',
    flexDirection: 'row',
  },
};

const INITIAL_STATE = {
  type: '',
  email: '',
  password: '',
  mobile: '',
  fullName: '',
  error: null,
};

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

// const INITIAL_STATE = {
//   username: '',
//   email: '',
//   passwordOne: '',
//   passwordTwo: '',
//   error: null,
// };

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { type, email, password, fullName, mobile } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.props.firebase.createUser(authUser.user.uid, {
          uuid: authUser.user.uid,
          email: email,
          user_type: type,
          fullname: fullName,
          phone_number: mobile,
        });
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
    const { fullName, type, mobile, email, password, error } = this.state;

    const isInvalid = password === '' || email === '' || type === '';

    return (
      <div className={classes.root}>
        <h1>Create a Jobify account</h1>

        <form onSubmit={this.onSubmit}>
          <div className={classes.root}>
            <div className={classes.formSpacing}>
              <FormControl component="fieldset">
                <FormLabel component="legend">User Type</FormLabel>
                <RadioGroup
                  className={classes.displayInRow}
                  name="type"
                  value={type}
                  onChange={this.onChange}
                >
                  <FormControlLabel
                    value="job_seeker"
                    control={<Radio />}
                    label="Job Seeker"
                  />
                  <FormControlLabel
                    value="employer"
                    control={<Radio />}
                    label="Employer"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className={classes.formSpacing}>
              <TextField
                id="outlined-basic"
                label="Full Name/Company Name"
                variant="outlined"
                name="fullName"
                value={fullName}
                onChange={this.onChange}
                type="text"
              />
            </div>

            <div className={classes.formSpacing}>
              <TextField
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                name="mobile"
                value={mobile}
                onChange={this.onChange}
                type="text"
              />
            </div>

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
                Sign Up
              </Button>
            </div>

            {error && <p className={classes.errorText}>{error.message}</p>}

            <SignInLink />
          </div>
        </form>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withStyles(styles)
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
