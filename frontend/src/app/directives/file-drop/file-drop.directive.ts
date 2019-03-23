import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
  exportAs: 'appFileDrop'
})
export class FileDropDirective {
  @Output() filesDropped = new EventEmitter<FileList>();
  filesHovered = false;

  constructor() {
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    event.preventDefault();
    const {files} = event.dataTransfer;
    this.filesDropped.emit(files);
    if (this.filesHovered === false) {
      return;
    }
    this.filesHovered = false;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    event.preventDefault();
    if (this.filesHovered === true) {
      return;
    }
    this.filesHovered = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    if (this.filesHovered === false) {
      return;
    }
    this.filesHovered = false;
  }
}
