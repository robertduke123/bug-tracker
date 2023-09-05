import React, { Component } from 'react';
import SignIn from './components/Signin';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NewProject from './components/NewProject';
import NewMember from './components/NewMember';
import NewTicket from './components/NewTicket';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Project from './components/Project';
import Tickets from './components/Tickets';
import Team from './components/Team';
import './App.css'


class App extends Component {
  constructor() {
    super() 
    this.state = {
    user: {
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      position: ''
    },
    route: 'signin',
    newForm: 'hidden',
    profile: 'hidden',
    edit: {
      project: '',
      state: false
    },    
    projects : [],
    team: [],
    loadedProject: {},
    loadedTicket: {},
    loadedMember: {}
  }
  }

  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      email: data.email,
      position: data.position
    }})
  }

  loadProjectState = () => {
    fetch('http://localhost:3000/projects')
        .then(res => res.json())
        .then(
            data => {
            if(data.length > 0){
            this.setState({projects: data})
            }
        }
        )
  }

  loadTeamState = () => {
    fetch('http://localhost:3000/team')
        .then(res => res.json())
        .then(
            data => {
            if(data.length > 0){
                let state = []
            data.forEach(member => {
              state.push({
                id: member.id,
                firstName: member.first_name,
                lastName: member.last_name,
                phone: member.phone,
                email: member.email,
                position: member.position
              })
            })
            this.setState({team: state})
            }
        }
        )
  }
  

  routeChange = (route) => {
    this.setState({route: route})
  }

  newFormControl = (e, control, edit) => {
    this.setState({newForm: control})
    if(edit) { 
      if(control === 'project') {
        this.setState({
      edit: {
        project: this.state.projects[this.state.projects.findIndex(object => {return object.name === e.target.parentNode.parentNode.firstChild.innerHTML})],
        state: true
    }}) 
      } else if(control === 'ticket') {
        let project = document.querySelector('.project-title h1').innerHTML
        let projectIndex = this.state.projects.findIndex(object => {return object.name === project})
        let ticketIndex = this.state.projects[projectIndex].tickets.findIndex(object => {return object.ticketTitle === e.target.parentNode.parentNode.firstChild.innerHTML})
        this.setState({
          edit: {
            project: this.state.projects[projectIndex].tickets[ticketIndex],
            state: true
        }})
        console.log(this.state.edit);
      } else if (control === 'member') {
        let project = document.querySelector('.project-title h1').innerHTML
        this.setState({
          edit: {
            project: this.state.projects[this.state.projects.findIndex(object => {return object.name === project})].contributor,
            state: true
          }
        })
      }       
    } else {
      this.setState({
      edit: {
        project: '',
        state: false
    }})
    }
  }

  profileControl = (control) => {
    this.setState({profile: control})
  }

  editUser = (info) => {
    fetch('http://localhost:3000/edit_team', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                oldEmail: this.state.user.email,
                newFirst: info.firstName,
                newLast: info.lastName,
                newPhone: info.phone,
                newEmail: info.email,
                newPosition: info.position 
            })
        })
        .then(res => res.json())

    let allProjects = this.state.projects
    allProjects.forEach(project => {
      if(project.contributor.includes(this.state.user.firstName + ' ' + this.state.user.lastName)){
        let contributor = project.contributor
        contributor.splice(contributor.indexOf(this.state.user.firstName + ' ' + this.state.user.lastName), 1)
        contributor.push(info.firstName + ' ' + info.lastName)
        fetch('http://localhost:3000/edit_project', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                project: project.name,
                newName: project.name,
                newDescription: project.description,
                newContributor: contributor
            })
        })
        .then(res => res.json())

      }
      project.tickets.forEach(ticket => {
        if(ticket.author === this.state.user.firstName + ' ' + this.state.user.lastName) {
          ticket.author = info.firstName + ' ' + info.lastName

          let assignedDevs = ticket.assignedDevs
        assignedDevs.splice(assignedDevs.indexOf(this.state.user.firstName + ' ' + this.state.user.lastName), 1)
        assignedDevs.push(info.firstName + ' ' + info.lastName)
        
        fetch('http://localhost:3000/edit_ticket', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                ticket: ticket.ticketTitle,
                newTicketTitle: ticket.ticketTitle,
                newAuthor: info.firstName + ' ' + info.lastName,
                newDescription : ticket.description,
                newStatus : ticket.status,
                newPriority : ticket.priority,
                newType : ticket.type,
                newTime : ticket.time,
                newAssignedDevs : ticket.assignedDevs  
            })
        })
        .then(res => res.json())
      }
      })
    })

    this.setState({user: info})
    this.setState({projects: allProjects})
    this.loadTeamState()
    this.setState({profile: 'hidden'})
  }  

  editPassword = (old, newP) => {
    
    fetch('http://localhost:3000/edit_password', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                email: this.state.user.email,
                oldPassword: old,
                newPassword: newP
            })
        })
        .then(res => res.json())

    this.setState({profile: 'hidden'})
  }

  createProject = (projectDetails) => {
    fetch('http://localhost:3000/projects', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                name: projectDetails.name,
                description: projectDetails.description,
                contributor: projectDetails.contributor
            })
        })
        .then(res => res.json())
        // .then(console.log())

    this.setState(prevState => ({
      projects: [...prevState.projects,
        projectDetails]
    }))
  }

  loadProject = (e) => {
    this.setState({route: 'Projects'})

    let projectName = e.target.innerHTML

    this.state.projects.map(project => {
      if(project.name === projectName) {                 
        this.setState({loadedProject: project})
      }
    })
    this.setState({loadedTicket: {}})
  }
  
  loadTicket = (e) => {
    let ticketName = e.target.innerHTML

    this.state.loadedProject.tickets.map(ticket => {
            if(ticket.ticketTitle === ticketName) {
              this.setState({loadedTicket: ticket})
            }
          })
  }

  loadMember = (e) => {
    let memberName = e.target.innerHTML

    this.state.team.map(member => {
      if(member.firstName + ' ' + member.lastName === memberName) {
        this.setState({loadedMember: member})
      }
    })
  }

  emptyMember = () => {
    this.setState({loadedMember: {}})
  }  

  addTeamMembers = (teamMembers) => {
    let project = document.querySelector('.project-title h1').innerHTML
    let projectIndex = this.state.projects.findIndex(object => {return object.name === project})
    let allProjects = this.state.projects
    let projectState = allProjects[projectIndex]
    let projectMembers = projectState.contributor
    teamMembers.forEach(member => {
      if(!projectMembers.includes(member)) {
        projectMembers.push(member)
      }
    })
    projectState.contributor = projectMembers

    fetch('http://localhost:3000/edit_project', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                project: project,
                newName: projectState.name,
                newDescription: projectState.description,
                newContributor: projectState.contributor
            })
        })
        .then(res => res.json())

    allProjects[projectIndex] = projectState
    this.setState({projects: allProjects})
  }

  createTicket = (newTicket) => {
    let project = document.querySelector('.project-title h1').innerHTML
    let projectIndex = this.state.projects.findIndex(object => {return object.name === project}) 
    let allProjects = this.state.projects
    let projectState = allProjects[projectIndex]
    let allTickets = projectState.tickets

     fetch('http://localhost:3000/tickets', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                projectName: project,
                ticketTitle: newTicket.ticketTitle,
                author: newTicket.author,
                description: newTicket.description,
                status: newTicket.status,
                priority: newTicket.priority,
                type: newTicket.type,
                time: newTicket.time,
                assignedDevs: newTicket.assignedDevs
            })
        })
        .then(res => res.json())

    allTickets.push(newTicket)
    projectState.tickets = allTickets

    allProjects[projectIndex] = projectState

    this.setState({projects: allProjects})
  }

  deleteItem = (e, version) => {
    let project
    let ticket
    let member
    let allProjects = this.state.projects

    if(version === 'project') {
      project = e.target.parentNode.parentNode.firstChild.innerHTML
      let projectIndex = allProjects.findIndex(object => {return object.name === project}) 

      fetch('http://localhost:3000/delete_project', {
            method: 'delete',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                projectName: project
            })
        })
        .then(res => res.json())

      allProjects.splice(projectIndex, 1)
      this.setState({projects: allProjects})

    } else if(version === 'ticket') {
      project = document.querySelector('.project-title h1').innerHTML
      ticket = e.target.parentNode.parentNode.firstChild.innerHTML
      let projectIndex = allProjects.findIndex(object => {return object.name === project})   
      let allTickets = allProjects[projectIndex].tickets  
      let ticketIndex = allTickets.findIndex(object => {return object.ticketTitle === ticket})

      fetch('http://localhost:3000/delete_ticket', {
            method: 'delete',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                ticketName: ticket
            })
        })
        .then(res => res.json())

      allTickets.splice(ticketIndex, 1)
      this.setState({projects: allProjects})
       
        this.setState({loadedTicket: {}})

    } else if(version === 'member') {
      project = document.querySelector('.project-title h1').innerHTML
      member = e.target.parentNode.parentNode.firstChild.innerHTML
      let projectIndex = allProjects.findIndex(object => {return object.name === project})   
      let allMembers = allProjects[projectIndex].contributor
      let memberIndex = allMembers.indexOf(member)
      allMembers.splice(memberIndex, 1)

      fetch('http://localhost:3000/edit_project', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                project: project,
                newName: allProjects[projectIndex].name,
                newDescription: allProjects[projectIndex].description,
                newContributor: allMembers
            })
        })
        .then(res => res.json())

      this.setState({projects: allProjects})
    } else {
      let member = this.state.loadedMember
      let allMembers = this.state.team
      let memberIndex = allMembers.findIndex(object => {return object.name === member.name})

      fetch('http://localhost:3000/delete_team', {
            method: 'delete',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                email: member.email
            })
        })
        .then(res => res.json())

      allMembers.splice(memberIndex, 1)

      this.setState({team: allMembers})
      this.setState({loadedMember: {}})
    }
  }

  editItem = (version, state) => {
    let project
    let allProjects = this.state.projects

      if(version === 'project') {
        let projectIndex = allProjects.findIndex(object => {return object.name === this.state.edit.project.name})   
        project = allProjects[projectIndex]
        console.log(this.state.edit);
        fetch('http://localhost:3000/edit_project', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                project: project.name,
                newName: state.name,
                newDescription: state.description,
                newContributor: state.contributor
            })
        })
        .then(res => res.json())

        project.name = state.name
        project.description = state.description
        project.contributor = state.contributor
        this.setState({projects: allProjects})
      } else if(version === 'ticket') {
        project = document.querySelector('.project-title h1').innerHTML
        let projectIndex = allProjects.findIndex(object => {return object.name === project})   
        let allTickets = this.state.projects[projectIndex].tickets
        let ticketIndex = allTickets.findIndex(object => {return object.ticketTitle === state.ticketTitle})
        let ticket = allTickets[ticketIndex]

        console.log(allTickets, ticketIndex, ticket, state);

        fetch('http://localhost:3000/edit_ticket', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                ticket: ticket.ticketTitle,
                newTicketTitle: state.ticketTitle,
                newAuthor: state.author,
                newDescription : state.description,
                newStatus : state.status,
                newPriority : state.priority,
                newType : state.type,
                newTime : state.time,
                newAssignedDevs : state.assignedDevs  
            })
        })
        .then(res => res.json())

        ticket.ticketTitle = state.ticketTitle
        ticket.author = state.author
        ticket.description = state.description
        ticket.status = state.status
        ticket.priority = state.priority
        ticket.type = state.type
        ticket.time = state.time
        ticket.assignedDevs = state.assignedDevs  
        this.setState({projects: allProjects})    
      } else {
      let member = this.state.loadedMember
      let allMembers = this.state.team
      let memberIndex = allMembers.findIndex(object => {return object.firstName === member.firstName})

      fetch('http://localhost:3000/edit_team', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                oldEmail: allMembers[memberIndex].email,
                newFirst: state.firstName,
                newLast: state.lastName,
                newPhone: state.phone,
                newEmail: state.email,
                newPosition: state.position 
            })
        })
        .then(res => res.json())

        let allProjects = this.state.projects
    allProjects.forEach(project => {
      if(project.contributor.includes(this.state.loadedMember.firstName + ' ' + this.state.loadedMember.lastName)){
        let contributor = project.contributor
        contributor.splice(contributor.indexOf(this.state.loadedMember.firstName + ' ' + this.state.loadedMember.lastName), 1)
        contributor.push(state.firstName + ' ' + state.lastName)
        fetch('http://localhost:3000/edit_project', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                project: project.name,
                newName: project.name,
                newDescription: project.description,
                newContributor: contributor
            })
        })
        .then(res => res.json())

      }
      project.tickets.forEach(ticket => {
        console.log(this.state.loadedMember.firstName + ' ' + this.state.loadedMember.lastName, ticket.author);
        if(ticket.author === this.state.loadedMember.firstName + ' ' + this.state.loadedMember.lastName) {
          ticket.author = state.firstName + ' ' + state.lastName
          console.log(ticket);
          let assignedDevs = ticket.assignedDevs
        assignedDevs.splice(assignedDevs.indexOf(this.state.loadedMember.firstName + ' ' + this.state.loadedMember.lastName), 1)
        assignedDevs.push(state.firstName + ' ' + state.lastName)
        
        fetch('http://localhost:3000/edit_ticket', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                ticket: ticket.ticketTitle,
                newTicketTitle: ticket.ticketTitle,
                newAuthor: state.firstName + ' ' + state.lastName,
                newDescription : ticket.description,
                newStatus : ticket.status,
                newPriority : ticket.priority,
                newType : ticket.type,
                newTime : ticket.time,
                newAssignedDevs : ticket.assignedDevs  
            })
        })
        .then(res => res.json())
      }
      })
    })
      
      allMembers[memberIndex] = state  
      this.setState({team: allMembers})
      if(this.state.loadedMember.firstName === this.state.user.firstName) {
        this.setState({user: state})
      }

      this.setState({projects: allProjects})
      this.setState({loadedMember: {}})
    }
    }

    commentAction = (e, action) => {
    let project = document.querySelector('.project-title h1').innerHTML
    let ticket = document.querySelector('#ticket-name').innerHTML
    let projectIndex = this.state.projects.findIndex(object => {return object.name === project})
    let ticketIndex = this.state.projects[projectIndex].tickets.findIndex(object => {return object.ticketTitle === ticket})    
    let comment  
    let deletion
    
    action === 'add' ? 
    comment = e.target.previousSibling.value :
    deletion = e.target.nextSibling.innerHTML

    let allProjects = this.state.projects
    let projectState = allProjects[projectIndex]
    let allTickets = projectState.tickets
    let ticketState = projectState.tickets[ticketIndex]
    let commentsState = ticketState.comments

    let commentIndex = commentsState.findIndex(object => {return object.comment === deletion})

    action === 'add' ? 
     fetch('http://localhost:3000/comments', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                ticketTitle: ticket,
                user: this.state.user.firstName + ' ' + this.state.user.lastName,
                date: new Date().toString().slice(0, -40),
                comment: comment
            })
        })
        .then(res => res.json()) :
        fetch('http://localhost:3000/delete_comment', {
            method: 'put',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify({
                ticketName: ticket,
                delText: deletion
            })
        })
        .then(res => res.json())

    action === 'add' ? 
    commentsState.push({
        user: this.state.user.firstName + ' ' + this.state.user.lastName,
        date: new Date().toString().slice(0, -40),
        comment: comment
      }) :      

    commentsState.splice(commentIndex, 1)

    let newTicketState =  {
      ticketTitle: ticketState.ticketTitle,
            author: ticketState.author,
            description: ticketState.description,
            status: ticketState.status,
            priority: ticketState.priority,
            type: ticketState.type,
            time: ticketState.time,
            assignedDevs: ticketState.assignedDevs,
            comments: commentsState
    }

    allTickets[ticketIndex] = newTicketState

    let newProjectState = {
        name: projectState.name,
        description: projectState.description,
        contributor: projectState.contributor,
        tickets: allTickets
    }

    allProjects[projectIndex] = newProjectState

    this.setState({projects: allProjects})

    document.querySelector('.ticket-comment input').value = ''
  }

   

  render() { 
    return (
      <div className='app'>
        {this.state.route === 'signin' ?
        <SignIn
        user={this.state.user}
        routeChange={this.routeChange} 
        loadUser={this.loadUser}
        loadProjectState={this.loadProjectState}
        loadTeamState={this.loadTeamState}
        /> :
        this.state.route === 'register' ?
        <Register
        user={this.state.user}
        routeChange={this.routeChange}
        loadUser={this.loadUser}
        loadProjectState={this.loadProjectState}
        loadTeamState={this.loadTeamState}
        /> :        
        this.state.newForm === 'project' ? 
        <NewProject 
        newFormControl={this.newFormControl} 
        projects={this.state.projects}
        team={this.state.team} 
        createProject={this.createProject}
        editItem={this.editItem}
        edit={this.state.edit}
        /> :
        this.state.newForm === 'member' ?
        <NewMember 
        newFormControl={this.newFormControl} 
        projects={this.state.projects}
        team={this.state.team} 
        addTeamMembers={this.addTeamMembers}
        editItem={this.editItem}
        edit={this.state.edit}
        /> : 
        this.state.newForm === 'ticket' ?
        <NewTicket
        user={this.state.user}
        newFormControl={this.newFormControl} 
        projects={this.state.projects}
        team={this.state.team} 
        createTicket={this.createTicket}
        editItem={this.editItem}
        edit={this.state.edit}
        /> :
        this.state.profile === 'Show' ?
        <Profile
        user={this.state.user}
        profileControl={this.profileControl}
        editUser={this.editUser} 
        editPassword={this.editPassword}
        /> :
        <div className='waste'></div>
        }  
        <Sidebar 
        routeChange={this.routeChange} 
        user={this.state.user} 
        />
        <div className='main-container'>
        <div className='shadow'></div>
        <Navbar 
        route={this.state.route}
        user={this.state.user}
        profileControl={this.profileControl} 
        routeChange={this.routeChange} 
        />
        {
          this.state.route === 'Dashboard' ? 
          <Dashboard 
          user={this.state.user}
          projects={this.state.projects} 
          newFormControl={this.newFormControl} 
          loadProject={this.loadProject} 
          createProjectTitle={this.createProjectTitle}
          deleteItem={this.deleteItem}
          /> :
          this.state.route === 'Projects' ?
          <Project 
          projects={this.state.projects} 
          team={this.state.team} 
          loadedProject={this.state.loadedProject} 
          loadedTicket={this.state.loadedTicket} 
          loadTicket={this.loadTicket}
          commentAction={this.commentAction}
          newFormControl={this.newFormControl}
          deleteItem={this.deleteItem}
          /> :
          this.state.route === 'Tickets' ?
          <Tickets
          user={this.state.user}
          projects={this.state.projects} 
          loadProject={this.loadProject} 
          /> :
          <Team
          team={this.state.team}
          loadedMember={this.state.loadedMember}
          loadMember={this.loadMember}
          editItem={this.editItem}
          deleteItem={this.deleteItem}
          emptyMember={this.emptyMember}
          />
          }
        </div>
      </div>
    );
  }
}
 
export default App;
