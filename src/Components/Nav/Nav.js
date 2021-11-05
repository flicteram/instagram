import React from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Avatar from '@mui/material/Avatar'
import './Nav.css'


function Nav({user,leftNav,rightNav,title}){

    return (
    <nav className='navComponent'>
        <div className='navComponentInside'>
        <ArrowBackIosNewIcon sx={{width:20,height:20,cursor:'pointer'}} onClick={()=>leftNav()}/>
        <h1 className='navComponentTitle'>{title}</h1>
        <Avatar onClick={()=>rightNav()} src={user.photoURL} sx={{width:25,height:25,cursor:'pointer'}}/>
        </div>
    </nav>
    )
}

export default Nav