import React from 'react';
import dashboardImg from '../img/icons8-dashboard-100.png';
import projectUserImg from '../img/icons8-users-96.png';
import ticketImg from '../img/icons8-menu-rounded-96.png';

export default function Sidebar(props) {

    function change(e){        
        let btns = document.querySelectorAll('.sidebar-btn')
        let count = 0
        btns.forEach(btn => {
           if (btn.className === 'sidebar-btn on') {
            count++
           }
           if(count === 1) {
            btns.forEach(btn => btn.className = 'sidebar-btn off')
           }
        })
            e.currentTarget.className === 'sidebar-btn off' ? 
            e.currentTarget.className = 'sidebar-btn on' :
            e.currentTarget.className = 'sidebar-btn off'

            let route = e.currentTarget.getAttribute('id')
            props.routeChange(route)
        }   

        // function style = 

    return(
        <div className='sidebar'>
            <div className="user-badge">
                {/* <div className="user-image-cont" style={{backgroundImage: `${props.user.image}`}}>
                    <img src={props.user.image} alt="" /></div>                 */}
                <h1>WELCOME<br/>{`${props.user.firstName} ${props.user.lastName}`}</h1>
            </div>

            <div className="sidebar-btn on" id='Dashboard' onClick={change}>
                <img src={dashboardImg} alt="" style={{width: '40px', height: '40px'}}/>
                <h2>Dashboard Home</h2>
            </div>

            <div className="sidebar-btn off" id='Tickets' onClick={change}>
                <img src={ticketImg} alt="" style={{width: '40px', height: '40px'}}/>
                <h2>My Tickets</h2>
            </div>

            {
                props.user.position === 'Admin' ? 
                <div className="sidebar-btn off" id='Team' onClick={change}>
                    <img src={projectUserImg} alt="" style={{width: '40px', height: '40px'}}/>
                    <h2>Team Members</h2>
                </div> :
                false
            }

             

            {/* <div className="sidebar-btn off" id='Profile' onClick={change}>
                <img src={accountImg} alt="" style={{width: '40px', height: '40px'}}/>
                <h2>User Profile</h2>
            </div> */}
        </div>
    )
}