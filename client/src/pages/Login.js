import React,{useState} from 'react'
import { Row, Col, Button, Form} from 'react-bootstrap'
import { gql, useLazyQuery } from '@apollo/client';
import {useNavigate, Link} from 'react-router-dom'
import { useAuthDispatch } from '../context/auth';

const LOGIN_USER = gql`
  query login(
    $username: String! 
    $password: String! 
  
    ) {
    login(
        username: $username 
        password: $password 

        ) {
      username email createdAt token
    }
  }
`;


export default function Login() {
    const [variables, setVariables]= useState({
        username: '',
        password: ''
    })
    const Navigate = useNavigate()
    const [errors,setErrors] = useState({})

    const dispatch= useAuthDispatch()

    const [loginUser, {loading}] = useLazyQuery(LOGIN_USER,{
        onError: (err)=>{
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        onCompleted: (data)=>{
                dispatch({type:'LOGIN', payload: data.login})
                Navigate('/')
                window.location.reload('/')
        }

      })
   const submitLogin = (e) =>{
    e.preventDefault()
    loginUser({variables})
   }
  return (
    <Row className='bg-white py-5 justify-content-center'>
    <Col sm={8} md={6} lg={4}>

    <h1 className='text-center'>Login</h1>
    <Form onSubmit={submitLogin}>

    <Form.Group className="mb-3">
      <Form.Label 
        className={errors.username && 'text-danger' }
        >
            {errors.username ?? 'Username'}
        </Form.Label>
      <Form.Control 
        type="text" 
        value={variables.username} 
        className={errors.username && 'is-invalid'}
        onChange={(e)=>setVariables({...variables, username: e.target.value})}
        placeholder="Enter Username" />
    </Form.Group>


    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label 
        className={errors.password && 'text-danger' }
        >
            {errors.password ?? 'password'}
        </Form.Label>
      <Form.Control
        type="password" 
        value={variables.password} 
        className={errors.password && 'is-invalid'}
        onChange={(e)=>setVariables({...variables, password: e.target.value})}
        placeholder="Password" />
    </Form.Group>

    <div className='text-center'>
      <Button 
        variant="success" 
        type="submit" 
        disabled={loading}
        >
       {loading ? 'Loging in' : 'Login'}
      </Button>
      <br/>
      <small>Don't have an account? <Link to='/register'>Register</Link></small>
    </div>
   
  </Form>
    </Col>
  </Row>
  )
}
