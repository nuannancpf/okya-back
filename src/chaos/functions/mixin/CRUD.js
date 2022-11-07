import { add, validate, query, one, submit, update, remove, search, page } from '@/chaos/functions/common/Data';

export const addmx = {
    data() {
        return {
            domain: '',
            showAddForm: false,
            form: {},
            rules: {},
            addPath: '',
            indexPath: '',
        };
    },
    methods: {
        showAdd() {
            if (this.addPath) {
                this.$router.push(`/${this.addPath}`);
            } else {
                this.showAddForm = true;
            }
        },
        doAdd() {
            validate(this, 'form', async () => {
                const res = await add(this.domain, this.form);
                if (!res) return;
                if (this.addPath) {
                    await this.$router.push(this.indexPath);
                } else {
                    this.showAddForm = false;
                    this.search();
                }
            });
        },
    },
};

export const updatemx = {
    data() {
        return {
            domain: '',
            showUpdateForm: false,
            updateForm: {},
            rules: {},
            showUpdateMethod: '',
            updateMethod: '',
            updatePath: '',
        };
    },
    methods: {
        showUpdate(mu) {
            if (this.updatePath) {
                this.$router.push({ name: this.updatePath, params: { mu } });
            } else {
                this.loadUpdate(mu);
                this.showUpdateForm = true;
            }
        },
        async loadUpdate(mu) {
            if (this.showUpdateMethod) {
                this.updateForm = await query(this.domain + '/' + this.showUpdateMethod, { mu });
            } else {
                this.updateForm = await one(this.domain, mu);
            }
        },
        doUpdate() {
            validate(this, 'updateForm', async () => {
                let res;
                if (this.updateMethod) {
                    res = await submit(`${this.domain}/${this.updateMethod}`, {
                        mu: this.updateForm.mu,
                        data: this.updateForm,
                    });
                } else {
                    res = await update(this.domain, this.updateForm.mu, this.updateForm);
                }
                if (!res) return;
                if (this.updatePath) {
                    await this.$router.push(this.indexPath);
                } else {
                    this.showUpdateForm = false;
                    this.search();
                }
            });
        },
    },
};

export const removemx = {
    data() {
        return {
            domain: '',
            pickRowMu: '',
        };
    },
    methods: {
        doDelete(mu) {
            remove(this.domain, mu, () => this.search());
        },
    },
};

export const pagemx = {
    data() {
        return {
            domain: '',
            currentPage: 1,
            limit: 20,
            total: 0,
            tableData: [],
            //查询条件
            data: {},
            searchMethod: '',
            loading: false,
        };
    },
    created() {
        this.search();
    },
    methods: {
        async search() {
            this.loading = false;
            let res;
            if (this.searchMethod) {
                res = await search(`${this.domain}/${this.searchMethod}`, this.currentPage, this.limit, this.data);
            } else {
                res = await page(this.domain, this.currentPage, this.limit, this.data);
            }
            this.tableData = res.list;
            this.total = res.total;
            this.loading = false;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.search();
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.currentPage = 1;
            this.search();
        },
        handleChange(value, key) {
            this.currentPage = 1;
            this.data[key] = value;
            this.search();
        },
    },
};

export const goBack = {
    data() {
        return {
            indexPath: '',
        };
    },
    methods: {
        goBack() {
            this.$router.push(this.indexPath);
        },
    },
};
