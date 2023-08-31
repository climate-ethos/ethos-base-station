import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

import { useDataSensorStore } from 'src/stores/dataSensor';
import { useDataUserStore } from 'src/stores/dataUser';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Check whether data needs to be initialized
  const dataUserStore = useDataUserStore();
  const dataSensorStore = useDataSensorStore();
  Router.beforeEach((to) => {
    const initializePath = '/initialize';
    const settingsPath = '/settings';
    console.log(to.path);

    if (
      // Any data is undefined
      (dataUserStore.containsUndefined || dataSensorStore.containsUndefined) &&
      // Avoid an infinite redirect
      to.path !== initializePath &&
      // Allow navigation to settings
      to.path !== settingsPath &&
      // Is running in electron (i.e. not in test mode)
      process.env.MODE == 'electron'
    ) {
      // redirect the user to the initialize page
      return initializePath;
    }
  });

  return Router;
});
