import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
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

class PasswordChangeForm extends Component {
  onSubmit = async (values) => {
    await this.props.firebase
      .doPasswordUpdate(values.newPassword)
      .then(() => {
        alert('Password changed.');
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
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object().shape({
              newPassword: Yup.string()
                .required('Required')
                .min(6, "That can't be very secure."),
              confirmPassword: Yup.string()
                .required('Required')
                .min(6, "That can't be very secure.")
                .oneOf(
                  [Yup.ref('newPassword'), null],
                  'Passwords do not match.'
                ),
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
                    label="Confirm New Password"
                    variant="outlined"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    error={errors.confirmPassword && touched.confirmPassword}
                    helperText={
                      errors.confirmPassword &&
                      touched.confirmPassword &&
                      errors.confirmPassword
                    }
                  />
                </div>

                <div className={classes.formSpacing}>
                  <Button variant="contained" color="secondary" type="submit">
                    Change Password
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

export default compose(withFirebase, withStyles(styles))(PasswordChangeForm);
