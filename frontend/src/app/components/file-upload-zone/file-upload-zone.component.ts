import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {IonInput} from '@ionic/angular';

@Component({
  selector: 'app-file-upload-zone',
  templateUrl: './file-upload-zone.component.html',
  styleUrls: ['./file-upload-zone.component.scss']
})
export class FileUploadZoneComponent {
  @Input() multiple: boolean;
  @Output() files: EventEmitter<FileList | File> = new EventEmitter();
  @ViewChild('inputElement') inputElement: IonInput;

  handleDrop(files: FileList) {
    const file = files[0];
    this.files.next(this.multiple ? files : file);
  }

  async handleSelect(event) {
    const {files} = await this.inputElement.getInputElement();
    if (files) {
      const file = files[0];
      this.files.next(this.multiple ? files : file);
    }
  }

  async openFileDownLoad() {
    const inputElement = await this.inputElement.getInputElement();
    inputElement.click();
  }
}
