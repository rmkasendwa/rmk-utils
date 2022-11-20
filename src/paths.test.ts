import { matchPath } from './paths';

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
