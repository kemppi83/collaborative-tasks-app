import * as React from 'react';
import { useProtectedMutation } from '../../app/services/auth';

export const ProtectedComponent = (): JSX.Element => {
  const [attemptAccess, { data, error, isLoading }] = useProtectedMutation();

  return (
    <>
      <button type="button" onClick={() => attemptAccess()}>
        Make an authenticated request
      </button>
      {isLoading && <p>Data is loading</p>}
      {data ? (
        <>
          Data:
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      ) : error ? (
        <>
          Error: <pre>{JSON.stringify(error, null, 2)}</pre>
        </>
      ) : null}
    </>
  );
};
