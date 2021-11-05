import React from "react";
import './FooterLow.css'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function FooterLow({homePageBig}){
    
    return(
        <footer className={homePageBig?'footerLowBig':'footerLow'}>
        <h5>Made by <span className='madeByNameLow'>Alexandru Flicter</span></h5>
        <div>
        <a href={'https://github.com/flicteram'}><GitHubIcon sx={{":hover":{color:'red'},cursor:'pointer',width:30,height:30,color:'black'}}/></a>
        <a href={'https://www.linkedin.com/in/alexandru-flicter-3b70ab220/'}><LinkedInIcon sx={{":hover":{color:'red'},cursor:'pointer',width:30,height:30,marginLeft:'10px',color:'black'}}/></a>
        </div>

        </footer>
    )
}

export default FooterLow