<script lang="ts">
import './main.scss';
// import modules
import { reactive, computed, h, getCurrentInstance, onMounted, nextTick, ref } from 'vue';
import { useBem } from '../../utils';

export default {
    name: 'UsModule',
    props: {
        biz: String,
    },
    setup(props, { slots }) {
        // init modules
        const app: any = getCurrentInstance();
        const { bCls, mCls } = useBem();

        const getCls = computed(() => {
            let cls = [bCls('module')];
            props.biz && cls.push(mCls(props.biz, 'biz'));
            return cls;
        })

        let elTag = props.biz === 'body' ? 'main' : ['header', 'footer'].includes(props.biz) ? props.biz : 'section';

        const attrs = {
            class: getCls.value,
        };

        if (!slots.default) {
            return () => h(elTag, attrs)
        }

        return () => [
            h(elTag, attrs, slots.default?.())
        ]
    }
}
</script>
