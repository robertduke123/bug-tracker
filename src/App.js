import React, { Component } from "react";
import SignIn from "./components/Signin";
import Register from "./components/Register";
import Demo from "./components/Demo";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import NewProject from "./components/NewProject";
import NewMember from "./components/NewMember";
import NewTicket from "./components/NewTicket";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Project from "./components/Project";
import Tickets from "./components/Tickets";
import Team from "./components/Team";
import "./App.css";

// testing git branch

const initialState = {
	user: {
		id: "",
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		position: "",
	},
	route: "signin",
	newForm: "hidden",
	profile: "hidden",
	edit: {
		project: "",
		state: false,
	},
	projects: [],
	team: [],
	loadedProject: {},
	loadedTicket: {},
	loadedMember: {},
};

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	componentDidMount() {
		const refresh = localStorage.getItem("refreshToken");

		if (refresh) {
			fetch(
				"https://bug-tracker-backend-jpam.onrender.com/token",
				// "http://localhost:4000/token",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						token: refresh,
					}),
				},
			)
				.then((response) => {
					// if (response.status !== 403) {
					return response.json();
					// } else {
					// 	localStorage.removeItem("refreshToken");
					// }
				})
				.then((data) => {
					if (data.id) {
						this.loadUser(data);
						this.loadProjectState();
						this.loadTeamState();
						this.routeChange("Dashboard");
					}
				});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Compare previous state with current state
		if (prevState !== this.state) {
			console.log(this.state);
		}
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				firstName: data.first_name,
				lastName: data.last_name,
				phone: data.phone,
				email: data.email,
				position: data.position,
			},
		});
	};

	loadProjectState = () => {
		fetch(
			// 'http://localhost:3000/get_projects',
			"https://bug-tracker-backend-jpam.onrender.com/get_projects",
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.length > 0) {
					this.setState({ projects: data });
				}
				console.log(this.state);
			});
	};

	loadTeamState = () => {
		fetch(
			// 'http://localhost:3000/team',
			"https://bug-tracker-backend-jpam.onrender.com/team",
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.length > 0) {
					let state = [];
					data.forEach((member) => {
						state.push({
							id: member.id,
							firstName: member.first_name,
							lastName: member.last_name,
							phone: member.phone,
							email: member.email,
							position: member.position,
						});
					});
					this.setState({ team: state });
				}
			});
	};

	routeChange = (route) => {
		if (route === "signin") {
			this.setState(initialState);
		}
		this.setState({ route: route });
	};

	newFormControl = (e, control, edit) => {
		this.setState({ newForm: control });
		if (edit) {
			if (control === "project") {
				this.setState({
					edit: {
						project:
							this.state.projects[
								this.state.projects.findIndex((object) => {
									return (
										object.name ===
										e.target.parentNode.parentNode.firstChild.innerHTML
									);
								})
							],
						state: true,
					},
				});
			} else if (control === "ticket") {
				let project = document.querySelector(".project-title h1").innerHTML;
				let projectIndex = this.state.projects.findIndex((object) => {
					return object.name === project;
				});
				let ticketIndex = this.state.projects[projectIndex].tickets.findIndex(
					(object) => {
						return (
							object.ticket_title ===
							e.target.parentNode.parentNode.firstChild.innerHTML
						);
					},
				);
				this.setState({
					edit: {
						project: this.state.projects[projectIndex].tickets[ticketIndex],
						state: true,
					},
				});
			} else if (control === "member") {
				let project = document.querySelector(".project-title h1").innerHTML;
				this.setState({
					edit: {
						project:
							this.state.projects[
								this.state.projects.findIndex((object) => {
									return object.name === project;
								})
							].contributors,
						state: true,
					},
				});
			}
		} else {
			this.setState({
				edit: {
					project: "",
					state: false,
				},
			});
		}
	};

	profileControl = (control) => {
		this.setState({ profile: control });
	};

	editUser = (info) => {
		fetch(
			// 'http://localhost:3000/signin',
			"https://bug-tracker-backend-jpam.onrender.com/signin",
			{
				method: "put",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					oldEmail: this.state.user.email,
					newFirst: info.firstName,
					newLast: info.lastName,
					newPhone: info.phone,
					newEmail: info.email,
					newPosition: info.position,
				}),
			},
		)
			.then((res) => res.json())
			.catch(console.log);

		let allProjects = this.state.projects;
		allProjects.forEach((project) => {
			if (
				project.contributors.includes(
					this.state.user.firstName + " " + this.state.user.lastName,
				)
			) {
				let contributors = project.contributors;
				contributors.splice(
					contributors.indexOf(
						this.state.user.firstName + " " + this.state.user.lastName,
					),
					1,
				);
				contributors.push(info.firstName + " " + info.lastName);
				fetch(
					// 'http://localhost:3000/edit_project',
					"https://bug-tracker-backend-jpam.onrender.com/edit_project",
					{
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							project: project.name,
							newName: project.name,
							newDescription: project.description,
							newContributors: contributors,
						}),
					},
				)
					.then((res) => res.json())
					.catch(console.log);
			}
			project.tickets.forEach((ticket) => {
				if (
					ticket.author ===
					this.state.user.firstName + " " + this.state.user.lastName
				) {
					ticket.author = info.firstName + " " + info.lastName;

					let assignedDevs = ticket.assigned_devs;
					assignedDevs.splice(
						assignedDevs.indexOf(
							this.state.user.firstName + " " + this.state.user.lastName,
						),
						1,
					);
					assignedDevs.push(info.firstName + " " + info.lastName);

					fetch(
						// 'http://localhost:3000/edit_ticket',
						"https://bug-tracker-backend-jpam.onrender.com/edit_ticket",
						{
							method: "put",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								ticket: ticket.ticket_title,
								newTicketTitle: ticket.ticket_title,
								newAuthor: info.firstName + " " + info.lastName,
								newDescription: ticket.description,
								newStatus: ticket.status,
								newPriority: ticket.priority,
								newType: ticket.type,
								newTime: ticket.time,
								newAssignedDevs: ticket.assigned_devs,
							}),
						},
					)
						.then((res) => res.json())
						.catch(console.log);
				}
			});
		});

		this.setState({ user: info });
		this.setState({ projects: allProjects });
		this.loadTeamState();
		this.loadTeamState();
		this.setState({ profile: "hidden" });
	};

	editPassword = (old, newP) => {
		fetch(
			// 'http://localhost:3000/edit_password',
			"https://bug-tracker-backend-jpam.onrender.com/edit_password",
			{
				method: "put",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: this.state.user.email,
					prevPassword: old,
					newPassword: newP,
				}),
			},
		)
			.then((res) => res.json())
			.catch(console.log);

		this.setState({ profile: "hidden" });
	};

	createProject = (projectDetails) => {
		fetch(
			// 'http://localhost:3000/projects',
			"https://bug-tracker-backend-jpam.onrender.com/projects",
			{
				method: "put",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: projectDetails.name,
					description: projectDetails.description,
					contributors: projectDetails.contributors,
				}),
			},
		)
			.then((res) => res.json())
			.catch(console.log);

		this.setState((prevState) => ({
			projects: [...prevState.projects, projectDetails],
		}));
	};

	loadProject = (e) => {
		this.setState({ route: "Projects" });

		let projectName = e.target.innerHTML;

		this.state.projects.map((project) => {
			if (project.name === projectName) {
				this.setState({ loadedProject: project });
			}
		});
		this.setState({ loadedTicket: {} });
	};

	loadTicket = (e) => {
		let ticketName = e.target.innerHTML;

		this.state.loadedProject.tickets.map((ticket) => {
			if (ticket.ticket_title === ticketName) {
				this.setState({ loadedTicket: ticket });
			}
		});
	};

	loadMember = (e) => {
		let memberName = e.target.innerHTML;

		this.state.team.map((member) => {
			if (member.firstName + " " + member.lastName === memberName) {
				this.setState({ loadedMember: member });
			}
		});
	};

	emptyMember = () => {
		this.setState({ loadedMember: {} });
	};

	addTeamMembers = (teamMembers) => {
		let project = document.querySelector(".project-title h1").innerHTML;
		let projectIndex = this.state.projects.findIndex((object) => {
			return object.name === project;
		});
		let allProjects = this.state.projects;
		let projectState = allProjects[projectIndex];
		let projectMembers = projectState.contributors;
		teamMembers.forEach((member) => {
			if (!projectMembers.includes(member)) {
				projectMembers.push(member);
			}
		});
		projectState.contributors = projectMembers;

		fetch(
			// 'http://localhost:3000/edit_project',
			"https://bug-tracker-backend-jpam.onrender.com/edit_project",
			{
				method: "put",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					project: project,
					newName: projectState.name,
					newDescription: projectState.description,
					newContributors: projectState.contributors,
				}),
			},
		)
			.then((res) => res.json())
			.catch(console.log);

		allProjects[projectIndex] = projectState;
		this.setState({ projects: allProjects });
	};

	createTicket = (newTicket) => {
		console.log("yes");

		let project = document.querySelector(".project-title h1").innerHTML;
		let projectIndex = this.state.projects.findIndex((object) => {
			return object.name === project;
		});
		let allProjects = this.state.projects;
		let projectState = allProjects[projectIndex];
		let allTickets = projectState.tickets;

		console.log("test");

		fetch(
			// 'http://localhost:3000/tickets',
			"https://bug-tracker-backend-jpam.onrender.com/tickets",
			{
				method: "put",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					projectName: project,
					ticketTitle: newTicket.ticket_title,
					author: newTicket.author,
					description: newTicket.description,
					status: newTicket.status,
					priority: newTicket.priority,
					type: newTicket.type,
					time: newTicket.time,
					assignedDevs: newTicket.assigned_devs,
				}),
			},
		)
			.then((res) => res.json())
			.catch(console.log);

		allTickets.push(newTicket);
		projectState.tickets = allTickets;

		allProjects[projectIndex] = projectState;

		this.setState({ projects: allProjects });
	};

	deleteItem = (e, version) => {
		let project;
		let ticket;
		let member;
		let allProjects = this.state.projects;

		if (version === "project") {
			project = e.target.parentNode.parentNode.firstChild.innerHTML;
			let projectIndex = allProjects.findIndex((object) => {
				return object.name === project;
			});

			fetch(
				// 'http://localhost:3000/delete_project',
				"https://bug-tracker-backend-jpam.onrender.com/delete_project",
				{
					method: "delete",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						projectName: project,
					}),
				},
			)
				.then((res) => res.json())
				.catch(console.log);

			allProjects.splice(projectIndex, 1);
			this.setState({ projects: allProjects });
		} else if (version === "ticket") {
			project = document.querySelector(".project-title h1").innerHTML;
			ticket = e.target.parentNode.parentNode.firstChild.innerHTML;
			let projectIndex = allProjects.findIndex((object) => {
				return object.name === project;
			});
			let allTickets = allProjects[projectIndex].tickets;
			let ticketIndex = allTickets.findIndex((object) => {
				return object.ticket_title === ticket;
			});

			fetch(
				// 'http://localhost:3000/delete_ticket',
				"https://bug-tracker-backend-jpam.onrender.com/delete_ticket",
				{
					method: "delete",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						ticketName: ticket,
					}),
				},
			)
				.then((res) => res.json())
				.catch(console.log);

			allTickets.splice(ticketIndex, 1);
			this.setState({ projects: allProjects });

			this.setState({ loadedTicket: {} });
		} else if (version === "member") {
			project = document.querySelector(".project-title h1").innerHTML;
			member = e.target.parentNode.parentNode.firstChild.innerHTML;
			let projectIndex = allProjects.findIndex((object) => {
				return object.name === project;
			});
			let allMembers = allProjects[projectIndex].contributors;
			let memberIndex = allMembers.indexOf(member);
			allMembers.splice(memberIndex, 1);

			fetch(
				// 'http://localhost:3000/edit_project',
				"https://bug-tracker-backend-jpam.onrender.com/edit_project",
				{
					method: "put",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						project: project,
						newName: allProjects[projectIndex].name,
						newDescription: allProjects[projectIndex].description,
						newContributors: allMembers,
					}),
				},
			)
				.then((res) => res.json())
				.catch(console.log);

			this.setState({ projects: allProjects });
		} else {
			let member = this.state.loadedMember;
			let allMembers = this.state.team;
			let memberIndex = allMembers.findIndex((object) => {
				return object.name === member.name;
			});

			fetch(
				// 'http://localhost:3000/delete_team',
				"https://bug-tracker-backend-jpam.onrender.com/delete_team",
				{
					method: "delete",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: member.id,
					}),
				},
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.length > 0) {
						let state = [];
						data.forEach((member) => {
							state.push({
								id: member.id,
								firstName: member.first_name,
								lastName: member.last_name,
								phone: member.phone,
								email: member.email,
								position: member.position,
							});
						});
						this.setState({ team: state });
					}
					this.setState({ loadedMember: {} });
				})
				.catch(console.log);
		}
	};

	editItem = (version, state) => {
		let project;
		let allProjects = this.state.projects;

		if (version === "project") {
			let projectIndex = allProjects.findIndex((object) => {
				return object.name === this.state.edit.project.name;
			});
			project = allProjects[projectIndex];
			fetch(
				// 'http://localhost:3000/edit_project',
				"https://bug-tracker-backend-jpam.onrender.com/edit_project",
				{
					method: "put",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						project: project.name,
						newName: state.name,
						newDescription: state.description,
						newContributors: state.contributors,
					}),
				},
			)
				.then((res) => res.json())
				.catch(console.log);

			project.name = state.name;
			project.description = state.description;
			project.contributors = state.contributors;
			this.setState({ projects: allProjects });
		} else if (version === "ticket") {
			project = document.querySelector(".project-title h1").innerHTML;
			let projectIndex = allProjects.findIndex((object) => {
				return object.name === project;
			});
			let allTickets = this.state.projects[projectIndex].tickets;
			let ticketIndex = allTickets.findIndex((object) => {
				console.log(object.id, state.id);

				return object.id === state.id;
			});
			let ticket = allTickets[ticketIndex];
			console.log(project, projectIndex, ticketIndex, ticket);

			fetch(
				// 'http://localhost:3000/edit_ticket',
				"https://bug-tracker-backend-jpam.onrender.com/edit_ticket",
				{
					method: "put",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						ticket: ticket.ticket_title,
						newTicketTitle: state.ticket_title,
						newAuthor: state.author,
						newDescription: state.description,
						newStatus: state.status,
						newPriority: state.priority,
						newType: state.type,
						newTime: state.time,
						newAssignedDevs: state.assigned_devs,
					}),
				},
			)
				.then((res) => res.json())
				.catch(console.log);

			ticket.ticket_title = state.ticket_title;
			ticket.author = state.author;
			ticket.description = state.description;
			ticket.status = state.status;
			ticket.priority = state.priority;
			ticket.type = state.type;
			ticket.time = state.time;
			ticket.assigned_devs = state.assigned_devs;
			this.setState({ projects: allProjects });
		} else {
			let member = this.state.loadedMember;
			let allMembers = this.state.team;
			let memberIndex = allMembers.findIndex((object) => {
				return object.firstName === member.firstName;
			});
			console.log(allMembers[memberIndex]);

			fetch(
				// 'http://localhost:3000/edit_team',
				"https://bug-tracker-backend-jpam.onrender.com/edit_team",
				{
					method: "put",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						oldEmail: allMembers[memberIndex].email,
						newFirst: member.firstName,
						newLast: member.lastName,
						newPhone: member.phone,
						newEmail: member.email,
						newPosition: member.position,
					}),
				},
			)
				.then((res) => res.json())
				.catch(console.log);

			let allProjects = this.state.projects;
			allProjects.forEach((project) => {
				if (
					project.contributors.includes(
						this.state.loadedMember.firstName +
							" " +
							this.state.loadedMember.lastName,
					)
				) {
					let contributors = project.contributors;
					contributors.splice(
						contributors.indexOf(
							this.state.loadedMember.firstName +
								" " +
								this.state.loadedMember.lastName,
						),
						1,
					);
					contributors.push(state.firstName + " " + state.lastName);
					fetch(
						// 'http://localhost:3000/edit_project',
						"https://bug-tracker-backend-jpam.onrender.com/edit_project",
						{
							method: "put",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								project: project.name,
								newName: project.name,
								newDescription: project.description,
								newContributors: contributors,
							}),
						},
					)
						.then((res) => res.json())
						.catch(console.log);
				}
				project.tickets.forEach((ticket) => {
					if (
						ticket.author ===
						this.state.loadedMember.firstName +
							" " +
							this.state.loadedMember.lastName
					) {
						ticket.author = state.firstName + " " + state.lastName;
						let assignedDevs = ticket.assigned_devs;
						assignedDevs.splice(
							assignedDevs.indexOf(
								this.state.loadedMember.firstName +
									" " +
									this.state.loadedMember.lastName,
							),
							1,
						);
						assignedDevs.push(state.firstName + " " + state.lastName);

						fetch(
							// 'http://localhost:3000/edit_ticket',
							"https://bug-tracker-backend-jpam.onrender.com/edit_ticket",
							{
								method: "put",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									ticket: ticket.ticket_title,
									newTicketTitle: ticket.ticket_title,
									newAuthor: state.firstName + " " + state.lastName,
									newDescription: ticket.description,
									newStatus: ticket.status,
									newPriority: ticket.priority,
									newType: ticket.type,
									newTime: ticket.time,
									newAssignedDevs: ticket.assigned_devs,
								}),
							},
						)
							.then((res) => res.json())
							.catch(console.log);
					}
				});
			});

			allMembers[memberIndex] = state;
			this.setState({ team: allMembers });
			// if (this.state.loadedMember.firstName === this.state.user.firstName) {
			this.setState({ user: member });
			// }

			this.setState({ projects: allProjects });
			this.setState({ loadedMember: {} });
		}
	};

	commentAction = (e, action) => {
		let project = document.querySelector(".project-title h1").innerHTML;
		let ticket = document.querySelector("#ticket-name").innerHTML;
		let projectIndex = this.state.projects.findIndex((object) => {
			return object.name === project;
		});
		let ticketIndex = this.state.projects[projectIndex].tickets.findIndex(
			(object) => {
				return object.ticket_title === ticket;
			},
		);
		let comment;
		let deletion;

		if (action === "add") {
			comment = e.target.previousSibling.value;
		} else {
			deletion = e.target.nextSibling.innerHTML;
		}

		let allProjects = this.state.projects;
		let projectState = allProjects[projectIndex];
		let allTickets = projectState.tickets;
		let ticketState = projectState.tickets[ticketIndex];
		let commentsUsers = ticketState.comment_user || [];
		let commentsDates = ticketState.comment_date || [];
		let commentsTexts = ticketState.comment_text || [];

		let commentIndex = commentsTexts.findIndex((object) => {
			return object === deletion;
		});

		action === "add"
			? fetch(
					// 'http://localhost:3000/comment',
					"https://bug-tracker-backend-jpam.onrender.com/comments",
					{
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							ticketTitle: ticket,
							user: this.state.user.firstName + " " + this.state.user.lastName,
							date: new Date().toString().slice(0, -40),
							comment: comment,
						}),
					},
				)
					.then(console.log)
					.catch(console.log)
			: fetch(
					// 'http://localhost:3000/delete_comment',
					"https://bug-tracker-backend-jpam.onrender.com/delete_comment",
					{
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							ticketTitle: ticket,
							user: commentsUsers[commentIndex],
							date: commentsDates[commentIndex],
							comment: deletion,
						}),
					},
				)
					.then((res) => res.json())
					.catch(console.log);

		if (action === "add") {
			commentsUsers.push(
				this.state.user.firstName + " " + this.state.user.lastName,
			);
			commentsDates.push(new Date().toString().slice(0, -40));
			commentsTexts.push(comment);
		} else {
			commentsUsers.splice(commentIndex, 1);
			commentsDates.splice(commentIndex, 1);
			commentsTexts.splice(commentIndex, 1);
		}

		let newTicketState = {
			id: ticketState.id,
			ticket_title: ticketState.ticket_title,
			author: ticketState.author,
			description: ticketState.description,
			status: ticketState.status,
			priority: ticketState.priority,
			type: ticketState.type,
			time: ticketState.time,
			assignedDevs: ticketState.assigned_devs,
			comment_user: commentsUsers,
			comment_date: commentsDates,
			comment_text: commentsTexts,
		};

		allTickets[ticketIndex] = newTicketState;

		let newProjectState = {
			id: projectState.id,
			name: projectState.name,
			description: projectState.description,
			contributors: projectState.contributors,
			tickets: allTickets,
		};

		allProjects[projectIndex] = newProjectState;

		this.setState({ projects: allProjects });

		document.querySelector(".ticket-comment input").value = "";
	};

	render() {
		return (
			<div className="app">
				{this.state.route === "signin" ? (
					<SignIn
						routeChange={this.routeChange}
						loadUser={this.loadUser}
						loadProjectState={this.loadProjectState}
						loadTeamState={this.loadTeamState}
					/>
				) : this.state.route === "register" ? (
					<Register
						routeChange={this.routeChange}
						loadUser={this.loadUser}
						loadProjectState={this.loadProjectState}
						loadTeamState={this.loadTeamState}
					/>
				) : this.state.route === "demo" ? (
					<Demo
						routeChange={this.routeChange}
						loadUser={this.loadUser}
						loadProjectState={this.loadProjectState}
						loadTeamState={this.loadTeamState}
					/>
				) : this.state.newForm === "project" ? (
					<NewProject
						newFormControl={this.newFormControl}
						projects={this.state.projects}
						team={this.state.team}
						createProject={this.createProject}
						editItem={this.editItem}
						edit={this.state.edit}
					/>
				) : this.state.newForm === "member" ? (
					<NewMember
						newFormControl={this.newFormControl}
						projects={this.state.projects}
						team={this.state.team}
						addTeamMembers={this.addTeamMembers}
						editItem={this.editItem}
						edit={this.state.edit}
					/>
				) : this.state.newForm === "ticket" ? (
					<NewTicket
						user={this.state.user}
						newFormControl={this.newFormControl}
						projects={this.state.projects}
						team={this.state.team}
						createTicket={this.createTicket}
						editItem={this.editItem}
						edit={this.state.edit}
					/>
				) : this.state.profile === "Show" ? (
					<Profile
						user={this.state.user}
						profileControl={this.profileControl}
						editUser={this.editUser}
						editPassword={this.editPassword}
						loadTeamState={this.loadTeamState}
					/>
				) : (
					<div className="waste"></div>
				)}
				<Sidebar routeChange={this.routeChange} user={this.state.user} />
				<div className="main-container">
					<div className="shadow"></div>
					<Navbar
						route={this.state.route}
						user={this.state.user}
						profileControl={this.profileControl}
						routeChange={this.routeChange}
					/>
					{this.state.route === "Dashboard" ? (
						<Dashboard
							user={this.state.user}
							projects={this.state.projects}
							newFormControl={this.newFormControl}
							loadProject={this.loadProject}
							createProjectTitle={this.createProjectTitle}
							deleteItem={this.deleteItem}
						/>
					) : this.state.route === "Projects" ? (
						<Project
							projects={this.state.projects}
							team={this.state.team}
							loadedProject={this.state.loadedProject}
							loadedTicket={this.state.loadedTicket}
							loadTicket={this.loadTicket}
							commentAction={this.commentAction}
							newFormControl={this.newFormControl}
							deleteItem={this.deleteItem}
						/>
					) : this.state.route === "Tickets" ? (
						<Tickets
							user={this.state.user}
							projects={this.state.projects}
							loadProject={this.loadProject}
						/>
					) : (
						<Team
							team={this.state.team}
							loadedMember={this.state.loadedMember}
							loadMember={this.loadMember}
							editItem={this.editItem}
							deleteItem={this.deleteItem}
							emptyMember={this.emptyMember}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default App;
