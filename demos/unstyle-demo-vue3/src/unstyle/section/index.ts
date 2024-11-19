import { App } from 'vue';
import Main from './src/main.vue';

Main.install = function(app: App) {
    app.component(Main.name, Main);
};

export default Main;
