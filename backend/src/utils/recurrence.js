export const getNextOccurrences = (task, count = 5) => {
  if (!task.dueDate || !task.recurringFrequency || task.recurringFrequency === 'none') {
    return [];
  }

  const dates = [];
  let currentDate = new Date(task.dueDate);

  for (let i = 0; i < count; i++) {
    let nextDate;
    
    switch (task.recurringFrequency) {
      case 'daily':
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        break;

      case 'weekly':
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 7);
        break;

      case 'monthly':
        nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;

      case 'custom':
        if (task.recurringCustom) {
          const { interval, unit } = task.recurringCustom;
          nextDate = new Date(currentDate);
          
          switch (unit) {
            case 'days':
              nextDate.setDate(nextDate.getDate() + interval);
              break;
            case 'weeks':
              nextDate.setDate(nextDate.getDate() + (interval * 7));
              break;
            case 'months':
              nextDate.setMonth(nextDate.getMonth() + interval);
              break;
            default:
              nextDate.setDate(nextDate.getDate() + interval);
          }
        }
        break;
    }

    if (nextDate) {
      currentDate = nextDate;
      dates.push(new Date(nextDate));
    }
  }

  return dates;
};

const getNextWeekday = (date, weekdays) => {
  let current = new Date(date);
  current.setDate(current.getDate() + 1);
  
  while (!weekdays.includes(current.getDay())) {
    current.setDate(current.getDate() + 1);
  }
  
  return current;
};
