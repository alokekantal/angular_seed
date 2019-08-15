import { Injectable } from "@angular/core";
import { AppConstant } from '../constant/appConstant';

@Injectable()
export class UtilityService {
  constructor() { }

  prepareDataForRole(data, keyId, keyDescription): any {
    let list = [];
    for (let i = 0; i < data.length; i++) {
      list.push({
        id: data[i][keyId],
        itemName: data[i][keyDescription]
      });
    }
    return list
  }

  prepareDataForVessel(data, keyId, keyDescription): any {
    let list = [];
    for (let i = 0; i < data.length; i++) {
      list.push({
        id: data[i][keyId],
        itemName: data[i][keyDescription]
      });
    }
    return list
  }

  getNestedChildren(arr, parentcode) {
    var out = []
    for (var i in arr) {
      if (arr[i].parentcode == parentcode) {
        var childrens = this.getNestedChildren(arr, arr[i].code)
        if (childrens.length) {
          arr[i].childrens = childrens;
        } else {
          arr[i].childrens = [];
        }
        arr[i]['options'] = AppConstant.COMPONENT_OPTIONS;
        out.push(arr[i])
      }
    }
    return out
  }

  configComponemtListWithEdit() {
    return {
      showActionButtons: true,
      showAddButtons: true,
      showRenameButtons: true,
      showDeleteButtons: true,
      enableExpandButtons: true,
      enableDragging: true,
      rootTitle: 'Components',
      validationText: 'Enter valid data',
      minCharacterLength: 5,
      setItemsAsLinks: false,
      setFontSize: 15,
      setIconSize: 12,
      codeList: null
    };
  }

  configComponemtList() {
    return {
      showActionButtons: false,
      showAddButtons: true,
      showRenameButtons: true,
      showDeleteButtons: true,
      enableExpandButtons: true,
      enableDragging: false,
      rootTitle: 'Components',
      validationText: 'Enter valid data',
      minCharacterLength: 5,
      setItemsAsLinks: false,
      setFontSize: 15,
      setIconSize: 12
    };
  }

  search(object, searchKeyword){
    if(object.code.toLowerCase().indexOf(searchKeyword.toLowerCase()) == -1 
        && object.description.toLowerCase().indexOf(searchKeyword.toLowerCase()) == -1){        
      object.options.hidden = true;
    } else if (searchKeyword === '') {
      object.options.hidden = false;
    } else {
      object.options.hidden = false;
    }
    for(let child of object.childrens){      
      this.search(child, searchKeyword);
    } 
    var child = object.childrens.find(function(node){
      return node.options.hidden === false;		
    });
    if(child != undefined){
      object.options.hidden =false;
    }
      return object;     
  }

  setLoginInfo(logininfo) {
    localStorage.setItem('loginInfo', JSON.stringify(logininfo));
  }

  setOrgInfo(orgInfo) {
    localStorage.setItem('orgInfo', JSON.stringify(orgInfo));
  }

  getLoginInfo() {
    return JSON.parse(localStorage.getItem('loginInfo'));
  }

  getOrgInfo() {
    return JSON.parse(localStorage.getItem('orgInfo'));
  }

  setComponentTree(componentList) {
    localStorage.setItem('componentList', JSON.stringify(componentList));
  }

  setComponentLinear(componentListLinear) {
    localStorage.setItem('componentListLinear', JSON.stringify(componentListLinear));
  }

  getComponentTree() {
    return JSON.parse(localStorage.getItem('componentList'));
  }

  getComponentLinear() {
    return JSON.parse(localStorage.getItem('componentListLinear')).slice();
  }

  setShipNameForJob(shipName) {
    let data = {shipName: shipName};
    localStorage.setItem('shipNameForJob', JSON.stringify(data));
  }

  getShipNameForJob() {
    return JSON.parse(localStorage.getItem('shipNameForJob')).shipName;
  }

  datePickerObjectTodate(dateObj){
    return  dateObj.year + '-' + dateObj.month + '-' + dateObj.day;
  }

  datePickerObjectTodatetimestamp(dateObj){
    return  (new Date(dateObj.year + '-' + dateObj.month + '-' + dateObj.day)).getTime();
  }

  javascriptDateToString(date){
    return [date.getFullYear(), (date.getMonth()+1),date.getDate()].join('-') +' ' +
            [date.getHours(),date.getMinutes()].join(':');
  }

  javascriptDateToObj(date){
      return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
              };
  }

  secToClock(d){
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

  getFileType(attachment){
    let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
    if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
      ext = 'image';
    }else if(ext == 'xls' || ext == 'xlsx') {
      ext = 'excel';
    }else if(ext == 'pdf') {
      ext = 'pdf';
    }
    return ext;
  }


  showLoader() {
    document.getElementById("overlay").style.visibility = "visible";
  }

  hideLoader() {
    document.getElementById("overlay").style.visibility = "hidden";
  }

  showLoaderMsg() {
    document.getElementById("overlaywithmsg").style.visibility = "visible";
  }

  hideLoaderMsg() {
    document.getElementById("overlaywithmsg").style.visibility = "hidden";
  }

  checkEditorContentIsValid(data){
    return (data.indexOf('<img') != -1) ? false : true;
  }

}