import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  RadioGroup,
  Radio,
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import LoadingIndicator from '../../constants/LoadingIndicator';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROLES from '../../constants/roles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSpacing: {
    margin: 15,
    width: '150%',
  },
  inputSize: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  labelGap: {
    margin: 10,
  },
  selectError: {
    color: 'red',
  },
  selectSize: {
    width: 220,
  },
  fileCountText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayInRow: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

function VisitorRegistration(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const submitDetails = (values, authUser) => {
    const { jobTitle, idRadio, jobDescription } = values;

    const key = props.firebase.generateVacancyKey();

    const vacancyObject = {
      vacancy_uid: key,
      job_title: jobTitle,
      job_type: idRadio,
      job_description: jobDescription,
      ...authUser,
    };

    try {
      props.firebase.postVacancy(key, vacancyObject);

      props.firebase.saveVacancyForEmployer(authUser.uuid, key, vacancyObject);

      setLoading(false);
      alert('Job vacancy posted!');
    } catch (error) {
      setLoading(false);
      alert('Error! Please register again.');
    }
  };

  return (
    <div>
      <Helmet>
        <title>Post Job Vacancy</title>
      </Helmet>
      {loading ? (
        <div>
          <LoadingIndicator />
        </div>
      ) : (
        <AuthUserContext.Consumer>
          {(authUser) => (
            <div className={classes.container}>
              <Formik
                initialValues={{
                  jobTitle: '',
                  idRadio: '',
                  jobDescription: '',
                }}
                validationSchema={Yup.object().shape({
                  jobTitle: Yup.string()
                    .min(2, 'Too Short!')
                    .matches('^[a-zA-Z ]+$', 'Only alphabets allowed')
                    .required('Required'),
                  idRadio: Yup.string().required('Required'),
                  jobDescription: Yup.string()
                    .min(2, 'Too Short!')
                    .matches('^[a-zA-Z ]+$', 'Only alphabets allowed')
                    .required('Required'),
                })}
                onSubmit={(values) => submitDetails(values, authUser)}
              >
                {({
                  values,
                  setFieldValue,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                  resetForm,
                }) => (
                  <Form className={classes.container}>
                    <div className={classes.formSpacing}>
                      <TextField
                        className={classes.inputSize}
                        id="outlined-basic"
                        label="Job Title"
                        variant="outlined"
                        name="jobTitle"
                        value={values.jobTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.jobTitle && touched.jobTitle}
                        helperText={
                          errors.jobTitle && touched.jobTitle && errors.jobTitle
                        }
                      />
                    </div>

                    <div className={classes.formSpacing}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Job Type</FormLabel>
                        <RadioGroup
                          className={classes.displayInRow}
                          name="idRadio"
                          value={values.idRadio}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          <FormControlLabel
                            value="Full Time"
                            control={<Radio />}
                            label="Full Time"
                          />
                          <FormControlLabel
                            value="Part Time"
                            control={<Radio />}
                            label="Part Time"
                          />
                        </RadioGroup>
                        {errors.idRadio && touched.idRadio && (
                          <FormHelperText className={classes.selectError}>
                            {errors.idRadio}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>

                    <div className={classes.formSpacing}>
                      <TextField
                        multiline
                        className={classes.inputSize}
                        id="outlined-basic"
                        label="Job Description"
                        variant="outlined"
                        name="jobDescription"
                        value={values.jobDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.jobDescription && touched.jobDescription}
                        helperText={
                          errors.jobDescription &&
                          touched.jobDescription &&
                          errors.jobDescription
                        }
                      />
                    </div>

                    <div className={classes.displayInRow}>
                      <div className={classes.formSpacing}>
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="secondary"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>

                      <div className={classes.formSpacing}>
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="secondary"
                          type="reset"
                          onClick={() => {
                            resetForm();
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </AuthUserContext.Consumer>
      )}
    </div>
  );
}

const condition = (authUser) =>
  authUser && authUser.user_type === ROLES.EMPLOYER;

export default compose(
  withAuthorization(condition),
  withFirebase
)(VisitorRegistration);
