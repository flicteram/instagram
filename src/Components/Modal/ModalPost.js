import React,{useState} from "react";
import './ModalPost.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import  Modal  from 'react-modal'
import { useHistory } from "react-router-dom";
import {doc,updateDoc,arrayRemove,arrayUnion,deleteDoc} from "firebase/firestore";
import {db} from '../../firebase'

Modal.setAppElement('#root')

function ModalPost({data,user,userData,goToPost}){
    const [isOpen,setIsOpen]=useState(false)
    const history=useHistory()

    const modalStylesGoToPost={
        overlay:{
            position:'fixed',
            },
        content:{
            position:'absolute',
            top:'35%',
            maxHeight:'170px',
            display:'flex',
            padding:'0',
            flexDirection:'column',
            justifyContent:'space-between',
            alignItems:'center',
            borderRadius:'20px',
            margin:'0 auto',
            maxWidth:'300px',
        }        
    }
    const modalStylesDontGoToPost={
        overlay:{
            position:'fixed',
            
            },
        content:{
            position:'absolute',
            top:'35%',
            maxHeight:'120px',
            maxWidth:'300px',
            margin:'0 auto',
            display:'flex',
            padding:'0',
            flexDirection:'column',
            justifyContent:'space-between',
            alignItems:'center',
            borderRadius:'20px'
        }        
    }
    function handleUnfollow(){
        const followRef = doc(db,'users',user.uid)
        const followedRef = doc(db,'users',data.data.uid)
        updateDoc(followedRef,{
            followers:arrayRemove(user.uid)
        })
        updateDoc(followRef,{
            following:arrayRemove(data.data.uid)
        })
    }
    function handleFollow(){
        const followRef = doc(db,'users',user.uid)
        const followedRef = doc(db,'users',data.data.uid)
        updateDoc(followedRef,{
            followers:arrayUnion(user.uid)
        })
        updateDoc(followRef,{
            following:arrayUnion(data.data.uid)
        })
    }
    async function handleDeletePost(){
        await deleteDoc(doc(db,'posts',data.id))
        history.push('/')
    }

    if(!userData){
        return <h1></h1>
    }
    return(
        <div>
        <MoreHorizIcon sx={{width:28,height:28,cursor:'pointer'}} onClick={()=>setIsOpen(true)}/>
        {data.data.uid===user.uid?
        <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false)} style={goToPost?modalStylesGoToPost:modalStylesDontGoToPost}>
        <p onClick={()=>handleDeletePost()} className='postOptionDelete'>Delete</p>
        {goToPost&&<p onClick={()=>history.push(`/post/${data.id}`)} className='postOption'>Go To Post</p>}
        <p onClick={()=>setIsOpen(false)} className='postOptionLast'>Cancel</p>
        </Modal>:
        <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false)} style={goToPost?modalStylesGoToPost:modalStylesDontGoToPost}>
        {userData.followers.includes(user.uid)?
        <p onClick={()=>handleUnfollow()} className='postOptionUnfollow'>Unfollow</p>:
        <p onClick={()=>handleFollow()} className='postOptionFollow'>Follow</p>
        }   
        {goToPost&&<p onClick={()=>history.push(`/post/${data.id}`)} className='postOption'>Go To Post</p>}
        <p onClick={()=>setIsOpen(false)} className='postOptionLast'>Cancel</p>
    </Modal>}
        </div>
    )
}


export default ModalPost