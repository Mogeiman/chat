import React,{useState} from 'react'
import { Row, Col, Button, Form} from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom'

const REGISTER_USER = gql`
  mutation register(
    $username: String! 
    $email: String! 
    $password: String! 
    $confirmPassword: String!
    ) {
    register(
        username: $username 
        email: $email 
        password: $password 
        confirmPassword: $confirmPassword
        ) {
      username email createdAt
    }
  }
`;

function Register() {

    const [variables, setVariables] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      const Navigate = useNavigate()
      const [errors,setErrors] = useState({})
      const [registerUser, {loading}] = useMutation(REGISTER_USER,{
        update(_,__){Navigate('/login')},
        onError: (err)=>{
            console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
        }
      })
      const submitRegister = (e)=>{
        e.preventDefault()
        registerUser({variables})
      }
  return (
    <Row className='bg-white py-5 justify-content-center'>
    <Col sm={8} md={6} lg={4}>

    <h1 className='text-center'>Register</h1>
    <Form onSubmit={submitRegister}>

    <Form.Group className="mb-3">
      <Form.Label className={errors.username && 'text-danger' }>{errors.username ?? 'Username'}</Form.Label>
      <Form.Control 
        type="text" 
        value={variables.username} 
        className={errors.username && 'is-invalid'}
        onChange={(e)=>setVariables({...variables, username: e.target.value})}
        placeholder="Enter Username" />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label className={errors.email && 'text-danger' }>{errors.email ?? 'Email Address'}</Form.Label>
      <Form.Control type="email" 
        value={variables.email}
        className={errors.email && 'is-invalid'}
        onChange={(e)=>setVariables({...variables, email: e.target.value})}
        placeholder="Enter email" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label className={errors.password && 'text-danger' }>{errors.password ?? 'password'}</Form.Label>
      <Form.Control
        type="password" 
        value={variables.password} 
        className={errors.password && 'is-invalid'}
        onChange={(e)=>setVariables({...variables, password: e.target.value})}
        placeholder="Password" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label className={errors.confirmPassword && 'text-danger' }>{errors.confirmPassword ?? 'Confirm Password'}</Form.Label>
      <Form.Control 
        type="password" 
        className={errors.confirmPassword && 'is-invalid'}
        value={variables.confirmPassword} 
        onChange={(e)=>setVariables({...variables, confirmPassword: e.target.value})}
        placeholder="Confirm Password" />
    </Form.Group>

    <div className='text-center'>
      <Button variant="success" type="submit" disabled={loading}>
        {loading ? 'loading..' : 'Register'}
      </Button>
      <br/>
      <small>already have an account? <Link to='/Login'>Login</Link></small>
    </div>
   
  </Form>
    </Col>
  </Row>
  )
}

export default Register