//导出数据 生成文件
class ExportFile {

    static  exportJson2CSV(jsonData, fileTitle, headerTable) {
        let _headerTable = headerTable;
        var arrData = typeof jsonData !== 'object' ? JSON.parse(jsonData) : jsonData;
        var csvString = '';
        var row = "";
        var _headerName = this.getCombineHeader(_headerTable)
        for (var index in _headerName) {
            row += _headerName[index] + ',';
        }
        row = row.slice(0, -1);
        csvString += row + '\r\n';

        for (var i = 0; i < arrData.length; i++) {
            let row = "";
            _headerTable.map( item => {
                if(item.children && item.children.length){
                    item.children.map( item1 => {
                        row += '"' + arrData[i][item1.dataIndex] + '",';
                    })
                }else {
                    row += '"' + arrData[i][item.dataIndex] + '",';
                }
            })
            row.slice(0, row.length - 1);
            csvString += row + '\r\n';
        }

        if (csvString === '') {
            alert("导出错误！");
            return;
        }

        var fileName = fileTitle.replace(/ /g, "_");
        csvString = "\ufeff" + csvString;
        var blob = new Blob([csvString], {type: "text/plain"});
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName + ".csv";
        link.click();
        URL.revokeObjectURL(link.href);
    }
    static getCombineHeader(arr) {//拼接表头字段
        let _tableHeader = arr;
        let result = {};
        let i = 0;

        for (var kk in _tableHeader) {
            var content = _tableHeader[kk];
            if (content.hasOwnProperty('children')) {
                for (var k in content.children) {
                    result[i] = content.title + ' - ' + content.children[k]['title'];
                    ++i;
                }
            } else {
                result[i] = content.title;
                ++i;
            }
        }
        return result;
    }
}
export default ExportFile;