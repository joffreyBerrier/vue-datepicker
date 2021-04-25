import Vue from "vue";
import Calendar from "./components/Calendar";

const Components = {
  Calendar,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

// import Calendar from "./components/Calendar.vue";

// export default Calendar;
