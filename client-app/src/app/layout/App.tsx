import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import HomePage from '../../features/activities/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './loadingComponent';
import ModalContainer from '../api/common/modal/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';


const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token,appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded();
    }
  }, [getUser, token, setAppLoaded])

  if (!appLoaded) return <LoadingComponent content='Loading app ...' />
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage}></Route>
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <NavBar></NavBar>
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              <Route exact path='/activities' component={ActivityDashboard}></Route>
              <Route path='/activities/:id' component={ActivityDetails}></Route>
              <Route key={location.key} path={['/CreateActivity', '/manage/:id']} component={ActivityForm}></Route>
              <Route path='/profile/:username' component={ProfilePage} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </Fragment>
      )}></Route>
    </Fragment>
  );
};


export default withRouter(observer(App));
