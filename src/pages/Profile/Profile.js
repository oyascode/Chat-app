import React, { useEffect, useState } from 'react'
import "./Profile.css"
import displayProfile from "../../assets/image/user2.png"
import Camera from '../../components/svg/Camera'
import { storage, db, auth } from '../../firebase'
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { getDoc, doc, updateDoc} from 'firebase/firestore'
import Delete from '../../components/svg/Delete'
import { useNavigate } from 'react-router-dom'


const Profile = () => {
  const [ img, setImg] = useState("");
  const [user, setUser] = useState()

  const navigate = useNavigate();
  // console.log(user)

  useEffect(() => {
    getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    })
    if (img) {
      const imgUpload = async () => {
        const imgRef = ref(
          storage, 
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: url,
          avatarPath: snap.ref.fullPath,
        });
        // console.log(url)
        setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      imgUpload();

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img])

  const deleteImage = async () => {
    try {
      const confirmDelete = window.confirm("Delete Avatar?")
      if (confirmDelete) {
        await deleteObject(ref(storage, user.avatarPath))
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        })
        navigate('/');
      } 
    } catch (error) {
      console.log(error.message)
    }
  }

  return user ? (
    <div className="profile_wrap">
      <div className="flex_wrap">
        <div className="img_wrap">
          <img src={ user.avatar || displayProfile } alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImage}/> : null}
              <input 
                type="file" 
                accept="image/*" 
                id='photo'  
                style={{display: "none"}}
                onChange={(event) => setImg(event.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_wrap">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createdAt.toDate().toDateString()}</small> 
        </div>
      </div>
    </div>
  ): null
}

export default Profile