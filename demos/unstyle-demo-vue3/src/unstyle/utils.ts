import { ref } from 'vue';
export function useBem() {
    const root = ref<HTMLElement>();

    let bClsName: string;
    const ns = 'us';
    
    function bCls(cls: string) {
        const bCls = `${ns}-${cls}`;
        bClsName = bCls;
        return bCls;
    }
    function eCls(cls: string) {
        const bn = bClsName || Array.from(root?.value?.classList ?? []).find(cls => cls.startsWith(ns));
        return `${bn}__${cls}`;
    }
    function mCls(cls: string, els: string) {
        if (els) {
            return `${eCls(els)}--${cls}`;
        }
        const bn = bClsName || Array.from(root?.value?.classList ?? []).find(cls => cls.startsWith(ns));
        return `${bn}--${cls}`;
    }
    return {
        root,
        bCls,
        eCls,
        mCls,
    }
}