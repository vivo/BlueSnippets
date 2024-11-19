import { App } from 'vue';

import Article from './article';
import Module from './module';
import Section from './section';

const install = function(app: App | any) {
    [
        Article,
        Module,
        Section,
    ].forEach(component => {
        component.install(app);
    });
};

export {
    Article,
    Module,
    Section,
};

export default {
    install
}
