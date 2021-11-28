import React,{useContext,useEffect,useState} from "react";
import { doc,increment, onSnapshot,Timestamp,addDoc,collection,orderBy,query,updateDoc,arrayUnion} from "firebase/firestore";
import {db} from '../firebase'
import {Context} from '../Context'
import {useParams} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import './CommentPage.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress';

function CommentPage(){
    const {postId} = useParams()
    const [postData,setPostData]=useState([])
    const [commentsData,setCommentsData]=useState(null)
    const [commentText,setCommentText]=useState('')
    const {user} = useContext(Context)
    const history = useHistory()


    async function handlePostComment(e){
        e.preventDefault()
        const commentRef = collection(db,`posts`,postId,'comments')
        const whoCommentedRef = doc(db,'posts',postId)
        await addDoc(commentRef,{
                username:user.displayName,
                timestamp:Timestamp.now(),
                commentText:commentText,
                userPhoto:user.photoURL,
                userId:user.uid
            })
        await updateDoc(whoCommentedRef,{
            whoCommented:arrayUnion(user.uid),
            commentsCount:increment(1)
        })
        setCommentText('')
    }

    useEffect(()=>{
        /*Get post data*/
        const postRef = doc(db, "posts",postId)
        const unsub =  onSnapshot(postRef, (doc) => {
            setPostData(doc.data())
        })
        return unsub
    },[postId])
    
    useEffect(()=>{
        /*Get comments*/
        const commentRef = query(collection(db,`posts/${postId}/comments`),orderBy("timestamp", "desc"))
        const change = onSnapshot(commentRef,(querySnapshot)=>{
            const commentsArray=[]
            querySnapshot.forEach((doc) => {
                commentsArray.push(doc.data())
            });
            setCommentsData(commentsArray)
        })
        return change
    },[postId])

    function timeAgoComment(timePosted){
        const minutes = Math.round((Timestamp.now().seconds-timePosted)/60)
        if(minutes<1){
            return 'JUST NOW'
        }
        else if (minutes>=1&&minutes<60){
            return `${minutes}m`
        }
        else if (minutes>=60&&minutes<=1440) {
            return `${Math.floor(minutes/60)}h`
        }
        else {
            return `${Math.floor(minutes/1440)}d`
        }
    }
    return(
        <div className='commentPageContainer'>
            <nav className='navComments'>
                <div className='navCommentsInner'>
                <div className='nav'>
                <ArrowBackIosNewIcon sx={{width:20,height:20,cursor:'pointer'}} onClick={()=>history.goBack()}/>
                <h1 className='commentsTitle'>Comments</h1>
                <Avatar onClick={()=>history.push(`/profile/${user.uid}`)} src={user.photoURL} sx={{width:25,height:25,cursor:'pointer'}}/>
                </div>
                <form className='commentContainer' onSubmit={e=>handlePostComment(e)}>
                    <Avatar src={user.photoURL} sx={{width:35,height:35}}/>
                    <input className='textAreaComment'
                        value={commentText}
                        onChange={e=>setCommentText(e.target.value)}
                        placeholder='Add a comment...'
                     />
                    <button disabled={commentText.trim()===''} className='postCommentButton'>Post</button>
                </form>
                </div>
            </nav>
            <div className='commentPostDescription'>
                <div className='commentPostDescriptionAvatar'>
                <Avatar src={postData.userPhoto} sx={{width:35,height:35,cursor:'pointer'}} onClick={()=>history.push(`/profile/${postData.uid}`)} />
                <p className='commentPostAll'><span className='commentPostUserPosted'>{postData.username}</span> <span className='commentPostDescriptionText'>{postData.text}</span></p>
                </div>
                {postData.timePosted&&<p className='timeAgoComment'>{timeAgoComment(postData.timePosted.seconds)}</p>}
            </div>
            {!commentsData?<LinearProgress/>:
            commentsData.map(comment=>(
                <div className='commentContainerUser' key={comment.timestamp.seconds}>
                    <div className='commentAvatarUser'>
                        <Avatar src={comment.userPhoto} sx={{width:35,height:35,cursor:'pointer'}} onClick={()=>history.push(`/profile/${comment.userId}`)}/>
                        <p className='commentUserAll'><span onClick={()=>history.push(`/profile/${comment.userId}`)} className='commentUsername'>{comment.username}</span> <span className='commentUser'>{comment.commentText}</span></p>
                    </div>
                    <p className='timeAgoCommentUser'>{timeAgoComment(comment.timestamp.seconds)}</p>
                </div>
            ))}
        </div>
    )
}

export default CommentPage