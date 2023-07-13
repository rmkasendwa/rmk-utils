import { isEmpty } from 'lodash';

export type PathParam = string | number | boolean;

export type QueryParam = PathParam | Record<string, any>;

export type TemplatePathParams = Record<string | number | symbol, PathParam>;

export type TemplatePath<T extends TemplatePathParams = any> = string & {
  [key in keyof T]?: string;
};

export type InferPathParams<P> = P extends TemplatePath<infer T> ? T : never;

/**
 * Returns an interpolated path with placeholder parameters replaced with actual parameters.
 *
 * @param templatePath The path template to interpolate.
 * @param params The parameters to interpolate.
 *
 * @returns Interpolated path.
 *
 * @throws Error if params can't fully interpolate the template path.
 *
 * @example
 * getInterpolatedPath("/users/:userId", { userId: 123 }); -> "/users/123"
 */
export const getInterpolatedPath = <T extends TemplatePathParams = any>(
  templatePath: TemplatePath<T> | string,
  params: T
): string => {
  if (templatePath.match(/:(\w+)/g)) {
    const extractedParameters = [];
    const regex = /:(\w+)/g;
    let match;
    do {
      match = regex.exec(templatePath);
      match && extractedParameters.push(match[1]);
    } while (match);
    extractedParameters
      .filter((key) => !key.match(/^\d+$/g))
      .forEach((key) => {
        if (!params[key]) {
          throw new Error(`Param ${key} not found`);
        }
        templatePath = templatePath.replace(
          `:${key}`,
          encodeURIComponent(params[key])
        ) as typeof templatePath;
      });
  } else if (templatePath.match(/\{(\w+)\}/g)) {
    const extractedParameters = [];
    const regex = /\{(\w+)\}/g;
    let match;
    do {
      match = regex.exec(templatePath);
      match && extractedParameters.push(match[1]);
    } while (match);
    extractedParameters
      .filter((key) => !key.match(/^\d+$/g))
      .forEach((key) => {
        if (!params[key]) {
          throw new Error(`Param ${key} not found`);
        }
        templatePath = templatePath.replace(
          `{${key}}`,
          encodeURIComponent(params[key])
        ) as typeof templatePath;
      });
  } else if (templatePath.match(/\[(\w+)\]/g)) {
    const extractedParameters = [];
    const regex = /\[(\w+)\]/g;
    let match;
    do {
      match = regex.exec(templatePath);
      match && extractedParameters.push(match[1]);
    } while (match);
    extractedParameters
      .filter((key) => !key.match(/^\d+$/g))
      .forEach((key) => {
        if (!params[key]) {
          throw new Error(`Param ${key} not found`);
        }
        templatePath = templatePath.replace(
          `[${key}]`,
          encodeURIComponent(params[key])
        ) as typeof templatePath;
      });
  }

  return templatePath;
};

/**
 * Determines if params are sufficient to interpolate a template path.
 *
 * @param templatePath The template path.
 * @param params Interpolation parameters.
 *
 * @returns whether the params are sufficient to interpolate the path or not.
 *
 * @example
 * paramsSufficientForPath("/users/:userId/properties/:propertyId", { userId: 123 }); -> false
 * paramsSufficientForPath("/users/:userId/properties/:propertyId", { userId: 123, status: "ACTIVE" }); -> false
 * paramsSufficientForPath("/users/:userId/properties/:propertyId", { userId: 123, propertyId: 432 }); -> true
 */
export const paramsSufficientForPath = (
  templatePath: string,
  params: Record<string, PathParam>
) => {
  const extractedParameters = (() => {
    const extractedParameters = [];
    if (templatePath.match(/:(\w+)/g)) {
      const regex = /:(\w+)/g;
      let match;
      do {
        match = regex.exec(templatePath);
        match && extractedParameters.push(match[1]);
      } while (match);
    } else if (templatePath.match(/\{(\w+)\}/g)) {
      const regex = /\{(\w+)\}/g;
      let match;
      do {
        match = regex.exec(templatePath);
        match && extractedParameters.push(match[1]);
      } while (match);
    } else if (templatePath.match(/\[(\w+)\]/g)) {
      const regex = /\[(\w+)\]/g;
      let match;
      do {
        match = regex.exec(templatePath);
        match && extractedParameters.push(match[1]);
      } while (match);
    }
    return extractedParameters;
  })();
  return extractedParameters
    .filter((key) => !key.match(/^\d+$/g))
    .every((key) => {
      if (params[key] == null) {
        return false;
      }
      return true;
    });
};

