import React,{useState} from "react";
import { useHistory } from "react-router-dom";
import './PostDisplayProfile.css'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

function PostDisplayProfile({item}){

    const [hover,setHover]=useState(false) 
    const history = useHistory()

    return(
        <div 
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
         className='postImageDisplayContainer'>
        <img className='postImageDisplay' onClick={()=>history.push(`/post/${item.id}`)} key={item.id} src={item.data.postPhoto} alt={item.data.username}/>
        <div className={hover?'reactionsProfileContainer':'reactionsProfileContainerNo'}>
            <div className='reactionComment'>
            <FavoriteIcon sx={{color:'white'}}/>
            <p style={{fontSize:"1.1rem"}}>{item.data.likes}</p>
            </div>
            <div className='reactionComment'>
            <ModeCommentIcon sx={{color:'white'}}/>
            <p style={{fontSize:"1.1rem"}}>{item.data.commentsCount}</p>
            </div>
        </div>
        </div>
    )
}

export default PostDisplayProfile