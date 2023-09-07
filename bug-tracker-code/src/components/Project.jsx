import React from 'react';

document.onclick = function() {
    let editMenu = document.querySelectorAll('.edit-container')
    editMenu.forEach(menu => {
        if (menu.className === 'edit-container open') {
            
            menu.className = 'edit-container closing'
        }
    })
    }  

     function edit(e) {
        e.stopPropagation()
        e.currentTarget.nextSibling.className = 'edit-container open'
        let position = e.currentTarget.getBoundingClientRect()
        e.currentTarget.nextSibling.style.top = `${position.top}px`
        e.currentTarget.nextSibling.style.left = `${position.right - 100}px`

    }

export default function Project(props) {

    function changeColor(e) {
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
        }


        function allColor(e) {
            if(e.currentTarget.parentNode.parentNode.className === 'ticket-item yes') {
               let items = document.querySelectorAll('.ticket-item')
                items.forEach(item => item.className = 'ticket-item no') 
            }
            
        }

     
    let projects = props.projects
    
    

    return(
        <div>
            {
                projects.map(project => {
       if (project.name === props.loadedProject.name) {return(
        <div className='project'>
            <div className="project-title">
                <h1>{project.name}</h1>
                <p>{project.description}</p>
            </div>
            <div className="project-main">
                <div className="team-container">
                    <div className="team-head">
                        <h2>Team</h2>
                        <div className="btn" onClick={(e) => props.newFormControl(e, 'member', false)}>New Member</div>
                    </div>
                    <div className='project-list-name'>
                        <h2>NAME</h2>
                        <h2>EMAIL</h2>
                        <h2>PHONE</h2>
                    </div>

                    <ul>
                        {project.contributor.map(contributor => {
                            return (props.team.map(member => {
                            if(member.firstName + ' ' + member.lastName === contributor) {
                                return(
                                    <li key={`item ${(props.projects.indexOf(project) + 1)}`} className='project-item'>
                                        <h2>{member.firstName + ' ' + member.lastName}</h2>
                                        <p>{member.email}</p>
                                        <p>{member.phone}</p>
                                        <div className="edit" onClick={(e) => edit(e)}>...</div>
                                        <ul className="edit-container closing" id='mem-edit'>
                                            <li onClick={(e) => props.deleteItem(e, 'member')}>delete</li>
                                        </ul>
                                    </li>
                                )}
                            
                        })) 
                        })}
                    </ul>

                </div>
                <div className="tickets-container">
                    <div className="ticket-head">
                        <h2>Tickets</h2>
                        <div className="btn" onClick={(e) => props.newFormControl(e, 'ticket')}>New Ticket</div>
                    </div>

                    <div className='project-list-name'>
                            <h2>TICKET TITLE</h2>
                            <h2>DESCRIPTION</h2>
                            <h2>TICKET AUTHOR</h2>
                        </div>

                    <ul>
                    {project.tickets ?
                    project.tickets.map(ticket => {
                        return(
                            <li key={`item ${(props.projects.indexOf(project) + 1)}`} className='ticket-item no'>
                                <h2 onMouseDown={(e) => props.loadTicket(e)} onMouseUp={(e) => changeColor(e)}>{ticket.ticketTitle}</h2>
                                <p>{ticket.description}</p>
                                <p>{ticket.author}</p>
                                <div className="edit" onClick={(e) => edit(e)}>...</div>
                                <ul className="edit-container closing">
                                    <li onClick={(e) => props.newFormControl(e, 'ticket', edit)}>edit</li>
                                    <li onMouseDown={(e) => allColor(e)} onMouseUp={(e) => props.deleteItem(e, 'ticket')}>delete</li>
                                </ul>
                            </li>
                        )}
                    ): (<div></div>)}
                    </ul>
                </div>
            </div>   
            
            {props.loadedTicket.ticketTitle ? 
                <div className="ticket-info-container">                    
                <h2>Selected Ticket Info</h2>
                <div className="ticket-info">
                    <div className="ticket-titles">
                        <h2>TICKET TITLE</h2>
                        <h2>AUTHOR</h2>
                        <h2>DESCRIPTION</h2>
                    </div>
                    
                    <div className="ticket-title-answers">
                        <h2 id='ticket-name'>{props.loadedTicket.ticketTitle}</h2>
                        <h2>{props.loadedTicket.author}</h2>
                        <h2>{props.loadedTicket.description}</h2>
                    </div>

                    <div className="ticket-stats">
                        <h2>STATUS</h2>
                        <h2>PRIORITY</h2>
                        <h2>TYPE</h2>
                        <h2>TIME ESTIMATED (HOURS)</h2>
                    </div>

                    <div className="ticket-stats-answers">
                        <div className="badge">{props.loadedTicket.status}</div>
                        <div className="badge">{props.loadedTicket.priority}</div>
                        <div className="badge">{props.loadedTicket.type}</div>
                        <h2>{props.loadedTicket.time}</h2>
                    </div>

                    

                    <div className="author-container">
                        <h2>ASSIGNED DEVS</h2>
                        <h2>{props.loadedTicket.assignedDevs.join(', ')}</h2>
                    </div>
                </div>
                <div className="ticket-info">
                    <h2>Comments</h2>
                    <div className="comment-container">
                    {props.loadedTicket.ticketTitle ?
                    projects.map(project => {
                            let projectName = props.loadedProject.name
                            if(project.name === projectName) {
                                return (project.tickets.map(ticket => {
                                    let ticketName = props.loadedTicket.ticketTitle
                                    if(ticket.ticketTitle === ticketName) {
                                        return(ticket.comments.map(comment => {
                                            return(
                                                    <div className="comment">
                                                        <h2>{comment.user} on {comment.date}</h2>
                                                        <div className="delete" onClick={(e) => props.commentAction(e, 'delete')}>X</div>
                                                        <p>{comment.comment}</p>  
                                                    </div>     
                                            )
                                        })
                                        )
                                    }
                                }))
                            }
                        }) : <div className='waste'></div>
                    }
                    </div>  
                    <div className="ticket-comment">
                        <input type="text" placeholder='Enter Comment'/>
                        <div className="submit" onClick={(e) => props.commentAction(e, 'add')}>Comment</div>
                    </div>
                </div>
            </div> :
            <div className="ticket-info-container">                    
                <h2>Selected Ticket Info</h2>
            </div>    
            }                
        </div>
        )} else {return false}
    })
            }
        </div>        
            
    )
}











