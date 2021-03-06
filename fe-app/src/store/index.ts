import Vue from 'vue'
import Vuex from 'vuex'
import Login from "@/store/modules/login";
import Registration from "@/store/modules/registration"
import BoomerOrders from "@/store/modules/boomerOrders"
import Account from "@/store/modules/account";
import Tasks from "@/store/modules/tasks"
import VolunteerOrders from "@/store/modules/volunteerOrders";
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    Login,
    Registration,
    BoomerOrders,
    VolunteerOrders,
    Account,
    Tasks
  }
});

export default store;
