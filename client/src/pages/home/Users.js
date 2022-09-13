import {Col, Image} from 'react-bootstrap'
import {gql, useQuery} from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../../context/Message'
import classNames from 'classnames'

const GET_USERS =gql`
  query getUsers{
    getUsers {
    username email imageUrl, createdAt
    latestMessage{
      uuid from to content createdAt 
    }
  }
  }

`
export default function Users() {
 
    const dispatch = useMessageDispatch()
    const {users} = useMessageState()
    const selectedUser = users?.find(u => u.selected === true)?.username
    const {loading} = useQuery(GET_USERS, {
        onCompleted: data => dispatch({
            type: 'SET_USERS', payload: data.getUsers
        }),
        onError: err => console.log(err)

        
    })
    

  return (
    <Col xs={2} md={4} className='px-0 bg-secondary'>
      {users?.map(user=>{
        const selected = selectedUser === user.username
          return(
            <div 
              role="button"
              className={classNames(
                " d-flex d-flex justify-content-center justify-content-md-start p-3 user-div", {
                'bg-white': selected
            })}
              key={user.username}
              onClick={()=>dispatch({type: 'SET_SELECTED_USER', payload: user.username})}
              >

                <Image 
                  src={user.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe2RXrMYSrpFSoUNyeS9s8NvjTNNYrG0UvUblM3alZoA&s'}
                  className=' user-image'
                  />
                  <div className='d-none d-md-block me-2'>
                  <p className='text-success pl-4'>{user.username}</p>
                  <p className='font-weight-light'>
                      {user.latestMessage ? user.latestMessage.content : 'You are now connected'}
                  </p>
                  </div>
                
            </div>
          )
        })}
      
      </Col>
  )
}
