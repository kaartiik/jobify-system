import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {
  Button,
  TextField,
  InputLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import LoadingIndicator from '../../constants/LoadingIndicator';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROLES from '../../constants/roles';

import PURPOSE from './purpose';
import PLACES from './places';
import UNITS from './units';

import VisitorImageModal from './VisitorImageModal';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  const [vistorObjectState, setVistorObjectState] = useState();
  const [visitorImg, setVistorImg] = useState(null);
  const [noImg, setNoImg] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [open, setOpen] = useState(false);

  const icRef2 = useRef(null);
  const icRef3 = useRef(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImage = (imgBase64) => {
    if (imgBase64) {
      setVistorImg(imgBase64);
      setNoImg(false);
    } else {
      setVistorImg(null);
      setNoImg(true);
    }
  };

  const handleImageReset = () => {
    setVistorImg(null);
    setNoImg(false);
  };

  const uploadImg = (values) => {
    if (visitorImg === null) {
      setNoImg(true);
      return;
    }
    setLoading(true);
    let id;
    if (values.passport) {
      id = values.passport.toUpperCase();
    } else {
      id = `${values.icNum1}${values.icNum2}${values.icNum3}`;
    }
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hour = newDate.getHours();
    let minutes = newDate.getMinutes();
    let seconds = newDate.getUTCSeconds();

    let timestamp = {
      date: date,
      month: month,
      year: year,
      hour: hour,
      minutes: minutes,
      seconds: seconds,
      formattedTime: newDate.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    };

    const storageRef = props.firebase.imageFile();
    let uploadTask = storageRef
      .child(`${date}${month}${year}`)
      .child(`${id}_${date}${month}${year}_${hour}${minutes}${seconds}`)
      .putString(visitorImg, 'data_url');

    uploadTask.on(
      'state_changed',
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      function (error) {
        alert('Error uploading image!');
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          submitDetails(id, values, downloadURL, timestamp);
        });
      }
    );
  };

  const submitDetails = (identityNo, values, downloadURL, timestamp) => {
    const database = props.firebase.database();
    let unitValue = '';
    if (values.unit) unitValue = `${values.block.toUpperCase()}-${values.unit}`;

    const visitorObj = {
      fullName: values.fullName.toUpperCase(),
      icNumber: `${values.icNum1}${values.icNum2}${values.icNum3}`,
      passportNumber: values.passport.toUpperCase(),
      mobile: values.mobile,
      vehicleNo: values.vehicleNo.replace(/\s/g, '').toUpperCase(),
      purpose: values.purpose.toUpperCase(),
      others: values.others.toUpperCase(),
      placeVisiting: values.place.toUpperCase(),
      unit: unitValue,
      date: `${timestamp.year}-${timestamp.month}-${timestamp.date}`,
      day: `${timestamp.date}`,
      month: `${timestamp.month}`,
      year: `${timestamp.year}`,
      time: `${timestamp.formattedTime}`,
      image: downloadURL,
    };

    setVistorObjectState(visitorObj);

    try {
      database
        .ref('Visitors')
        .child(
          `${identityNo}_${timestamp.date}${timestamp.month}${timestamp.year}_${timestamp.hour}${timestamp.minutes}${timestamp.seconds}`
        )
        .set(visitorObj)
        .then(() => {
          setLoading(false);
          setRedirect(true);
        });
    } catch (error) {
      setLoading(false);
      alert('Error! Please register again.');
    }
  };

  return (
    <div>
      <Helmet>
        <title>Menara Pelangi Visitor Registration</title>
      </Helmet>
      {redirect && (
        <Redirect
          to={{ pathname: ROUTES.VISITOR_STATUS, state: { vistorObjectState } }}
        />
      )}
      {loading ? (
        <div>
          <LoadingIndicator />
        </div>
      ) : (
        <div className={classes.container}>
          <Formik
            initialValues={{
              fullName: '',
              idRadio: '',
              icNum1: '',
              icNum2: '',
              icNum3: '',
              passport: '',
              mobile: '',
              isVehicle: false,
              vehicleNo: '',
              purpose: '',
              others: '',
              place: '',
              block: '',
              unit: '',
            }}
            validationSchema={Yup.object().shape({
              fullName: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .matches('^[a-zA-Z ]+$', 'Only alphabets allowed')
                .required('Required'),
              idRadio: Yup.string().required('Required'),
              icNum1: Yup.string().when('idRadio', {
                is: (value) => value === 'IC',
                then: Yup.string()
                  .min(6, 'Too Short!')
                  .max(6, 'Too Long!')
                  .matches('^[0-9]*$', 'Only numbers allowed')
                  .required('Required'),
                otherwise: Yup.string(),
              }),
              icNum2: Yup.string().when('idRadio', {
                is: (value) => value === 'IC',
                then: Yup.string()
                  .min(2, 'Too Short!')
                  .max(2, 'Too Long!')
                  .matches('^[0-9]*$', 'Only numbers allowed')
                  .required('Required'),
                otherwise: Yup.string(),
              }),
              icNum3: Yup.string().when('idRadio', {
                is: (value) => value === 'IC',
                then: Yup.string()
                  .min(4, 'Too Short!')
                  .max(4, 'Too Long!')
                  .matches('^[0-9]*$', 'Only numbers allowed')
                  .required('Required'),
                otherwise: Yup.string(),
              }),
              passport: Yup.string().when('idRadio', {
                is: (value) => value === 'PASSPORT',
                then: Yup.string()
                  .min(5, 'Too Short!')
                  .max(12, 'Too Long!')
                  .matches(
                    '^[a-zA-Z,0-9]+$',
                    'Only aplhanumeric characters allowed'
                  )
                  .required('Required'),
                otherwise: Yup.string(),
              }),
              mobile: Yup.string()
                .min(9, 'Too Short!')
                .max(20, 'Too Long!')
                .matches('^[0-9]*$', 'Only numbers allowed')
                .required('Required'),
              isVehicle: Yup.boolean(),
              vehicleNo: Yup.string().when('isVehicle', {
                is: true,
                then: Yup.string()
                  .min(2, 'Too Short!')
                  .max(8, 'Too Long!')
                  .required('Required'),
                otherwise: Yup.string(),
              }),
              purpose: Yup.string().required('Required'),
              others: Yup.string().when('purpose', {
                is: (value) => value === 'OTHERS',
                then: Yup.string()
                  .min(2, 'Too Short!')
                  .max(50, 'Too Long!')
                  .matches('^[a-zA-Z]+$', 'Only alphabets allowed')
                  .required('Required'),
                otherwise: Yup.string(),
              }),
              place: Yup.string().required('Required'),
              block: Yup.string().when('place', {
                is: (value) => value === 'UNIT',
                then: Yup.string().required('Required'),
                otherwise: Yup.string(),
              }),
              unit: Yup.string().when('place', {
                is: (value) => value === 'UNIT',
                then: Yup.string().required('Required'),
                otherwise: Yup.string(),
              }),
            })}
            onSubmit={(values) => {
              // same shape as initial values
              uploadImg(values);
            }}
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
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    error={errors.fullName && touched.fullName}
                    helperText={
                      errors.fullName && touched.fullName && errors.fullName
                    }
                  />
                </div>

                <div className={classes.formSpacing}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">ID Type</FormLabel>
                    <RadioGroup
                      className={classes.displayInRow}
                      aria-label="gender"
                      name="idRadio"
                      value={values.idRadio}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue('icNum1', '');
                        setFieldValue('icNum2', '');
                        setFieldValue('icNum3', '');
                        setFieldValue('passport', '');
                      }}
                    >
                      <FormControlLabel
                        value="IC"
                        control={<Radio />}
                        label="IC"
                      />
                      <FormControlLabel
                        value="PASSPORT"
                        control={<Radio />}
                        label="Passport"
                      />
                    </RadioGroup>
                    {errors.idRadio && touched.idRadio && (
                      <FormHelperText className={classes.selectError}>
                        {errors.idRadio}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                {values.idRadio === 'IC' && (
                  <div className={classes.displayInRow}>
                    <div className={classes.formSpacing}>
                      <TextField
                        id="outlined-basic"
                        label="IC Field 1"
                        variant="outlined"
                        name="icNum1"
                        value={values.icNum1}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value.length >= 6) {
                            icRef2.current.focus();
                          }
                        }}
                        onBlur={handleBlur}
                        type="text"
                        inputProps={{ maxLength: 6 }}
                        error={errors.icNum1 && touched.icNum1}
                        helperText={
                          errors.icNum1 && touched.icNum1 && errors.icNum1
                        }
                      />
                    </div>

                    <div className={classes.formSpacing}>
                      <TextField
                        inputRef={icRef2}
                        id="outlined-basic"
                        label="IC Field 2"
                        variant="outlined"
                        name="icNum2"
                        value={values.icNum2}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value.length >= 2) {
                            icRef3.current.focus();
                          }
                        }}
                        onBlur={handleBlur}
                        type="text"
                        inputProps={{ maxLength: 2 }}
                        error={errors.icNum2 && touched.icNum2}
                        helperText={
                          errors.icNum2 && touched.icNum2 && errors.icNum2
                        }
                      />
                    </div>

                    <div className={classes.formSpacing}>
                      <TextField
                        inputRef={icRef3}
                        id="outlined-basic"
                        label="IC Field 3"
                        variant="outlined"
                        name="icNum3"
                        value={values.icNum3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        inputProps={{ maxLength: 4 }}
                        error={errors.icNum3 && touched.icNum3}
                        helperText={
                          errors.icNum3 && touched.icNum3 && errors.icNum3
                        }
                      />
                    </div>
                  </div>
                )}

                {values.idRadio === 'PASSPORT' && (
                  <div className={classes.formSpacing}>
                    <TextField
                      id="outlined-basic"
                      label="Passport"
                      variant="outlined"
                      name="passport"
                      value={values.passport}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      inputProps={{ maxLength: 12 }}
                      error={errors.passport && touched.passport}
                      helperText={
                        errors.passport && touched.passport && errors.passport
                      }
                    />
                  </div>
                )}

                <div className={classes.formSpacing}>
                  <TextField
                    id="outlined-basic"
                    label="Mobile"
                    variant="outlined"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    error={errors.mobile && touched.mobile}
                    helperText={
                      errors.mobile && touched.mobile && errors.mobile
                    }
                  />
                </div>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isVehicle}
                      onChange={() => {
                        setFieldValue('isVehicle', !values.isVehicle);
                        setFieldValue('vehicleNo', '');
                      }}
                      name="isVehicle"
                      color="primary"
                    />
                  }
                  label="Vehicle Entry?"
                />

                {values.isVehicle && (
                  <div className={classes.formSpacing}>
                    <TextField
                      id="outlined-basic"
                      label="Vehicle Number"
                      variant="outlined"
                      name="vehicleNo"
                      value={values.vehicleNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      error={errors.vehicleNo && touched.vehicleNo}
                      helperText={
                        errors.vehicleNo &&
                        touched.vehicleNo &&
                        errors.vehicleNo
                      }
                    />
                  </div>
                )}

                <div className={classes.formSpacing}>
                  <FormControl
                    error={errors.purpose && touched.purpose}
                    variant="outlined"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Purpose
                    </InputLabel>

                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={values.purpose}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue('others', '');
                      }}
                      label="Purpose"
                      name="purpose"
                      className={classes.selectSize}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {Object.values(PURPOSE).map((item) => (
                        <MenuItem value={item.toUpperCase()}>{item}</MenuItem>
                      ))}
                    </Select>
                    {errors.purpose && touched.purpose && (
                      <FormHelperText className={classes.selectError}>
                        {errors.purpose}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                {values.purpose === 'OTHERS' && (
                  <div className={classes.formSpacing}>
                    <TextField
                      id="outlined-basic"
                      label="Other Purpose"
                      variant="outlined"
                      name="others"
                      value={values.others}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      error={errors.others && touched.others}
                      helperText={
                        errors.others && touched.others && errors.others
                      }
                    />
                  </div>
                )}

                <div className={classes.formSpacing}>
                  <FormControl
                    error={errors.place && touched.place}
                    variant="outlined"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Visiting
                    </InputLabel>

                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={values.place}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue('block', '');
                        setFieldValue('unit', '');
                      }}
                      label="Visiting"
                      name="place"
                      className={classes.selectSize}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {Object.values(PLACES).map((item) => (
                        <MenuItem value={item.toUpperCase()}>{item}</MenuItem>
                      ))}
                    </Select>
                    {errors.place && touched.place && (
                      <FormHelperText className={classes.selectError}>
                        {errors.place}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                {values.place === 'UNIT' && (
                  <div className={classes.displayInRow}>
                    <div className={classes.formSpacing}>
                      <FormControl
                        error={errors.block && touched.block}
                        variant="outlined"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          Block
                        </InputLabel>

                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={values.block}
                          onChange={handleChange}
                          label="Block"
                          name="block"
                          className={classes.selectSize}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'A'}>{'Block A'}</MenuItem>
                          <MenuItem value={'B'}>{'Block B'}</MenuItem>
                        </Select>
                        {errors.block && touched.block && (
                          <FormHelperText className={classes.selectError}>
                            {errors.block}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>

                    <div className={classes.formSpacing}>
                      <FormControl
                        error={errors.unit && touched.unit}
                        variant="outlined"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          Unit
                        </InputLabel>

                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={values.unit}
                          onChange={handleChange}
                          label="Unit"
                          name="unit"
                          className={classes.selectSize}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {UNITS.map((unit) => (
                            <MenuItem value={unit}>{unit}</MenuItem>
                          ))}
                        </Select>
                        {errors.unit && touched.unit && (
                          <FormHelperText className={classes.selectError}>
                            {errors.unit}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                )}

                <div className={classes.formSpacing}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpen()}
                  >
                    Visitor Image
                  </Button>
                  {noImg && (
                    <FormHelperText className={classes.selectError}>
                      Required
                    </FormHelperText>
                  )}
                  <div className={classes.fileCountText}>
                    {visitorImg ? (
                      <h5 style={{ color: 'green' }}>Photo taken</h5>
                    ) : (
                      <h5 style={{ color: 'red' }}>No Photo taken</h5>
                    )}
                  </div>
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
                        handleImageReset();
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
      {open && (
        <VisitorImageModal
          isOpen={open}
          toClose={handleClose}
          imgHandler={handleImage}
        />
      )}
    </div>
  );
}

const condition = (authUser) =>
  authUser &&
  (!!authUser.roles[ROLES.ADMIN] || !!authUser.roles[ROLES.SECURITY]);

export default compose(
  withAuthorization(condition),
  withFirebase
)(VisitorRegistration);
