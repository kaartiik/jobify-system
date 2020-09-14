import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
}));

// const RegisterSchema = ;

const QRCodeGenerator = ({ details }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.container}>
        <QRCode value={details} />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
