import React from "react";
import accountImg from "../img/icons8-user-64.png";

export default function Navbar(props) {
	return (
		<div className="nav">
			<h1 style={{ fontWeight: "bolder", marginLeft: "500px" }}>
				{props.route}
			</h1>

			<div className="nav-right">
				<div
					onClick={() => props.profileControl("Show")}
					style={{ cursor: "pointer" }}>
					User Profile <img src={accountImg} alt="account" />
				</div>
				<div
					className="btn"
					onClick={() => {
						localStorage.removeItem("refreshToken");
						props.routeChange("signin");
					}}>
					Log Out
				</div>
			</div>
		</div>
	);
}
