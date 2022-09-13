import React from 'react';
import ApolloProvider from './ApolloProvider';
import {Container} from 'react-bootstrap'
import Register from './pages/register'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss';
import Login from './pages/Login';
import Home from './pages/home/Home'
import {AuthProvider} from './context/auth';
import DynamicRoute from './util/dynamicRoute';
import AuthLogin from './util/authLogin';
import {MessageProvider} from './context/Message'

function App() {

  return (
    <ApolloProvider >
      <AuthProvider>
        <MessageProvider>
        <Router>
          <Container className='pt-5'>
            <Routes>
              <Route exact path='/' element={<DynamicRoute><Home /></DynamicRoute>}/>
              <Route  path='/register' element={<AuthLogin><Register /></AuthLogin>} />
              <Route  path='/login' element={<AuthLogin><Login /></AuthLogin>} />
            </Routes>
              
          </Container>
        </Router>
        </MessageProvider>
      </AuthProvider>
   </ApolloProvider>
  );
}

export default App;
