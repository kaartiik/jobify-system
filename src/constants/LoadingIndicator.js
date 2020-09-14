import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
var Spinner = require('react-spinkit');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },

  progress: {
    color: 'black',
  },
}));

export default function LoadingIndicator({ progress }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Spinner name="ball-scale-ripple" color="#002f6c" />
      {progress ? <h1 className={classes.progress}>{progress}%</h1> : <></>}
    </div>
  );
}
