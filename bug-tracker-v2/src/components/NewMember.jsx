import React, {Component} from 'react';

window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() === 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}

class NewMember extends Component{     
    
    constructor(props) {
    super(props)
    this.state = {
        teamMembers: []
    }
  }

    projectTeamMembers = () => {
        let members = document.querySelectorAll('option')
        members.forEach(member => {
            if(member.hasAttribute('selected')) {
                this.setState(prevState => ({
                    teamMembers: [
                        ...prevState.teamMembers,
                        member.value
                    ]
                }))
            }            
        })
        // console.log(this.state.teamMembers);
    }

    componentDidMount() {
        this.projectTeamMembers()
    }

    loadMembers = () => {     
        this.props.addTeamMembers(this.state.teamMembers)
        this.props.newFormControl('hidden')
        this.setState({
            teamMembers: []
        })
    }
    
    render() {
       return(
        <div className='new-project-container'> 
            <form className='add-member-form'>
                <div className='form-header'>
                    <h2 style={{fontWeight: 'bold'}}>Add New Members</h2>
                    <div className='close' onClick={() => this.props.newFormControl('hidden')}>x</div>
                </div>
                <label htmlFor="project-members">Add Team Member</label>
                <select name="project-members" id="dd" size='4' multiple >
                    {this.props.team.map(member => {
                       return <option>{member.firstName + ' ' +member.lastName}</option>
                    })}
                </select>

                <div className='btn' onMouseDown={this.projectTeamMembers} onMouseUp={this.loadMembers}>Add Member</div>
            </form>
        </div>
    ) 
    }
    
}

export default NewMember;