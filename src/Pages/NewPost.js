import React,{useContext,useState,useRef} from "react";
import './NewPost.css'
import { Context } from '../Context'
import { db,storage } from "../firebase";
import { collection, addDoc,Timestamp } from "firebase/firestore";
import {ref, uploadBytes,getDownloadURL,deleteObject} from "firebase/storage";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PhotoIcon from '@mui/icons-material/Photo';
import Avatar from '@mui/material/Avatar'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinearProgress from '@mui/material/LinearProgress';
function NewPost(){
    const [postInput,setPostInput]=useState('')
    const [currentFile,setCurrentFile]=useState(null)
    const [inputFocus,setInputFocus]=useState(false)
    const [imageUrl,setImageUrl]=useState(null)
    const [loadingImage,setLoadingImage]=useState(false)
    const fileRef = useRef(null)
    const {user} = useContext(Context)
    const history = useHistory()

    
    function handleDeleteFile(){
        const fileDeleteRef = ref(storage, currentFile)
        setLoadingImage(true)
        deleteObject(fileDeleteRef).then(()=>{
            setImageUrl(null)
            setCurrentFile(null)
            setLoadingImage(false)
        })
    }
    function handleFile(e){
        let file = e.target.files[0]
        if(file){
        setLoadingImage(true)
        const filePathRandom = `${user.uid}/${Math.round(Math.random()*1000)}${file.name}`
        const storageRef = ref(storage,`${user.uid}/${filePathRandom}`)
        uploadBytes(storageRef, file).then((snapshot)=>{
            setCurrentFile(snapshot.metadata.fullPath)      
        })
        .then(()=>{
            getDownloadURL(ref(storage,`${user.uid}/${filePathRandom}`))
            .then((url)=>{
                setImageUrl(url)
                setLoadingImage(false)
            })
        })
        }
        else{
            setImageUrl(null)
        }
    }
    async function handleSubmit(e){
        e.preventDefault()
        try {
                await addDoc(collection(db, "posts"), {
                text:postInput,
                username:user.displayName,
                uid:user.uid,
                userPhoto:user.photoURL,
                postPhoto:imageUrl,
                timePosted:Timestamp.now(),
                likes:0,
                whoLiked:[],
                whoCommented:[],
                commentsCount:0
            })
            setPostInput('')
            setImageUrl(null)
            history.push('/')
          } catch (e) {
            alert(e.message)
          }
    }
    return (
        <div className='newPostContainer'>
            <div className='newPostContainerInner'>
            <form onSubmit={(e)=>handleSubmit(e)}>
            
            <nav className='navPost'>
                <div className='navPostInner'>
            <ArrowBackIosNewIcon sx={{width:20,height:20,cursor:'pointer'}} onClick={()=>history.goBack()}/>
                <h1 className='newPost'>New Post</h1>
                <button className='shareButton' disabled={imageUrl===null||postInput===''}>Share</button>
                </div>
            </nav>
            <div className='inputContainer'>
                <Avatar src={user.photoURL} sx={{position:'absolute',top:10,left:10, width:30,height:30}}/>
                    <textarea onFocus={()=>setInputFocus(true)}
                    onBlur={()=>setInputFocus(false)}
                    className='newPostInput'
                    placeholder="Write a caption..."
                    type='text' 
                    value={postInput}
                    onChange={e=>setPostInput(e.target.value)}
                    />
                {loadingImage?<LinearProgress sx={{position:'absolute',top:'0px',width:'100%'}}/>:
                imageUrl?
                <div className='divImagePreview'
                 onClick={handleDeleteFile}>
                <img src={imageUrl} alt='Preview' className='imagePreview'/>
                <DeleteForeverIcon sx={{cursor:'pointer'}}/>
                </div>:
                <PhotoIcon onClick={()=>fileRef.current.click()} sx={{position:'absolute',right:10,top:10,width:30,height:30,color:'green',cursor:'pointer'}}/>}
                <input type='file' ref={fileRef} hidden value={''} onChange={e=>handleFile(e)}/>
            </div>
            </form>

            {imageUrl&&<div className={inputFocus?'previewFocused':'preview'}>
                <h2 className='previewTitle'>Preview</h2>
                <div className='previewNameFlex'>
                <Avatar src={user.photoURL} sx={{width:30,height:30}}/>
                <p className='displayNamePreviewUp'>{user.displayName}</p>
                </div>
                <img className='imagePreviewDown' alt='Preview' src={imageUrl}/>
                <p className='displayNamePreviewDown'>{user.displayName}<span className='previewInputDisplay'>{postInput}</span></p>
            </div>}
            </div>
        </div>
    )
}

export default NewPost