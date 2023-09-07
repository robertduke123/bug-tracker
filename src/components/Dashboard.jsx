import React from 'react';
   
document.onclick = function() {
    let editMenu = document.querySelectorAll('.edit-container')
    editMenu.forEach(menu => {
        if (menu.className === 'edit-container open') {
            
            menu.className = 'edit-container closing'
        }
    })
    }  
   


export default function Dashboard(props) {

    // console.log(props.project);
    
    function edit(e) {
        e.stopPropagation()
        e.target.nextSibling.className = 'edit-container open'
        let position = e.currentTarget.getBoundingClientRect()
        e.currentTarget.nextSibling.style.top = `${position.top}px`
        e.currentTarget.nextSibling.style.left = `${position.right - 100}px`
    }


    function createGraph(type) {
        let types = []
        let priorities = []
        let status = []
        let none = false
        if(props.projects) {
            props.projects.forEach(project => {
                if(project.tickets.length === 0) {
                    none = true
                } else {
                    none = false
                project.tickets.forEach(ticket => {
                    if(ticket.author === props.user.firstName + ' ' + props.user.lastName){
                        types.push(ticket.type)
                        priorities.push(ticket.priority)
                        status.push(ticket.status)  
                    }                
                })
            }
            })
        }
       
        if(none) {
           document.querySelectorAll('.pie').forEach(pie => {
            pie.innerHTML = 'no data'
           })
              
        } else {
        if(type === 'type') {
            let issueNum = 0
            let bugNum = 0
            let featureNum = 0
            types.forEach(type=> {
                type === 'issue' ? issueNum++ :
                type === 'bug' ? bugNum ++ :
                featureNum ++
            })
            let total = types.length
            let issuePer = (issueNum / total) * 100
            let bugPer = (bugNum / total) * 100
            let featurePer = (featureNum / total) * 100            
            return {background : `conic-gradient(
                #4f7fa9 0 ${issuePer}%,
                #769cbc ${issuePer}% ${bugPer + issuePer}%, 
                #9db8cf  ${bugPer + issuePer}% ${featurePer + bugPer + issuePer}%`}
        } else if(type === 'priority') {
            let lowNum = 0
            let mediumNum = 0
            let highNum = 0
            let immediateNum = 0  
            priorities.forEach(priority=> {
                priority === 'low' ? lowNum ++ :
                priority === 'medium' ? mediumNum++ :
                priority === 'high' ? highNum ++ :
                immediateNum ++                
            })
            let total = priorities.length
            let lowPer = (lowNum / total) * 100
            let mediumPer = (mediumNum / total) * 100
            let highPer = (highNum / total) * 100
            let immediatePer = (immediateNum / total) * 100 
            return {background : `conic-gradient(
                #4f7fa9 0 ${lowPer}%, 
                #769cbc ${lowPer}% ${mediumPer + lowPer}%, 
                #9db8cf ${mediumNum + lowPer}% ${highPer + mediumPer + lowPer}%, 
                #c4d4e2 ${highPer + mediumPer + lowPer}% ${immediatePer + highPer + mediumPer + lowPer}%`}
        } else if(type === 'status') {
            let newNum = 0
            let progressNum = 0
            let resolvedNum = 0
            status.forEach(status=> {
                status === 'new' ? newNum++ :
                status === 'in progress' ? progressNum ++ :
                resolvedNum++
            })
            let total = status.length
            let newPer = (newNum / total) * 100
            let progressPer = (progressNum / total) * 100
            let resolvePer = (resolvedNum / total) * 100
            
            return {background : `conic-gradient(
                #4f7fa9 0 ${newPer}%, 
                #769cbc ${newPer}% ${progressPer + newPer}%, 
                #9db8cf ${progressPer + newPer}% ${resolvePer + progressPer + newPer}%`}
        }}
    }

    
    let listItems = props.projects.map(project => {            
        let contributors = project.contributor.join(', ')
        
            return(
            <li key={`item ${(props.projects.indexOf(project) + 1)}`} className='project-item'>
                <h2 className='project-name' onClick={(e) => props.loadProject(e)}>{project.name}</h2>
                <p>{project.description}</p>
                <p>{contributors}</p>
                <div className="edit" onClick={(e) => edit(e)}>...</div>
                <ul className="edit-container closing">
                    <li onClick={(e) => props.newFormControl(e, 'project', edit)}>edit</li>
                    <li  onClick={(e) => props.deleteItem(e, 'project')}>delete</li>
                </ul>
            </li>
            )
                
    })

    return(
        <div className='dashboard'>
            <div className='projects-container'>
                <div className='project-head'>
                    <h3 onClick={() => console.log(props.user)}>Projects</h3>
                    <div className='btn' onClick={(e) => props.newFormControl(e,'project')}>New Project</div>
                </div>
                <div className='project-list-name'>
                    <h2>PROJECT</h2>
                    <h2>DESCRIPTION</h2>
                    <h2>CONTRIBUTORS</h2>
                </div>
                <ul>  
                    {props.project?
                    listItems :
                    <div></div>}
                </ul>
            </div>


            <div className='graphs'>
               <div className='graph-container'>
                    <div className='graph'>
                        <div className="pie" style={createGraph('type')}></div>
                        <div className="legend">
                            <div className="pie-color" style={{background: '#4f7fa9'}}></div><p style={{color: '#4f7fa9'}}>Issue</p>
                            <div className="pie-color" style={{background: '#769cbc'}}></div><p style={{color: '#769cbc'}}>Bug</p>
                            <div className="pie-color" style={{background: ' #9db8cf'}}></div><p style={{color: ' #9db8cf'}}>Feature Request</p>

                        </div>
                    </div>
                    <h2>Tickets by Type</h2>
                </div>

                <div className='graph-container'>
                    <div className='graph'>
                        <div className="pie" style={createGraph('priority')}></div>
                         <div className="legend">
                            <div className="pie-color" style={{background: '#4f7fa9'}}></div><p style={{color: '#4f7fa9'}}>Low</p>
                            <div className="pie-color" style={{background: '#769cbc'}}></div><p style={{color: '#769cbc'}}>Medium</p>
                            <div className="pie-color" style={{background: ' #9db8cf'}}></div><p style={{color: ' #9db8cf'}}>High</p>
                            <div className="pie-color" style={{background: ' #c4d4e2'}}></div><p style={{color: ' #c4d4e2'}}>Immediate</p>
                        </div>
                    </div>
                    <h2>Tickets by Priority</h2>
                </div>

                <div className='graph-container'>
                    <div className='graph'>
                        <div className="pie" style={createGraph('status')}></div>
                        <div className="legend">
                            <div className="pie-color" style={{background: '#4f7fa9'}}></div><p style={{color: '#4f7fa9'}}>New</p>
                            <div className="pie-color" style={{background: '#769cbc'}}></div><p style={{color: '#769cbc'}}>In Progress</p>
                            <div className="pie-color" style={{background: ' #9db8cf'}}></div><p style={{color: ' #9db8cf'}}>Resolved</p>
                        </div>
                    </div>
                    <h2>Tickets by Status</h2>
                </div> 
            </div>
        </div>
    )
}