import React,{useContext,useState,useRef,useEffect} from "react";
import Nav from "../Components/Nav/Nav";
import NavBarDown from "../Components/NavBarDown/NavBarDown";
import './EditProfile.css'
import Avatar from '@mui/material/Avatar'
import {uploadBytes,ref,getDownloadURL} from 'firebase/storage'
import {doc,updateDoc,query,where,collection,getDocs,writeBatch,runTransaction } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import {useHistory,useParams} from 'react-router-dom'
import {Context} from '../Context'
import { storage,auth,db } from "../firebase";
import FooterLow from "../Components/FooterLow/FooterLow";

function EditProfile(){
    const {user} = useContext(Context)
    const {profileId}=useParams()
    const history = useHistory()

    const [profilePhoto,setProfilePhoto]=useState(null)
    const [name,setName]=useState(user.displayName)
    const [bio,setBio]=useState('')
    const fileRef = useRef(null)
   
    async function updateUserComments(){

        const includesComments=query(collection(db,'posts'),where('whoCommented','array-contains',profileId))
        const includesSnapshot=await getDocs(includesComments)

        
            includesSnapshot.forEach(async (document)=>{
                const queryComments = query(collection(db,`posts`,document.id,'comments',))
                const getComments = await getDocs(queryComments)
                
                if(profilePhoto)
                getComments.forEach(async(item)=>{
                    await runTransaction(db, async(transaction)=>{
                        await transaction.get(doc(db,'posts',document.id,'comments',item.id))
                        transaction.update(doc(db,'posts',document.id,'comments',item.id),{
                            username:name,
                            userPhoto:profilePhoto
                        })
                    })
                })
                else {
                    getComments.forEach(async(item)=>{
                        await runTransaction(db, async(transaction)=>{
                            await transaction.get(doc(db,'posts',document.id,'comments',item.id))
                            transaction.update(doc(db,'posts',document.id,'comments',item.id),{
                                username:name,
                            })
                        })
                    })
                }
            })
        }
    
    async function updateUserPosts(){
        
        const batchPosts=writeBatch(db)
        const userPosts = query(collection(db,'posts'),where('uid','==',profileId))
        const userDocs = await getDocs(userPosts)

        if(profilePhoto){
            userDocs.forEach((document)=>{
                batchPosts.update(doc(db,'posts',document.id),{
                    username:name,
                    userPhoto:profilePhoto
                })
            })
            batchPosts.commit()
        }
        else {
            userDocs.forEach((document)=>{
                batchPosts.update(doc(db,'posts',document.id),{
                    username:name,
                })
            })
            return batchPosts.commit()
        }
    }
    function handleProfilePhoto(e){
        let file = e.target.files[0]
        const storageRef=ref(storage,`profileImage/${file.name}`)
        uploadBytes(storageRef, file)
        .then(()=>{
            getDownloadURL(storageRef)
            .then((url)=>{
                setProfilePhoto(url)
            })
        })
    }

    function handleSubmitEdit(e){
        e.preventDefault()
        const usersDoc = doc(db,'users',profileId)
        if(profilePhoto){
        updateProfile(auth.currentUser,{
            displayName:name,
            photoURL:profilePhoto
        })
        .then(()=>{
            updateUserPosts()
        })
        .then(()=>{
            updateUserComments()
        })
        .then(async()=>{
            await updateDoc(usersDoc,{
                displayName:name,
                photoURL:profilePhoto,
                bio:bio
            })
            history.push('/')
        })
    }   else{
        updateProfile(auth.currentUser,{
            displayName:name,
        })
        .then(()=>{
            updateUserPosts()
        })
        .then(()=>{
            updateUserComments()
        })
        .then(async()=>{
            await updateDoc(usersDoc,{
                displayName:name,
                bio:bio
            })
            history.push('/')
        })
    }
    }
    useEffect(()=>{
        async function getUserDocData(){
            const getUserRef = query(collection(db,'users'),where('uid','==',profileId))
            const getUserDoc = await getDocs(getUserRef)
            getUserDoc.forEach((doc)=>{
                setBio(doc.data().bio)
            })
        }
        getUserDocData()
    },[profileId])

    function handleBack(){
        history.goBack()
    }
    function handelGoToProfile(){
        history.push(`/profile/${user.uid}`)
    }
    return(
        <div className='editProfileContainer'>
            <Nav user={user} leftNav={handleBack} rightNav={handelGoToProfile} title={'Edit Profile'}/>
            <div className='editProfileContainerInner'>
            <div className='changeProfilePhotoContainerAll'>
                <Avatar src={profilePhoto?profilePhoto:user.photoURL} sx={{width:40,height:40}}/>
                <div className='changeProfilePhotoContainer'>
                <h2 className='usernameEditProfile'>{user.displayName}</h2>
                <p className='changeProfilePhoto' onClick={()=>fileRef.current.click()}>Change Profile Photo</p>
                <input type='file' ref={fileRef} onChange={e=>handleProfilePhoto(e)} hidden/>
                </div>
            </div>
            <form className='formEditProfile' onSubmit={e=>handleSubmitEdit(e)}>
            <label>Name
            <input 
            type='text'
            value={name}
            onChange={e=>setName(e.target.value)}
            />
            </label>
            <label>
                Bio
            <textarea className='textAreaBio'
            value={bio}
            onChange={e=>setBio(e.target.value)}
               />
            </label>
            <button className='submitProfileEdit' disabled={name.length<6||name.length>25}>Submit</button>
            </form>
            
            
            </div>
            <FooterLow/>
            <NavBarDown user={user} home={false} border={'1px solid black'}/>
        </div>
    )
}

export default EditProfile