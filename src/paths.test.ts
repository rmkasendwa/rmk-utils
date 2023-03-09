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
  it('should be able to work work with both primitive types and object types in same url', () => {
    expect(
      addSearchParams(
        '/users',
        {
          sortBy: [
            { id: '1234', sortDirection: 'ASC' },
            { id: '4587', sortDirection: 'DESC' },
          ],
          modifiedKeys: ['groupBy', 'sortBy'],
          expandedGroupsInverted: true,
        },
        {
          arrayParamStyle: 'append',
        }
      )
    ).toBe(
      '/users?sortBy[0][id]=1234&sortBy[0][sortDirection]=ASC&sortBy[1][id]=4587&sortBy[1][sortDirection]=DESC&modifiedKeys[0]=groupBy&modifiedKeys[1]=sortBy&expandedGroupsInverted=true'
    );
  });
});
