import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-image-message',
  templateUrl: './image-message.component.html',
  styleUrls: ['./image-message.component.scss']
})
export class ImageMessageComponent implements OnInit {
  @Input() imageSrc: string;
  constructor() {
  }

  ngOnInit() {
  }

}
