export class ProjectDockyard {
	public id: number = 0;
	public orgid: number = 0;
	public shipid: number = 0;
    public projectid: number = 0;    
    public dockyardId: number = 0;;
	public contactDetails: string = '';
	public remarks: string = '';
	public defaultCurrencyId: string = '';

    public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
	public isactive: number = null;

	//transient
	public dockyard: string = '';
	public isSelected: boolean = false;
	
	constructor(shipid, projectid, dockyardId, dockyard, isSelected){
		this.shipid = shipid;
		this.projectid = projectid;
		this.dockyardId = dockyardId;
		this.dockyard = dockyard;
		this.isSelected = isSelected;
	}
}