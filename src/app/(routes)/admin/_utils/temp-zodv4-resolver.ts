import * as z from "zod/v4/core";
import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverError,
  ResolverSuccess,
  appendErrors,
} from "react-hook-form";

function parseErrorSchema(
  zodErrors: z.$ZodIssue[],
  validateAllFieldCriteria: boolean,
) {
  const errors: Record<string, FieldError> = {};
  for (; zodErrors.length; ) {
    const error = zodErrors[0];

    if (!error) continue;

    const { code, message, path } = error;
    const _path = path.join(".");

    if (!errors[_path]) {
      if (error.code === "invalid_union") {
        const unionError = error.errors[0]?.[0];

        if (unionError) {
          errors[_path] = {
            message: unionError.message,
            type: unionError.code,
          };
        }
      } else {
        errors[_path] = { message, type: code };
      }
    }

    if (error.code === "invalid_union") {
      error.errors.forEach((unionError) =>
        unionError.forEach((e) =>
          zodErrors.push({
            ...e,
            path: [...path, ...e.path],
          }),
        ),
      );
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path]?.types;
      const messages = types && types[error.code];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as string[]).concat(messages as string[], error.message)
          : error.message,
      ) as FieldError;
    }

    zodErrors.shift();
  }

  return errors;
}

export function zodResolver<Input extends FieldValues, Context, Output>(
  schema: z.$ZodType<Output, Input>,
  schemaOptions?: Partial<z.ParseContext<z.$ZodIssue>>,
  resolverOptions?: {
    mode?: "async" | "sync";
    raw?: false;
  },
): Resolver<Input, Context, Output>;

export function zodResolver<Input extends FieldValues, Context, Output>(
  schema: z.$ZodType<Output, Input>,
  schemaOptions: Partial<z.ParseContext<z.$ZodIssue>> | undefined,
  resolverOptions: {
    mode?: "async" | "sync";
    raw: true;
  },
): Resolver<Input, Context, Input>;

/**
 * Creates a resolver function for react-hook-form that validates form data using a Zod schema
 * @param {z.$ZodType<Input>} schema - The Zod schema used to validate the form data
 * @param {Partial<z.ParseContext<z.$ZodIssue>>} [schemaOptions] - Optional configuration options for Zod parsing
 * @param {Object} [resolverOptions] - Optional resolver-specific configuration
 * @param {('async'|'sync')} [resolverOptions.mode='async'] - Validation mode. Use 'sync' for synchronous validation
 * @param {boolean} [resolverOptions.raw=false] - If true, returns the raw form values instead of the parsed data
 * @returns {Resolver<z.output<typeof schema>>} A resolver function compatible with react-hook-form
 * @throws {Error} Throws if validation fails with a non-Zod error
 * @example
 * const schema = z.object({
 *   name: z.string().min(2),
 *   age: z.number().min(18)
 * });
 *
 * useForm({
 *   resolver: zodResolver(schema)
 * });
 */
export function zodResolver<Input extends FieldValues, Context, Output>(
  schema: z.$ZodType<Output, Input>,
  schemaOptions?: Partial<z.ParseContext<z.$ZodIssue>>,
  resolverOptions: {
    mode?: "async" | "sync";
    raw?: boolean;
  } = {},
): Resolver<Input, Context, Output | Input> {
  return async (values: Input, _, options) => {
    try {
      const data = await z[
        resolverOptions.mode === "sync" ? "parse" : "parseAsync"
      ](schema, values, schemaOptions);

      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        errors: {} as FieldErrors,
        values: resolverOptions.raw ? Object.assign({}, values) : data,
      } satisfies ResolverSuccess<Output | Input>;
    } catch (error) {
      if (error instanceof z.$ZodError) {
        return {
          values: {},
          errors: toNestErrors(
            parseErrorSchema(
              error.issues,
              !options.shouldUseNativeValidation &&
                options.criteriaMode === "all",
            ),
            options,
          ),
        } satisfies ResolverError<Input>;
      }

      throw error;
    }
  };
}
