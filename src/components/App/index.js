import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../../theme';

import Navigation from '../Navigation';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import UsersPage from '../Users';
import PasswordResetPage from '../PasswordReset';
import Visitors from '../Visitors';
import VisitorRegistration from '../VisitorRegistration';
import VisitorStatus from '../VisitorStatus';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navigation />
        <Route
          exact
          path={ROUTES.LANDING}
          render={() => {
            return <Redirect to={ROUTES.HOME} />;
          }}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.VISITORS} component={Visitors} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.PASSWORD_RESET} component={PasswordResetPage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.USERS} component={UsersPage} />
        <Route
          path={ROUTES.VISITOR_REGISTRATION}
          component={VisitorRegistration}
        />
        <Route path={ROUTES.VISITOR_STATUS} component={VisitorStatus} />
      </div>
    </ThemeProvider>
  </Router>
);

export default withAuthentication(App);
