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
  const regex = /:(\w+)|\{(\w+)\}|\[(\w+)\]/g;
  const extractedParameters = [];
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
  const regex = /:(\w+)|\{(\w+)\}|\[(\w+)\]/g;
  const extractedParameters = [];
  let match;
  do {
    match = regex.exec(templatePath);
    match && extractedParameters.push(match[1]);
  } while (match);
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
}

/**
 * Adds search params to a path.
 *
 * @param routePath The path to which search params will be added.
 * @param params The search params to add to path.
 * @param options Configuration options.
 *
 * @returns The full path with search params added.
 *
 * @example
 * addSearchParams("/users", { userId: 123, status: "ACTIVE" }); -> "/users?userId=123&status=ACTIVE"
 */
export const addSearchParams = (
  routePath: string,
  params: Record<string, QueryParam | QueryParam[] | null | undefined>,
  { arrayParamStyle = 'comma' }: AddSearchParamsOptions = {}
): string => {
  const keys = Object.keys(params);
  if (keys.length === 0) return routePath;
  const queryString = keys
    .reduce((accumulator, key) => {
      switch (arrayParamStyle) {
        case 'append':
          if (params[key] != null && String(params[key]).length > 0) {
            if (Array.isArray(params[key])) {
              [...(params[key] as any)].forEach((value) => {
                accumulator.push(`${key}=${encodeURIComponent(value)}`);
              });
            } else {
              accumulator.push(
                `${key}=${encodeURIComponent(String(params[key]))}`
              );
            }
          }
          break;
        case 'comma':
        default:
          if (params[key] != null && String(params[key]).length > 0) {
            const value = (() => {
              if (Array.isArray(params[key])) {
                return (params[key] as any).join(',');
              }
              return String(params[key]);
            })();
            accumulator.push(`${key}=${encodeURIComponent(value)}`);
          }
      }
      return accumulator;
    }, [] as string[])
    .join('&');
  if (queryString.length > 0) {
    return routePath + '?' + queryString;
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
