import * as React from 'react';
import { getCommonResourceActions } from '@console/app/src/actions/creators/common-factory';
import { K8sResourceKind, referenceFor } from '@console/internal/module/k8s';
import { useK8sModel } from '@console/shared/src/hooks/useK8sModel';
import { EditImportApplication } from './creators';

export const useEditImportActionProvider = (resource: K8sResourceKind) => {
  const [kindObj, inFlight] = useK8sModel(referenceFor(resource));

  const editImportAction = React.useMemo(() => {
    const annotation = resource?.metadata?.annotations?.['openshift.io/generated-by'];
    const isFromDevfile = resource?.metadata?.annotations?.isFromDevfile;
    const hideEditImportAction = annotation !== 'OpenShiftWebConsole' || !!isFromDevfile;

    return hideEditImportAction ? [] : EditImportApplication(kindObj, resource);
  }, [kindObj, resource]);

  return [editImportAction, !inFlight, undefined];
};

export const useServiceBindingActionProvider = (resource: K8sResourceKind) => {
  const [k8sKind, inFlight] = useK8sModel(referenceFor(resource));
  const action = React.useMemo(() => getCommonResourceActions(k8sKind, resource), [
    k8sKind,
    resource,
  ]);
  return [action, !inFlight, undefined];
};
