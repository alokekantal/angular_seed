import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor(private translate: TranslateService) {
        this.sliders.push(
            {
                imagePath: 'assets/images/image1.jpg',
                label: '',
                text:''
            },
            {
                imagePath: 'assets/images/image2.jpg',
                label: '',
                text: ''
            },
            {
                imagePath: 'assets/images/image3.jpg',
                label: '',
                text:''
            },
            {
                imagePath: 'assets/images/image4.jpg',
                label: '',
                text:''
            }
        );

        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            },
            {
                id: 2,
                type: 'warning',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            }
        );
    }

    ngOnInit() {}

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
