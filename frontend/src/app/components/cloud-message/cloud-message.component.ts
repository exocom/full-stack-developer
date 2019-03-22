import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cloud-message',
  templateUrl: './cloud-message.component.html',
  styleUrls: ['./cloud-message.component.scss']
})
export class CloudMessageComponent implements OnInit {
  @Input() emoji: 'crumbs' | 'sleeping';

  constructor() {
  }

  ngOnInit() {
  }

}
