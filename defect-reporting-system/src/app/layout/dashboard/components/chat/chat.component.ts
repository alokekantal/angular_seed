import { Component, OnInit } from '@angular/core';

import { AppConstant } from '../../../../shared/constant/appConstant';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    options = AppConstant.editorConfig;
    constructor() { }
    ngOnInit() { }
}
