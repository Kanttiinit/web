import { ErrorBoundary as SolidErrorBoundary } from "solid-js";
import * as consts from "../consts";
import { computedState } from "../state";

const ErrorMessage = () => {
  return <p>{computedState.translations().errorDetails}</p>;
};

export function ErrorBoundary(props: { children: any; fallback?: any }) {
  return (
    <SolidErrorBoundary
      fallback={(error) => {
        console.error(error);

        if (consts.isProduction) {
          // window.Sentry.captureException(error);
        }

        return props.fallback || <ErrorMessage />;
      }}
    >
      {props.children}
    </SolidErrorBoundary>
  );
}
