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



class NewProject extends Component{     
    
    constructor(props) {
    super(props)
    if(this.props.edit.state) {
    this.state = {
        name: this.props.edit.project.name,
        description: this.props.edit.project.description,
        contributor: this.props.edit.project.contributor
    }
    } else {
    this.state = {
        name: '',
        description: '',
        contributor: []
    }}
  }

    projectName = (e) => {
    this.setState({name: e.target.value})
    }

    projectDescription = (e) => {
    this.setState({description: e.target.value})
    }

    projectContributors = () => {
        let members = document.querySelectorAll('option')
        // let count = 0
        // members.forEach(member => {
        //     if(member.hasAttribute('selected')) {
        //         count++
        //     }
        // })

        // if(this.props.edit.state && count > 0) {this.setState({contributor: []})}
        this.setState({contributor: []})
        

        members.forEach(member => {
            if(member.hasAttribute('selected')) {
                if(!this.state.contributor.includes(member.value)){
                this.setState(prevState => ({
                    contributor: [
                        ...prevState.contributor,
                        member.value
                    ]
                }))}
            }     
        })
    }

    componentDidMount() {
        this.projectContributors()
    }

    loadProject = () => { 
        let name = document.querySelector('#project-name')
        let desc = document.querySelector('#project-description')
        let devSelect = document.querySelector('#dd')
        let opCount = 0

        this.state.contributor.forEach(option => {if (option) {opCount++}})
        
        if(
            this.state.name !== '' &&
            this.state.description !== '' &&
            opCount > 0
        ){  
            this.props.edit.state ?
            this.props.editItem('project', this.state) :
            this.props.createProject(this.state)            
            this.props.newFormControl('hidden', false)
            this.setState({
                name: '',
                description: '',
                contributor: []
            })
        } else {
            if(!name.value) {name.style.border = '1px solid red'} else {name.style.border = '1px solid gray'}            
            if(!desc.value){desc.style.border = '1px solid red'} else {desc.style.border = '1px solid gray'}            
            if(!devSelect.value){devSelect.style.border = '1px solid red'} else {devSelect.style.border = '1px solid gray'} 
        }
    }
    
    render() {
       return(
        <div className='new-project-container'> 
            <form className='new-project-form'>
                <div className='form-header'>
                    <h2 style={{fontWeight: 'bold'}}>Add New Project</h2>
                    <div className='close' onClick={(e) => this.props.newFormControl(e, 'hidden', false)}>x</div>
                </div>
                <label htmlFor="project-name">Project Name</label>
                <input name='project-name' type="text" id='project-name' onChange={this.projectName} 
                defaultValue={ this.props.edit.state ? this.props.edit.project.name : ''}/>

                <label htmlFor="project-description">Peoject Description</label>
                <textarea name="project-description" id="project-description" cols="30" rows="10" onChange={this.projectDescription}
                defaultValue={ this.props.edit.state ? this.props.edit.project.description : ''}></textarea>

                <label htmlFor="project-members">Add Team Member</label>
                
                <select name="project-members" id="dd" size='4' multiple >
                    {this.props.team.map(member => {                        
                        if(this.props.edit.state) {
                            if(this.props.edit.project.contributor.includes(member.firstName + ' ' + member.lastName)) {
                                return <option>{member.firstName + ' ' + member.lastName}</option>
                            } else {return <option>{member.firstName + ' ' + member.lastName}</option>}                           
                        } else {return <option>{member.firstName + ' ' + member.lastName}</option>}
                    })}
                </select>

                <div className='btn' onMouseDown={this.projectContributors} onMouseUp={this.loadProject}>Submit</div>
            </form>
        </div>
    ) 
    }
    
}

export default NewProject;