import React from "react";
import {useHistory} from 'react-router-dom'
import './Header.css'
import logo from '../Images/instagramLogo.png'
import HomeIcon from '@mui/icons-material/Home';
import Avatar from '@mui/material/Avatar'
import LogoutIcon from '@mui/icons-material/Logout';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {auth} from '../../firebase'
import { signOut } from "firebase/auth";

function Header({user,isHome}){
    const history=useHistory()
    function handleLogOut(){
        signOut(auth)
        .catch((error)=>{
            alert(error.message)
        })
    }
    return(
        <div>
        <nav className='navMainLow'>
            <img className='logoHeader' src={logo} alt='Instagram logo'/>
        </nav>
        <nav className='navMainHigh'>
            <div className='navMainHighInner'>
            <img className='logoHeader' src={logo} alt='Instagram logo' onClick={()=>history.push('/')}/>
            <div className='navMainHighOptions'>
            {isHome?<HomeIcon sx={{width:25,height:25,cursor:'pointer'}} onClick={()=>history.push('/')}/>:
            <HomeOutlinedIcon sx={{width:25,height:25,cursor:'pointer'}} onClick={()=>history.push('/')}/>}
            <AddBoxOutlinedIcon sx={{width:25,height:25,cursor:'pointer'}} onClick={()=>history.push('/newPost')}/>
            <LogoutIcon sx={{width:25,height:25,cursor:'pointer'}} onClick={()=>handleLogOut()}/>
            <Avatar onClick={()=>history.push(`/profile/${user.uid}`)} src={user.photoURL} sx={{width:25,height:25,cursor:'pointer'}}/>
            </div>
            </div>
            
        </nav>
        </div>
    )
}

export default Header