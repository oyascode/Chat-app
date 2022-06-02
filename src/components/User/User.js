import React, { useEffect, useState } from 'react'
import './User.css'
import displayProfile from '../../assets/image/user.png';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase'

const User = ({ user, selectUser, user1, chat }) => {
  const [data, setData] = useState();
  const user2 = user?.uid

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    const unsub = onSnapshot(doc(db, 'lastMessage', id), (doc) => {
      setData(doc.data());
    })
    return () => unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(data)
  return (
    <>
      <div 
        className={`user_wrap ${chat.name === user.name && 'selected_user'}`} 
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user.avatar || displayProfile} alt="avatar" className='avatar' />
            <h4>{user.name}</h4>
            {
              data?.from !== user1 && data?.unread && (
                <small className='unread'>New</small>
              )  
            }
          </div>
          <div 
            className={`user_status ${user.isOnline ? "online" : "offline"}`}>
          </div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? 'Me:' : null}</strong> 
            {data.text}
          </p>
        )}
      </div> 
      <div 
        onClick={() => selectUser(user)}
        className={`small_wrap ${chat.name === user.name && 'selected_user'}`} 
      >
        <img src={user.avatar || displayProfile} alt="avatar" className='avatar small_screen' />
      </div>
    </>
  )
}

export default User