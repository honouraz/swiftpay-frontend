import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
    const { user } = useAuth();
  
  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-md mx-auto">
        <Card>
          <h1 className="text-xl font-bold mb-2">Profile</h1>
          
           <p> NAME: {user?.name?.split(" ")[0] || "Boss"}</p>
          <p>Email: {user?.email?.split(" ")[0] || "Boss"}</p>
          <p>Membership: Active</p>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
