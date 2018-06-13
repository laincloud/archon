import Moment from 'moment';

export default function ProcView(proc) {
  let wrapped = proc;

  wrapped.upCount = () => {
    return _(proc.pods).
      filter(p => p.status === 'True').
      value().length;
  };

  wrapped.lifescore = () => {
    let score = wrapped.upCount() * 100.0 / proc.numinstances;
    return score > 100 ? 100 : score;
  };

  return wrapped;
}
