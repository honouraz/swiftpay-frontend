import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ padding: "30px" }}>
      {children}
    </div>
  );
};

export default MainLayout;
