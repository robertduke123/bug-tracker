
import React, {Component} from 'react';

class Register extends Component{

    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    onFirstNameChange = (e) => {
        this.setState({firstName : e.target.value})
    }

    onLastNameChange = (e) => {
        this.setState({lastName : e.target.value})
    }

    onEmailChange = (e) => {
        this.setState({email : e.target.value})
    }

    onPhoneChange = (e) => {
        this.setState({phone : e.target.value})
    }

    onPasswordChange = (e) => {
        this.setState({password : e.target.value})
    }

    onConfirmPasswordChange = (e) => {
        this.setState({confirmPassword : e.target.value})
        console.log(this.state);
    }

    onSubmitRegister = (e) => {
        console.log(this.state);
        if(this.state.password === this.state.confirmPassword){
        const {firstName, lastName, phone, email, password} = this.state
        fetch('http://localhost:3000/register', {
            method: 'post',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                password: password,
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
                console.log(user);
            }
        }
        )
    }
    }

    render() {

        return(
        <div id='sign'>
            <div className="sign-container">
                <form style={{height: '500px'}}>                    
                    <h1 style={{fontWeight: 'bold'}}>Register</h1>
                    <div className='sign-fields'>
                        <label htmlFor="firstName">First Name</label>
                        <input                         
                        className="pa2 br2 input-reset ba bg-transparent hover-bg-black text-white hover-white w-100" 
                        type="text" 
                        name="firstName"  
                        id="firstName"
                        onChange={(e) => this.onFirstNameChange(e)}
                        />
                    </div>

                    <div className='sign-fields'>
                        <label htmlFor="lastName">Last Name</label>
                        <input                         
                        className="pa2 br2 input-reset ba bg-transparent hover-bg-black text-white hover-white w-100" 
                        type="text" 
                        name="lastName"  
                        id="lastName"
                        onChange={(e) => this.onLastNameChange(e)}
                        />
                    </div>

                    <div className='sign-fields'>
                        <label htmlFor="email-address">Email</label>
                        <input                         
                        className="pa2 br2 input-reset ba bg-transparent hover-bg-black text-white hover-white w-100" 
                        type="email" 
                        name="email-address"  
                        id="email-address"
                        onChange={(e) => this.onEmailChange(e)}
                        />
                    </div>

                    <div className='sign-fields'>
                        <label htmlFor="phone">Phone</label>
                        <input                         
                        className="pa2 br2 input-reset ba bg-transparent hover-bg-black text-white hover-white w-100" 
                        type="phone" 
                        name="phone"  
                        id="phone"
                        onChange={(e) => this.onPhoneChange(e)}
                        />
                    </div>

                    <div className="sign-fields">
                        <label htmlFor="password">Password</label>
                        <input 
                        type="password" 
                        name="password"  
                        id="password"
                        onChange={(e) => this.onPasswordChange(e)}
                        />
                    </div>

                    <div className="sign-fields">
                        <label htmlFor="confirm-password">Confirm</label>
                        <input 
                        type="password" 
                        name="confirm-password"  
                        id="confirm-password"
                        onChange={(e) => this.onConfirmPasswordChange(e)}
                        />
                    </div>
                    
                    <div className='btn'onClick={() => this.onSubmitRegister()}>Submit</div>
                    
                    
                    <p 
                        href="#0" 
                        // id='reg'
                        // className='btn'
                        style={{cursor: 'pointer', marginTop: '1px', color: 'white'}}
                        onClick={() => this.props.routeChange('signin')}
                        >Back</p>
                    
                </form>
            </div>
        </div>
    )
}
    }

    export default Register