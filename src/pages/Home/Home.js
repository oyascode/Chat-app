import React, { useEffect, useState } from 'react'
import './Home.css'
import { db, auth, storage } from '../../firebase' 
import { 
  collection, 
  query, where, 
  onSnapshot, 
  addDoc, 
  Timestamp, 
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import User from '../../components/User/User'
import MessageForm from '../../components/MessageForm/MessageForm'
import Message from '../../components/Message/Message'


const Home = () => {
  const [ users, setUsers ] = useState([]);
  const [ chat, setChat ] = useState('');
  const [ text, setText ] = useState("");
  const [ img, setImg ] = useState('');
  const [ messages, setMessages] = useState([]);

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, 'users');
    //Create a query object
    const queryObj = query(usersRef, where('uid', 'not-in', [user1]));
    //execute the query
    const unSub = onSnapshot(queryObj, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      })
      setUsers(users);
    })
    return () => unSub()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const selectUser = async (user) => {
    setChat(user)
    // console.log(user)

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    const msgRef = collection(db, 'messages', id, 'chat')
    const queryObj = query(msgRef, orderBy('createdAt', 'asc'))

    onSnapshot(queryObj, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach(doc => {
        messages.push(doc.data());
      })
      setMessages(messages);
    }) 

    const docSnap = await getDoc(doc(db, 'lastMessage', id))
    if(docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, 'lastMessage', id), {unread: false})
    }
  }
  console.log(messages);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const user2 = chat.uid;
    
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    let url;
    if (img) {
      const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`);
      const snap = await uploadBytes(imgRef, img);
      const downloadUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = downloadUrl
    }

    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
    })

    await setDoc(doc(db, 'lastMessage', id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
      unread: true,
    })
  
    setText('');
  }

  return (
    <div className='home_wrap'>
      <div className='users_wrap'>
        {
          users.map(user => (
            <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat}/>
          ))
        }
      </div>
      <div className="messages_wrap">
        {chat ? 
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3> 
            </div> 
            <div className="messages">
              {
                messages.length ?
              messages.map((message, index) => <Message key={index} message={message} user1={user1}/>) : null
              } 
            </div>
            <MessageForm 
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </> :
          (<h3 className="no_chat">Select a user to start conversation</h3>)
        }
      </div>
    </div>
  )
}

export default Home