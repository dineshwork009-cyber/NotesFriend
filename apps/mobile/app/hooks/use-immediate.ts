import { DependencyList, EffectCallback, useEffect } from "react";

const useImmediateEffect = (callback: EffectCallback, deps: DependencyList) => {
  useEffect(() => {
    let cleanup;
    setImmediate(() => {
      cleanup = callback();
    });
    return cleanup;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);
};

export default useImmediateEffect;
