import React, { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Webcam from 'react-webcam';
import IconButton from '@material-ui/core/IconButton';
import { CameraAlt, Redo, Done, Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  picture: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHolder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const WebcamCapture = ({ onClose, oncapture }) => {
  const classes = useStyles();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    oncapture(imageSrc);
    setImgSrc(imageSrc);
  }, [oncapture]);

  const retakePicture = () => {
    setImgSrc(null);
    oncapture(null);
  };

  return (
    <>
      {imgSrc ? (
        <div className={classes.picture}>
          <img src={imgSrc} alt="Visitor" />
          <div className={classes.buttonHolder}>
            <IconButton
              onClick={() => retakePicture()}
              color="primary"
              aria-label="retake"
              component="span"
            >
              <Redo />
            </IconButton>

            <IconButton
              onClick={() => onClose()}
              color="primary"
              aria-label="done"
              component="span"
            >
              <Done />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className={classes.picture}>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <div className={classes.buttonHolder}>
            <IconButton
              onClick={capture}
              color="primary"
              aria-label="capture"
              component="span"
            >
              <CameraAlt />
            </IconButton>

            <IconButton
              onClick={() => onClose()}
              color="primary"
              aria-label="close"
              component="span"
            >
              <Close />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

export default WebcamCapture;
