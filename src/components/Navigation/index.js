import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TitleAnnouncer from '../TitleAnnouncer';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';

import {
  Home,
  Menu,
  Person,
  ExitToApp,
  EmojiPeople,
  People,
  Work,
  AddCircle,
  Settings,
  DoneAll,
} from '@material-ui/icons';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
});

function Navigation({ firebase }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const menuIcons = (index) => {
    if (index === 0) return <Home />;
    else if (index === 1) return <Person />;
    else if (index === 2) return <AddCircle />;
    else if (index === 3) return <Settings />;
    else if (index === 4) return <Work />;
    else if (index === 5) return <DoneAll />;
    else if (index === 6) return <People />;
  };

  const drawerItems = (text, index, authUser) => {
    if (index === 0) {
      return (
        <Link to={ROUTES.HOME} className={classes.link}>
          <ListItem button key={text}>
            <ListItemIcon>{menuIcons(index)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      );
    } else if (index === 1) {
      return (
        <Link to={ROUTES.ACCOUNT} className={classes.link}>
          <ListItem button key={text}>
            <ListItemIcon>{menuIcons(index)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      );
    } else if (index === 2) {
      return (
        authUser.user_type === ROLES.EMPLOYER && (
          <Link to={ROUTES.POST_JOB_VACANCY} className={classes.link}>
            <ListItem button key={text}>
              <ListItemIcon>{menuIcons(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        )
      );
    } else if (index === 3) {
      return (
        authUser.user_type === ROLES.EMPLOYER && (
          <Link to={ROUTES.MANAGE_VACANCIES} className={classes.link}>
            <ListItem button key={text}>
              <ListItemIcon>{menuIcons(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        )
      );
    } else if (index === 4) {
      return (
        authUser.user_type === ROLES.JOB_SEEKER && (
          <Link to={ROUTES.JOB_VACANCIES} className={classes.link}>
            <ListItem button key={text}>
              <ListItemIcon>{menuIcons(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        )
      );
    } else if (index === 5) {
      return (
        authUser.user_type === ROLES.JOB_SEEKER && (
          <Link to={ROUTES.APPLICATION_STATUS} className={classes.link}>
            <ListItem button key={text}>
              <ListItemIcon>{menuIcons(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        )
      );
    } else if (index === 6) {
      return (
        authUser.user_type === ROLES.EMPLOYER && (
          <Link to={ROUTES.APPLICANTS} className={classes.link}>
            <ListItem button key={text}>
              <ListItemIcon>{menuIcons(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        )
      );
    }
  };

  const list = (anchor, authUser) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          'Home',
          'Account',
          'Post Job Vacancy',
          'Manage Vacancies',
          'Job Vacancies',
          'Application Status',
          'Applicants',
        ].map((text, index) => drawerItems(text, index, authUser))}
      </List>
      <Divider />
      <List>
        {['Sign Out'].map((text, index) => (
          <ListItem button onClick={() => firebase.doSignOut()} key={text}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const anchor = 'left';

  return (
    <div>
      <React.Fragment key={anchor}>
        <AuthUserContext.Consumer>
          {(authUser) =>
            authUser ? (
              <>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton
                      edge="start"
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="menu"
                      onClick={toggleDrawer(anchor, true)}
                    >
                      <Menu />
                    </IconButton>
                    <TitleAnnouncer />
                  </Toolbar>
                </AppBar>

                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor, authUser)}
                </Drawer>
              </>
            ) : (
              <></>
            )
          }
        </AuthUserContext.Consumer>
      </React.Fragment>
    </div>
  );
}

export default withFirebase(Navigation);
