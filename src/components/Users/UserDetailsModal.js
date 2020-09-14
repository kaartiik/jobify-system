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

const UserDetailsModal = ({ userData, isOpen, toClose }) => {
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
                <h4>Full Name: {userData.name}</h4>
                <h4>Unit(s): {userData.unit}</h4>
                <h4>Mobile: {userData.phone}</h4>
                <h4>Email: {userData.email}</h4>
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
