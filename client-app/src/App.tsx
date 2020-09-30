import React, {Component} from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state ={ 
    values: []
  }

    componentDidMount(){
      axios.get('http://localhost:5000/api/values')
      .then((reponse) => {

        this.setState({
          values: reponse.data
        })
      })
      
    }
  render(){
    return (
      <div>
        <Header as='h2' icon>
          <Icon name='users' />Reactivities
          <Header.Subheader></Header.Subheader>
        </Header>
        <List>
        {this.state.values.map((value :any) =>(
              <List.Item key={value.id}>{value.name}</List.Item>
           ))}
        </List>
         <ul>
          
         </ul>
      </div>
    );
  }
 
}

export default App;
