import authReducer, { setCredentials, resetCredentials } from './authSlice';
import type { AuthState } from './authSlice';

describe('authentication reducer', () => {
  const initialState: AuthState = {
    user: null,
    token: null
  };
  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null
    });
  });

  it('should handle user', () => {
    expect(
      authReducer(
        initialState,
        setCredentials({
          user: {
            username: 'Test',
            email: 'testuser@email.com'
          },
          token: 'exampleToken'
        })
      )
    ).toEqual({
      user: {
        username: 'Test',
        email: 'testuser@email.com'
      },
      token: 'exampleToken'
    });
  });

  it('should reset state', () => {
    const currentState = {
      user: {
        username: 'Test',
        email: 'testuser@email.com'
      },
      token: 'exampleToken'
    };

    expect(authReducer(currentState, resetCredentials())).toEqual({
      user: null,
      token: null
    });
  });
});
