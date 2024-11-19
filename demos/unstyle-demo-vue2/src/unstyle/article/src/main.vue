<script>
import mixins from '../../mixins';
import './main.scss';
export default {
    name: 'UsArticle',
    mixins: [
        mixins
    ],
    props: {
        biz: String,
    },
    data() {
        return {
            name: 'article'
        }
    },
    computed: {
        getCls() {
            let cls = [this.bCls(this.name)];
            this.biz && cls.push(this.mCls(this.biz, 'biz'));
            return cls;
        }
    },
    render (h) {
        return h(this.name, this.getAttrs(), [this.$slots.default])
    },
    methods: {
        getAttrs() {
            return {
                class: this.getCls,
                on: {
                    click: e => this.$emit('click', e)
                }
            }
        }
    }
};
</script>
