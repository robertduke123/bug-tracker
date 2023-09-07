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

class NewTicket extends Component{     
    
    constructor(props) {
    super(props)
    if(this.props.edit.state) {
    this.state = {
        ticketTitle: this.props.edit.project.ticketTitle,
        author: this.props.edit.project.author,
        description: this.props.edit.project.description,
        status: this.props.edit.project.status,
        priority: this.props.edit.project.priority,
        type: this.props.edit.project.type,
        time: this.props.edit.project.time,
        assignedDevs: this.props.edit.project.assignedDevs,
        comments: this.props.edit.project.comments
    }
    } else {
    this.state = {
        ticketTitle: '',
        author: this.props.user.firstName + ' ' + this.props.user.lastName,
        description: '',
        status: 'resolved',
        priority: 'immediate',
        type: 'issue',
        time: '',
        assignedDevs: [],
        comments: []
    }
    }
  }

    ticketName = (e) => {
    this.setState({ticketTitle: e.target.value})
    }

   ticketDescription = (e) => {
    this.setState({description: e.target.value})
    }

    ticketContributors = () => {
        let members = document.querySelectorAll('.ticket-mem')
        this.setState({assignedDevs: []})
        members.forEach(member => {
            if(!this.state.assignedDevs.includes(member.value))
            if(member.hasAttribute('selected')) {
                this.setState(prevState => ({
                    assignedDevs: [
                        ...prevState.assignedDevs,
                        member.value
                    ]
                }))
            }            
        })
    }

    componentDidMount() {
        this.ticketContributors()
    }

    ticketTime = (e) => {
        if(parseInt(e.target.value)) {
            this.setState({time: parseInt(e.target.value)})
        }
    }

    ticketType = (e) => {
        this.setState({type: e.target.value.toLowerCase()})
    }

    ticketPriority = (e) => {
        this.setState({priority: e.target.value.toLowerCase()})
    }

     ticketStatus = (e) => {
        this.setState({status: e.target.value.toLowerCase()})
    }

    loadticket = () => {   
        let name = document.querySelector('#project-name')
        let desc = document.querySelector('#project-description')
        let devSelect = document.querySelector('#dd')
        let opCount = 0
        
        let timeEst = document.querySelector('#time-estimate') 

        this.state.assignedDevs.forEach(option => {if (option) {opCount++}})

        if(
            this.state.ticketTitle !== '' &&
            this.state.description !== '' &&
            this.state.time !== '' &&
            opCount > 0
        ) {
            this.props.edit.state ?
            this.props.editItem('ticket', this.state):
            this.props.createTicket(this.state)
            this.props.newFormControl('hidden', false)
            this.setState({
                ticketTitle: '',
                author: this.props.user.firstName + ' ' + this.props.user.lastName,
                description: '',
                status: 'resolved',
                priority: 'immediate',
                type: 'issue',
                time: '',
                assignedDevs: [],
                comments: []
            })  
        } else {
            if(!name.value) {name.style.border = '1px solid red'} else {name.style.border = '1px solid gray'}            
            if(!desc.value){desc.style.border = '1px solid red'} else {desc.style.border = '1px solid gray'}            
            if(!devSelect.value){devSelect.style.border = '1px solid red'} else {devSelect.style.border = '1px solid gray'} 
            if(!timeEst.value || isNaN(timeEst.value)){timeEst.style.border = '1px solid red'} else {timeEst.style.border = '1px solid gray'} 
        }

        
    }
    
    render() {

       return(
        <div className='new-project-container'> 
            <form className='new-ticket-form'>
                <div className='form-header'>
                    <h2 style={{fontWeight: 'bold'}}>Add New Ticket</h2>
                    <div className='close' onClick={(e) => this.props.newFormControl(e, 'hidden', false)}>x</div>
                </div>
                <label htmlFor="project-name">Ticket Name</label>
                <input name='project-name' type="text" id='project-name' onChange={this.ticketName}
                defaultValue={ this.props.edit.state ? this.props.edit.project.ticketTitle : ''}/>

                <label htmlFor="project-description">Ticket Description</label>
                <textarea name="project-description" id="project-description" cols="30" rows="10" onChange={this.ticketDescription}
                defaultValue={ this.props.edit.state ? this.props.edit.project.description : ''}></textarea>

                <div className="form-sec">
                    <label htmlFor="project-members">Add Team Member</label>
                    <select name="project-members" id="dd" size='4' multiple >
                    {this.props.team.map(member => {                        
                        if(this.props.edit.state) {
                            if(this.props.edit.project.assignedDevs.includes(member.firstName + ' ' + member.lastName)) {
                                return <option className='ticket-mem'>{member.firstName + ' ' + member.lastName}</option>
                            } else {return <option className='ticket-mem'>{member.firstName + ' ' + member.lastName}</option>}                           
                        } else {return <option className='ticket-mem'>{member.firstName + ' ' + member.lastName}</option>}
                    })}
                </select>

                    <label htmlFor="time-estimate">Time Estimate (Hours)</label>
                    <input name='time-estimate' type="text" id='time-estimate' placeholder='20' onChange={this.ticketTime}
                    defaultValue={ this.props.edit.state ? this.props.edit.project.time : ''}/>
                </div>  

                <div className="form-sec">
                    <label htmlFor="ticket-type">Type</label>
                
                        <select name="ticket-type" id="ticket-type" onChange={this.ticketType}>
                            <option selected={this.props.edit.project.type === 'issue' ? 'selected'  : ''}>Issue</option>
                            <option selected={this.props.edit.project.type === 'bug' ? 'selected'  : ''}>Bug</option>
                            <option selected={this.props.edit.project.type === 'feature request' ? 'selected'  : ''}>Feature Request</option>
                        </select>  

                        <label htmlFor="ticket-priority">Priority</label>
                        <select name="ticket-priority" id="ticket-priority" onChange={this.ticketPriority}>
                            <option selected={this.props.edit.project.priority === 'low' ? 'selected'  : ''}>Low</option>
                            <option selected={this.props.edit.project.priority === 'medium' ? 'selected'  : ''}>Medium</option>                           
                            <option selected={this.props.edit.project.priority === 'high' ? 'selected'  : ''}>High</option>
                             <option selected={this.props.edit.project.priority === 'immediate' ? 'selected'  : ''}>Immediate</option>                            
                        </select>

                        <label htmlFor="ticket-status">Status</label>
                        <select name="ticket-status" id="ticket-status" onChange={this.ticketStatus}>
                            <option selected={this.props.edit.project.status === 'new' ? 'selected'  : ''}>New</option>
                            <option selected={this.props.edit.project.status === 'in progress' ? 'selected'  : ''}>In Progress</option>
                            <option selected={this.props.edit.project.status === 'resolved' ? 'selected'  : ''}>Resolved</option>
                        </select>
                </div>              

                <div className='btn' onMouseDown={this.ticketContributors} onMouseUp={this.loadticket}>Submit</div>
            </form>
        </div>
    ) 
    }
    
}

export default NewTicket;