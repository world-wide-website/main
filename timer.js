const CountingsTimerTime = document.getElementsByClassName("boxoffice");

const startDate = new Date('1024-05-13T09:00:00');
  function updateTimer() {
    const now = new Date();
    const timeDifference = now - startDate;
  
    const centuries = Math.floor(timeDifference / (100*365 * 24 * 60 * 60 * 1000));
    const years = Math.floor(timeDifference % (100 * 365 * 24 * 60 * 60 * 1000) / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor((timeDifference % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor((timeDifference % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

    CountingsTimerTime.textContent = `${centuries}C ${years}Y ${months}M ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  setInterval(updateTimer, 1000)
