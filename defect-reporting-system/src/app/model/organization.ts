import { UserDetail } from './userDetail';
export class Organization{
    public org_id: number = null;
	public orgName: string = '';
	public orgMail: string = '';
	public address: string = '';
	public phoneNo: string = '';
	public faxNo: string = '';
	public orgRegNumber: string = '';
	public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
	public isactive: number = null;
	public orgDesc: string = '';
	public email1: string = '';
	public email2: string = '';
	public phoneNo1: string = '';
	public phoneNo2: string = '';
	public copyFromOrgId: number = null;
	public userDetail: UserDetail = new UserDetail();

}