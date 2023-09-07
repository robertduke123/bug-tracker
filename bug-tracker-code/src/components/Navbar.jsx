import React from 'react';
import bell from '../img/icons8-bell-24.png'
import accountImg from '../img/icons8-user-64.png'

export default function Navbar(props) {

    return(
        <div className='nav'>

            <h1 style={{fontWeight: 'bolder', marginLeft: '500px'}}>{props.route}</h1>

            <div className='nav-right'>
                {/* <a href="#">Notification <img src={bell}/></a> */}
                <a href="#" onClick={() => props.profileControl('Show')}>User Profile <img src={accountImg}/></a>
                <div className="btn" onClick={() => props.routeChange('signin')} >Log Out</div>
            </div>
        </div>
    )
}