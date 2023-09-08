import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            phone: this.props.user.phone,
            email: this.props.user.email,
            position: this.props.user.position,
            profileRoute: 'details'
        }
    }

    userChange = (e, value) => {
        value === 'firstName' ?
        this.setState({firstName: e.target.value}):
        value === 'lastName' ?
        this.setState({lastName: e.target.value}):
        value === 'phone' ?
        this.setState({phone: e.target.value}):
        this.setState({email: e.target.value})
        console.log(this.state);
    }

    profileSubmit = () => {
        let info = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            email: this.state.email,
            position: this.state.position,
        }

        this.props.editUser(info)
        // this.setState({profileRoute: 'details'})
    }

    changePassword = () => {
        let old = document.querySelector('#old').value
        let newP = document.querySelector('#newP').value
        let confirm = document.querySelector('#confirm').value

        fetch('https://bug-tracker-backend-jpam.onrender.com/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                email: this.props.user.email,
                password: old
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                if(newP === confirm) {
                this.props.editPassword(old, newP)
            }
        }})
    
    }



    render() { 
        return (
            <div className='new-project-container'>
                {
                this.state.profileRoute === 'details' ?
                <div className="profile-container">
                    <div className='form-header'>
                        <h2 style={{fontWeight: 'bold'}}>Profile</h2>
                        <div className='close' onClick={(e) => this.props.profileControl('hidden')}>x</div>
                    </div>
                    <div className="profile-info">
                        <h2>Name:</h2><h2>{`${this.state.firstName} ${this.state.lastName}`}</h2>
                    </div>
                    <div className="profile-info">
                        <h2>Phone:</h2><h2>{this.state.phone}</h2> 
                    </div>
                    <div className="profile-info">
                        <h2>Email:</h2><h2>{this.state.email}</h2> 
                    </div>
                    <div className="profile-info">
                        <h2>Position:</h2><h2>{this.state.position}</h2> 
                    </div>
                    <div className="profile-info">
                        {this.props.user.email === 'admin' || this.props.user.email === 'employee' ?
                        <div></div> :
                        <div>
                            <p className="profile-edit" onClick={() => this.setState({profileRoute: 'editDetails'})}>Edit Account Details</p>
                            <p className="profile-edit" onClick={() => this.setState({profileRoute: 'editPassword'})}>Edit Account Password</p>   
                        </div>}
                    </div>
                </div> :
                this.state.profileRoute === 'editDetails' ?
                <div className="profile-container">
                    <div className='form-header'>
                        <h2 style={{fontWeight: 'bold'}}>Change Details</h2>
                        <div className='close' onClick={(e) => this.props.profileControl('hidden')}>x</div>
                    </div>
                    <div className="profile-info">
                        <h2>First Name:</h2><input type="text" defaultValue={this.state.firstName} onChange={(e) => this.userChange(e, 'firstName')}/>
                    </div>
                    <div className="profile-info">
                        <h2>First Name:</h2><input type="text" defaultValue={this.state.lastName} onChange={(e) => this.userChange(e, 'lastName')}/>
                    </div>
                    <div className="profile-info">
                        <h2>Phone:</h2><input type="text" defaultValue={this.state.phone} onChange={(e) => this.userChange(e, 'phone')}/> 
                    </div>
                    <div className="profile-info">
                        <h2>Email:</h2><input type="text" defaultValue={this.state.email} onChange={(e) => this.userChange(e, 'email')}/> 
                    </div>
                    <div className="profile-info">
                         <div className="btn" onClick={() => this.profileSubmit()}>Submit</div>       
                    </div>                                
                </div> :
                <div className="profile-container">
                    <div className='form-header'>
                        <h2 style={{fontWeight: 'bold'}}>Change Password</h2>
                        <div className='close' onClick={(e) => this.props.profileControl('hidden')}>x</div>
                    </div>
                    <div className="profile-info">
                        <h2>Old Password:</h2><input type="password" id='old'/>
                    </div>
                    <div className="profile-info">
                        <h2>New Password:</h2><input type="text" id='newP'/>
                    </div>
                    <div className="profile-info">
                        <h2>Confirm:</h2><input type="password" id='confirm'/> 
                    </div>
                    <div className="profile-info">
                         <div className="btn" onClick={() => this.changePassword()}>Submit</div>       
                    </div>                                
                </div>
                }
            </div>
        );
    }
}
 
export default Profile;