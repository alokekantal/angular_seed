export class ProjectCurrencyConversion{
    public id: number = 0;
	public orgid: number = 0;
	public shipid: number = 0;
    public projectid: number = 0;
    public fromcurrencyid: number = 0; ;
	public tocurrencyid: number = 0; ;
	public conversionRate: number = 0; ;

	public isSelected: boolean = false;

    public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
	public isactive: number = null;
	
	constructor(shipid, projectid, fromcurrencyid, tocurrencyid, isSelected){
		this.shipid = shipid;
		this.projectid = projectid;
		this.fromcurrencyid = fromcurrencyid;
		this.tocurrencyid = tocurrencyid;
		this.isSelected = isSelected;
	}
}