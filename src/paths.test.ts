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
  it('should return the route path as is when no search parameters are provided', () => {
    const routePath = '/products';
    const searchParams = {};
    const modifiedURL = addSearchParams(routePath, searchParams);
    expect(modifiedURL).toBe(routePath);
  });

  it('should append search parameters to the route path with default options', () => {
    const routePath = '/products';
    const searchParams = {
      category: 'electronics',
      price: 100,
    };
    const expected = '/products?category=electronics&price=100';
    const modifiedURL = addSearchParams(routePath, searchParams);
    expect(modifiedURL).toBe(expected);
  });

  it('should append search parameters to the route path event when the path has existing search parameters', () => {
    const routePath = '/products?category=electronics';
    const searchParams = {
      price: 100,
      availability: true,
    };
    const expected =
      '/products?category=electronics&price=100&availability=true';
    const modifiedURL = addSearchParams(routePath, searchParams);
    expect(modifiedURL).toBe(expected);
  });

  it('should encode object as stringified url', () => {
    const expected =
      '/users?sortBy[0][id]=1234&sortBy[0][sortDirection]=ASC&sortBy[1][id]=4587&sortBy[1][sortDirection]=DESC';
    const modifiedURL = addSearchParams(
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
    );
    expect(modifiedURL).toBe(expected);
  });
  it('should be able to work work with both primitive types and object types in same url', () => {
    const expected =
      '/users?sortBy[0][id]=1234&sortBy[0][sortDirection]=ASC&sortBy[1][id]=4587&sortBy[1][sortDirection]=DESC&modifiedKeys[0]=groupBy&modifiedKeys[1]=sortBy&expandedGroupsInverted=true';
    const modifiedURL = addSearchParams(
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
    );
    expect(modifiedURL).toBe(expected);
  });

  it('should replace the existing search param not append if it already exists', () => {
    {
      const routePath = '/products?price=150';
      const searchParams = {
        category: 'electronics',
        price: 200,
      };
      const expected = '/products?category=electronics&price=200';
      const modifiedURL = addSearchParams(routePath, searchParams);
      expect(modifiedURL).toBe(expected);
    }
    {
      const routePath = '/products?price=150&price=250';
      const searchParams = {
        category: 'electronics',
        price: 200,
      };
      const expected = '/products?category=electronics&price=200';
      const modifiedURL = addSearchParams(routePath, searchParams);
      expect(modifiedURL).toBe(expected);
    }
  });
});
