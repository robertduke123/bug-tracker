import React from 'react';

export default function Demo() {

    function onDemoSubmit(version) {        
        if(version === 'admin') {
           fetch('https://bug-tracker-backend-jpam.onrender.com/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/Json'},
                body: JSON.stringify({
                    email: 'admin',
                    password: 'N/A'
                })
            })
            .then(res => res.json())
            .then(
                user => {
                if(user.id){
                    this.props.loadUser(user)
                    this.props.loadProjectState()
                    this.props.loadTeamState()
                    this.props.routeChange('Dashboard')
                }
            }
            ) 
        } else {
            fetch('https://bug-tracker-backend-jpam.onrender.com/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/Json'},
                body: JSON.stringify({
                    email: 'employee',
                    password: 'N/A'
                })
            })
            .then(res => res.json())
            .then(
                user => {
                if(user.id){
                    this.props.loadUser(user)
                    this.props.loadProjectState()
                    this.props.loadTeamState()
                    this.props.routeChange('Dashboard')
                }
            }
            ) 
        }

        
    }

    return(
        <div id='sign'>
            <div className="sign-container">
                <form>                    
                    <h1 style={{fontWeight: 'bold'}}>Demo</h1>
                                        
                    <div className='btn'onClick={() => onDemoSubmit('admin')}>Admin</div>
                    <div className='btn'onClick={() => onDemoSubmit('employee')}>Employee</div>
                    
                    <p 
                        style={{cursor: 'pointer', color: 'white'}}
                        onClick={() => props.routeChange('signin')}
                    >Back</p>
                    
                </form>
            </div>
        </div>
    )
}