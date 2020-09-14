import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Modal, Backdrop, Fade, IconButton } from '@material-ui/core';
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

const VisitorDetailsModal = ({ visitorData, isOpen, toClose }) => {
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
                <h4>Full Name: {visitorData.fullName}</h4>
                {visitorData.icNumber ? (
                  <h4>IC: {visitorData.icNumber}</h4>
                ) : (
                  <h4>Passport: {visitorData.passportNumber}</h4>
                )}
                <h4>Mobile: {visitorData.mobile}</h4>
                {visitorData.vehicleNo && (
                  <h4>Vehicle No: {visitorData.vehicleNo}</h4>
                )}
                {visitorData.purpose === 'OTHERS' ? (
                  <h4>Other Purpose: {visitorData.others}</h4>
                ) : (
                  <h4>Purpose: {visitorData.purpose}</h4>
                )}

                <h4>Visiting: {visitorData.placeVisiting}</h4>

                {visitorData.placeVisiting === 'UNIT' && (
                  <h4>Unit: {visitorData.unit}</h4>
                )}

                <h4>Time: {visitorData.time}</h4>
                <h4>Date: {visitorData.date}</h4>
              </div>
              <Avatar
                alt="Visitor"
                variant="rounded"
                src={visitorData.image}
                className={classes.visitorImg}
              />
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default VisitorDetailsModal;
