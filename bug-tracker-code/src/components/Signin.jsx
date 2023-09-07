import React, {Component} from 'react';

class SignIn extends Component{

    constructor(props) {
        super(props)
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    

    onEmailChange = (e) => {
        this.setState({signInEmail : e.target.value})
    }

    onPasswordChange = (e) => {
        this.setState({signInPassword : e.target.value})
    }

    onSubmitSignIn = (e) => {
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
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
                console.log(user.name);
            }
        }
        )
    }

    render() {

        return(
        <div id='sign'>
            <div className="sign-container">
                <form>                    
                    <h1 style={{fontWeight: 'bold'}}>Sign In</h1>
                    <div className='sign-fields'>
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input                         
                        className="pa2 br2 input-reset ba bg-transparent hover-bg-black text-white hover-white w-100" 
                        type="email" 
                        name="email-address"  
                        id="email-address"
                        onChange={(e) => this.onEmailChange(e)}
                        />
                    </div>
                    <div className="sign-fields">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input 
                        type="password" 
                        name="password"  
                        id="password"
                        onChange={(e) => this.onPasswordChange(e)}
                        />
                    </div>
                    
                    <div className='btn'onClick={() => this.onSubmitSignIn()}>Submit</div>
                    
                    
                    <p 
                        // href="#0" 
                        // id='reg'
                        // className='btn'
                        style={{cursor: 'pointer', color: 'white'}}
                        onClick={() => this.props.routeChange('register')}
                        >Register</p>
                    
                </form>
            </div>
        </div>
    )
}
    }

    export default SignIn