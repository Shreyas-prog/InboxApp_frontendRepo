import { defineStore } from 'pinia'

export const DefaultDataStore = defineStore('DefaultDataStore', () => {

    const dateOptions = ref([
        { name: 'Today', icon: 'pi pi-calendar', color:'text-green-500',text:getTodayDay() },
        { name: 'Tomorrow', icon: 'pi pi-sun', color:'text-yellow-500', text:getTomorrowDay() },
        { name: 'This weekend', icon: 'pi pi-shopping-bag', color:'text-blue-500', text:'Sat' },
        { name: 'Next week', icon: 'pi pi-calendar', color:'text-purple-500', text:getNextWeeksMonday() }
    ]);

    const priorityOptions = ref([
        {
            name:'Priority 1',
            value: 'p1'
        },
        {
            name:'Priority 2',
            value: 'p2'
        },
        {
            name:'Priority 3',
            value: 'p3'
        },
        {
            name:'Priority 4',
            value: 'p4'
        }
    ])

    const reminderOptions = ref(['Date & time', 'Before task']);

    const getDateOptions = () => {
        return dateOptions.value
    }

    const getPriorityOptions = () => {
        return priorityOptions.value
    }

    const getReminderOptions = () => {
        return reminderOptions.value
    }

    function getTodayDay() {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      return days[today.getDay()];
    }
    
    function getTomorrowDay() {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return days[tomorrow.getDay()];
    }
    
    function getNextWeeksMonday() {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
                      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
      const today = new Date();
      const currentDay = today.getDay();
      
      // Calculate how many days to add to reach next week's Monday
      const daysToAdd = ((8 - currentDay) % 7) + 7; // Ensures we go to the *next* week's Monday
      const nextMonday = new Date();
      nextMonday.setDate(today.getDate() + daysToAdd);
    
      const dayName = days[nextMonday.getDay()];
      const date = nextMonday.getDate();
      const monthName = months[nextMonday.getMonth()];
    
      return `${dayName} ${date} ${monthName}`;
    }
    
  return { getDateOptions, getPriorityOptions, getReminderOptions, dateOptions, priorityOptions, reminderOptions }
})