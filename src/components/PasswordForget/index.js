import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
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

const PasswordForgetPage = ({ classes }) => (
  <div className={classes.root}>
    <h1>Forgot Password</h1>
    <PasswordForgetForm />
  </div>
);

class PasswordForgetFormBase extends Component {
  onSubmit = async (values) => {
    await this.props.firebase
      .doPasswordReset(values.email)
      .then(() => {
        alert('Password reset link sent to your email.');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.formSpacing}>
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Invalid email').required('Required'),
            })}
            onSubmit={(values, { resetForm }) => {
              // same shape as initial values
              this.onSubmit(values).then(() => resetForm({ values: '' }));
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
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                  />
                </div>

                <div className={classes.formSpacing}>
                  <Button variant="contained" color="secondary" type="submit">
                    Reset Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default withStyles(styles)(PasswordForgetPage);

const PasswordForgetForm = compose(
  withFirebase,
  withStyles(styles)
)(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
