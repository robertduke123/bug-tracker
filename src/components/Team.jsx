import React, {Component} from 'react';

class Team extends Component {

    constructor(props){
        super(props)
        this.state = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: ''
      }
    } 


    changeColor = (e) => {
        let items = document.querySelectorAll('.ticket-item')
        let count = 0
        items.forEach(item => {
           if (item.className === 'ticket-item yes') {
            count++
           }
           if(count === 1) {
            items.forEach(item => item.className = 'ticket-item no')
           }
        })
            e.currentTarget.parentNode.className === 'ticket-item no' ? 
            e.currentTarget.parentNode.className = 'ticket-item yes' :
            e.currentTarget.parentNode.className = 'ticket-item no'

            document.querySelector('.team-cover').style.zIndex = '2'
            document.querySelector('.detail-cover').style.zIndex = '-2'
            document.querySelector('.team-cover').style.opacity = '1'
            document.querySelector('.detail-cover').style.opacity = '0'
        }

        firstNameChannge = (e) => {
            this.setState({firstName: e.target.value})
        }

        lastNameChannge = (e) => {
            this.setState({lastName: e.target.value})
        }

        phoneChannge = (e) => {
            this.setState({phone: e.target.value})
        }

        positionChange = (e)  => {
            this.setState({position: e.target.value})
        }

        emailChannge = (e) => {
            this.setState({email: e.target.value})
        }

        submitMember = () => {
        let first = document.querySelector('#member-first-name').value
        let last = document.querySelector('#member-last-name').value
        let email = document.querySelector('#member-email').value
        let phone = document.querySelector('#member-phone').value
        let position = document.querySelector('#member-position').value

        this.setState({
            firstName: first,
            lastName: last,
            email: email, 
            phone: phone,
            position: position
        })

        document.querySelector('.team-cover').style.zIndex = '-2'
        document.querySelector('.detail-cover').style.zIndex = '2'
        document.querySelector('.team-cover').style.opacity = '0'
        document.querySelector('.detail-cover').style.opacity = '1'

        let items = document.querySelectorAll('.ticket-item')
        items.forEach(item => {
           if (item.className === 'ticket-item yes') {
            items.forEach(item => item.className = 'ticket-item no')
           }
        })
    }

    deleteReady = () => {
        document.querySelector('.sure-cover').style.zIndex = '20'
        document.querySelector('.sure-cover').style.opacity = '1'
    }


    dismissMember = () => {
        document.querySelector('.sure-cover').style.zIndex = '-20'
        document.querySelector('.sure-cover').style.opacity = '0'
        document.querySelector('.team-cover').style.zIndex = '-2'
        document.querySelector('.detail-cover').style.zIndex = '2'
        document.querySelector('.team-cover').style.opacity = '0'
        document.querySelector('.detail-cover').style.opacity = '1'

        let items = document.querySelectorAll('.ticket-item')
        items.forEach(item => {
           if (item.className === 'ticket-item yes') {
            items.forEach(item => item.className = 'ticket-item no')
           }
        })
    }

    deleteNo = () => {
        document.querySelector('.sure-cover').style.zIndex = '-20'
        document.querySelector('.sure-cover').style.opacity = '0'
    }
        
        render() {
            return(
                <div className='team'>
                    <div className="team-cover"></div>
                    <div className="all-team-container">
                        <div className='project-head'>
                            <h3>Team Members</h3>
                        </div>
                        <ul>
                            {this.props.team.map(member => {
                                if(member.email !== 'admin' && member.email !== 'employee') {
                                    return (
                                        <li className='ticket-item no'>
                                            <h2 onMouseDown={(e) => this.props.loadMember(e)} onMouseUp={(e) => this.changeColor(e)}>{member.firstName + ' ' + member.lastName}</h2>
                                            <p>{member.email}</p>
                                            <p>{member.phone}</p>
                                        </li>
                                    )   
                                }                                
                            })}                        
                        </ul>                
                    </div>         
                    <div className="detail-cover"></div>   
                    <div className="team-details-container">
                        <div className='project-head'>
                            <h3>Team Member Details</h3>
                        </div>
                        {
                        this.props.loadedMember.firstName ? 
                           <div className="member-form">
                            <div className="member-field">
                                <label htmlFor="member-first-name">First Name</label>
                                <input name='member-first-name' type="text" id='member-first-name' 
                                defaultValue={this.props.loadedMember.firstName} onChange={(e) => this.firstNameChannge(e)}/>   
                            </div>
                            <div className="member-field">
                                <label htmlFor="member-last-name">Last Name</label>
                                <input name='member-last-name' type="text" id='member-last-name' 
                                defaultValue={this.props.loadedMember.lastName} onChange={(e) => this.lastNameChannge(e)}/>   
                            </div>

                            <div className="member-field">
                                <label htmlFor="member-phone">Phone</label>
                                <input name='member-phone' type="text" id='member-phone' 
                                defaultValue={this.props.loadedMember.phone} onChange={(e) => this.phoneChannge(e)}/>   
                            </div>

                            <div className="member-field">
                                <label htmlFor="member-position">Position</label>
                                <select name="member-position" id="member-position" style={{height: '40px'}} onChange={(e) => this.positionChange(e)}>
                                    <option selected={this.props.loadedMember.position === 'Admin' ? 'selected' : ''}>Admin</option>
                                    <option selected={this.props.loadedMember.position === 'Employee' ? 'selected' : ''}>Employee</option>
                                </select>   
                            </div>

                            <div className="member-field" style={{width: '630px'}}>
                                <label htmlFor="member-email">Email</label>
                                <input name='member-email' type="text" id='member-email' 
                                defaultValue={this.props.loadedMember.email} onChange={(e) => this.emailChannge(e)}/>   
                            </div>

                            <div className="member-field" style={{width: '630px'}}>
                                <div className="btn" onMouseDown={() => this.submitMember()} onMouseUp={() => this.props.editItem( 'member', this.state)}>Save</div>
                                <div className="btn" id='delete' onClick={() => this.deleteReady()}>Delete</div>
                                <div className="btn" onMouseDown={() => this.dismissMember()} onMouseUp={() => this.props.emptyMember()}>Cancel</div>
                            </div>
                        </div> : <div className="waste"></div>
                            }
                        <div className="sure-cover">
                            <div className="sure-container">
                                <h2>Are You Sure</h2>
                                <div className="sure-btn">
                                    <div className="btn" id="delete" onMouseDown={() => this.dismissMember()} onMouseUp={(e) => this.props.deleteItem(e, 'team')}>Yes</div>
                                    <div className="btn" onClick={() => this.deleteNo()}>NO</div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}
}


export default Team