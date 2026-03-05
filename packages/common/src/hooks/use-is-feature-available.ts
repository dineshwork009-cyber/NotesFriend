import { useEffect, useState } from "react";
import {
  areFeaturesAvailable,
  FeatureId,
  FeatureResult,
  isFeatureAvailable
} from "../utils/index.js";
import { EVENTS } from "@notesfriend/core";
import { database } from "../database.js";

export function useIsFeatureAvailable<TId extends FeatureId>(
  id: TId | undefined,
  value?: number
) {
  const [result, setResult] = useState<FeatureResult<TId>>();

  useEffect(() => {
    if (!id) return;

    isFeatureAvailable(id, value).then((result) => setResult(result));
    const userSubscriptionUpdated = database.eventManager.subscribe(
      EVENTS.userSubscriptionUpdated,
      () => {
        isFeatureAvailable(id, value).then((result) => setResult(result));
      }
    );
    return () => {
      userSubscriptionUpdated.unsubscribe();
    };
  }, []);

  return result;
}

export function useAreFeaturesAvailable<TIds extends FeatureId[]>(
  ids: TIds,
  values: number[] = []
) {
  const [result, setResult] =
    useState<{ [K in TIds[number]]: FeatureResult<K> }>();

  useEffect(() => {
    areFeaturesAvailable(ids, values).then((result) => setResult(result));
    const userSubscriptionUpdated = database.eventManager.subscribe(
      EVENTS.userSubscriptionUpdated,
      () => {
        areFeaturesAvailable(ids, values).then((result) => setResult(result));
      }
    );
    return () => {
      userSubscriptionUpdated.unsubscribe();
    };
  }, []);

  return result;
}
