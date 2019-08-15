export class UserDetail{
	public user_id: number = null;
	public userType: number = 2;
	public shipid: number = null;
	public userCode: string = '';
	public passcode: string = '';
	public firstname: string = '';
	public lastname: string = '';
	public deptId: number = null;
	public phonenumber: string = '';
	public personalMailid: string = '';
	public designationId: number = null;
	public email1: string = '';

	public useruid: string = '';
	public uidtype: string = '';
	public imagePath: string = '';
	public orgId: number = null;	
	public roleList: Array<number> = [];
	public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
	public isactive: number = 1;
}