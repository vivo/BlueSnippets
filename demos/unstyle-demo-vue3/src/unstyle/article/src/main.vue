<script lang="ts">
import './main.scss';
// import modules
import { computed, h } from 'vue';
import { useBem } from '../../utils';

export default {
    name: 'UsArticle',
    props: {
        biz: String,
    },
    setup(props, { slots }) {
        // init modules
        const { bCls, mCls } = useBem();

        const getCls = computed(() => {
            let cls = [bCls('article')];
            props.biz && cls.push(mCls(props.biz, 'biz'));
            return cls;
        })

        const attrs = {
            class: getCls.value,
        };

        if (!slots.default) {
            return () => h('article', attrs)
        }

        return () => h('article', attrs,  [
            slots.default?.()
        ])
    }
}
</script>
