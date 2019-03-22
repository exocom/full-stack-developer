import {finalize, map, shareReplay, startWith, tap} from 'rxjs/operators';
import {combineLatest, concat, from, Observable, ReplaySubject} from 'rxjs';

export const navigatorPermission = () => (source: Observable<any>) => {
  let permissionStatusWithOnchange = null;
  const replaySubject: ReplaySubject<PermissionStatus> = new ReplaySubject(1);

  source.pipe(tap(permissionStatus => {
      permissionStatusWithOnchange = permissionStatus;
      permissionStatus.onchange = function () {
        replaySubject.next(this);
      };
    }),
    finalize(() => {
      permissionStatusWithOnchange.onchange = null;
      permissionStatusWithOnchange = null;
    }));
  return concat(source, replaySubject.pipe(shareReplay(1)));
};


export const startFromPromise = <T>(promise: Promise<T>, source: Observable<T>) => {
  const startValue = new Date();
  return combineLatest(from(promise), source.pipe(startWith(startValue))).pipe(
    map(([p, o]) => o === startValue ? p : o),
    shareReplay(1)
  );
};
