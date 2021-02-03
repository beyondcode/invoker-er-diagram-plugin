import Plugin from './components/Plugin.vue';
import Navigation from './components/Navigation.vue';
import PluginContextStore from './PluginContextStore';

export default (context: PluginContext) => {
  PluginContextStore.plugin = context;

  context.router.addRoutes([
    {
      name: 'er-diagram',
      path: '/er-diagram',
      component: Plugin,
    },
  ]);

  context.navigation.add(Navigation)
}