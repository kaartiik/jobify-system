import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Modal, Backdrop, Fade, IconButton } from '@material-ui/core';
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
}));

const ApplicationDetailsModal = ({ jobData, isOpen, toClose }) => {
  const classes = useStyles();

  return (
    <div>
      <Modal
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
                <h4>Company: {jobData.company_name}</h4>
                <h4>Job Title: {jobData.job_title}</h4>
                <h4>Job Description: {jobData.job_description}</h4>
                <h4>Job Type: {jobData.job_type}</h4>
                <h4>Email: {jobData.company_email}</h4>
                <h4>Phone Number: {jobData.company_phone_number}</h4>
                <h4>Application Status: {jobData.application_status}</h4>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ApplicationDetailsModal;
