import { reject, resolve } from 'core-js/fn/promise';
import XLSX, { utils } from 'xlsx'

export let character = {
    school: {
        text:"学校",
        type:'string'
    },
    class: {
        text:"班级",
        type:'string'
    },
    testid: {
        text:"考号",
        type:'string'
    },
    name: {
        text:"姓名",
        type:'string'
    },
    sex: {
        text:"性别",
        type:'string'
    },
    totalScore: {
        text:"总分",
        type:'number'
    },
    processeValuation: {
        text:"过程评价分",
        type:'number'
    },
    grade: {
        text:"等级",
        type:'string'
    },
    itemone: {
        text:"一类项目",
        type:'string'
    },
    gradeone: {
        text:"成绩",
        type:'number'       
    },
    scoreOne: {
        text:"分数",
        type:'number'
    },
    itemTwo: {
        text:"二类项目",
        type:'string'
    },
    gradeTwo: {
        text:"成绩1",
        type:'number'
    },
    scoreTwo: {
        text:"分数1",
        type:'number'
    },
    itemThree: {
        text:"三类项目",
        type:'string'
    },
    gradeThree: {
        text:"成绩2",
        type:'number'
    },
    scoreThree: {
        text:"分数2",
        type:'number'
    },
    hash256: {
        text:"体育成绩哈希值",
        type:'string'
    },
    TransHash: {
        text:"交易哈希",
        type:'string'
    }
};

const EXCEL = {
    // 导出Excel方法
    /**
     * @description                  依据数据导出表格，一般是根据查询出的数据导出表格
     * @param {Object} option        Object--配置对象
     * @param option.title      Array--表头，即表格首行展示的内容，如：['姓名','年龄','性别','地址']
     * @param option.body       Array--表格内容，二维数组，每一行的内容为一个数组，与表头对应，如:[['王小虎',28,'男','aa'],['王大虎',29,'男','aa']]
     * @param option.name       String--文件名，如:'demo'
     * @param option.suffix     String--文件后缀名，如'csv'
     * @param option.merges     Array--表格的单元格合并信息，如[
          { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },-----表示A1和A2单元格合并
          { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } },-----表示B1和C1单元格合并
          { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },-----表示D1和E1单元格合并
          { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }-----表示F1和F2单元格合并
        ]------s:start,e:end,r:row,c:cell;
     */
    exportFromArray(option) {
        const config = Object.assign({}, { name: 'demo', suffix: 'csv' }, option)
        const { title, body, name, suffix, merges } = config;
        const array = [...title, ...body];
        const workBook = utils.book_new();//创建workBook
        const workSheet = utils.aoa_to_sheet(array);//将数组转换成workSheet
        const fileName = name + '.' + suffix;
        workSheet['!merges'] = merges;
        utils.book_append_sheet(workBook, workSheet, name);
        XLSX.writeFile(workBook, fileName, { bookType: suffix, type: 'buffer' })
    },
    /**
     * @description                      依据网页中的表格导出文件，只导出网页中的表格数据
     * @param {Object} option            配置对象
     * @param {string} option.id         表格在dom中的id,必传
     * @param {string} option.name       String--文件名，如:'demo'
     * @param {string} option.suffix     String--文件后缀名，如'csv'
     */
    exportFromTable(option) {
        const config = Object.assign({}, { name: 'demo', suffix: 'csv',sheetName:'信息表' }, option),
            { id, name, suffix, merges,sheetName } = config,
            workBook = utils.book_new(),
            workSheet = utils.table_to_sheet(document.getElementById(id)),
            fileName = name + '.' + suffix;
        workSheet['!merges'] = merges;
        utils.book_append_sheet(workBook, workSheet, sheetName);
        XLSX.writeFile(workBook, fileName, { bookType: suffix, type: 'buffer' })
    },
    /**
     * @description  解析表格文件数据，返回表格中内容，目前暂不支持导入有单元格合并的表格
     * @param    {Object} file    导入的文件，二进制数据流
     * @returns  {Object} data    返回的表格数据
     * @returns  {Array}  data.title   表头
     * @returns  {Array}  data.body    表格数据
     */
    async importFromLocal(file) {
       /* const workBook = await this.readerWorkBookFromLocal(file),
            workSheet = workBook.Sheets[workBook.SheetNames[0]],
            content = utils.sheet_to_json(workSheet),
            data = {};
        data.title = Object.keys(content[0]);
        data.body = content;
        return data;*/
        const workBook = await this.readerWorkBookFromLocal(file),
            workSheet = workBook.Sheets[workBook.SheetNames[0]],
            content = utils.sheet_to_json(workSheet),
            data = {};
            let arr=[];
            let i = 0;
            content.forEach(item => {
                let obj={};
                for (let key in character){
                    let v=character[key],
                    text = v.text,
                    type = v.type;
                    v = item[text]||"";
                    type ==="string" ? (v = String(v)) : null;
                    type === "number" ? (v = Number(v)) : null;
                    obj[key] = v;
                }
                
                const str = JSON.stringify(obj);
                //console.log(str);
                var strs = web3.utils.sha3(str);
                window.myContract2.methods.saveEvidence(strs).send({from:window.defaultAccount})
                .on('transactionHash',(transactionHash)=>{
                    /*return  new Promise((resolve,reject) => {
                        resolve(transactionHash)
                    }).then(resolve => {
                        console.log(transactionHash)
                    })*/
                    
                    //obj.TransHash = transactionHash;
                    //console.log('transactionHash', obj)
                })
                .on('receipt',(receipt)=>{
                    console.log({ receipt:receipt })
                })
                .on('error',(error, receipt)=>{
                    console.log({ error:error, receipt:receipt})
                })
                content[i]["体育成绩哈希值"] = strs;
                //content[i]["交易哈希"] = transactionHash;
                obj.hash256 = strs;
                //console.log(obj);
                arr.push(obj);
                i++
            });
            //console.log(arr)
        arr.title = Object.keys(content[0]);
        //data.title = arr;
        arr.body = content;
        console.log(content);
        //console.log(arr.body);
        return arr;
    },
    /**
     * @description              本地读取文件的方法
     * @param {Object} file      文件流
     */
    readerWorkBookFromLocal(file) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        return new Promise(function (resolve, reject) {
            reader.onload = function (e) {
                const fileData = e.target.result;
                if (reader.readyState === 2) {
                    const workBook = XLSX.read(fileData, { type: 'binary' });
                    resolve(workBook);
                } else {
                    reject('读取文件失败');
                }
            }
        })
    }
}

export default EXCEL;