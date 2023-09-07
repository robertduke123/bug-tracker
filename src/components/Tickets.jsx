import React from 'react';

export default function Tickets(props) {

    let projectList = []
    let list = []
    props.projects.forEach(project => {        
        project.tickets.forEach(ticket => {
            if(ticket.author === props.user.firstName + ' ' + props.user.lastName){
                projectList.push(project)
                list.push(ticket)
            }
        })   
    })
       
    console.log(list, props.user);

    let count = -1

    return(
        <div className='tickets'>
            <div className="all-tickets-container">
                <div className='project-head'>
                    <h3>My Tickets</h3>
                </div>
                <div className='all-tickets-list-name'>
                    <h2>PROJECT</h2>
                    <h2>TICKET</h2>
                    <h2>STATUS</h2>
                    <h2>TIME</h2>
                    <h2>PRIORITY</h2>
                </div>
                <ul>
                   
                    {list.map(item => {
                        count++
                        return(
                         <li className='all-tickets-item no'>           
                            <h2 className='project-name' onClick={(e) => props.loadProject(e)}>{projectList[count].name}</h2>
                            <p>{item.ticketTitle}</p>
                            <p>{item.status}</p>
                            <p>{item.time}</p>
                            <p>{item.priority}</p> 
                        </li>)
                    })}
                </ul>                
            </div>            
        </div>
    )
}