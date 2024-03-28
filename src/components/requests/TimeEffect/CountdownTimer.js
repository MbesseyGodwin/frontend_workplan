import { useEffect, useState } from "react";

const CountdownTimer = ({ deadline }) => {
    const calculateTimeLeft = () => {
      const difference = +new Date(deadline) - +new Date();
      let timeLeft = {};
  
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
  
      return timeLeft;
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      return () => clearTimeout(timer);
    });
  
    const timerComponents = Object.keys(timeLeft).map((interval) => {
      if (!timeLeft[interval]) {
        return null;
      }
  
      return (
        <span key={interval}>
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    });
  
    return (
      <div>
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
    );
  };
  
  function getNextMonday(currentDate) {
    const today = new Date(currentDate); // Create a Date object from the current date
    let day = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

    // Calculate the number of days to add to reach the next Monday
    const daysToAdd = (day === 1) ? 7 : (-7 + (7 - day + 1));

    // Add the calculated days to the current date
    today.setDate(today.getDate() + daysToAdd);

    // Check if the result is a valid date
    if (isNaN(today.getTime())) {
      return "Invalid date"; // Handle invalid date
    }

    // Return the formatted date string
    return today.toLocaleString('en-US', {
      weekday: 'short', // Short day name (e.g., Mon)
      year: 'numeric',
      month: 'short', // Short month name (e.g., Mar)
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short' // Short time zone name (e.g., GMT)
    });
  }


// Usage
// const deadline = new Date("2024-03-31T23:59:59"); // Replace with the actual deadline

  export  {getNextMonday, CountdownTimer}