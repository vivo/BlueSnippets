<script lang="ts">
import './main.scss';
// import modules
import { reactive, computed, h, getCurrentInstance, onMounted, nextTick, ref } from 'vue';
import { useBem } from '../../utils';

export default {
    name: 'UsSection',
    props: {
        biz: String,
    },
    setup(props, { slots }) {
        // init modules
        const app: any = getCurrentInstance();
        const { bCls, mCls } = useBem();

        const getCls = computed(() => {
            let cls = [bCls('section')];
            props.biz && cls.push(mCls(props.biz, 'biz'));
            return cls;
        })

        const attrs = {
            class: getCls.value,
        };

        if (!slots.default) {
            return () => h('section', attrs)
        }

        return () => [
            h('section', attrs,  slots.default?.())
        ]
    }
}
</script>
