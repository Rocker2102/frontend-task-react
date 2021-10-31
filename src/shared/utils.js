export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = Math.floor(seconds - hours * 3600 - minutes * 60);

    let str = '';
    if (hours > 0) {
        str += (hours < 10 ? '0' + hours : hours) + ':';
    }
    str += (minutes < 10 ? '0' + minutes : minutes) + ':';
    str += (seconds < 10 ? '0' + seconds : seconds);

    return str;
};

export const formatFileSize = (bytes, precision = 2) => {
    if (bytes === 0) { return '0 Bytes' }

    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + sizes[i];
};
