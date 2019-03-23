import { TestBed } from '@angular/core/testing';

import { S3Service } from './s3.service';

describe('S3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: S3Service = TestBed.get(S3Service);
    expect(service).toBeTruthy();
  });
});