export interface AddSearchParamsOptions {
  arrayParamStyle?: 'comma' | 'append';
  mode?: 'string' | 'json';
}

/**
 * Appends search parameters to a route path or URL.
 *
 * @param routePath The path to which search params will be added.
 * @param searchParams The search params to add to path.
 * @param options Configuration options.
 *
 * @returns The full path with search params added.
 *
 * @example
 * addSearchParams("/users", { userId: 123, status: "ACTIVE" }); -> "/users?userId=123&status=ACTIVE"
 *
 * @example
 * const routePath = '/products';
 * const searchParams = {
 *   category: 'electronics',
 *   price: 100,
 *   color: ['red', 'blue']
 * };
 *
 * const options = {
 *   arrayParamStyle: 'comma',
 *   mode: 'string'
 * };
 *
 * const modifiedURL = addSearchParams(routePath, searchParams, options);
 * console.log(modifiedURL);
 * // Output: "/products?category=electronics&price=100&color=red,blue"
 */
export const addSearchParams = (
  routePath: string,
  searchParams: Record<string, QueryParam | QueryParam[] | null | undefined>,
  { arrayParamStyle = 'comma', mode = 'string' }: AddSearchParamsOptions = {}
): string => {
  const keys = Object.keys(searchParams);

  if (keys.length === 0) return routePath;

  const paramsKeyValuePair = (() => {
    switch (mode) {
      case 'string':
        return keys.reduce<Record<string, string>>((accumulator, key) => {
          switch (arrayParamStyle) {
            case 'append':
              if (
                searchParams[key] != null &&
                String(searchParams[key]).length > 0
              ) {
                const baseSearchParamValue = searchParams[key]!;

                /**
                 * Recursively finds the nested value path and appends it to the accumulator.
                 *
                 * @param {*} searchParamValue - The current value being processed.
                 * @param {string[]} searchParamValuePath - The path of keys leading to the current value.
                 */
                const findValuePath = (
                  searchParamValue: any,
                  searchParamValuePath: string[] = []
                ) => {
                  if (typeof searchParamValue === 'object') {
                    const entries = Object.entries(searchParamValue);
                    entries.forEach(([objectKey, value]) => {
                      findValuePath(value, [
                        ...searchParamValuePath,
                        objectKey,
                      ]);
                    });
                  } else {
                    accumulator[
                      `${key}${searchParamValuePath
                        .map((key) => {
                          return `[${key}]`;
                        })
                        .join('')}`
                    ] = encodeURIComponent(searchParamValue);
                  }
                };

                findValuePath(baseSearchParamValue);
              }
              break;
            case 'comma':
            default:
              if (
                searchParams[key] != null &&
                String(searchParams[key]).length > 0
              ) {
                const value = (() => {
                  if (
                    searchParams[key] != null &&
                    typeof searchParams[key] === 'object' &&
                    String(searchParams[key]).includes('[object Object]')
                  ) {
                    return JSON.stringify(searchParams[key]);
                  }
                  if (Array.isArray(searchParams[key])) {
                    return (searchParams[key] as any).join(',');
                  }
                  return String(searchParams[key]);
                })();
                accumulator[key] = encodeURIComponent(value);
              }
          }
          return accumulator;
        }, {});
      case 'json':
        return keys.reduce<Record<string, string>>((accumulator, key) => {
          if (searchParams[key] != null) {
            accumulator[key] = encodeURIComponent(
              JSON.stringify(searchParams[key])
            );
          }
          return accumulator;
        }, {});
    }
  })();

  if (!isEmpty(paramsKeyValuePair)) {
    const isValidURL = routePath.includes('://');
    const url = new URL(
      routePath,
      (() => {
        if (!isValidURL) {
          return 'http://localhost';
        }
      })()
    );

    /**
     * Appends key-value pairs to the URL's search parameters.
     *
     * @param {string} key - The parameter key.
     * @param {string} value - The parameter value.
     */
    Object.entries(paramsKeyValuePair).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    if (!isValidURL) {
      return url.pathname + url.search;
    }

    return url.toString();
  }

  return routePath;
};

/**
 * Determines if a path matches a template path.
 *
 * @param templatePath The template path.
 * @param testPath The path to test.
 *
 * @returns whether the path matches or not.
 */
export const matchPath = (templatePath: string, testPath: string) => {
  return Boolean(
    RegExp(
      `^${templatePath.replace(/:(\w+)|\{(\w+)\}|\[(\w+)\]/g, '(\\w+)')}$`,
      'g'
    ).exec(testPath)
  );
};
