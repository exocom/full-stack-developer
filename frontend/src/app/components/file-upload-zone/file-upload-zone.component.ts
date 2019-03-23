import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-file-upload-zone',
  templateUrl: './file-upload-zone.component.html',
  styleUrls: ['./file-upload-zone.component.scss']
})
export class FileUploadZoneComponent {
  @Input() multiple: boolean;
  @Output() files: EventEmitter<FileList | File> = new EventEmitter();
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>;

  handleDrop(files: FileList) {
    const file = files[0];
    this.files.next(this.multiple ? files : file);
  }

  handleSelect(event) {
    const {files} = this.inputElement.nativeElement;
    if (files) {
      const file = files[0];
      this.files.next(this.multiple ? files : file);
    }
  }
}
