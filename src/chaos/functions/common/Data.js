import { Message, MessageBox } from 'element-ui';
import { exportExcel } from './Execl';
import { post } from './Request';

export async function add(domain, param = {}) {
    const { data } = await post(`/manage/${domain}/add`, param);
    if (data) {
        Message({ type: 'success', message: '新增成功!' });
    } else {
        Message({ type: 'warning', message: '新增失败!' });
    }
    return data || false;
}

export function remove(domain, mu, callback) {
    MessageBox.confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
    })
        .then(async () => {
            const { data } = await post(`/manage/${domain}/delete`, { mu });
            if (data) {
                Message({ type: 'success', message: '删除成功!' });
                if (callback) {
                    callback(data);
                }
            } else {
                Message({ type: 'warning', message: '删除失败!' });
            }
            return data || false;
        })
        .catch(() => {
            Message({ type: 'info', message: '已取消删除' });
        });
}

export async function update(domain, mu, param = {}) {
    const { data } = await post(`/manage/${domain}/update`, { mu, data: param });
    if (data) {
        Message({ type: 'success', message: '修改成功!' });
    } else {
        Message({ type: 'warning', message: '修改失败!' });
    }
    return data || false;
}

export async function one(domain, mu) {
    const { data } = await post(`/manage/${domain}/one`, { mu });
    return data || {};
}

export async function list(domain, param = {}) {
    const { data } = await post(`/manage/${domain}/list`, param);
    return data || [];
}

export async function page(domain, pageNum = 1, pageSize = 20, param = {}) {
    const { page } = await post(`/manage/${domain}/page`, { pageNum, pageSize, data: param });
    const { list = [], current = 1, total = 0 } = page;
    return { list, current, total };
}

export async function search(method, pageNum = 1, pageSize = 20, param = {}) {
    const { page } = await post(`/manage/${method}`, { pageNum, pageSize, data: param });
    const { list = [], current = 1, total = 0 } = page;
    return { list, current, total };
}

export async function query(method, param = {}) {
    const { data } = await post(`/manage/${method}`, param);
    return data;
}

export async function submit(method, param = {}) {
    const { data } = await post(`/manage/${method}`, param);
    return data || false;
}

export async function confirm(method, param, callback) {
    MessageBox.confirm('确认提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
    })
        .then(async () => {
            const { data } = await post(`/manage/${method}`, param);
            if (data) {
                Message({ type: 'success', message: '处理成功!' });
                if (callback) {
                    callback(data);
                }
            } else {
                Message({ type: 'warning', message: '处理失败!' });
            }
            return data || false;
        })
        .catch(() => {
            Message({ type: 'info', message: '已取消提交' });
        });
}

export function validate(form, formName, callback) {
    form.$refs[formName].validate((valid) => {
        if (!valid) {
            return false;
        }
        callback();
    });
}

export async function rainBowPage(url, pageNum = 1, pageSize = 20, param = {}) {
    const { page } = await post('/manage/' + url, { pageNum, pageSize, data: param });
    const { list = [], current = 1, total = 0, top, down } = page;
    return { list, total, current, top, down };
}

export async function searchExport(method, header, filename = 'export', param) {
    let pageNum = 1;
    let res;
    do {
        res = await post(`/manage/${method}`, { pageNum, pageSize: 1000, data: param });
        if (res.page.list) {
            exportExcel(header, res.page.list, filename.concat('.xlsx'));
            pageNum += 1;
            break;
        }
    } while (res.page.list);
    return true;
}
