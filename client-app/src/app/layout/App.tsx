import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import HomePage from '../../features/activities/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';


const App: React.FC<RouteComponentProps> = ({ location }) => {
  
  return (
    <Fragment>
      <Route exact path='/' component={HomePage}></Route>
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <NavBar></NavBar>
          <Container style={{ marginTop: '7em' }}>
            <Route exact path='/activities' component={ActivityDashboard}></Route>
            <Route path='/activities/:id' component={ActivityDetails}></Route>
            <Route key={location.key} path={['/CreateActivity', '/manage/:id']} component={ActivityForm}></Route>
          </Container>
        </Fragment>
      )}></Route>
    </Fragment>
  );
};


export default withRouter(observer(App));
