import OSS from 'ali-oss';
import { Message } from 'element-ui';
import { query } from '@/chaos/functions/common/Data';
import { configs } from '@/app/config';

// 获取阿里云密钥
const getAliOSSToken = async () => {
    return await query('common/getAliYunOSSToken');
};

// 开始上传文件
const startUploadFile = async (options = {}) => {
    let filedata = options.filedata || {};
    let direname = options.direname || '';
    let progress = options.progress || (() => {});
    let sizemax = options.sizemax || 1024 * 1024 * 2;
    let extlist = options.extname || ['.jpg', '.png'];
    if (filedata === undefined) {
        Message({ type: 'error', message: '请选择能正常读写的文件路径' });
        return false;
    }
    if (direname.length === 0) {
        Message({ type: 'error', message: '请设置存放该文件的业务目录' });
        return false;
    }
    let extname = filedata.name.replace(/.+\./, '.');
    let filename = filedata.name.replace(extname, '');
    if (!extlist.some((item) => item === extname.toLowerCase())) {
        Message({ type: 'error', message: `仅支持上传的文件类型（${extlist.join('/')}）` });
        return false;
    }
    if (filedata.size === 0 || filedata.size > sizemax) {
        Message({ type: 'error', message: `仅支持上传的文件大小（${sizemax / 1024 / 1024}MB）` });
        return false;
    }
    let alitoken = await getAliOSSToken();
    if (Object.values(alitoken).some((item) => item.length === 0)) {
        Message({ type: 'error', message: '服务器返回阿里云上传参数缺失' });
        return false;
    }
    let filedate = new Date(Number(alitoken.expiration));
    let filedateY = filedate.getFullYear().toString();
    let filedateM = (filedate.getMonth() + 1).toString().padStart(2, '0');
    let filedateD = filedate
        .getDate()
        .toString()
        .padStart(2, '0');
    let filetime = new Date().getTime();
    let filerandom = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    let filepath = `${alitoken.root}${direname}/${filedateY}${filedateM}${filedateD}/${filename}.${filetime}.${filerandom}${extname.toLowerCase()}`;
    let client = new OSS(Object.assign(alitoken, { refreshSTSToken: async () => await getAliOSSToken() }));
    return client
        .multipartUpload(filepath, filedata, { progress: async (score) => await progress(~~(score * 100)) })
        .then((result) => {
            return configs().get('fileHost') + result.name;
        })
        .catch(() => {
            Message({ type: 'error', message: '本地调用阿里云上传文件失败' });
            return false;
        });
};

export default startUploadFile;
