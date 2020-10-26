import { observer } from 'mobx-react-lite';
import React,{ useEffect,useContext } from 'react';
import { Grid, GridColumn } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/loadingComponent';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityDashboard: React.FC = () => {
    const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

    return (
        <Grid>
            <Grid.Column width={10} >
                <ActivityList />
            </Grid.Column>
            <GridColumn width={6}>
               <h2>Activity filters</h2>
            </GridColumn>
        </Grid>

    )

};
export default observer(ActivityDashboard)