import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Base64 } from 'js-base64';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSpacing: {
    margin: 15,
  },
};

class PasswordResetPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      email: '',
      validCode: false,
      error: null,
      redirect: false,
    };
  }

  componentDidMount() {
    var that = this;
    let params = new URL(document.location).searchParams;
    let code = params.get('oobCode');
    this.setState({ code: code });

    this.props.firebase
      .verifyReset(code)
      .then(function (email) {
        that.setState({ email: email, validCode: true });
      })
      .catch(function (error) {
        alert(error);
      });
  }

  onSubmit = (values) => {
    var that = this;
    const { code, email } = this.state;
    let encrypt = Base64.encode(values.newPassword);

    this.props.firebase
      .confirmReset(code, values.newPassword)
      .then(function () {
        that.props.firebase.updateKey(email, encrypt);

        that.setState({
          code: '',
          email: '',
          validCode: false,
          redirect: true,
        });
        alert('Password updated. You can now login with your new password.');
      })
      .catch(function (error) {
        alert(error.message);
      });
  };

  render() {
    const { classes } = this.props;
    const { validCode, redirect } = this.state;

    return (
      <>
        {redirect && <Redirect to={ROUTES.SIGN_IN} />}
        <div className={classes.root}>
          <h1>Reset Password</h1>
          {validCode ? (
            <div className={classes.root}>
              <Formik
                initialValues={{
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={Yup.object().shape({
                  newPassword: Yup.string()
                    .required('Required')
                    .min(8, 'Minimum 8 characters'),
                  confirmPassword: Yup.string()
                    .required('Required')
                    .min(8, 'Minimum 8 characters.')
                    .oneOf(
                      [Yup.ref('newPassword'), null],
                      'Passwords do not match.'
                    ),
                })}
                onSubmit={(values, { resetForm }) => {
                  // same shape as initial values
                  this.onSubmit(values);
                }}
              >
                {({
                  values,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                }) => (
                  <Form className={classes.root}>
                    <div className={classes.formSpacing}>
                      <TextField
                        id="outlined-basic"
                        label="New Password"
                        variant="outlined"
                        name="newPassword"
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="password"
                        error={errors.newPassword && touched.newPassword}
                        helperText={
                          errors.newPassword &&
                          touched.newPassword &&
                          errors.newPassword
                        }
                      />
                    </div>

                    <div className={classes.formSpacing}>
                      <TextField
                        id="outlined-basic"
                        label="Confirm Password"
                        variant="outlined"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="password"
                        error={
                          errors.confirmPassword && touched.confirmPassword
                        }
                        helperText={
                          errors.confirmPassword &&
                          touched.confirmPassword &&
                          errors.confirmPassword
                        }
                      />
                    </div>

                    <div className={classes.formSpacing}>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                      >
                        Change Password
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </>
    );
  }
}

export default compose(withFirebase, withStyles(styles))(PasswordResetPage);
