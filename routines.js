const localStorage = window.localStorage;

// From https://www.delftstack.com/fr/howto/javascript/javascript-get-week-number/
const getWeekNumber = (date) => {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return result;
};

const dayCount = (count) => {
  return 1000 * 60 * 60 * 24 * count;
};

// From https://flaviocopes.com/how-to-check-dates-same-day-javascript/
const isSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const tasks = [
  {
    id: "menage",
    label: "Faire le ménage",
    isActive: (lastExecution, currentDate) => {
      const weekNumber = getWeekNumber(currentDate);
      const dayOfWeek = currentDate.getDay();
      return (
        /*Pas déjà fait aujourd'hui*/ !isSameDay(lastExecution, currentDate) &&
        /*Semaine impaire*/ weekNumber % 2 === 1 &&
        /*Jeudi*/ dayOfWeek === 4
      );
    },
  },
  {
    id: "draps",
    label: "Changer les draps",
    isActive: (lastExecution, currentDate) => {
      const weekNumber = getWeekNumber(currentDate);
      const dayOfWeek = currentDate.getDay();
      return (
        /*Pas déjà fait aujourd'hui*/ !isSameDay(lastExecution, currentDate) &&
        /*Semaine impaire*/ weekNumber % 2 === 1 &&
        /*Mercredi*/ dayOfWeek === 3
      );
    },
  },
  {
    id: "bain",
    label: "Donner le bain",
    isActive: (lastExecution, currentDate) => {
      return (
        /*Plus de 2 jours*/ currentDate.getTime() - lastExecution.getTime() >
        dayCount(2)
      );
    },
  },
  {
    id: "poubelles",
    label: "Sortir les poubelles",
    isActive: (lastExecution, currentDate) => {
      const dayOfWeek = currentDate.getDay();
      return (
        /*Pas déjà fait aujourd'hui*/ !isSameDay(lastExecution, currentDate) &&
        /*Mercredi*/ dayOfWeek === 3
      );
    },
  },
  {
    id: "recyclable",
    label: "Sortir le recyclable",
    isActive: (lastExecution, currentDate) => {
      const dayOfWeek = currentDate.getDay();
      return (
        /*Pas déjà fait aujourd'hui*/ !isSameDay(lastExecution, currentDate) &&
        /*Dimanche*/ dayOfWeek === 7
      );
    },
  },
  {
    id: "affaires",
    label: "Ranger les affaires",
    isActive: (lastExecution, currentDate) => {
      return (
        /*Plus de 3 jours*/ currentDate.getTime() - lastExecution.getTime() >
        dayCount(3)
      );
    },
  },
];

const refreshList = () => {
  const taskElements = tasks
    .filter((task) => {
      const taskLastExecutionFromLocalStorage = localStorage.getItem(task.id);
      const taskLastExecution = taskLastExecutionFromLocalStorage
        ? new Date(taskLastExecutionFromLocalStorage)
        : new Date(0);
      const currentDate = new Date();
      return task.isActive(taskLastExecution, currentDate);
    })
    .map((task) => {
      return `<article>
      <p>${task.label}</p>
      <button onclick="markAsExecuted('${task.id}')">Fait !</button>
    </article>`;
    });

  const taskRootElement = document.getElementById("tasks");
  taskRootElement.innerHTML = taskElements.join("\n");
};

const markAsExecuted = (taskId) => {
  localStorage.setItem(taskId, new Date());
  refreshList();
};

const reset = () => {
  localStorage.clear();
  refreshList();
};

refreshList();
