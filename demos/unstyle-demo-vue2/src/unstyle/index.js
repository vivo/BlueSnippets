import Article from './article';
import Module from './module';
import Section from './section';

const install = function(Vue) {
    [
        Article,
        Module,
        Section,
    ].forEach(component => {
        component.install(Vue);
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
