export const formatNum = n => { // 数字补零
    n = n.toString();
    return n[1] ? n : '0' + n;
};

const formatStamp = (t) => { // 格式化(分)时间戳 --> '2019-09-12 12:23'
    if (t) {
        let time = new Date(t * 1000), year, month, day, hour, min;
        year = time.getFullYear();
        month = time.getMonth() + 1;
        day = time.getDate();
        hour = time.getHours();
        min = time.getMinutes();
        return [year, month, day].map(formatNum).join('-') + ' ' + [hour, min].map(formatNum).join(':');
    } else {
        return '';
    }
};
export default formatStamp;