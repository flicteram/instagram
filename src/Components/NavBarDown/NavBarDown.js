import React from 'react'
import './NavBarDown.css'
import {useHistory} from 'react-router-dom'
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import HomeIcon from '@mui/icons-material/Home';
import Avatar from '@mui/material/Avatar'
import LogoutIcon from '@mui/icons-material/Logout';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

function NavBarDown({user,home,border}){
    const history = useHistory()
    function handleLogOut(){
        signOut(auth)
        .catch((error)=>{
            alert(error.message)
        })
    }
    return(
        <nav className='navDown'>
           { home?<HomeIcon className='menuIcon' onClick={()=>history.push('/')} sx={{width:30,height:30, color:'black'}}/>:
           <HomeOutlinedIcon className='menuIcon' onClick={()=>history.push('/')} sx={{width:30,height:30, color:'black'}}/>}
            <AddBoxOutlinedIcon onClick={()=>history.push('/newPost')} className='menuIcon' sx={{width:30,height:30}}/>
            <LogoutIcon className='menuIcon' onClick={()=>handleLogOut()} sx={{width:30,height:30}}/>
            <Avatar onClick={()=>history.push(`/profile/${user.uid}`)} src={user.photoURL} sx={{width:30,height:30,border:border}}/>
        </nav>
    )
}


export default NavBarDown