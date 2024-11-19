<script>
import './main.scss';
import Article from '../../article';
export default {
    name: 'UsModule',
    extends: Article,
    data() {
        return {
            name: 'module'
        }
    },
    render (h) {
        let elTag = this.biz === 'body'
            ? 'main'
            : ['header', 'footer'].includes(this.biz) ? this.biz : 'section';
        return h(elTag, this.getAttrs(), [this.$slots.default])
    }
};
</script>
