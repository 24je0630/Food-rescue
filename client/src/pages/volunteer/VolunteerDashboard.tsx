import { useEffect, useState } from 'react';
import { getAvailableTasks, acceptTask } from '../../services/volunteerApi';


const VolunteerDashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    getAvailableTasks().then(setTasks).catch(console.error);
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await acceptTask(id);
      // Fetch updated tasks
      const updatedTasks = await getAvailableTasks();
      setTasks(updatedTasks);
    } catch (e) {
      console.error(e);
    }
  };



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Volunteer Dashboard</h1>
      <h2 className="text-xl mb-2">Available Pickups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(task => (
          <div key={task.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{task.foodName}</h3>
            <p>Pickup: {task.pickupAddress}</p>
            <button
              onClick={() => handleAccept(task.id)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Accept Pickup
            </button>
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks currently available.</p>}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
