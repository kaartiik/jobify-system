import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../../theme';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import Applicants from '../Applicants';
import PasswordResetPage from '../PasswordReset';
import PostJobVacancy from '../PostJobVacancy';
import ManageVacancies from '../ManageVacancies';
import JobVacancies from '../JobVacancies';
import ApplicationStatus from '../ApplicationStatus';

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
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.PASSWORD_RESET} component={PasswordResetPage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.APPLICANTS} component={Applicants} />
        <Route path={ROUTES.POST_JOB_VACANCY} component={PostJobVacancy} />
        <Route path={ROUTES.MANAGE_VACANCIES} component={ManageVacancies} />
        <Route path={ROUTES.JOB_VACANCIES} component={JobVacancies} />
        <Route path={ROUTES.APPLICATION_STATUS} component={ApplicationStatus} />
      </div>
    </ThemeProvider>
  </Router>
);

export default withAuthentication(App);
