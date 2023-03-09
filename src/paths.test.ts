import { addSearchParams, matchPath } from './paths';

describe('matchPath', () => {
  it('should return true if the test path matches the template path', () => {
    expect(
      matchPath('/users/{userId}/properties', '/users/123/properties')
    ).toBe(true);
    expect(
      matchPath('/users/[userId]/properties', '/users/123/properties')
    ).toBe(true);
    expect(
      matchPath('/users/:userId/properties', '/users/123/properties')
    ).toBe(true);
  });
});

describe('addSearchParams', () => {
  it('should encode object as stringified url', () => {
    expect(
      addSearchParams(
        '/users',
        {
          sortBy: [
            { id: '1234', sortDirection: 'ASC' },
            { id: '4587', sortDirection: 'DESC' },
          ],
        },
        {
          arrayParamStyle: 'append',
        }
      )
    ).toBe(
      '/users?sortBy[0][id]=1234&sortBy[0][sortDirection]=ASC&sortBy[1][id]=4587&sortBy[1][sortDirection]=DESC'
    );
  });
});
