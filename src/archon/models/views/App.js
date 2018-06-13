import { getCommitTimeFromTag } from '../Utils';

export default function AppView(app) {
  let wrapped = app;
  
  wrapped.commitTime = () => {
    return getCommitTimeFromTag(app.metaversion);
  };

  wrapped.procFullname = (proc) => {
    return `${app.appname}.${proc.proctype}.${proc.procname}`;
  };

  wrapped.procUpCount = (proc) => {
    return _(proc.pods).
      filter(p => p.status === 'True').
      value().length;
  };

  wrapped.lifescore = () => {
    let upCount = 0;
    let total = 0;
    if (app.apptype === 'resource') {
      return 100;
    }

    _.forEach(app.procs, (proc) => {
      total += proc.numinstances;
      upCount += wrapped.procUpCount(proc);
    });
    // FIXME: uncomment this when we got the portal pods runtime data
    //const portals = _(app.useservices).map(s => s.service.portals).flatten().value();
    //_.forEach(portals, (proc) => {
      //total += proc.numinstances;
      //upCount += wrapped.procUpCount(proc);
    //});
    return total > 0 ? upCount * 100.0 / total : 100;
  };

  return wrapped;
};
