import React from "react";
import './Stories.css'
import Avatar from '@mui/material/Avatar'
import AddIcon from '@mui/icons-material/Add';
import Carousel from 'react-elastic-carousel'
import musk from '../Images/musk.jpg'
import bezos from '../Images/bezos.jpg'
import mark from '../Images/mark.jpg'
import messi from '../Images/messi.jpg'
import ronaldo from '../Images/ronaldo.jpg'
import theRock from '../Images/theRock.jpg'
import neymar from '../Images/neymar.jpg'
import bill from '../Images/gates.jpg'
import diesel from '../Images/diesel.jpg'

function Stories({user}){

    const breakPoints = [{
        width:260,
        itemsToShow:4,
        itemsToScroll:4,
        },
        {
        width:300,
        itemsToShow:5,
        itemsToScroll:5,
        },{
        width:350,
        itemsToShow:6,
        itemsToScroll:6,  
        },
        {
        width:410,
        itemsToShow:7,
        itemsToScroll:7,
        },
        {
        width:500,
        itemsToShow:9,
        itemsToScroll:9,
        }
]

    return (
            <div className='storyContainer'>
            <Carousel showArrows={false} outerSpacing={0} breakPoints={breakPoints} pagination={false} itemsToShow={7} className='carousel' showEmptySlots={true}>
            <div className='myStoryContainer'>
            <Avatar src={user.photoURL} sx={{width:50,height:50}}/>
            <AddIcon className='addIconStory' sx={{position:'absolute',width:20,height:20,right:'5px'}}/>
            <p className='yourStory'>Your story</p>
            </div>
            <div className='personStory'>
            <img src={musk} alt={'musk'} className='storyImg'/>
            <p className='yourStory'>musk71</p>
            </div>
            <div className='personStory'>
            <img src={bezos} alt={'bezos'} className='storyImg'/>
            <p className='yourStory'>bezos2</p>
            </div>
            <div className='personStory'>
            <img src={bill} alt={'bill gates'} className='storyImg'/>
            <p className='yourStory'>billg</p>
            </div>
            <div className='personStory'>
            <img src={mark} alt={'zuckerberg'} className='storyImg'/>
            <p className='yourStory'>markfb</p>
            </div>
            <div className='personStory'>
            <img src={messi} alt={'messi'}className='storyImg'/>
            <p className='yourStory'>messipsg</p>
            </div>
            <div className='personStory'>
            <img src={neymar} alt={'neymas'} className='storyImg'/>
            <p className='yourStory'>neymarjr</p>
            </div>
            <div className='personStory'>
            <img src={ronaldo} alt={'ronaldo'} className='storyImg'/>
            <p className='yourStory'>cr7</p>
            </div>
            <div className='personStory'>
            <img src={theRock} alt={'The Rock'} className='storyImg'/>
            <p className='yourStory'>theRock</p>
            </div>
            <div className='personStory'>
            <img src={diesel} alt={'Vin Diesel'} className='storyImg'/>
            <p className='yourStory'>vinD</p>
            </div>
            </Carousel>
            </div>
        
    )
}

export default Stories