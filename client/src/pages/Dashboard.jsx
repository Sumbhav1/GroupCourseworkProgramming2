import React from "react";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <p></p>
    return (
        <>
        <div className="align-items-center bg-blue-600">
            <p className="weight-700">
                DASHBOARD
            </p>
        </div>
        </>
    )
}

export default Dashboard;