import { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

interface Due {
  _id: string;
  name: string;
  description: string;
  prices: Record<string, number>;
  extraCharge: number;
  platformFeePercent: number;
}

export default function DuesManagement() {
  const { isAdmin } = useAuth();
  const [dues, setDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDues = async () => {
    try {
      const res = await API.get("/dues/admin");
      setDues(res.data);
    } catch (err) {
      alert("Failed to load dues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchDues();
  }, [isAdmin]);

  if (!isAdmin) return <p>Access denied</p>;
  if (loading) return <p>Loading dues...</p>;

  return (
    <div>
      <h2>Dues Management</h2>

      {dues.map((due) => (
        <div
          key={due._id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <h4>{due.name}</h4>
          <p>{due.description}</p>

          <strong>Prices by Level</strong>

          {Object.entries(due.prices ?? {}).map(([level, price]) => {
            if (typeof price !== "number") return null;

            return (
              <p key={level}>
                Level {level}: ₦{price.toLocaleString()}
              </p>
            );
          })}

          <p>Extra Charge: ₦{due.extraCharge}</p>
          <p>Platform Fee: {due.platformFeePercent}%</p>
        </div>
      ))}
    </div>
  );
}
