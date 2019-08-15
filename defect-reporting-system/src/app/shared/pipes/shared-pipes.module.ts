import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
    name: 'singleDeptFilter'
})
export class SingleDeptFilter implements PipeTransform {
    transform(deptId: any, deptList: any): any {
        // tslint:disable-next-line:no-shadowed-variable
        const dept = deptList.find(dept => dept.dept_id === deptId);
        if (dept !== null && dept !== undefined) {
            return dept.deptName;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'multipleDeptFilter'
})
export class MultipleDeptFilter implements PipeTransform {
    transform(deptIdList: any, deptList: any): any {
        if (deptIdList !== null) {
            let deptDesc = deptList.map(dept => {
                return deptIdList.indexOf(dept.dept_id) > -1
                    ? dept.deptName
                    : null;
            });
            deptDesc = deptDesc.filter(v => v !== null);
            return deptDesc;
        } else {
            return;
        }
    }
}

@Pipe({
    name: 'singleDesignationFilter'
})
export class SingleDesignationFilter implements PipeTransform {
    transform(designationId: any, designationIdList: any): any {
        const designation = designationIdList.find(
            // tslint:disable-next-line:no-shadowed-variable
            designation => designation.designation_id === designationId
        );
        if (
            designationId !== null &&
            designationId !== undefined &&
            designation !== undefined
        ) {
            return designation.designation === null
                ? 'N/A'
                : designation.designation;
        } else {
            return;
        }
    }
}

@Pipe({
    name: 'userTypeFilter'
})
export class UserTypeFilter implements PipeTransform {
    transform(userType: any): any {
        return +userType === 1 ? 'Ship' : 'Office';
    }
}

@Pipe({
    name: 'multipleUserFilter'
})
export class MultipleUserFilter implements PipeTransform {
    transform(userIdList: any, userList: any): any {
        if (userIdList.length > 0) {
            let userNameList = userList.map(user => {
                return userIdList.indexOf(user.user_id) > -1
                    ? user.firstname + ' ' + user.lastName
                    : null;
            });
            userNameList = userNameList.filter(v => v !== null);
            return userNameList;
        } else {
            return;
        }
    }
}

@Pipe({
    name: 'multipleFunctionFilter'
})
export class MultipleFunctionFilter implements PipeTransform {
    transform(functionIdList: any, functionList: any): any {
        if (functionIdList !== null && functionIdList.length > 0) {
            let functionNameList = functionList.map(func => {
                return functionIdList.indexOf(func.function_id) > -1
                    ? func.functionKey
                    : null;
            });
            functionNameList = functionNameList.filter(v => v !== null);
            return functionNameList;
        } else {
            return;
        }
    }
}

@Pipe({
    name: 'orgFilter'
})
export class SingleOrgFilter implements PipeTransform {
    transform(orgId: any, orgList: any): any {
        // tslint:disable-next-line:no-shadowed-variable
        const org = orgList.find(org => org.org_id === orgId);
        if (org !== null && org !== undefined) {
            return org.orgName;
        } else {
            return '';
        }
    }
}

@Pipe({ name: 'searchByName' })
export class SearchByNamePipe implements PipeTransform {
    transform(list: any[], searchText: string, searchField: string) {
        return list.filter(
            item =>
                item[searchField].toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
    }
}

@Pipe({ name: 'searchByNameMultiple' })
export class SearchByNameMultiple implements PipeTransform {
    transform(list: any[], searchText: string, searchFieldList: string) {
        return list.filter(
            item => {
                let found = false;
                for(let i = 0; i < searchFieldList.length; i++){
                    if((''+item[searchFieldList[i]]).toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
                        found = true;                        
                    }
                }
                if(found){
                    return true;
                }else{
                    return false;
                }    
            }
        );
    }
}

@Pipe({ name: 'searchByNameMultipleJobLibrary' })
export class SearchByNameMultipleJobLibrary implements PipeTransform {
    transform(list: any[], searchText: string, searchFieldList: string, vesselType) {
        return list.filter(
            item => {
                let found = false;
                if(searchText == '' && vesselType == ''){
                    return true;
                }
                for(let i = 0; i < searchFieldList.length; i++){
                    if(item[searchFieldList[i]] !== null && item[searchFieldList[i]] !== '' && 'vesselAge' !== searchFieldList[i]
                        && (''+item[searchFieldList[i]]).trim().toLowerCase().indexOf(searchText.trim().toLowerCase()) !== -1 
                        && searchText.length > 0){
                        found = true;  
                        break;                      
                    }
                    if(item[searchFieldList[i]] !== null && item[searchFieldList[i]] !== '' && 'vesselAge' === searchFieldList[i]                     
                        && searchText.length > 0){
                            let vesselAgeList = item[searchFieldList[i]].split(',');
                            for(let j = 0; j < vesselAgeList.length; j++){
                                if(vesselAgeList[j] >= +searchText.trim().toLowerCase()){
                                        found = true;  
                                        break;
                                }
                            }
                                              
                    }    
                    if(found)   break;            
                }
                if(item.vesselType !== null && vesselType !== '' 
                    && (''+item.vesselType).trim().toLowerCase().indexOf(vesselType.trim().toLowerCase()) !== -1){
                    found = true;               
                }
                if(found){
                    return true;
                }else{
                    return false;
                }    
            }
        );
    }
}

@Pipe({
    name: 'singleShipNamefilter'
})
export class SingleShipNamefilter implements PipeTransform {
    transform(ship_id: any, list: any): any {
        const obj = list.find(ship => ship.ship_id === ship_id);
        if (obj !== null && obj !== undefined) {
            return obj.name;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'singleShipImofilter'
})
export class SingleShipImofilter implements PipeTransform {
    transform(ship_id: any, list: any): any {
        const obj = list.find(ship => ship.ship_id === ship_id);
        if (obj !== null && obj !== undefined) {
            return obj.v_imo_no;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'multipleRoleFilter'
})
export class MultipleRoleFilter implements PipeTransform {
    transform(roleIdList: any, roleList: any): any {
        if (roleIdList !== null && roleIdList.length > 0) {
            let roleNameList = roleList.map(role => {
                return roleIdList.indexOf(role.role_id) > -1
                    ? role.description
                    : null;
            });
            roleNameList = roleNameList.filter(v => v !== null);
            return roleNameList;
        } else {
            return;
        }
    }
}

@Pipe({
    name: 'singleVesselTypeFilter'
})
export class SingleVesselTypeFilter implements PipeTransform {
    transform(id: any, list: any): any {
        const obj = list.find(vessel => vessel.id === id);
        if (obj !== null && obj !== undefined) {
            return obj.description;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'singleDockyardFilter'
})
export class SingleDockyardFilter implements PipeTransform {
    transform(id: any, list: any): any {
        const obj = list.find(dockyard => dockyard.id === +id);
        if (obj !== null && obj !== undefined) {
            return obj.dockyard;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'singleDocType'
})
export class SingleDocType implements PipeTransform {
    transform(id: any, list: any): any {
        const obj = list.find(dockyard => dockyard.id === +id);
        if (obj !== null && obj !== undefined) {
            return obj.dockyard;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'singleCurrency'
})
export class SingleCurrency implements PipeTransform {
    transform(id: any, list: any): any {
        const obj = list.find(currency => currency.id === +id);
        if (obj !== null && obj !== undefined) {
            return obj.currencyDescription;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'singleComponent'
})
export class SingleComponent implements PipeTransform {
    transform(id: any, list: any): any {
        const obj = list.find(component => component.id === +id);
        if (obj !== null && obj !== undefined) {
            return obj.description;
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'singleShipType'
})
export class SingleShipType implements PipeTransform {
    transform(ship_id: any, shipList: any, vesselTypeList: any): any {
        const ship = shipList.find(ship => ship.ship_id === ship_id);
        if (ship !== null && ship !== undefined) {
            const obj = vesselTypeList.find(vType => vType.id === ship.v_type);
            if (obj !== null && obj !== undefined) {
                return obj.description;
            }
        } else {
            return '';
        }
    }
}

@Pipe({
    name: 'characterLimit'
})
export class CharacterLimit implements PipeTransform {
    transform(data: any, limit: any): any {
        return data !== null ? data.substring(0, limit) + "..." : '';
    }
}

@Pipe({
    name: 'orderBy'
})
export class OrderBy implements PipeTransform {
    transform(data: any, shortPropertyList: any): any {
        shortPropertyList.forEach(element => {
            data.sort((a, b) => {                
                return b[element] - a[element];
            });
        });
        return data;
    }
}

@Pipe({
    name: 'runningJobCount'
})
export class RunningJobCount implements PipeTransform {
    transform(jobList: any): any {
        if (jobList !== null) {
            let activejobList = jobList.filter(job => job.status === 'A');
            return activejobList.length;
        } else {
            return '';
        }
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [
        SingleDeptFilter,
        SingleDesignationFilter,
        UserTypeFilter,
        MultipleDeptFilter,
        MultipleUserFilter,
        SearchByNamePipe,
        SearchByNameMultiple,
        SingleOrgFilter,
        MultipleFunctionFilter,
        SingleShipNamefilter,
        SingleShipImofilter,
        MultipleRoleFilter,
        SingleDockyardFilter,
        SingleVesselTypeFilter,
        SingleDocType,
        SingleCurrency,
        CharacterLimit,
        OrderBy,
        SearchByNameMultipleJobLibrary,
        SingleComponent,
        SingleShipType,
        RunningJobCount

    ],
    declarations: [
        SingleDeptFilter,
        SingleDesignationFilter,
        UserTypeFilter,
        MultipleDeptFilter,
        MultipleUserFilter,
        SearchByNamePipe,
        SearchByNameMultiple,
        SingleOrgFilter,
        MultipleFunctionFilter,
        SingleShipNamefilter,
        SingleShipImofilter,
        MultipleRoleFilter,
        SingleDockyardFilter,
        SingleVesselTypeFilter,
        SingleDocType,
        SingleCurrency,
        CharacterLimit,
        OrderBy,
        SearchByNameMultipleJobLibrary,
        SingleComponent,
        SingleShipType,
        RunningJobCount
    ]
})
export class SharedPipesModule {}
