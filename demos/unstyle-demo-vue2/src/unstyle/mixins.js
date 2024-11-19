export default {
    data() {
        return {
            ns: 'us',
            bClsName: ''
        };
    },
    methods: {
        bCls(cls) {
            const bCls = `${this.ns}-${cls}`;
            this.bClsName = bCls;
            return bCls;
        },
        eCls(cls) {
            const bClsName = this.bClsName || Array.from(this.$el?.classList ?? []).find(cls => cls.startsWith(this.ns.namespace));
            return `${bClsName}__${cls}`;
        },
        mCls(cls, eCls) {
            if (eCls) {
                return `${this.eCls(eCls)}--${cls}`;
            }
            const bClsName = this.bClsName || Array.from(this.$el?.classList || []).find(cls => cls.startsWith(this.ns.namespace));
            return `${bClsName}--${cls}`;
        }
    }
};
