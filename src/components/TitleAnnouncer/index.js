import React, { useState, useEffect, createRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
}));

const TitleAnnouncer = (props) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const titleRef = createRef();
  const { pathname } = useLocation();

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Typography variant="h4" className={classes.title} ref={titleRef}>
        {title}
      </Typography>
      <Helmet onChangeClientState={({ title }) => setTitle(title)} />
    </>
  );
};

export default TitleAnnouncer;
