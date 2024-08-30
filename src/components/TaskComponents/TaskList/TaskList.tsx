import React, { useEffect, useState } from 'react'
import { sampleHello } from '../../../services/TaskServices'

interface TaskListProps {

}

const TaskList = (props: TaskListProps) => {

    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        // Define an async function inside useEffect to handle async operations
        const fetchMessage = async () => {
          try {
            const data = await sampleHello();
            // Ensure data is of type string before setting it
            if (typeof data === 'string') {
              setMessage(data);
            } else {
              console.error('Fetched data is not a string:', data);
            }
          } catch (error) {
            console.error('Error fetching message:', error);
          }
        };
    
        fetchMessage(); // Call the async function
    }, []);

    return (
    <div>TaskList - {message}</div>
  )
}

export default TaskList