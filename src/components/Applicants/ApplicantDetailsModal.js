import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  visitorImg: {
    width: theme.spacing(35),
    height: theme.spacing(35),
    margin: 30,
  },
  closeIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  formSpacing: {
    margin: 25,
  },
  selectSize: {
    width: 220,
  },
}));

const UserDetailsModal = ({
  userData,
  isOpen,
  toClose,
  status,
  onStatusChange,
}) => {
  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isOpen}
        onClose={toClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <div className={classes.paper}>
            <div className={classes.closeIcon}>
              <IconButton
                onClick={() => toClose()}
                color="primary"
                aria-label="close"
                component="span"
              >
                <Close />
              </IconButton>
            </div>
            <div className={classes.flexRow}>
              <div>
                <h4>Full Name: {userData.user_fullname}</h4>
                <h4>Mobile: {userData.user_phone_number}</h4>
                <h4>Email: {userData.user_email}</h4>
                <h4>Job Title: {userData.job_title}</h4>
                <h4>Job Description: {userData.job_description}</h4>
                <h4>Job Type: {userData.job_type}</h4>
                <h4>Application Status: {userData.application_status}</h4>

                <div className={classes.formSpacing}>
                  <FormControl variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Status
                    </InputLabel>

                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={status}
                      onChange={(e) => {
                        onStatusChange(e.target.value);
                      }}
                      label="Status"
                      name="status"
                      className={classes.selectSize}
                    >
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Selected">Selected</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              {userData.avatar === 'noDP' ? (
                <Avatar alt="User" className={classes.visitorImg} />
              ) : (
                <Avatar
                  alt="User"
                  variant="rounded"
                  src={userData.avatar}
                  className={classes.visitorImg}
                />
              )}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default UserDetailsModal;
