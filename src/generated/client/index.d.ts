
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Diary
 * 
 */
export type Diary = $Result.DefaultSelection<Prisma.$DiaryPayload>
/**
 * Model ActivityLog
 * 
 */
export type ActivityLog = $Result.DefaultSelection<Prisma.$ActivityLogPayload>
/**
 * Model HouseRule
 * 
 */
export type HouseRule = $Result.DefaultSelection<Prisma.$HouseRulePayload>
/**
 * Model DutySchedule
 * 
 */
export type DutySchedule = $Result.DefaultSelection<Prisma.$DutySchedulePayload>
/**
 * Model Schedule
 * 
 */
export type Schedule = $Result.DefaultSelection<Prisma.$SchedulePayload>
/**
 * Model ScheduleCategory
 * 
 */
export type ScheduleCategory = $Result.DefaultSelection<Prisma.$ScheduleCategoryPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProjectMember
 * 
 */
export type ProjectMember = $Result.DefaultSelection<Prisma.$ProjectMemberPayload>
/**
 * Model ProjectDiary
 * 
 */
export type ProjectDiary = $Result.DefaultSelection<Prisma.$ProjectDiaryPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.diary`: Exposes CRUD operations for the **Diary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Diaries
    * const diaries = await prisma.diary.findMany()
    * ```
    */
  get diary(): Prisma.DiaryDelegate<ExtArgs>;

  /**
   * `prisma.activityLog`: Exposes CRUD operations for the **ActivityLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActivityLogs
    * const activityLogs = await prisma.activityLog.findMany()
    * ```
    */
  get activityLog(): Prisma.ActivityLogDelegate<ExtArgs>;

  /**
   * `prisma.houseRule`: Exposes CRUD operations for the **HouseRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HouseRules
    * const houseRules = await prisma.houseRule.findMany()
    * ```
    */
  get houseRule(): Prisma.HouseRuleDelegate<ExtArgs>;

  /**
   * `prisma.dutySchedule`: Exposes CRUD operations for the **DutySchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DutySchedules
    * const dutySchedules = await prisma.dutySchedule.findMany()
    * ```
    */
  get dutySchedule(): Prisma.DutyScheduleDelegate<ExtArgs>;

  /**
   * `prisma.schedule`: Exposes CRUD operations for the **Schedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Schedules
    * const schedules = await prisma.schedule.findMany()
    * ```
    */
  get schedule(): Prisma.ScheduleDelegate<ExtArgs>;

  /**
   * `prisma.scheduleCategory`: Exposes CRUD operations for the **ScheduleCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScheduleCategories
    * const scheduleCategories = await prisma.scheduleCategory.findMany()
    * ```
    */
  get scheduleCategory(): Prisma.ScheduleCategoryDelegate<ExtArgs>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs>;

  /**
   * `prisma.projectMember`: Exposes CRUD operations for the **ProjectMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectMembers
    * const projectMembers = await prisma.projectMember.findMany()
    * ```
    */
  get projectMember(): Prisma.ProjectMemberDelegate<ExtArgs>;

  /**
   * `prisma.projectDiary`: Exposes CRUD operations for the **ProjectDiary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectDiaries
    * const projectDiaries = await prisma.projectDiary.findMany()
    * ```
    */
  get projectDiary(): Prisma.ProjectDiaryDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Diary: 'Diary',
    ActivityLog: 'ActivityLog',
    HouseRule: 'HouseRule',
    DutySchedule: 'DutySchedule',
    Schedule: 'Schedule',
    ScheduleCategory: 'ScheduleCategory',
    Project: 'Project',
    ProjectMember: 'ProjectMember',
    ProjectDiary: 'ProjectDiary'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "diary" | "activityLog" | "houseRule" | "dutySchedule" | "schedule" | "scheduleCategory" | "project" | "projectMember" | "projectDiary"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Diary: {
        payload: Prisma.$DiaryPayload<ExtArgs>
        fields: Prisma.DiaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>
          }
          findFirst: {
            args: Prisma.DiaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>
          }
          findMany: {
            args: Prisma.DiaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>[]
          }
          create: {
            args: Prisma.DiaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>
          }
          createMany: {
            args: Prisma.DiaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiaryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>[]
          }
          delete: {
            args: Prisma.DiaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>
          }
          update: {
            args: Prisma.DiaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>
          }
          deleteMany: {
            args: Prisma.DiaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryPayload>
          }
          aggregate: {
            args: Prisma.DiaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiary>
          }
          groupBy: {
            args: Prisma.DiaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiaryCountArgs<ExtArgs>
            result: $Utils.Optional<DiaryCountAggregateOutputType> | number
          }
        }
      }
      ActivityLog: {
        payload: Prisma.$ActivityLogPayload<ExtArgs>
        fields: Prisma.ActivityLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActivityLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActivityLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          findFirst: {
            args: Prisma.ActivityLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActivityLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          findMany: {
            args: Prisma.ActivityLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>[]
          }
          create: {
            args: Prisma.ActivityLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          createMany: {
            args: Prisma.ActivityLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActivityLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>[]
          }
          delete: {
            args: Prisma.ActivityLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          update: {
            args: Prisma.ActivityLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          deleteMany: {
            args: Prisma.ActivityLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActivityLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActivityLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          aggregate: {
            args: Prisma.ActivityLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivityLog>
          }
          groupBy: {
            args: Prisma.ActivityLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivityLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActivityLogCountArgs<ExtArgs>
            result: $Utils.Optional<ActivityLogCountAggregateOutputType> | number
          }
        }
      }
      HouseRule: {
        payload: Prisma.$HouseRulePayload<ExtArgs>
        fields: Prisma.HouseRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HouseRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HouseRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>
          }
          findFirst: {
            args: Prisma.HouseRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HouseRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>
          }
          findMany: {
            args: Prisma.HouseRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>[]
          }
          create: {
            args: Prisma.HouseRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>
          }
          createMany: {
            args: Prisma.HouseRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HouseRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>[]
          }
          delete: {
            args: Prisma.HouseRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>
          }
          update: {
            args: Prisma.HouseRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>
          }
          deleteMany: {
            args: Prisma.HouseRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HouseRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HouseRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HouseRulePayload>
          }
          aggregate: {
            args: Prisma.HouseRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHouseRule>
          }
          groupBy: {
            args: Prisma.HouseRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<HouseRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.HouseRuleCountArgs<ExtArgs>
            result: $Utils.Optional<HouseRuleCountAggregateOutputType> | number
          }
        }
      }
      DutySchedule: {
        payload: Prisma.$DutySchedulePayload<ExtArgs>
        fields: Prisma.DutyScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DutyScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DutyScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>
          }
          findFirst: {
            args: Prisma.DutyScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DutyScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>
          }
          findMany: {
            args: Prisma.DutyScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>[]
          }
          create: {
            args: Prisma.DutyScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>
          }
          createMany: {
            args: Prisma.DutyScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DutyScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>[]
          }
          delete: {
            args: Prisma.DutyScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>
          }
          update: {
            args: Prisma.DutyScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>
          }
          deleteMany: {
            args: Prisma.DutyScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DutyScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DutyScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DutySchedulePayload>
          }
          aggregate: {
            args: Prisma.DutyScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDutySchedule>
          }
          groupBy: {
            args: Prisma.DutyScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<DutyScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.DutyScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<DutyScheduleCountAggregateOutputType> | number
          }
        }
      }
      Schedule: {
        payload: Prisma.$SchedulePayload<ExtArgs>
        fields: Prisma.ScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findFirst: {
            args: Prisma.ScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findMany: {
            args: Prisma.ScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          create: {
            args: Prisma.ScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          createMany: {
            args: Prisma.ScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          delete: {
            args: Prisma.ScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          update: {
            args: Prisma.ScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          deleteMany: {
            args: Prisma.ScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          aggregate: {
            args: Prisma.ScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSchedule>
          }
          groupBy: {
            args: Prisma.ScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduleCountAggregateOutputType> | number
          }
        }
      }
      ScheduleCategory: {
        payload: Prisma.$ScheduleCategoryPayload<ExtArgs>
        fields: Prisma.ScheduleCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduleCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduleCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>
          }
          findFirst: {
            args: Prisma.ScheduleCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduleCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>
          }
          findMany: {
            args: Prisma.ScheduleCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>[]
          }
          create: {
            args: Prisma.ScheduleCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>
          }
          createMany: {
            args: Prisma.ScheduleCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScheduleCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>[]
          }
          delete: {
            args: Prisma.ScheduleCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>
          }
          update: {
            args: Prisma.ScheduleCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>
          }
          deleteMany: {
            args: Prisma.ScheduleCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduleCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScheduleCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduleCategoryPayload>
          }
          aggregate: {
            args: Prisma.ScheduleCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScheduleCategory>
          }
          groupBy: {
            args: Prisma.ScheduleCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduleCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduleCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduleCategoryCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectMember: {
        payload: Prisma.$ProjectMemberPayload<ExtArgs>
        fields: Prisma.ProjectMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          findFirst: {
            args: Prisma.ProjectMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          findMany: {
            args: Prisma.ProjectMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          create: {
            args: Prisma.ProjectMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          createMany: {
            args: Prisma.ProjectMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          delete: {
            args: Prisma.ProjectMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          update: {
            args: Prisma.ProjectMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          deleteMany: {
            args: Prisma.ProjectMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          aggregate: {
            args: Prisma.ProjectMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectMember>
          }
          groupBy: {
            args: Prisma.ProjectMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectMemberCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectMemberCountAggregateOutputType> | number
          }
        }
      }
      ProjectDiary: {
        payload: Prisma.$ProjectDiaryPayload<ExtArgs>
        fields: Prisma.ProjectDiaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectDiaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectDiaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>
          }
          findFirst: {
            args: Prisma.ProjectDiaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectDiaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>
          }
          findMany: {
            args: Prisma.ProjectDiaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>[]
          }
          create: {
            args: Prisma.ProjectDiaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>
          }
          createMany: {
            args: Prisma.ProjectDiaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectDiaryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>[]
          }
          delete: {
            args: Prisma.ProjectDiaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>
          }
          update: {
            args: Prisma.ProjectDiaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDiaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectDiaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectDiaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectDiaryPayload>
          }
          aggregate: {
            args: Prisma.ProjectDiaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectDiary>
          }
          groupBy: {
            args: Prisma.ProjectDiaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectDiaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectDiaryCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectDiaryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    diaries: number
    activities: number
    houseRules: number
    dutySchedules: number
    schedules: number
    projectMembers: number
    projectDiaries: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diaries?: boolean | UserCountOutputTypeCountDiariesArgs
    activities?: boolean | UserCountOutputTypeCountActivitiesArgs
    houseRules?: boolean | UserCountOutputTypeCountHouseRulesArgs
    dutySchedules?: boolean | UserCountOutputTypeCountDutySchedulesArgs
    schedules?: boolean | UserCountOutputTypeCountSchedulesArgs
    projectMembers?: boolean | UserCountOutputTypeCountProjectMembersArgs
    projectDiaries?: boolean | UserCountOutputTypeCountProjectDiariesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDiariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountHouseRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HouseRuleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDutySchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DutyScheduleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectDiariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectDiaryWhereInput
  }


  /**
   * Count Type ScheduleCountOutputType
   */

  export type ScheduleCountOutputType = {
    diaries: number
  }

  export type ScheduleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diaries?: boolean | ScheduleCountOutputTypeCountDiariesArgs
  }

  // Custom InputTypes
  /**
   * ScheduleCountOutputType without action
   */
  export type ScheduleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCountOutputType
     */
    select?: ScheduleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScheduleCountOutputType without action
   */
  export type ScheduleCountOutputTypeCountDiariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    members: number
    diaries: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | ProjectCountOutputTypeCountMembersArgs
    diaries?: boolean | ProjectCountOutputTypeCountDiariesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMemberWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountDiariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectDiaryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    password: number
    role: number
    created_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    email: string
    password: string
    role: string
    created_at: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    diaries?: boolean | User$diariesArgs<ExtArgs>
    activities?: boolean | User$activitiesArgs<ExtArgs>
    houseRules?: boolean | User$houseRulesArgs<ExtArgs>
    dutySchedules?: boolean | User$dutySchedulesArgs<ExtArgs>
    schedules?: boolean | User$schedulesArgs<ExtArgs>
    projectMembers?: boolean | User$projectMembersArgs<ExtArgs>
    projectDiaries?: boolean | User$projectDiariesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diaries?: boolean | User$diariesArgs<ExtArgs>
    activities?: boolean | User$activitiesArgs<ExtArgs>
    houseRules?: boolean | User$houseRulesArgs<ExtArgs>
    dutySchedules?: boolean | User$dutySchedulesArgs<ExtArgs>
    schedules?: boolean | User$schedulesArgs<ExtArgs>
    projectMembers?: boolean | User$projectMembersArgs<ExtArgs>
    projectDiaries?: boolean | User$projectDiariesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      diaries: Prisma.$DiaryPayload<ExtArgs>[]
      activities: Prisma.$ActivityLogPayload<ExtArgs>[]
      houseRules: Prisma.$HouseRulePayload<ExtArgs>[]
      dutySchedules: Prisma.$DutySchedulePayload<ExtArgs>[]
      schedules: Prisma.$SchedulePayload<ExtArgs>[]
      projectMembers: Prisma.$ProjectMemberPayload<ExtArgs>[]
      projectDiaries: Prisma.$ProjectDiaryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string
      password: string
      role: string
      created_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    diaries<T extends User$diariesArgs<ExtArgs> = {}>(args?: Subset<T, User$diariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findMany"> | Null>
    activities<T extends User$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany"> | Null>
    houseRules<T extends User$houseRulesArgs<ExtArgs> = {}>(args?: Subset<T, User$houseRulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "findMany"> | Null>
    dutySchedules<T extends User$dutySchedulesArgs<ExtArgs> = {}>(args?: Subset<T, User$dutySchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "findMany"> | Null>
    schedules<T extends User$schedulesArgs<ExtArgs> = {}>(args?: Subset<T, User$schedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany"> | Null>
    projectMembers<T extends User$projectMembersArgs<ExtArgs> = {}>(args?: Subset<T, User$projectMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany"> | Null>
    projectDiaries<T extends User$projectDiariesArgs<ExtArgs> = {}>(args?: Subset<T, User$projectDiariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.diaries
   */
  export type User$diariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    where?: DiaryWhereInput
    orderBy?: DiaryOrderByWithRelationInput | DiaryOrderByWithRelationInput[]
    cursor?: DiaryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiaryScalarFieldEnum | DiaryScalarFieldEnum[]
  }

  /**
   * User.activities
   */
  export type User$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    where?: ActivityLogWhereInput
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    cursor?: ActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * User.houseRules
   */
  export type User$houseRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    where?: HouseRuleWhereInput
    orderBy?: HouseRuleOrderByWithRelationInput | HouseRuleOrderByWithRelationInput[]
    cursor?: HouseRuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HouseRuleScalarFieldEnum | HouseRuleScalarFieldEnum[]
  }

  /**
   * User.dutySchedules
   */
  export type User$dutySchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    where?: DutyScheduleWhereInput
    orderBy?: DutyScheduleOrderByWithRelationInput | DutyScheduleOrderByWithRelationInput[]
    cursor?: DutyScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DutyScheduleScalarFieldEnum | DutyScheduleScalarFieldEnum[]
  }

  /**
   * User.schedules
   */
  export type User$schedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    cursor?: ScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * User.projectMembers
   */
  export type User$projectMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    cursor?: ProjectMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * User.projectDiaries
   */
  export type User$projectDiariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    where?: ProjectDiaryWhereInput
    orderBy?: ProjectDiaryOrderByWithRelationInput | ProjectDiaryOrderByWithRelationInput[]
    cursor?: ProjectDiaryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectDiaryScalarFieldEnum | ProjectDiaryScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Diary
   */

  export type AggregateDiary = {
    _count: DiaryCountAggregateOutputType | null
    _min: DiaryMinAggregateOutputType | null
    _max: DiaryMaxAggregateOutputType | null
  }

  export type DiaryMinAggregateOutputType = {
    id: string | null
    title: string | null
    activity_description: string | null
    project_event: string | null
    category: string | null
    date: string | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
    schedule_id: string | null
  }

  export type DiaryMaxAggregateOutputType = {
    id: string | null
    title: string | null
    activity_description: string | null
    project_event: string | null
    category: string | null
    date: string | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
    schedule_id: string | null
  }

  export type DiaryCountAggregateOutputType = {
    id: number
    title: number
    activity_description: number
    project_event: number
    category: number
    date: number
    created_at: number
    updated_at: number
    created_by: number
    schedule_id: number
    _all: number
  }


  export type DiaryMinAggregateInputType = {
    id?: true
    title?: true
    activity_description?: true
    project_event?: true
    category?: true
    date?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    schedule_id?: true
  }

  export type DiaryMaxAggregateInputType = {
    id?: true
    title?: true
    activity_description?: true
    project_event?: true
    category?: true
    date?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    schedule_id?: true
  }

  export type DiaryCountAggregateInputType = {
    id?: true
    title?: true
    activity_description?: true
    project_event?: true
    category?: true
    date?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    schedule_id?: true
    _all?: true
  }

  export type DiaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Diary to aggregate.
     */
    where?: DiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diaries to fetch.
     */
    orderBy?: DiaryOrderByWithRelationInput | DiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Diaries
    **/
    _count?: true | DiaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiaryMaxAggregateInputType
  }

  export type GetDiaryAggregateType<T extends DiaryAggregateArgs> = {
        [P in keyof T & keyof AggregateDiary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiary[P]>
      : GetScalarType<T[P], AggregateDiary[P]>
  }




  export type DiaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryWhereInput
    orderBy?: DiaryOrderByWithAggregationInput | DiaryOrderByWithAggregationInput[]
    by: DiaryScalarFieldEnum[] | DiaryScalarFieldEnum
    having?: DiaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiaryCountAggregateInputType | true
    _min?: DiaryMinAggregateInputType
    _max?: DiaryMaxAggregateInputType
  }

  export type DiaryGroupByOutputType = {
    id: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at: Date
    updated_at: Date
    created_by: string
    schedule_id: string | null
    _count: DiaryCountAggregateOutputType | null
    _min: DiaryMinAggregateOutputType | null
    _max: DiaryMaxAggregateOutputType | null
  }

  type GetDiaryGroupByPayload<T extends DiaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiaryGroupByOutputType[P]>
            : GetScalarType<T[P], DiaryGroupByOutputType[P]>
        }
      >
    >


  export type DiarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    activity_description?: boolean
    project_event?: boolean
    category?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    schedule_id?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    schedule?: boolean | Diary$scheduleArgs<ExtArgs>
  }, ExtArgs["result"]["diary"]>

  export type DiarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    activity_description?: boolean
    project_event?: boolean
    category?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    schedule_id?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    schedule?: boolean | Diary$scheduleArgs<ExtArgs>
  }, ExtArgs["result"]["diary"]>

  export type DiarySelectScalar = {
    id?: boolean
    title?: boolean
    activity_description?: boolean
    project_event?: boolean
    category?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    schedule_id?: boolean
  }

  export type DiaryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    schedule?: boolean | Diary$scheduleArgs<ExtArgs>
  }
  export type DiaryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    schedule?: boolean | Diary$scheduleArgs<ExtArgs>
  }

  export type $DiaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Diary"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
      schedule: Prisma.$SchedulePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      activity_description: string
      project_event: string
      category: string
      date: string
      created_at: Date
      updated_at: Date
      created_by: string
      schedule_id: string | null
    }, ExtArgs["result"]["diary"]>
    composites: {}
  }

  type DiaryGetPayload<S extends boolean | null | undefined | DiaryDefaultArgs> = $Result.GetResult<Prisma.$DiaryPayload, S>

  type DiaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DiaryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiaryCountAggregateInputType | true
    }

  export interface DiaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Diary'], meta: { name: 'Diary' } }
    /**
     * Find zero or one Diary that matches the filter.
     * @param {DiaryFindUniqueArgs} args - Arguments to find a Diary
     * @example
     * // Get one Diary
     * const diary = await prisma.diary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiaryFindUniqueArgs>(args: SelectSubset<T, DiaryFindUniqueArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Diary that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DiaryFindUniqueOrThrowArgs} args - Arguments to find a Diary
     * @example
     * // Get one Diary
     * const diary = await prisma.diary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiaryFindUniqueOrThrowArgs>(args: SelectSubset<T, DiaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Diary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryFindFirstArgs} args - Arguments to find a Diary
     * @example
     * // Get one Diary
     * const diary = await prisma.diary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiaryFindFirstArgs>(args?: SelectSubset<T, DiaryFindFirstArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Diary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryFindFirstOrThrowArgs} args - Arguments to find a Diary
     * @example
     * // Get one Diary
     * const diary = await prisma.diary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiaryFindFirstOrThrowArgs>(args?: SelectSubset<T, DiaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Diaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Diaries
     * const diaries = await prisma.diary.findMany()
     * 
     * // Get first 10 Diaries
     * const diaries = await prisma.diary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diaryWithIdOnly = await prisma.diary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiaryFindManyArgs>(args?: SelectSubset<T, DiaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Diary.
     * @param {DiaryCreateArgs} args - Arguments to create a Diary.
     * @example
     * // Create one Diary
     * const Diary = await prisma.diary.create({
     *   data: {
     *     // ... data to create a Diary
     *   }
     * })
     * 
     */
    create<T extends DiaryCreateArgs>(args: SelectSubset<T, DiaryCreateArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Diaries.
     * @param {DiaryCreateManyArgs} args - Arguments to create many Diaries.
     * @example
     * // Create many Diaries
     * const diary = await prisma.diary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiaryCreateManyArgs>(args?: SelectSubset<T, DiaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Diaries and returns the data saved in the database.
     * @param {DiaryCreateManyAndReturnArgs} args - Arguments to create many Diaries.
     * @example
     * // Create many Diaries
     * const diary = await prisma.diary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Diaries and only return the `id`
     * const diaryWithIdOnly = await prisma.diary.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiaryCreateManyAndReturnArgs>(args?: SelectSubset<T, DiaryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Diary.
     * @param {DiaryDeleteArgs} args - Arguments to delete one Diary.
     * @example
     * // Delete one Diary
     * const Diary = await prisma.diary.delete({
     *   where: {
     *     // ... filter to delete one Diary
     *   }
     * })
     * 
     */
    delete<T extends DiaryDeleteArgs>(args: SelectSubset<T, DiaryDeleteArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Diary.
     * @param {DiaryUpdateArgs} args - Arguments to update one Diary.
     * @example
     * // Update one Diary
     * const diary = await prisma.diary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiaryUpdateArgs>(args: SelectSubset<T, DiaryUpdateArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Diaries.
     * @param {DiaryDeleteManyArgs} args - Arguments to filter Diaries to delete.
     * @example
     * // Delete a few Diaries
     * const { count } = await prisma.diary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiaryDeleteManyArgs>(args?: SelectSubset<T, DiaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Diaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Diaries
     * const diary = await prisma.diary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiaryUpdateManyArgs>(args: SelectSubset<T, DiaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Diary.
     * @param {DiaryUpsertArgs} args - Arguments to update or create a Diary.
     * @example
     * // Update or create a Diary
     * const diary = await prisma.diary.upsert({
     *   create: {
     *     // ... data to create a Diary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Diary we want to update
     *   }
     * })
     */
    upsert<T extends DiaryUpsertArgs>(args: SelectSubset<T, DiaryUpsertArgs<ExtArgs>>): Prisma__DiaryClient<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Diaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryCountArgs} args - Arguments to filter Diaries to count.
     * @example
     * // Count the number of Diaries
     * const count = await prisma.diary.count({
     *   where: {
     *     // ... the filter for the Diaries we want to count
     *   }
     * })
    **/
    count<T extends DiaryCountArgs>(
      args?: Subset<T, DiaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Diary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiaryAggregateArgs>(args: Subset<T, DiaryAggregateArgs>): Prisma.PrismaPromise<GetDiaryAggregateType<T>>

    /**
     * Group by Diary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiaryGroupByArgs['orderBy'] }
        : { orderBy?: DiaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Diary model
   */
  readonly fields: DiaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Diary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    schedule<T extends Diary$scheduleArgs<ExtArgs> = {}>(args?: Subset<T, Diary$scheduleArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Diary model
   */ 
  interface DiaryFieldRefs {
    readonly id: FieldRef<"Diary", 'String'>
    readonly title: FieldRef<"Diary", 'String'>
    readonly activity_description: FieldRef<"Diary", 'String'>
    readonly project_event: FieldRef<"Diary", 'String'>
    readonly category: FieldRef<"Diary", 'String'>
    readonly date: FieldRef<"Diary", 'String'>
    readonly created_at: FieldRef<"Diary", 'DateTime'>
    readonly updated_at: FieldRef<"Diary", 'DateTime'>
    readonly created_by: FieldRef<"Diary", 'String'>
    readonly schedule_id: FieldRef<"Diary", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Diary findUnique
   */
  export type DiaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * Filter, which Diary to fetch.
     */
    where: DiaryWhereUniqueInput
  }

  /**
   * Diary findUniqueOrThrow
   */
  export type DiaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * Filter, which Diary to fetch.
     */
    where: DiaryWhereUniqueInput
  }

  /**
   * Diary findFirst
   */
  export type DiaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * Filter, which Diary to fetch.
     */
    where?: DiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diaries to fetch.
     */
    orderBy?: DiaryOrderByWithRelationInput | DiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Diaries.
     */
    cursor?: DiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Diaries.
     */
    distinct?: DiaryScalarFieldEnum | DiaryScalarFieldEnum[]
  }

  /**
   * Diary findFirstOrThrow
   */
  export type DiaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * Filter, which Diary to fetch.
     */
    where?: DiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diaries to fetch.
     */
    orderBy?: DiaryOrderByWithRelationInput | DiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Diaries.
     */
    cursor?: DiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Diaries.
     */
    distinct?: DiaryScalarFieldEnum | DiaryScalarFieldEnum[]
  }

  /**
   * Diary findMany
   */
  export type DiaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * Filter, which Diaries to fetch.
     */
    where?: DiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diaries to fetch.
     */
    orderBy?: DiaryOrderByWithRelationInput | DiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Diaries.
     */
    cursor?: DiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diaries.
     */
    skip?: number
    distinct?: DiaryScalarFieldEnum | DiaryScalarFieldEnum[]
  }

  /**
   * Diary create
   */
  export type DiaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * The data needed to create a Diary.
     */
    data: XOR<DiaryCreateInput, DiaryUncheckedCreateInput>
  }

  /**
   * Diary createMany
   */
  export type DiaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Diaries.
     */
    data: DiaryCreateManyInput | DiaryCreateManyInput[]
  }

  /**
   * Diary createManyAndReturn
   */
  export type DiaryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Diaries.
     */
    data: DiaryCreateManyInput | DiaryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Diary update
   */
  export type DiaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * The data needed to update a Diary.
     */
    data: XOR<DiaryUpdateInput, DiaryUncheckedUpdateInput>
    /**
     * Choose, which Diary to update.
     */
    where: DiaryWhereUniqueInput
  }

  /**
   * Diary updateMany
   */
  export type DiaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Diaries.
     */
    data: XOR<DiaryUpdateManyMutationInput, DiaryUncheckedUpdateManyInput>
    /**
     * Filter which Diaries to update
     */
    where?: DiaryWhereInput
  }

  /**
   * Diary upsert
   */
  export type DiaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * The filter to search for the Diary to update in case it exists.
     */
    where: DiaryWhereUniqueInput
    /**
     * In case the Diary found by the `where` argument doesn't exist, create a new Diary with this data.
     */
    create: XOR<DiaryCreateInput, DiaryUncheckedCreateInput>
    /**
     * In case the Diary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiaryUpdateInput, DiaryUncheckedUpdateInput>
  }

  /**
   * Diary delete
   */
  export type DiaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    /**
     * Filter which Diary to delete.
     */
    where: DiaryWhereUniqueInput
  }

  /**
   * Diary deleteMany
   */
  export type DiaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Diaries to delete
     */
    where?: DiaryWhereInput
  }

  /**
   * Diary.schedule
   */
  export type Diary$scheduleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    where?: ScheduleWhereInput
  }

  /**
   * Diary without action
   */
  export type DiaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
  }


  /**
   * Model ActivityLog
   */

  export type AggregateActivityLog = {
    _count: ActivityLogCountAggregateOutputType | null
    _min: ActivityLogMinAggregateOutputType | null
    _max: ActivityLogMaxAggregateOutputType | null
  }

  export type ActivityLogMinAggregateOutputType = {
    id: string | null
    action: string | null
    diary_title: string | null
    category: string | null
    timestamp: Date | null
    user_id: string | null
  }

  export type ActivityLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    diary_title: string | null
    category: string | null
    timestamp: Date | null
    user_id: string | null
  }

  export type ActivityLogCountAggregateOutputType = {
    id: number
    action: number
    diary_title: number
    category: number
    timestamp: number
    user_id: number
    _all: number
  }


  export type ActivityLogMinAggregateInputType = {
    id?: true
    action?: true
    diary_title?: true
    category?: true
    timestamp?: true
    user_id?: true
  }

  export type ActivityLogMaxAggregateInputType = {
    id?: true
    action?: true
    diary_title?: true
    category?: true
    timestamp?: true
    user_id?: true
  }

  export type ActivityLogCountAggregateInputType = {
    id?: true
    action?: true
    diary_title?: true
    category?: true
    timestamp?: true
    user_id?: true
    _all?: true
  }

  export type ActivityLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivityLog to aggregate.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActivityLogs
    **/
    _count?: true | ActivityLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivityLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivityLogMaxAggregateInputType
  }

  export type GetActivityLogAggregateType<T extends ActivityLogAggregateArgs> = {
        [P in keyof T & keyof AggregateActivityLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivityLog[P]>
      : GetScalarType<T[P], AggregateActivityLog[P]>
  }




  export type ActivityLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityLogWhereInput
    orderBy?: ActivityLogOrderByWithAggregationInput | ActivityLogOrderByWithAggregationInput[]
    by: ActivityLogScalarFieldEnum[] | ActivityLogScalarFieldEnum
    having?: ActivityLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivityLogCountAggregateInputType | true
    _min?: ActivityLogMinAggregateInputType
    _max?: ActivityLogMaxAggregateInputType
  }

  export type ActivityLogGroupByOutputType = {
    id: string
    action: string
    diary_title: string | null
    category: string | null
    timestamp: Date
    user_id: string
    _count: ActivityLogCountAggregateOutputType | null
    _min: ActivityLogMinAggregateOutputType | null
    _max: ActivityLogMaxAggregateOutputType | null
  }

  type GetActivityLogGroupByPayload<T extends ActivityLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivityLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivityLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivityLogGroupByOutputType[P]>
            : GetScalarType<T[P], ActivityLogGroupByOutputType[P]>
        }
      >
    >


  export type ActivityLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    diary_title?: boolean
    category?: boolean
    timestamp?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activityLog"]>

  export type ActivityLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    diary_title?: boolean
    category?: boolean
    timestamp?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activityLog"]>

  export type ActivityLogSelectScalar = {
    id?: boolean
    action?: boolean
    diary_title?: boolean
    category?: boolean
    timestamp?: boolean
    user_id?: boolean
  }

  export type ActivityLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ActivityLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ActivityLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActivityLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string
      diary_title: string | null
      category: string | null
      timestamp: Date
      user_id: string
    }, ExtArgs["result"]["activityLog"]>
    composites: {}
  }

  type ActivityLogGetPayload<S extends boolean | null | undefined | ActivityLogDefaultArgs> = $Result.GetResult<Prisma.$ActivityLogPayload, S>

  type ActivityLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActivityLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActivityLogCountAggregateInputType | true
    }

  export interface ActivityLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActivityLog'], meta: { name: 'ActivityLog' } }
    /**
     * Find zero or one ActivityLog that matches the filter.
     * @param {ActivityLogFindUniqueArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActivityLogFindUniqueArgs>(args: SelectSubset<T, ActivityLogFindUniqueArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActivityLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActivityLogFindUniqueOrThrowArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActivityLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActivityLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogFindFirstArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActivityLogFindFirstArgs>(args?: SelectSubset<T, ActivityLogFindFirstArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActivityLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogFindFirstOrThrowArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActivityLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActivityLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActivityLogs
     * const activityLogs = await prisma.activityLog.findMany()
     * 
     * // Get first 10 ActivityLogs
     * const activityLogs = await prisma.activityLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activityLogWithIdOnly = await prisma.activityLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActivityLogFindManyArgs>(args?: SelectSubset<T, ActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActivityLog.
     * @param {ActivityLogCreateArgs} args - Arguments to create a ActivityLog.
     * @example
     * // Create one ActivityLog
     * const ActivityLog = await prisma.activityLog.create({
     *   data: {
     *     // ... data to create a ActivityLog
     *   }
     * })
     * 
     */
    create<T extends ActivityLogCreateArgs>(args: SelectSubset<T, ActivityLogCreateArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActivityLogs.
     * @param {ActivityLogCreateManyArgs} args - Arguments to create many ActivityLogs.
     * @example
     * // Create many ActivityLogs
     * const activityLog = await prisma.activityLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActivityLogCreateManyArgs>(args?: SelectSubset<T, ActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActivityLogs and returns the data saved in the database.
     * @param {ActivityLogCreateManyAndReturnArgs} args - Arguments to create many ActivityLogs.
     * @example
     * // Create many ActivityLogs
     * const activityLog = await prisma.activityLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActivityLogs and only return the `id`
     * const activityLogWithIdOnly = await prisma.activityLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActivityLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActivityLog.
     * @param {ActivityLogDeleteArgs} args - Arguments to delete one ActivityLog.
     * @example
     * // Delete one ActivityLog
     * const ActivityLog = await prisma.activityLog.delete({
     *   where: {
     *     // ... filter to delete one ActivityLog
     *   }
     * })
     * 
     */
    delete<T extends ActivityLogDeleteArgs>(args: SelectSubset<T, ActivityLogDeleteArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActivityLog.
     * @param {ActivityLogUpdateArgs} args - Arguments to update one ActivityLog.
     * @example
     * // Update one ActivityLog
     * const activityLog = await prisma.activityLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActivityLogUpdateArgs>(args: SelectSubset<T, ActivityLogUpdateArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActivityLogs.
     * @param {ActivityLogDeleteManyArgs} args - Arguments to filter ActivityLogs to delete.
     * @example
     * // Delete a few ActivityLogs
     * const { count } = await prisma.activityLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActivityLogDeleteManyArgs>(args?: SelectSubset<T, ActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActivityLogs
     * const activityLog = await prisma.activityLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActivityLogUpdateManyArgs>(args: SelectSubset<T, ActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActivityLog.
     * @param {ActivityLogUpsertArgs} args - Arguments to update or create a ActivityLog.
     * @example
     * // Update or create a ActivityLog
     * const activityLog = await prisma.activityLog.upsert({
     *   create: {
     *     // ... data to create a ActivityLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActivityLog we want to update
     *   }
     * })
     */
    upsert<T extends ActivityLogUpsertArgs>(args: SelectSubset<T, ActivityLogUpsertArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogCountArgs} args - Arguments to filter ActivityLogs to count.
     * @example
     * // Count the number of ActivityLogs
     * const count = await prisma.activityLog.count({
     *   where: {
     *     // ... the filter for the ActivityLogs we want to count
     *   }
     * })
    **/
    count<T extends ActivityLogCountArgs>(
      args?: Subset<T, ActivityLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivityLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActivityLogAggregateArgs>(args: Subset<T, ActivityLogAggregateArgs>): Prisma.PrismaPromise<GetActivityLogAggregateType<T>>

    /**
     * Group by ActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActivityLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActivityLogGroupByArgs['orderBy'] }
        : { orderBy?: ActivityLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActivityLog model
   */
  readonly fields: ActivityLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActivityLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActivityLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActivityLog model
   */ 
  interface ActivityLogFieldRefs {
    readonly id: FieldRef<"ActivityLog", 'String'>
    readonly action: FieldRef<"ActivityLog", 'String'>
    readonly diary_title: FieldRef<"ActivityLog", 'String'>
    readonly category: FieldRef<"ActivityLog", 'String'>
    readonly timestamp: FieldRef<"ActivityLog", 'DateTime'>
    readonly user_id: FieldRef<"ActivityLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ActivityLog findUnique
   */
  export type ActivityLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog findUniqueOrThrow
   */
  export type ActivityLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog findFirst
   */
  export type ActivityLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivityLogs.
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivityLogs.
     */
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * ActivityLog findFirstOrThrow
   */
  export type ActivityLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivityLogs.
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivityLogs.
     */
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * ActivityLog findMany
   */
  export type ActivityLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLogs to fetch.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActivityLogs.
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * ActivityLog create
   */
  export type ActivityLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ActivityLog.
     */
    data: XOR<ActivityLogCreateInput, ActivityLogUncheckedCreateInput>
  }

  /**
   * ActivityLog createMany
   */
  export type ActivityLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActivityLogs.
     */
    data: ActivityLogCreateManyInput | ActivityLogCreateManyInput[]
  }

  /**
   * ActivityLog createManyAndReturn
   */
  export type ActivityLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActivityLogs.
     */
    data: ActivityLogCreateManyInput | ActivityLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActivityLog update
   */
  export type ActivityLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ActivityLog.
     */
    data: XOR<ActivityLogUpdateInput, ActivityLogUncheckedUpdateInput>
    /**
     * Choose, which ActivityLog to update.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog updateMany
   */
  export type ActivityLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActivityLogs.
     */
    data: XOR<ActivityLogUpdateManyMutationInput, ActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which ActivityLogs to update
     */
    where?: ActivityLogWhereInput
  }

  /**
   * ActivityLog upsert
   */
  export type ActivityLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ActivityLog to update in case it exists.
     */
    where: ActivityLogWhereUniqueInput
    /**
     * In case the ActivityLog found by the `where` argument doesn't exist, create a new ActivityLog with this data.
     */
    create: XOR<ActivityLogCreateInput, ActivityLogUncheckedCreateInput>
    /**
     * In case the ActivityLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActivityLogUpdateInput, ActivityLogUncheckedUpdateInput>
  }

  /**
   * ActivityLog delete
   */
  export type ActivityLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter which ActivityLog to delete.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog deleteMany
   */
  export type ActivityLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivityLogs to delete
     */
    where?: ActivityLogWhereInput
  }

  /**
   * ActivityLog without action
   */
  export type ActivityLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
  }


  /**
   * Model HouseRule
   */

  export type AggregateHouseRule = {
    _count: HouseRuleCountAggregateOutputType | null
    _min: HouseRuleMinAggregateOutputType | null
    _max: HouseRuleMaxAggregateOutputType | null
  }

  export type HouseRuleMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    created_by: string | null
    created_at: Date | null
  }

  export type HouseRuleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    created_by: string | null
    created_at: Date | null
  }

  export type HouseRuleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    created_by: number
    created_at: number
    _all: number
  }


  export type HouseRuleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    created_by?: true
    created_at?: true
  }

  export type HouseRuleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    created_by?: true
    created_at?: true
  }

  export type HouseRuleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    created_by?: true
    created_at?: true
    _all?: true
  }

  export type HouseRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HouseRule to aggregate.
     */
    where?: HouseRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HouseRules to fetch.
     */
    orderBy?: HouseRuleOrderByWithRelationInput | HouseRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HouseRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HouseRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HouseRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HouseRules
    **/
    _count?: true | HouseRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HouseRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HouseRuleMaxAggregateInputType
  }

  export type GetHouseRuleAggregateType<T extends HouseRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateHouseRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHouseRule[P]>
      : GetScalarType<T[P], AggregateHouseRule[P]>
  }




  export type HouseRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HouseRuleWhereInput
    orderBy?: HouseRuleOrderByWithAggregationInput | HouseRuleOrderByWithAggregationInput[]
    by: HouseRuleScalarFieldEnum[] | HouseRuleScalarFieldEnum
    having?: HouseRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HouseRuleCountAggregateInputType | true
    _min?: HouseRuleMinAggregateInputType
    _max?: HouseRuleMaxAggregateInputType
  }

  export type HouseRuleGroupByOutputType = {
    id: string
    title: string
    content: string
    created_by: string
    created_at: Date
    _count: HouseRuleCountAggregateOutputType | null
    _min: HouseRuleMinAggregateOutputType | null
    _max: HouseRuleMaxAggregateOutputType | null
  }

  type GetHouseRuleGroupByPayload<T extends HouseRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HouseRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HouseRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HouseRuleGroupByOutputType[P]>
            : GetScalarType<T[P], HouseRuleGroupByOutputType[P]>
        }
      >
    >


  export type HouseRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    created_by?: boolean
    created_at?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["houseRule"]>

  export type HouseRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    created_by?: boolean
    created_at?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["houseRule"]>

  export type HouseRuleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    created_by?: boolean
    created_at?: boolean
  }

  export type HouseRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HouseRuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $HouseRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HouseRule"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      created_by: string
      created_at: Date
    }, ExtArgs["result"]["houseRule"]>
    composites: {}
  }

  type HouseRuleGetPayload<S extends boolean | null | undefined | HouseRuleDefaultArgs> = $Result.GetResult<Prisma.$HouseRulePayload, S>

  type HouseRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HouseRuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HouseRuleCountAggregateInputType | true
    }

  export interface HouseRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HouseRule'], meta: { name: 'HouseRule' } }
    /**
     * Find zero or one HouseRule that matches the filter.
     * @param {HouseRuleFindUniqueArgs} args - Arguments to find a HouseRule
     * @example
     * // Get one HouseRule
     * const houseRule = await prisma.houseRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HouseRuleFindUniqueArgs>(args: SelectSubset<T, HouseRuleFindUniqueArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HouseRule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HouseRuleFindUniqueOrThrowArgs} args - Arguments to find a HouseRule
     * @example
     * // Get one HouseRule
     * const houseRule = await prisma.houseRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HouseRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, HouseRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HouseRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleFindFirstArgs} args - Arguments to find a HouseRule
     * @example
     * // Get one HouseRule
     * const houseRule = await prisma.houseRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HouseRuleFindFirstArgs>(args?: SelectSubset<T, HouseRuleFindFirstArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HouseRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleFindFirstOrThrowArgs} args - Arguments to find a HouseRule
     * @example
     * // Get one HouseRule
     * const houseRule = await prisma.houseRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HouseRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, HouseRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HouseRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HouseRules
     * const houseRules = await prisma.houseRule.findMany()
     * 
     * // Get first 10 HouseRules
     * const houseRules = await prisma.houseRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const houseRuleWithIdOnly = await prisma.houseRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HouseRuleFindManyArgs>(args?: SelectSubset<T, HouseRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HouseRule.
     * @param {HouseRuleCreateArgs} args - Arguments to create a HouseRule.
     * @example
     * // Create one HouseRule
     * const HouseRule = await prisma.houseRule.create({
     *   data: {
     *     // ... data to create a HouseRule
     *   }
     * })
     * 
     */
    create<T extends HouseRuleCreateArgs>(args: SelectSubset<T, HouseRuleCreateArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HouseRules.
     * @param {HouseRuleCreateManyArgs} args - Arguments to create many HouseRules.
     * @example
     * // Create many HouseRules
     * const houseRule = await prisma.houseRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HouseRuleCreateManyArgs>(args?: SelectSubset<T, HouseRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HouseRules and returns the data saved in the database.
     * @param {HouseRuleCreateManyAndReturnArgs} args - Arguments to create many HouseRules.
     * @example
     * // Create many HouseRules
     * const houseRule = await prisma.houseRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HouseRules and only return the `id`
     * const houseRuleWithIdOnly = await prisma.houseRule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HouseRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, HouseRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HouseRule.
     * @param {HouseRuleDeleteArgs} args - Arguments to delete one HouseRule.
     * @example
     * // Delete one HouseRule
     * const HouseRule = await prisma.houseRule.delete({
     *   where: {
     *     // ... filter to delete one HouseRule
     *   }
     * })
     * 
     */
    delete<T extends HouseRuleDeleteArgs>(args: SelectSubset<T, HouseRuleDeleteArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HouseRule.
     * @param {HouseRuleUpdateArgs} args - Arguments to update one HouseRule.
     * @example
     * // Update one HouseRule
     * const houseRule = await prisma.houseRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HouseRuleUpdateArgs>(args: SelectSubset<T, HouseRuleUpdateArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HouseRules.
     * @param {HouseRuleDeleteManyArgs} args - Arguments to filter HouseRules to delete.
     * @example
     * // Delete a few HouseRules
     * const { count } = await prisma.houseRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HouseRuleDeleteManyArgs>(args?: SelectSubset<T, HouseRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HouseRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HouseRules
     * const houseRule = await prisma.houseRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HouseRuleUpdateManyArgs>(args: SelectSubset<T, HouseRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HouseRule.
     * @param {HouseRuleUpsertArgs} args - Arguments to update or create a HouseRule.
     * @example
     * // Update or create a HouseRule
     * const houseRule = await prisma.houseRule.upsert({
     *   create: {
     *     // ... data to create a HouseRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HouseRule we want to update
     *   }
     * })
     */
    upsert<T extends HouseRuleUpsertArgs>(args: SelectSubset<T, HouseRuleUpsertArgs<ExtArgs>>): Prisma__HouseRuleClient<$Result.GetResult<Prisma.$HouseRulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HouseRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleCountArgs} args - Arguments to filter HouseRules to count.
     * @example
     * // Count the number of HouseRules
     * const count = await prisma.houseRule.count({
     *   where: {
     *     // ... the filter for the HouseRules we want to count
     *   }
     * })
    **/
    count<T extends HouseRuleCountArgs>(
      args?: Subset<T, HouseRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HouseRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HouseRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HouseRuleAggregateArgs>(args: Subset<T, HouseRuleAggregateArgs>): Prisma.PrismaPromise<GetHouseRuleAggregateType<T>>

    /**
     * Group by HouseRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HouseRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HouseRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HouseRuleGroupByArgs['orderBy'] }
        : { orderBy?: HouseRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HouseRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHouseRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HouseRule model
   */
  readonly fields: HouseRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HouseRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HouseRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HouseRule model
   */ 
  interface HouseRuleFieldRefs {
    readonly id: FieldRef<"HouseRule", 'String'>
    readonly title: FieldRef<"HouseRule", 'String'>
    readonly content: FieldRef<"HouseRule", 'String'>
    readonly created_by: FieldRef<"HouseRule", 'String'>
    readonly created_at: FieldRef<"HouseRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HouseRule findUnique
   */
  export type HouseRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * Filter, which HouseRule to fetch.
     */
    where: HouseRuleWhereUniqueInput
  }

  /**
   * HouseRule findUniqueOrThrow
   */
  export type HouseRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * Filter, which HouseRule to fetch.
     */
    where: HouseRuleWhereUniqueInput
  }

  /**
   * HouseRule findFirst
   */
  export type HouseRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * Filter, which HouseRule to fetch.
     */
    where?: HouseRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HouseRules to fetch.
     */
    orderBy?: HouseRuleOrderByWithRelationInput | HouseRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HouseRules.
     */
    cursor?: HouseRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HouseRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HouseRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HouseRules.
     */
    distinct?: HouseRuleScalarFieldEnum | HouseRuleScalarFieldEnum[]
  }

  /**
   * HouseRule findFirstOrThrow
   */
  export type HouseRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * Filter, which HouseRule to fetch.
     */
    where?: HouseRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HouseRules to fetch.
     */
    orderBy?: HouseRuleOrderByWithRelationInput | HouseRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HouseRules.
     */
    cursor?: HouseRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HouseRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HouseRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HouseRules.
     */
    distinct?: HouseRuleScalarFieldEnum | HouseRuleScalarFieldEnum[]
  }

  /**
   * HouseRule findMany
   */
  export type HouseRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * Filter, which HouseRules to fetch.
     */
    where?: HouseRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HouseRules to fetch.
     */
    orderBy?: HouseRuleOrderByWithRelationInput | HouseRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HouseRules.
     */
    cursor?: HouseRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HouseRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HouseRules.
     */
    skip?: number
    distinct?: HouseRuleScalarFieldEnum | HouseRuleScalarFieldEnum[]
  }

  /**
   * HouseRule create
   */
  export type HouseRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * The data needed to create a HouseRule.
     */
    data: XOR<HouseRuleCreateInput, HouseRuleUncheckedCreateInput>
  }

  /**
   * HouseRule createMany
   */
  export type HouseRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HouseRules.
     */
    data: HouseRuleCreateManyInput | HouseRuleCreateManyInput[]
  }

  /**
   * HouseRule createManyAndReturn
   */
  export type HouseRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HouseRules.
     */
    data: HouseRuleCreateManyInput | HouseRuleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HouseRule update
   */
  export type HouseRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * The data needed to update a HouseRule.
     */
    data: XOR<HouseRuleUpdateInput, HouseRuleUncheckedUpdateInput>
    /**
     * Choose, which HouseRule to update.
     */
    where: HouseRuleWhereUniqueInput
  }

  /**
   * HouseRule updateMany
   */
  export type HouseRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HouseRules.
     */
    data: XOR<HouseRuleUpdateManyMutationInput, HouseRuleUncheckedUpdateManyInput>
    /**
     * Filter which HouseRules to update
     */
    where?: HouseRuleWhereInput
  }

  /**
   * HouseRule upsert
   */
  export type HouseRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * The filter to search for the HouseRule to update in case it exists.
     */
    where: HouseRuleWhereUniqueInput
    /**
     * In case the HouseRule found by the `where` argument doesn't exist, create a new HouseRule with this data.
     */
    create: XOR<HouseRuleCreateInput, HouseRuleUncheckedCreateInput>
    /**
     * In case the HouseRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HouseRuleUpdateInput, HouseRuleUncheckedUpdateInput>
  }

  /**
   * HouseRule delete
   */
  export type HouseRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
    /**
     * Filter which HouseRule to delete.
     */
    where: HouseRuleWhereUniqueInput
  }

  /**
   * HouseRule deleteMany
   */
  export type HouseRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HouseRules to delete
     */
    where?: HouseRuleWhereInput
  }

  /**
   * HouseRule without action
   */
  export type HouseRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HouseRule
     */
    select?: HouseRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HouseRuleInclude<ExtArgs> | null
  }


  /**
   * Model DutySchedule
   */

  export type AggregateDutySchedule = {
    _count: DutyScheduleCountAggregateOutputType | null
    _min: DutyScheduleMinAggregateOutputType | null
    _max: DutyScheduleMaxAggregateOutputType | null
  }

  export type DutyScheduleMinAggregateOutputType = {
    id: string | null
    day: string | null
    member_name: string | null
    created_by: string | null
  }

  export type DutyScheduleMaxAggregateOutputType = {
    id: string | null
    day: string | null
    member_name: string | null
    created_by: string | null
  }

  export type DutyScheduleCountAggregateOutputType = {
    id: number
    day: number
    member_name: number
    created_by: number
    _all: number
  }


  export type DutyScheduleMinAggregateInputType = {
    id?: true
    day?: true
    member_name?: true
    created_by?: true
  }

  export type DutyScheduleMaxAggregateInputType = {
    id?: true
    day?: true
    member_name?: true
    created_by?: true
  }

  export type DutyScheduleCountAggregateInputType = {
    id?: true
    day?: true
    member_name?: true
    created_by?: true
    _all?: true
  }

  export type DutyScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DutySchedule to aggregate.
     */
    where?: DutyScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DutySchedules to fetch.
     */
    orderBy?: DutyScheduleOrderByWithRelationInput | DutyScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DutyScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DutySchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DutySchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DutySchedules
    **/
    _count?: true | DutyScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DutyScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DutyScheduleMaxAggregateInputType
  }

  export type GetDutyScheduleAggregateType<T extends DutyScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateDutySchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDutySchedule[P]>
      : GetScalarType<T[P], AggregateDutySchedule[P]>
  }




  export type DutyScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DutyScheduleWhereInput
    orderBy?: DutyScheduleOrderByWithAggregationInput | DutyScheduleOrderByWithAggregationInput[]
    by: DutyScheduleScalarFieldEnum[] | DutyScheduleScalarFieldEnum
    having?: DutyScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DutyScheduleCountAggregateInputType | true
    _min?: DutyScheduleMinAggregateInputType
    _max?: DutyScheduleMaxAggregateInputType
  }

  export type DutyScheduleGroupByOutputType = {
    id: string
    day: string
    member_name: string
    created_by: string
    _count: DutyScheduleCountAggregateOutputType | null
    _min: DutyScheduleMinAggregateOutputType | null
    _max: DutyScheduleMaxAggregateOutputType | null
  }

  type GetDutyScheduleGroupByPayload<T extends DutyScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DutyScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DutyScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DutyScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], DutyScheduleGroupByOutputType[P]>
        }
      >
    >


  export type DutyScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    day?: boolean
    member_name?: boolean
    created_by?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dutySchedule"]>

  export type DutyScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    day?: boolean
    member_name?: boolean
    created_by?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dutySchedule"]>

  export type DutyScheduleSelectScalar = {
    id?: boolean
    day?: boolean
    member_name?: boolean
    created_by?: boolean
  }

  export type DutyScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DutyScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DutySchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DutySchedule"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      day: string
      member_name: string
      created_by: string
    }, ExtArgs["result"]["dutySchedule"]>
    composites: {}
  }

  type DutyScheduleGetPayload<S extends boolean | null | undefined | DutyScheduleDefaultArgs> = $Result.GetResult<Prisma.$DutySchedulePayload, S>

  type DutyScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DutyScheduleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DutyScheduleCountAggregateInputType | true
    }

  export interface DutyScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DutySchedule'], meta: { name: 'DutySchedule' } }
    /**
     * Find zero or one DutySchedule that matches the filter.
     * @param {DutyScheduleFindUniqueArgs} args - Arguments to find a DutySchedule
     * @example
     * // Get one DutySchedule
     * const dutySchedule = await prisma.dutySchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DutyScheduleFindUniqueArgs>(args: SelectSubset<T, DutyScheduleFindUniqueArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DutySchedule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DutyScheduleFindUniqueOrThrowArgs} args - Arguments to find a DutySchedule
     * @example
     * // Get one DutySchedule
     * const dutySchedule = await prisma.dutySchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DutyScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, DutyScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DutySchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleFindFirstArgs} args - Arguments to find a DutySchedule
     * @example
     * // Get one DutySchedule
     * const dutySchedule = await prisma.dutySchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DutyScheduleFindFirstArgs>(args?: SelectSubset<T, DutyScheduleFindFirstArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DutySchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleFindFirstOrThrowArgs} args - Arguments to find a DutySchedule
     * @example
     * // Get one DutySchedule
     * const dutySchedule = await prisma.dutySchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DutyScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, DutyScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DutySchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DutySchedules
     * const dutySchedules = await prisma.dutySchedule.findMany()
     * 
     * // Get first 10 DutySchedules
     * const dutySchedules = await prisma.dutySchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dutyScheduleWithIdOnly = await prisma.dutySchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DutyScheduleFindManyArgs>(args?: SelectSubset<T, DutyScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DutySchedule.
     * @param {DutyScheduleCreateArgs} args - Arguments to create a DutySchedule.
     * @example
     * // Create one DutySchedule
     * const DutySchedule = await prisma.dutySchedule.create({
     *   data: {
     *     // ... data to create a DutySchedule
     *   }
     * })
     * 
     */
    create<T extends DutyScheduleCreateArgs>(args: SelectSubset<T, DutyScheduleCreateArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DutySchedules.
     * @param {DutyScheduleCreateManyArgs} args - Arguments to create many DutySchedules.
     * @example
     * // Create many DutySchedules
     * const dutySchedule = await prisma.dutySchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DutyScheduleCreateManyArgs>(args?: SelectSubset<T, DutyScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DutySchedules and returns the data saved in the database.
     * @param {DutyScheduleCreateManyAndReturnArgs} args - Arguments to create many DutySchedules.
     * @example
     * // Create many DutySchedules
     * const dutySchedule = await prisma.dutySchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DutySchedules and only return the `id`
     * const dutyScheduleWithIdOnly = await prisma.dutySchedule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DutyScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, DutyScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DutySchedule.
     * @param {DutyScheduleDeleteArgs} args - Arguments to delete one DutySchedule.
     * @example
     * // Delete one DutySchedule
     * const DutySchedule = await prisma.dutySchedule.delete({
     *   where: {
     *     // ... filter to delete one DutySchedule
     *   }
     * })
     * 
     */
    delete<T extends DutyScheduleDeleteArgs>(args: SelectSubset<T, DutyScheduleDeleteArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DutySchedule.
     * @param {DutyScheduleUpdateArgs} args - Arguments to update one DutySchedule.
     * @example
     * // Update one DutySchedule
     * const dutySchedule = await prisma.dutySchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DutyScheduleUpdateArgs>(args: SelectSubset<T, DutyScheduleUpdateArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DutySchedules.
     * @param {DutyScheduleDeleteManyArgs} args - Arguments to filter DutySchedules to delete.
     * @example
     * // Delete a few DutySchedules
     * const { count } = await prisma.dutySchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DutyScheduleDeleteManyArgs>(args?: SelectSubset<T, DutyScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DutySchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DutySchedules
     * const dutySchedule = await prisma.dutySchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DutyScheduleUpdateManyArgs>(args: SelectSubset<T, DutyScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DutySchedule.
     * @param {DutyScheduleUpsertArgs} args - Arguments to update or create a DutySchedule.
     * @example
     * // Update or create a DutySchedule
     * const dutySchedule = await prisma.dutySchedule.upsert({
     *   create: {
     *     // ... data to create a DutySchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DutySchedule we want to update
     *   }
     * })
     */
    upsert<T extends DutyScheduleUpsertArgs>(args: SelectSubset<T, DutyScheduleUpsertArgs<ExtArgs>>): Prisma__DutyScheduleClient<$Result.GetResult<Prisma.$DutySchedulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DutySchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleCountArgs} args - Arguments to filter DutySchedules to count.
     * @example
     * // Count the number of DutySchedules
     * const count = await prisma.dutySchedule.count({
     *   where: {
     *     // ... the filter for the DutySchedules we want to count
     *   }
     * })
    **/
    count<T extends DutyScheduleCountArgs>(
      args?: Subset<T, DutyScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DutyScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DutySchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DutyScheduleAggregateArgs>(args: Subset<T, DutyScheduleAggregateArgs>): Prisma.PrismaPromise<GetDutyScheduleAggregateType<T>>

    /**
     * Group by DutySchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DutyScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DutyScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DutyScheduleGroupByArgs['orderBy'] }
        : { orderBy?: DutyScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DutyScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDutyScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DutySchedule model
   */
  readonly fields: DutyScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DutySchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DutyScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DutySchedule model
   */ 
  interface DutyScheduleFieldRefs {
    readonly id: FieldRef<"DutySchedule", 'String'>
    readonly day: FieldRef<"DutySchedule", 'String'>
    readonly member_name: FieldRef<"DutySchedule", 'String'>
    readonly created_by: FieldRef<"DutySchedule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DutySchedule findUnique
   */
  export type DutyScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * Filter, which DutySchedule to fetch.
     */
    where: DutyScheduleWhereUniqueInput
  }

  /**
   * DutySchedule findUniqueOrThrow
   */
  export type DutyScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * Filter, which DutySchedule to fetch.
     */
    where: DutyScheduleWhereUniqueInput
  }

  /**
   * DutySchedule findFirst
   */
  export type DutyScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * Filter, which DutySchedule to fetch.
     */
    where?: DutyScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DutySchedules to fetch.
     */
    orderBy?: DutyScheduleOrderByWithRelationInput | DutyScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DutySchedules.
     */
    cursor?: DutyScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DutySchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DutySchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DutySchedules.
     */
    distinct?: DutyScheduleScalarFieldEnum | DutyScheduleScalarFieldEnum[]
  }

  /**
   * DutySchedule findFirstOrThrow
   */
  export type DutyScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * Filter, which DutySchedule to fetch.
     */
    where?: DutyScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DutySchedules to fetch.
     */
    orderBy?: DutyScheduleOrderByWithRelationInput | DutyScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DutySchedules.
     */
    cursor?: DutyScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DutySchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DutySchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DutySchedules.
     */
    distinct?: DutyScheduleScalarFieldEnum | DutyScheduleScalarFieldEnum[]
  }

  /**
   * DutySchedule findMany
   */
  export type DutyScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * Filter, which DutySchedules to fetch.
     */
    where?: DutyScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DutySchedules to fetch.
     */
    orderBy?: DutyScheduleOrderByWithRelationInput | DutyScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DutySchedules.
     */
    cursor?: DutyScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DutySchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DutySchedules.
     */
    skip?: number
    distinct?: DutyScheduleScalarFieldEnum | DutyScheduleScalarFieldEnum[]
  }

  /**
   * DutySchedule create
   */
  export type DutyScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a DutySchedule.
     */
    data: XOR<DutyScheduleCreateInput, DutyScheduleUncheckedCreateInput>
  }

  /**
   * DutySchedule createMany
   */
  export type DutyScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DutySchedules.
     */
    data: DutyScheduleCreateManyInput | DutyScheduleCreateManyInput[]
  }

  /**
   * DutySchedule createManyAndReturn
   */
  export type DutyScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DutySchedules.
     */
    data: DutyScheduleCreateManyInput | DutyScheduleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DutySchedule update
   */
  export type DutyScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a DutySchedule.
     */
    data: XOR<DutyScheduleUpdateInput, DutyScheduleUncheckedUpdateInput>
    /**
     * Choose, which DutySchedule to update.
     */
    where: DutyScheduleWhereUniqueInput
  }

  /**
   * DutySchedule updateMany
   */
  export type DutyScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DutySchedules.
     */
    data: XOR<DutyScheduleUpdateManyMutationInput, DutyScheduleUncheckedUpdateManyInput>
    /**
     * Filter which DutySchedules to update
     */
    where?: DutyScheduleWhereInput
  }

  /**
   * DutySchedule upsert
   */
  export type DutyScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the DutySchedule to update in case it exists.
     */
    where: DutyScheduleWhereUniqueInput
    /**
     * In case the DutySchedule found by the `where` argument doesn't exist, create a new DutySchedule with this data.
     */
    create: XOR<DutyScheduleCreateInput, DutyScheduleUncheckedCreateInput>
    /**
     * In case the DutySchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DutyScheduleUpdateInput, DutyScheduleUncheckedUpdateInput>
  }

  /**
   * DutySchedule delete
   */
  export type DutyScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
    /**
     * Filter which DutySchedule to delete.
     */
    where: DutyScheduleWhereUniqueInput
  }

  /**
   * DutySchedule deleteMany
   */
  export type DutyScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DutySchedules to delete
     */
    where?: DutyScheduleWhereInput
  }

  /**
   * DutySchedule without action
   */
  export type DutyScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DutySchedule
     */
    select?: DutyScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DutyScheduleInclude<ExtArgs> | null
  }


  /**
   * Model Schedule
   */

  export type AggregateSchedule = {
    _count: ScheduleCountAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  export type ScheduleMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: string | null
    start_date: string | null
    end_date: string | null
    created_by: string | null
    created_at: Date | null
  }

  export type ScheduleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: string | null
    start_date: string | null
    end_date: string | null
    created_by: string | null
    created_at: Date | null
  }

  export type ScheduleCountAggregateOutputType = {
    id: number
    title: number
    description: number
    category: number
    start_date: number
    end_date: number
    created_by: number
    created_at: number
    _all: number
  }


  export type ScheduleMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    start_date?: true
    end_date?: true
    created_by?: true
    created_at?: true
  }

  export type ScheduleMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    start_date?: true
    end_date?: true
    created_by?: true
    created_at?: true
  }

  export type ScheduleCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    start_date?: true
    end_date?: true
    created_by?: true
    created_at?: true
    _all?: true
  }

  export type ScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedule to aggregate.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Schedules
    **/
    _count?: true | ScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduleMaxAggregateInputType
  }

  export type GetScheduleAggregateType<T extends ScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSchedule[P]>
      : GetScalarType<T[P], AggregateSchedule[P]>
  }




  export type ScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithAggregationInput | ScheduleOrderByWithAggregationInput[]
    by: ScheduleScalarFieldEnum[] | ScheduleScalarFieldEnum
    having?: ScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduleCountAggregateInputType | true
    _min?: ScheduleMinAggregateInputType
    _max?: ScheduleMaxAggregateInputType
  }

  export type ScheduleGroupByOutputType = {
    id: string
    title: string
    description: string | null
    category: string
    start_date: string
    end_date: string
    created_by: string
    created_at: Date
    _count: ScheduleCountAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  type GetScheduleGroupByPayload<T extends ScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
        }
      >
    >


  export type ScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    start_date?: boolean
    end_date?: boolean
    created_by?: boolean
    created_at?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    diaries?: boolean | Schedule$diariesArgs<ExtArgs>
    _count?: boolean | ScheduleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    start_date?: boolean
    end_date?: boolean
    created_by?: boolean
    created_at?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    start_date?: boolean
    end_date?: boolean
    created_by?: boolean
    created_at?: boolean
  }

  export type ScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    diaries?: boolean | Schedule$diariesArgs<ExtArgs>
    _count?: boolean | ScheduleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Schedule"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
      diaries: Prisma.$DiaryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      category: string
      start_date: string
      end_date: string
      created_by: string
      created_at: Date
    }, ExtArgs["result"]["schedule"]>
    composites: {}
  }

  type ScheduleGetPayload<S extends boolean | null | undefined | ScheduleDefaultArgs> = $Result.GetResult<Prisma.$SchedulePayload, S>

  type ScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ScheduleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ScheduleCountAggregateInputType | true
    }

  export interface ScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Schedule'], meta: { name: 'Schedule' } }
    /**
     * Find zero or one Schedule that matches the filter.
     * @param {ScheduleFindUniqueArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduleFindUniqueArgs>(args: SelectSubset<T, ScheduleFindUniqueArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Schedule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ScheduleFindUniqueOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Schedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduleFindFirstArgs>(args?: SelectSubset<T, ScheduleFindFirstArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Schedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Schedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Schedules
     * const schedules = await prisma.schedule.findMany()
     * 
     * // Get first 10 Schedules
     * const schedules = await prisma.schedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduleWithIdOnly = await prisma.schedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduleFindManyArgs>(args?: SelectSubset<T, ScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Schedule.
     * @param {ScheduleCreateArgs} args - Arguments to create a Schedule.
     * @example
     * // Create one Schedule
     * const Schedule = await prisma.schedule.create({
     *   data: {
     *     // ... data to create a Schedule
     *   }
     * })
     * 
     */
    create<T extends ScheduleCreateArgs>(args: SelectSubset<T, ScheduleCreateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Schedules.
     * @param {ScheduleCreateManyArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduleCreateManyArgs>(args?: SelectSubset<T, ScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Schedules and returns the data saved in the database.
     * @param {ScheduleCreateManyAndReturnArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Schedules and only return the `id`
     * const scheduleWithIdOnly = await prisma.schedule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, ScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Schedule.
     * @param {ScheduleDeleteArgs} args - Arguments to delete one Schedule.
     * @example
     * // Delete one Schedule
     * const Schedule = await prisma.schedule.delete({
     *   where: {
     *     // ... filter to delete one Schedule
     *   }
     * })
     * 
     */
    delete<T extends ScheduleDeleteArgs>(args: SelectSubset<T, ScheduleDeleteArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Schedule.
     * @param {ScheduleUpdateArgs} args - Arguments to update one Schedule.
     * @example
     * // Update one Schedule
     * const schedule = await prisma.schedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduleUpdateArgs>(args: SelectSubset<T, ScheduleUpdateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Schedules.
     * @param {ScheduleDeleteManyArgs} args - Arguments to filter Schedules to delete.
     * @example
     * // Delete a few Schedules
     * const { count } = await prisma.schedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduleDeleteManyArgs>(args?: SelectSubset<T, ScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Schedules
     * const schedule = await prisma.schedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduleUpdateManyArgs>(args: SelectSubset<T, ScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Schedule.
     * @param {ScheduleUpsertArgs} args - Arguments to update or create a Schedule.
     * @example
     * // Update or create a Schedule
     * const schedule = await prisma.schedule.upsert({
     *   create: {
     *     // ... data to create a Schedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Schedule we want to update
     *   }
     * })
     */
    upsert<T extends ScheduleUpsertArgs>(args: SelectSubset<T, ScheduleUpsertArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCountArgs} args - Arguments to filter Schedules to count.
     * @example
     * // Count the number of Schedules
     * const count = await prisma.schedule.count({
     *   where: {
     *     // ... the filter for the Schedules we want to count
     *   }
     * })
    **/
    count<T extends ScheduleCountArgs>(
      args?: Subset<T, ScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScheduleAggregateArgs>(args: Subset<T, ScheduleAggregateArgs>): Prisma.PrismaPromise<GetScheduleAggregateType<T>>

    /**
     * Group by Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduleGroupByArgs['orderBy'] }
        : { orderBy?: ScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Schedule model
   */
  readonly fields: ScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Schedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    diaries<T extends Schedule$diariesArgs<ExtArgs> = {}>(args?: Subset<T, Schedule$diariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Schedule model
   */ 
  interface ScheduleFieldRefs {
    readonly id: FieldRef<"Schedule", 'String'>
    readonly title: FieldRef<"Schedule", 'String'>
    readonly description: FieldRef<"Schedule", 'String'>
    readonly category: FieldRef<"Schedule", 'String'>
    readonly start_date: FieldRef<"Schedule", 'String'>
    readonly end_date: FieldRef<"Schedule", 'String'>
    readonly created_by: FieldRef<"Schedule", 'String'>
    readonly created_at: FieldRef<"Schedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Schedule findUnique
   */
  export type ScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findUniqueOrThrow
   */
  export type ScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findFirst
   */
  export type ScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findFirstOrThrow
   */
  export type ScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findMany
   */
  export type ScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedules to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule create
   */
  export type ScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a Schedule.
     */
    data: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
  }

  /**
   * Schedule createMany
   */
  export type ScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
  }

  /**
   * Schedule createManyAndReturn
   */
  export type ScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Schedule update
   */
  export type ScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a Schedule.
     */
    data: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
    /**
     * Choose, which Schedule to update.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule updateMany
   */
  export type ScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Schedules.
     */
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyInput>
    /**
     * Filter which Schedules to update
     */
    where?: ScheduleWhereInput
  }

  /**
   * Schedule upsert
   */
  export type ScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the Schedule to update in case it exists.
     */
    where: ScheduleWhereUniqueInput
    /**
     * In case the Schedule found by the `where` argument doesn't exist, create a new Schedule with this data.
     */
    create: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
    /**
     * In case the Schedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
  }

  /**
   * Schedule delete
   */
  export type ScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter which Schedule to delete.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule deleteMany
   */
  export type ScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedules to delete
     */
    where?: ScheduleWhereInput
  }

  /**
   * Schedule.diaries
   */
  export type Schedule$diariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diary
     */
    select?: DiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryInclude<ExtArgs> | null
    where?: DiaryWhereInput
    orderBy?: DiaryOrderByWithRelationInput | DiaryOrderByWithRelationInput[]
    cursor?: DiaryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiaryScalarFieldEnum | DiaryScalarFieldEnum[]
  }

  /**
   * Schedule without action
   */
  export type ScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
  }


  /**
   * Model ScheduleCategory
   */

  export type AggregateScheduleCategory = {
    _count: ScheduleCategoryCountAggregateOutputType | null
    _min: ScheduleCategoryMinAggregateOutputType | null
    _max: ScheduleCategoryMaxAggregateOutputType | null
  }

  export type ScheduleCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
    created_at: Date | null
  }

  export type ScheduleCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
    created_at: Date | null
  }

  export type ScheduleCategoryCountAggregateOutputType = {
    id: number
    name: number
    color: number
    created_at: number
    _all: number
  }


  export type ScheduleCategoryMinAggregateInputType = {
    id?: true
    name?: true
    color?: true
    created_at?: true
  }

  export type ScheduleCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    color?: true
    created_at?: true
  }

  export type ScheduleCategoryCountAggregateInputType = {
    id?: true
    name?: true
    color?: true
    created_at?: true
    _all?: true
  }

  export type ScheduleCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScheduleCategory to aggregate.
     */
    where?: ScheduleCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduleCategories to fetch.
     */
    orderBy?: ScheduleCategoryOrderByWithRelationInput | ScheduleCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduleCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduleCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduleCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScheduleCategories
    **/
    _count?: true | ScheduleCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduleCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduleCategoryMaxAggregateInputType
  }

  export type GetScheduleCategoryAggregateType<T extends ScheduleCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateScheduleCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScheduleCategory[P]>
      : GetScalarType<T[P], AggregateScheduleCategory[P]>
  }




  export type ScheduleCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleCategoryWhereInput
    orderBy?: ScheduleCategoryOrderByWithAggregationInput | ScheduleCategoryOrderByWithAggregationInput[]
    by: ScheduleCategoryScalarFieldEnum[] | ScheduleCategoryScalarFieldEnum
    having?: ScheduleCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduleCategoryCountAggregateInputType | true
    _min?: ScheduleCategoryMinAggregateInputType
    _max?: ScheduleCategoryMaxAggregateInputType
  }

  export type ScheduleCategoryGroupByOutputType = {
    id: string
    name: string
    color: string
    created_at: Date
    _count: ScheduleCategoryCountAggregateOutputType | null
    _min: ScheduleCategoryMinAggregateOutputType | null
    _max: ScheduleCategoryMaxAggregateOutputType | null
  }

  type GetScheduleCategoryGroupByPayload<T extends ScheduleCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduleCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduleCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduleCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduleCategoryGroupByOutputType[P]>
        }
      >
    >


  export type ScheduleCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["scheduleCategory"]>

  export type ScheduleCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["scheduleCategory"]>

  export type ScheduleCategorySelectScalar = {
    id?: boolean
    name?: boolean
    color?: boolean
    created_at?: boolean
  }


  export type $ScheduleCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScheduleCategory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      color: string
      created_at: Date
    }, ExtArgs["result"]["scheduleCategory"]>
    composites: {}
  }

  type ScheduleCategoryGetPayload<S extends boolean | null | undefined | ScheduleCategoryDefaultArgs> = $Result.GetResult<Prisma.$ScheduleCategoryPayload, S>

  type ScheduleCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ScheduleCategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ScheduleCategoryCountAggregateInputType | true
    }

  export interface ScheduleCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScheduleCategory'], meta: { name: 'ScheduleCategory' } }
    /**
     * Find zero or one ScheduleCategory that matches the filter.
     * @param {ScheduleCategoryFindUniqueArgs} args - Arguments to find a ScheduleCategory
     * @example
     * // Get one ScheduleCategory
     * const scheduleCategory = await prisma.scheduleCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduleCategoryFindUniqueArgs>(args: SelectSubset<T, ScheduleCategoryFindUniqueArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ScheduleCategory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ScheduleCategoryFindUniqueOrThrowArgs} args - Arguments to find a ScheduleCategory
     * @example
     * // Get one ScheduleCategory
     * const scheduleCategory = await prisma.scheduleCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduleCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduleCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ScheduleCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryFindFirstArgs} args - Arguments to find a ScheduleCategory
     * @example
     * // Get one ScheduleCategory
     * const scheduleCategory = await prisma.scheduleCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduleCategoryFindFirstArgs>(args?: SelectSubset<T, ScheduleCategoryFindFirstArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ScheduleCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryFindFirstOrThrowArgs} args - Arguments to find a ScheduleCategory
     * @example
     * // Get one ScheduleCategory
     * const scheduleCategory = await prisma.scheduleCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduleCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduleCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ScheduleCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScheduleCategories
     * const scheduleCategories = await prisma.scheduleCategory.findMany()
     * 
     * // Get first 10 ScheduleCategories
     * const scheduleCategories = await prisma.scheduleCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduleCategoryWithIdOnly = await prisma.scheduleCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduleCategoryFindManyArgs>(args?: SelectSubset<T, ScheduleCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ScheduleCategory.
     * @param {ScheduleCategoryCreateArgs} args - Arguments to create a ScheduleCategory.
     * @example
     * // Create one ScheduleCategory
     * const ScheduleCategory = await prisma.scheduleCategory.create({
     *   data: {
     *     // ... data to create a ScheduleCategory
     *   }
     * })
     * 
     */
    create<T extends ScheduleCategoryCreateArgs>(args: SelectSubset<T, ScheduleCategoryCreateArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ScheduleCategories.
     * @param {ScheduleCategoryCreateManyArgs} args - Arguments to create many ScheduleCategories.
     * @example
     * // Create many ScheduleCategories
     * const scheduleCategory = await prisma.scheduleCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduleCategoryCreateManyArgs>(args?: SelectSubset<T, ScheduleCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScheduleCategories and returns the data saved in the database.
     * @param {ScheduleCategoryCreateManyAndReturnArgs} args - Arguments to create many ScheduleCategories.
     * @example
     * // Create many ScheduleCategories
     * const scheduleCategory = await prisma.scheduleCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScheduleCategories and only return the `id`
     * const scheduleCategoryWithIdOnly = await prisma.scheduleCategory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScheduleCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, ScheduleCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ScheduleCategory.
     * @param {ScheduleCategoryDeleteArgs} args - Arguments to delete one ScheduleCategory.
     * @example
     * // Delete one ScheduleCategory
     * const ScheduleCategory = await prisma.scheduleCategory.delete({
     *   where: {
     *     // ... filter to delete one ScheduleCategory
     *   }
     * })
     * 
     */
    delete<T extends ScheduleCategoryDeleteArgs>(args: SelectSubset<T, ScheduleCategoryDeleteArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ScheduleCategory.
     * @param {ScheduleCategoryUpdateArgs} args - Arguments to update one ScheduleCategory.
     * @example
     * // Update one ScheduleCategory
     * const scheduleCategory = await prisma.scheduleCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduleCategoryUpdateArgs>(args: SelectSubset<T, ScheduleCategoryUpdateArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ScheduleCategories.
     * @param {ScheduleCategoryDeleteManyArgs} args - Arguments to filter ScheduleCategories to delete.
     * @example
     * // Delete a few ScheduleCategories
     * const { count } = await prisma.scheduleCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduleCategoryDeleteManyArgs>(args?: SelectSubset<T, ScheduleCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScheduleCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScheduleCategories
     * const scheduleCategory = await prisma.scheduleCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduleCategoryUpdateManyArgs>(args: SelectSubset<T, ScheduleCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ScheduleCategory.
     * @param {ScheduleCategoryUpsertArgs} args - Arguments to update or create a ScheduleCategory.
     * @example
     * // Update or create a ScheduleCategory
     * const scheduleCategory = await prisma.scheduleCategory.upsert({
     *   create: {
     *     // ... data to create a ScheduleCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScheduleCategory we want to update
     *   }
     * })
     */
    upsert<T extends ScheduleCategoryUpsertArgs>(args: SelectSubset<T, ScheduleCategoryUpsertArgs<ExtArgs>>): Prisma__ScheduleCategoryClient<$Result.GetResult<Prisma.$ScheduleCategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ScheduleCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryCountArgs} args - Arguments to filter ScheduleCategories to count.
     * @example
     * // Count the number of ScheduleCategories
     * const count = await prisma.scheduleCategory.count({
     *   where: {
     *     // ... the filter for the ScheduleCategories we want to count
     *   }
     * })
    **/
    count<T extends ScheduleCategoryCountArgs>(
      args?: Subset<T, ScheduleCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduleCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScheduleCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScheduleCategoryAggregateArgs>(args: Subset<T, ScheduleCategoryAggregateArgs>): Prisma.PrismaPromise<GetScheduleCategoryAggregateType<T>>

    /**
     * Group by ScheduleCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScheduleCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduleCategoryGroupByArgs['orderBy'] }
        : { orderBy?: ScheduleCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScheduleCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduleCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScheduleCategory model
   */
  readonly fields: ScheduleCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScheduleCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduleCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScheduleCategory model
   */ 
  interface ScheduleCategoryFieldRefs {
    readonly id: FieldRef<"ScheduleCategory", 'String'>
    readonly name: FieldRef<"ScheduleCategory", 'String'>
    readonly color: FieldRef<"ScheduleCategory", 'String'>
    readonly created_at: FieldRef<"ScheduleCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScheduleCategory findUnique
   */
  export type ScheduleCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * Filter, which ScheduleCategory to fetch.
     */
    where: ScheduleCategoryWhereUniqueInput
  }

  /**
   * ScheduleCategory findUniqueOrThrow
   */
  export type ScheduleCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * Filter, which ScheduleCategory to fetch.
     */
    where: ScheduleCategoryWhereUniqueInput
  }

  /**
   * ScheduleCategory findFirst
   */
  export type ScheduleCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * Filter, which ScheduleCategory to fetch.
     */
    where?: ScheduleCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduleCategories to fetch.
     */
    orderBy?: ScheduleCategoryOrderByWithRelationInput | ScheduleCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScheduleCategories.
     */
    cursor?: ScheduleCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduleCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduleCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScheduleCategories.
     */
    distinct?: ScheduleCategoryScalarFieldEnum | ScheduleCategoryScalarFieldEnum[]
  }

  /**
   * ScheduleCategory findFirstOrThrow
   */
  export type ScheduleCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * Filter, which ScheduleCategory to fetch.
     */
    where?: ScheduleCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduleCategories to fetch.
     */
    orderBy?: ScheduleCategoryOrderByWithRelationInput | ScheduleCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScheduleCategories.
     */
    cursor?: ScheduleCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduleCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduleCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScheduleCategories.
     */
    distinct?: ScheduleCategoryScalarFieldEnum | ScheduleCategoryScalarFieldEnum[]
  }

  /**
   * ScheduleCategory findMany
   */
  export type ScheduleCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * Filter, which ScheduleCategories to fetch.
     */
    where?: ScheduleCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduleCategories to fetch.
     */
    orderBy?: ScheduleCategoryOrderByWithRelationInput | ScheduleCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScheduleCategories.
     */
    cursor?: ScheduleCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduleCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduleCategories.
     */
    skip?: number
    distinct?: ScheduleCategoryScalarFieldEnum | ScheduleCategoryScalarFieldEnum[]
  }

  /**
   * ScheduleCategory create
   */
  export type ScheduleCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * The data needed to create a ScheduleCategory.
     */
    data: XOR<ScheduleCategoryCreateInput, ScheduleCategoryUncheckedCreateInput>
  }

  /**
   * ScheduleCategory createMany
   */
  export type ScheduleCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScheduleCategories.
     */
    data: ScheduleCategoryCreateManyInput | ScheduleCategoryCreateManyInput[]
  }

  /**
   * ScheduleCategory createManyAndReturn
   */
  export type ScheduleCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ScheduleCategories.
     */
    data: ScheduleCategoryCreateManyInput | ScheduleCategoryCreateManyInput[]
  }

  /**
   * ScheduleCategory update
   */
  export type ScheduleCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * The data needed to update a ScheduleCategory.
     */
    data: XOR<ScheduleCategoryUpdateInput, ScheduleCategoryUncheckedUpdateInput>
    /**
     * Choose, which ScheduleCategory to update.
     */
    where: ScheduleCategoryWhereUniqueInput
  }

  /**
   * ScheduleCategory updateMany
   */
  export type ScheduleCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScheduleCategories.
     */
    data: XOR<ScheduleCategoryUpdateManyMutationInput, ScheduleCategoryUncheckedUpdateManyInput>
    /**
     * Filter which ScheduleCategories to update
     */
    where?: ScheduleCategoryWhereInput
  }

  /**
   * ScheduleCategory upsert
   */
  export type ScheduleCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * The filter to search for the ScheduleCategory to update in case it exists.
     */
    where: ScheduleCategoryWhereUniqueInput
    /**
     * In case the ScheduleCategory found by the `where` argument doesn't exist, create a new ScheduleCategory with this data.
     */
    create: XOR<ScheduleCategoryCreateInput, ScheduleCategoryUncheckedCreateInput>
    /**
     * In case the ScheduleCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduleCategoryUpdateInput, ScheduleCategoryUncheckedUpdateInput>
  }

  /**
   * ScheduleCategory delete
   */
  export type ScheduleCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
    /**
     * Filter which ScheduleCategory to delete.
     */
    where: ScheduleCategoryWhereUniqueInput
  }

  /**
   * ScheduleCategory deleteMany
   */
  export type ScheduleCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScheduleCategories to delete
     */
    where?: ScheduleCategoryWhereInput
  }

  /**
   * ScheduleCategory without action
   */
  export type ScheduleCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCategory
     */
    select?: ScheduleCategorySelect<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    project_name: string | null
    description: string | null
    start_date: string | null
    end_date: string | null
    project_status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    project_name: string | null
    description: string | null
    start_date: string | null
    end_date: string | null
    project_status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    project_name: number
    description: number
    start_date: number
    end_date: number
    project_status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    project_name?: true
    description?: true
    start_date?: true
    end_date?: true
    project_status?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    project_name?: true
    description?: true
    start_date?: true
    end_date?: true
    project_status?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    project_name?: true
    description?: true
    start_date?: true
    end_date?: true
    project_status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    project_name: string
    description: string | null
    start_date: string
    end_date: string
    project_status: string
    created_at: Date
    updated_at: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_name?: boolean
    description?: boolean
    start_date?: boolean
    end_date?: boolean
    project_status?: boolean
    created_at?: boolean
    updated_at?: boolean
    members?: boolean | Project$membersArgs<ExtArgs>
    diaries?: boolean | Project$diariesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_name?: boolean
    description?: boolean
    start_date?: boolean
    end_date?: boolean
    project_status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    project_name?: boolean
    description?: boolean
    start_date?: boolean
    end_date?: boolean
    project_status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Project$membersArgs<ExtArgs>
    diaries?: boolean | Project$diariesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      members: Prisma.$ProjectMemberPayload<ExtArgs>[]
      diaries: Prisma.$ProjectDiaryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_name: string
      description: string | null
      start_date: string
      end_date: string
      project_status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Project$membersArgs<ExtArgs> = {}>(args?: Subset<T, Project$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany"> | Null>
    diaries<T extends Project$diariesArgs<ExtArgs> = {}>(args?: Subset<T, Project$diariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */ 
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly project_name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly start_date: FieldRef<"Project", 'String'>
    readonly end_date: FieldRef<"Project", 'String'>
    readonly project_status: FieldRef<"Project", 'String'>
    readonly created_at: FieldRef<"Project", 'DateTime'>
    readonly updated_at: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
  }

  /**
   * Project.members
   */
  export type Project$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    cursor?: ProjectMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * Project.diaries
   */
  export type Project$diariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    where?: ProjectDiaryWhereInput
    orderBy?: ProjectDiaryOrderByWithRelationInput | ProjectDiaryOrderByWithRelationInput[]
    cursor?: ProjectDiaryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectDiaryScalarFieldEnum | ProjectDiaryScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectMember
   */

  export type AggregateProjectMember = {
    _count: ProjectMemberCountAggregateOutputType | null
    _min: ProjectMemberMinAggregateOutputType | null
    _max: ProjectMemberMaxAggregateOutputType | null
  }

  export type ProjectMemberMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    user_id: string | null
    role: string | null
    created_at: Date | null
  }

  export type ProjectMemberMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    user_id: string | null
    role: string | null
    created_at: Date | null
  }

  export type ProjectMemberCountAggregateOutputType = {
    id: number
    project_id: number
    user_id: number
    role: number
    created_at: number
    _all: number
  }


  export type ProjectMemberMinAggregateInputType = {
    id?: true
    project_id?: true
    user_id?: true
    role?: true
    created_at?: true
  }

  export type ProjectMemberMaxAggregateInputType = {
    id?: true
    project_id?: true
    user_id?: true
    role?: true
    created_at?: true
  }

  export type ProjectMemberCountAggregateInputType = {
    id?: true
    project_id?: true
    user_id?: true
    role?: true
    created_at?: true
    _all?: true
  }

  export type ProjectMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectMember to aggregate.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectMembers
    **/
    _count?: true | ProjectMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMemberMaxAggregateInputType
  }

  export type GetProjectMemberAggregateType<T extends ProjectMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectMember[P]>
      : GetScalarType<T[P], AggregateProjectMember[P]>
  }




  export type ProjectMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithAggregationInput | ProjectMemberOrderByWithAggregationInput[]
    by: ProjectMemberScalarFieldEnum[] | ProjectMemberScalarFieldEnum
    having?: ProjectMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectMemberCountAggregateInputType | true
    _min?: ProjectMemberMinAggregateInputType
    _max?: ProjectMemberMaxAggregateInputType
  }

  export type ProjectMemberGroupByOutputType = {
    id: string
    project_id: string
    user_id: string
    role: string
    created_at: Date
    _count: ProjectMemberCountAggregateOutputType | null
    _min: ProjectMemberMinAggregateOutputType | null
    _max: ProjectMemberMaxAggregateOutputType | null
  }

  type GetProjectMemberGroupByPayload<T extends ProjectMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>
        }
      >
    >


  export type ProjectMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_id?: boolean
    role?: boolean
    created_at?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMember"]>

  export type ProjectMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_id?: boolean
    role?: boolean
    created_at?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMember"]>

  export type ProjectMemberSelectScalar = {
    id?: boolean
    project_id?: boolean
    user_id?: boolean
    role?: boolean
    created_at?: boolean
  }

  export type ProjectMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectMember"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      user_id: string
      role: string
      created_at: Date
    }, ExtArgs["result"]["projectMember"]>
    composites: {}
  }

  type ProjectMemberGetPayload<S extends boolean | null | undefined | ProjectMemberDefaultArgs> = $Result.GetResult<Prisma.$ProjectMemberPayload, S>

  type ProjectMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectMemberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectMemberCountAggregateInputType | true
    }

  export interface ProjectMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectMember'], meta: { name: 'ProjectMember' } }
    /**
     * Find zero or one ProjectMember that matches the filter.
     * @param {ProjectMemberFindUniqueArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectMemberFindUniqueArgs>(args: SelectSubset<T, ProjectMemberFindUniqueArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProjectMember that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectMemberFindUniqueOrThrowArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProjectMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindFirstArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectMemberFindFirstArgs>(args?: SelectSubset<T, ProjectMemberFindFirstArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProjectMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindFirstOrThrowArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProjectMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectMembers
     * const projectMembers = await prisma.projectMember.findMany()
     * 
     * // Get first 10 ProjectMembers
     * const projectMembers = await prisma.projectMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectMemberFindManyArgs>(args?: SelectSubset<T, ProjectMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProjectMember.
     * @param {ProjectMemberCreateArgs} args - Arguments to create a ProjectMember.
     * @example
     * // Create one ProjectMember
     * const ProjectMember = await prisma.projectMember.create({
     *   data: {
     *     // ... data to create a ProjectMember
     *   }
     * })
     * 
     */
    create<T extends ProjectMemberCreateArgs>(args: SelectSubset<T, ProjectMemberCreateArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProjectMembers.
     * @param {ProjectMemberCreateManyArgs} args - Arguments to create many ProjectMembers.
     * @example
     * // Create many ProjectMembers
     * const projectMember = await prisma.projectMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectMemberCreateManyArgs>(args?: SelectSubset<T, ProjectMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectMembers and returns the data saved in the database.
     * @param {ProjectMemberCreateManyAndReturnArgs} args - Arguments to create many ProjectMembers.
     * @example
     * // Create many ProjectMembers
     * const projectMember = await prisma.projectMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectMembers and only return the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProjectMember.
     * @param {ProjectMemberDeleteArgs} args - Arguments to delete one ProjectMember.
     * @example
     * // Delete one ProjectMember
     * const ProjectMember = await prisma.projectMember.delete({
     *   where: {
     *     // ... filter to delete one ProjectMember
     *   }
     * })
     * 
     */
    delete<T extends ProjectMemberDeleteArgs>(args: SelectSubset<T, ProjectMemberDeleteArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProjectMember.
     * @param {ProjectMemberUpdateArgs} args - Arguments to update one ProjectMember.
     * @example
     * // Update one ProjectMember
     * const projectMember = await prisma.projectMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectMemberUpdateArgs>(args: SelectSubset<T, ProjectMemberUpdateArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProjectMembers.
     * @param {ProjectMemberDeleteManyArgs} args - Arguments to filter ProjectMembers to delete.
     * @example
     * // Delete a few ProjectMembers
     * const { count } = await prisma.projectMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectMemberDeleteManyArgs>(args?: SelectSubset<T, ProjectMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectMembers
     * const projectMember = await prisma.projectMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectMemberUpdateManyArgs>(args: SelectSubset<T, ProjectMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProjectMember.
     * @param {ProjectMemberUpsertArgs} args - Arguments to update or create a ProjectMember.
     * @example
     * // Update or create a ProjectMember
     * const projectMember = await prisma.projectMember.upsert({
     *   create: {
     *     // ... data to create a ProjectMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectMember we want to update
     *   }
     * })
     */
    upsert<T extends ProjectMemberUpsertArgs>(args: SelectSubset<T, ProjectMemberUpsertArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProjectMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberCountArgs} args - Arguments to filter ProjectMembers to count.
     * @example
     * // Count the number of ProjectMembers
     * const count = await prisma.projectMember.count({
     *   where: {
     *     // ... the filter for the ProjectMembers we want to count
     *   }
     * })
    **/
    count<T extends ProjectMemberCountArgs>(
      args?: Subset<T, ProjectMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectMemberAggregateArgs>(args: Subset<T, ProjectMemberAggregateArgs>): Prisma.PrismaPromise<GetProjectMemberAggregateType<T>>

    /**
     * Group by ProjectMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectMemberGroupByArgs['orderBy'] }
        : { orderBy?: ProjectMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectMember model
   */
  readonly fields: ProjectMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectMember model
   */ 
  interface ProjectMemberFieldRefs {
    readonly id: FieldRef<"ProjectMember", 'String'>
    readonly project_id: FieldRef<"ProjectMember", 'String'>
    readonly user_id: FieldRef<"ProjectMember", 'String'>
    readonly role: FieldRef<"ProjectMember", 'String'>
    readonly created_at: FieldRef<"ProjectMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectMember findUnique
   */
  export type ProjectMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember findUniqueOrThrow
   */
  export type ProjectMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember findFirst
   */
  export type ProjectMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember findFirstOrThrow
   */
  export type ProjectMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember findMany
   */
  export type ProjectMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMembers to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember create
   */
  export type ProjectMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectMember.
     */
    data: XOR<ProjectMemberCreateInput, ProjectMemberUncheckedCreateInput>
  }

  /**
   * ProjectMember createMany
   */
  export type ProjectMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectMembers.
     */
    data: ProjectMemberCreateManyInput | ProjectMemberCreateManyInput[]
  }

  /**
   * ProjectMember createManyAndReturn
   */
  export type ProjectMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProjectMembers.
     */
    data: ProjectMemberCreateManyInput | ProjectMemberCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMember update
   */
  export type ProjectMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectMember.
     */
    data: XOR<ProjectMemberUpdateInput, ProjectMemberUncheckedUpdateInput>
    /**
     * Choose, which ProjectMember to update.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember updateMany
   */
  export type ProjectMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectMembers.
     */
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMembers to update
     */
    where?: ProjectMemberWhereInput
  }

  /**
   * ProjectMember upsert
   */
  export type ProjectMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectMember to update in case it exists.
     */
    where: ProjectMemberWhereUniqueInput
    /**
     * In case the ProjectMember found by the `where` argument doesn't exist, create a new ProjectMember with this data.
     */
    create: XOR<ProjectMemberCreateInput, ProjectMemberUncheckedCreateInput>
    /**
     * In case the ProjectMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectMemberUpdateInput, ProjectMemberUncheckedUpdateInput>
  }

  /**
   * ProjectMember delete
   */
  export type ProjectMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter which ProjectMember to delete.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember deleteMany
   */
  export type ProjectMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectMembers to delete
     */
    where?: ProjectMemberWhereInput
  }

  /**
   * ProjectMember without action
   */
  export type ProjectMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
  }


  /**
   * Model ProjectDiary
   */

  export type AggregateProjectDiary = {
    _count: ProjectDiaryCountAggregateOutputType | null
    _avg: ProjectDiaryAvgAggregateOutputType | null
    _sum: ProjectDiarySumAggregateOutputType | null
    _min: ProjectDiaryMinAggregateOutputType | null
    _max: ProjectDiaryMaxAggregateOutputType | null
  }

  export type ProjectDiaryAvgAggregateOutputType = {
    work_progress: number | null
  }

  export type ProjectDiarySumAggregateOutputType = {
    work_progress: number | null
  }

  export type ProjectDiaryMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    diary_title: string | null
    activity_description: string | null
    work_progress: number | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectDiaryMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    diary_title: string | null
    activity_description: string | null
    work_progress: number | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectDiaryCountAggregateOutputType = {
    id: number
    project_id: number
    diary_title: number
    activity_description: number
    work_progress: number
    created_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProjectDiaryAvgAggregateInputType = {
    work_progress?: true
  }

  export type ProjectDiarySumAggregateInputType = {
    work_progress?: true
  }

  export type ProjectDiaryMinAggregateInputType = {
    id?: true
    project_id?: true
    diary_title?: true
    activity_description?: true
    work_progress?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectDiaryMaxAggregateInputType = {
    id?: true
    project_id?: true
    diary_title?: true
    activity_description?: true
    work_progress?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectDiaryCountAggregateInputType = {
    id?: true
    project_id?: true
    diary_title?: true
    activity_description?: true
    work_progress?: true
    created_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProjectDiaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectDiary to aggregate.
     */
    where?: ProjectDiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectDiaries to fetch.
     */
    orderBy?: ProjectDiaryOrderByWithRelationInput | ProjectDiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectDiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectDiaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectDiaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectDiaries
    **/
    _count?: true | ProjectDiaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectDiaryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectDiarySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectDiaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectDiaryMaxAggregateInputType
  }

  export type GetProjectDiaryAggregateType<T extends ProjectDiaryAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectDiary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectDiary[P]>
      : GetScalarType<T[P], AggregateProjectDiary[P]>
  }




  export type ProjectDiaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectDiaryWhereInput
    orderBy?: ProjectDiaryOrderByWithAggregationInput | ProjectDiaryOrderByWithAggregationInput[]
    by: ProjectDiaryScalarFieldEnum[] | ProjectDiaryScalarFieldEnum
    having?: ProjectDiaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectDiaryCountAggregateInputType | true
    _avg?: ProjectDiaryAvgAggregateInputType
    _sum?: ProjectDiarySumAggregateInputType
    _min?: ProjectDiaryMinAggregateInputType
    _max?: ProjectDiaryMaxAggregateInputType
  }

  export type ProjectDiaryGroupByOutputType = {
    id: string
    project_id: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_by: string
    created_at: Date
    updated_at: Date
    _count: ProjectDiaryCountAggregateOutputType | null
    _avg: ProjectDiaryAvgAggregateOutputType | null
    _sum: ProjectDiarySumAggregateOutputType | null
    _min: ProjectDiaryMinAggregateOutputType | null
    _max: ProjectDiaryMaxAggregateOutputType | null
  }

  type GetProjectDiaryGroupByPayload<T extends ProjectDiaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectDiaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectDiaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectDiaryGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectDiaryGroupByOutputType[P]>
        }
      >
    >


  export type ProjectDiarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    diary_title?: boolean
    activity_description?: boolean
    work_progress?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectDiary"]>

  export type ProjectDiarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    diary_title?: boolean
    activity_description?: boolean
    work_progress?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectDiary"]>

  export type ProjectDiarySelectScalar = {
    id?: boolean
    project_id?: boolean
    diary_title?: boolean
    activity_description?: boolean
    work_progress?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ProjectDiaryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectDiaryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectDiaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectDiary"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      creator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      diary_title: string
      activity_description: string
      work_progress: number
      created_by: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["projectDiary"]>
    composites: {}
  }

  type ProjectDiaryGetPayload<S extends boolean | null | undefined | ProjectDiaryDefaultArgs> = $Result.GetResult<Prisma.$ProjectDiaryPayload, S>

  type ProjectDiaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectDiaryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectDiaryCountAggregateInputType | true
    }

  export interface ProjectDiaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectDiary'], meta: { name: 'ProjectDiary' } }
    /**
     * Find zero or one ProjectDiary that matches the filter.
     * @param {ProjectDiaryFindUniqueArgs} args - Arguments to find a ProjectDiary
     * @example
     * // Get one ProjectDiary
     * const projectDiary = await prisma.projectDiary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectDiaryFindUniqueArgs>(args: SelectSubset<T, ProjectDiaryFindUniqueArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProjectDiary that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectDiaryFindUniqueOrThrowArgs} args - Arguments to find a ProjectDiary
     * @example
     * // Get one ProjectDiary
     * const projectDiary = await prisma.projectDiary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectDiaryFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectDiaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProjectDiary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryFindFirstArgs} args - Arguments to find a ProjectDiary
     * @example
     * // Get one ProjectDiary
     * const projectDiary = await prisma.projectDiary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectDiaryFindFirstArgs>(args?: SelectSubset<T, ProjectDiaryFindFirstArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProjectDiary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryFindFirstOrThrowArgs} args - Arguments to find a ProjectDiary
     * @example
     * // Get one ProjectDiary
     * const projectDiary = await prisma.projectDiary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectDiaryFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectDiaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProjectDiaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectDiaries
     * const projectDiaries = await prisma.projectDiary.findMany()
     * 
     * // Get first 10 ProjectDiaries
     * const projectDiaries = await prisma.projectDiary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectDiaryWithIdOnly = await prisma.projectDiary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectDiaryFindManyArgs>(args?: SelectSubset<T, ProjectDiaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProjectDiary.
     * @param {ProjectDiaryCreateArgs} args - Arguments to create a ProjectDiary.
     * @example
     * // Create one ProjectDiary
     * const ProjectDiary = await prisma.projectDiary.create({
     *   data: {
     *     // ... data to create a ProjectDiary
     *   }
     * })
     * 
     */
    create<T extends ProjectDiaryCreateArgs>(args: SelectSubset<T, ProjectDiaryCreateArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProjectDiaries.
     * @param {ProjectDiaryCreateManyArgs} args - Arguments to create many ProjectDiaries.
     * @example
     * // Create many ProjectDiaries
     * const projectDiary = await prisma.projectDiary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectDiaryCreateManyArgs>(args?: SelectSubset<T, ProjectDiaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectDiaries and returns the data saved in the database.
     * @param {ProjectDiaryCreateManyAndReturnArgs} args - Arguments to create many ProjectDiaries.
     * @example
     * // Create many ProjectDiaries
     * const projectDiary = await prisma.projectDiary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectDiaries and only return the `id`
     * const projectDiaryWithIdOnly = await prisma.projectDiary.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectDiaryCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectDiaryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProjectDiary.
     * @param {ProjectDiaryDeleteArgs} args - Arguments to delete one ProjectDiary.
     * @example
     * // Delete one ProjectDiary
     * const ProjectDiary = await prisma.projectDiary.delete({
     *   where: {
     *     // ... filter to delete one ProjectDiary
     *   }
     * })
     * 
     */
    delete<T extends ProjectDiaryDeleteArgs>(args: SelectSubset<T, ProjectDiaryDeleteArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProjectDiary.
     * @param {ProjectDiaryUpdateArgs} args - Arguments to update one ProjectDiary.
     * @example
     * // Update one ProjectDiary
     * const projectDiary = await prisma.projectDiary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectDiaryUpdateArgs>(args: SelectSubset<T, ProjectDiaryUpdateArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProjectDiaries.
     * @param {ProjectDiaryDeleteManyArgs} args - Arguments to filter ProjectDiaries to delete.
     * @example
     * // Delete a few ProjectDiaries
     * const { count } = await prisma.projectDiary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDiaryDeleteManyArgs>(args?: SelectSubset<T, ProjectDiaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectDiaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectDiaries
     * const projectDiary = await prisma.projectDiary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectDiaryUpdateManyArgs>(args: SelectSubset<T, ProjectDiaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProjectDiary.
     * @param {ProjectDiaryUpsertArgs} args - Arguments to update or create a ProjectDiary.
     * @example
     * // Update or create a ProjectDiary
     * const projectDiary = await prisma.projectDiary.upsert({
     *   create: {
     *     // ... data to create a ProjectDiary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectDiary we want to update
     *   }
     * })
     */
    upsert<T extends ProjectDiaryUpsertArgs>(args: SelectSubset<T, ProjectDiaryUpsertArgs<ExtArgs>>): Prisma__ProjectDiaryClient<$Result.GetResult<Prisma.$ProjectDiaryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProjectDiaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryCountArgs} args - Arguments to filter ProjectDiaries to count.
     * @example
     * // Count the number of ProjectDiaries
     * const count = await prisma.projectDiary.count({
     *   where: {
     *     // ... the filter for the ProjectDiaries we want to count
     *   }
     * })
    **/
    count<T extends ProjectDiaryCountArgs>(
      args?: Subset<T, ProjectDiaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectDiaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectDiary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectDiaryAggregateArgs>(args: Subset<T, ProjectDiaryAggregateArgs>): Prisma.PrismaPromise<GetProjectDiaryAggregateType<T>>

    /**
     * Group by ProjectDiary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectDiaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectDiaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectDiaryGroupByArgs['orderBy'] }
        : { orderBy?: ProjectDiaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectDiaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectDiaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectDiary model
   */
  readonly fields: ProjectDiaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectDiary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectDiaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectDiary model
   */ 
  interface ProjectDiaryFieldRefs {
    readonly id: FieldRef<"ProjectDiary", 'String'>
    readonly project_id: FieldRef<"ProjectDiary", 'String'>
    readonly diary_title: FieldRef<"ProjectDiary", 'String'>
    readonly activity_description: FieldRef<"ProjectDiary", 'String'>
    readonly work_progress: FieldRef<"ProjectDiary", 'Int'>
    readonly created_by: FieldRef<"ProjectDiary", 'String'>
    readonly created_at: FieldRef<"ProjectDiary", 'DateTime'>
    readonly updated_at: FieldRef<"ProjectDiary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectDiary findUnique
   */
  export type ProjectDiaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * Filter, which ProjectDiary to fetch.
     */
    where: ProjectDiaryWhereUniqueInput
  }

  /**
   * ProjectDiary findUniqueOrThrow
   */
  export type ProjectDiaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * Filter, which ProjectDiary to fetch.
     */
    where: ProjectDiaryWhereUniqueInput
  }

  /**
   * ProjectDiary findFirst
   */
  export type ProjectDiaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * Filter, which ProjectDiary to fetch.
     */
    where?: ProjectDiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectDiaries to fetch.
     */
    orderBy?: ProjectDiaryOrderByWithRelationInput | ProjectDiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectDiaries.
     */
    cursor?: ProjectDiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectDiaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectDiaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectDiaries.
     */
    distinct?: ProjectDiaryScalarFieldEnum | ProjectDiaryScalarFieldEnum[]
  }

  /**
   * ProjectDiary findFirstOrThrow
   */
  export type ProjectDiaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * Filter, which ProjectDiary to fetch.
     */
    where?: ProjectDiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectDiaries to fetch.
     */
    orderBy?: ProjectDiaryOrderByWithRelationInput | ProjectDiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectDiaries.
     */
    cursor?: ProjectDiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectDiaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectDiaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectDiaries.
     */
    distinct?: ProjectDiaryScalarFieldEnum | ProjectDiaryScalarFieldEnum[]
  }

  /**
   * ProjectDiary findMany
   */
  export type ProjectDiaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * Filter, which ProjectDiaries to fetch.
     */
    where?: ProjectDiaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectDiaries to fetch.
     */
    orderBy?: ProjectDiaryOrderByWithRelationInput | ProjectDiaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectDiaries.
     */
    cursor?: ProjectDiaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectDiaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectDiaries.
     */
    skip?: number
    distinct?: ProjectDiaryScalarFieldEnum | ProjectDiaryScalarFieldEnum[]
  }

  /**
   * ProjectDiary create
   */
  export type ProjectDiaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectDiary.
     */
    data: XOR<ProjectDiaryCreateInput, ProjectDiaryUncheckedCreateInput>
  }

  /**
   * ProjectDiary createMany
   */
  export type ProjectDiaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectDiaries.
     */
    data: ProjectDiaryCreateManyInput | ProjectDiaryCreateManyInput[]
  }

  /**
   * ProjectDiary createManyAndReturn
   */
  export type ProjectDiaryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProjectDiaries.
     */
    data: ProjectDiaryCreateManyInput | ProjectDiaryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectDiary update
   */
  export type ProjectDiaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectDiary.
     */
    data: XOR<ProjectDiaryUpdateInput, ProjectDiaryUncheckedUpdateInput>
    /**
     * Choose, which ProjectDiary to update.
     */
    where: ProjectDiaryWhereUniqueInput
  }

  /**
   * ProjectDiary updateMany
   */
  export type ProjectDiaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectDiaries.
     */
    data: XOR<ProjectDiaryUpdateManyMutationInput, ProjectDiaryUncheckedUpdateManyInput>
    /**
     * Filter which ProjectDiaries to update
     */
    where?: ProjectDiaryWhereInput
  }

  /**
   * ProjectDiary upsert
   */
  export type ProjectDiaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectDiary to update in case it exists.
     */
    where: ProjectDiaryWhereUniqueInput
    /**
     * In case the ProjectDiary found by the `where` argument doesn't exist, create a new ProjectDiary with this data.
     */
    create: XOR<ProjectDiaryCreateInput, ProjectDiaryUncheckedCreateInput>
    /**
     * In case the ProjectDiary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectDiaryUpdateInput, ProjectDiaryUncheckedUpdateInput>
  }

  /**
   * ProjectDiary delete
   */
  export type ProjectDiaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
    /**
     * Filter which ProjectDiary to delete.
     */
    where: ProjectDiaryWhereUniqueInput
  }

  /**
   * ProjectDiary deleteMany
   */
  export type ProjectDiaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectDiaries to delete
     */
    where?: ProjectDiaryWhereInput
  }

  /**
   * ProjectDiary without action
   */
  export type ProjectDiaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectDiary
     */
    select?: ProjectDiarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectDiaryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    password: 'password',
    role: 'role',
    created_at: 'created_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DiaryScalarFieldEnum: {
    id: 'id',
    title: 'title',
    activity_description: 'activity_description',
    project_event: 'project_event',
    category: 'category',
    date: 'date',
    created_at: 'created_at',
    updated_at: 'updated_at',
    created_by: 'created_by',
    schedule_id: 'schedule_id'
  };

  export type DiaryScalarFieldEnum = (typeof DiaryScalarFieldEnum)[keyof typeof DiaryScalarFieldEnum]


  export const ActivityLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    diary_title: 'diary_title',
    category: 'category',
    timestamp: 'timestamp',
    user_id: 'user_id'
  };

  export type ActivityLogScalarFieldEnum = (typeof ActivityLogScalarFieldEnum)[keyof typeof ActivityLogScalarFieldEnum]


  export const HouseRuleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    created_by: 'created_by',
    created_at: 'created_at'
  };

  export type HouseRuleScalarFieldEnum = (typeof HouseRuleScalarFieldEnum)[keyof typeof HouseRuleScalarFieldEnum]


  export const DutyScheduleScalarFieldEnum: {
    id: 'id',
    day: 'day',
    member_name: 'member_name',
    created_by: 'created_by'
  };

  export type DutyScheduleScalarFieldEnum = (typeof DutyScheduleScalarFieldEnum)[keyof typeof DutyScheduleScalarFieldEnum]


  export const ScheduleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    category: 'category',
    start_date: 'start_date',
    end_date: 'end_date',
    created_by: 'created_by',
    created_at: 'created_at'
  };

  export type ScheduleScalarFieldEnum = (typeof ScheduleScalarFieldEnum)[keyof typeof ScheduleScalarFieldEnum]


  export const ScheduleCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    color: 'color',
    created_at: 'created_at'
  };

  export type ScheduleCategoryScalarFieldEnum = (typeof ScheduleCategoryScalarFieldEnum)[keyof typeof ScheduleCategoryScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    project_name: 'project_name',
    description: 'description',
    start_date: 'start_date',
    end_date: 'end_date',
    project_status: 'project_status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ProjectMemberScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    user_id: 'user_id',
    role: 'role',
    created_at: 'created_at'
  };

  export type ProjectMemberScalarFieldEnum = (typeof ProjectMemberScalarFieldEnum)[keyof typeof ProjectMemberScalarFieldEnum]


  export const ProjectDiaryScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    diary_title: 'diary_title',
    activity_description: 'activity_description',
    work_progress: 'work_progress',
    created_by: 'created_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProjectDiaryScalarFieldEnum = (typeof ProjectDiaryScalarFieldEnum)[keyof typeof ProjectDiaryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    diaries?: DiaryListRelationFilter
    activities?: ActivityLogListRelationFilter
    houseRules?: HouseRuleListRelationFilter
    dutySchedules?: DutyScheduleListRelationFilter
    schedules?: ScheduleListRelationFilter
    projectMembers?: ProjectMemberListRelationFilter
    projectDiaries?: ProjectDiaryListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    diaries?: DiaryOrderByRelationAggregateInput
    activities?: ActivityLogOrderByRelationAggregateInput
    houseRules?: HouseRuleOrderByRelationAggregateInput
    dutySchedules?: DutyScheduleOrderByRelationAggregateInput
    schedules?: ScheduleOrderByRelationAggregateInput
    projectMembers?: ProjectMemberOrderByRelationAggregateInput
    projectDiaries?: ProjectDiaryOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    diaries?: DiaryListRelationFilter
    activities?: ActivityLogListRelationFilter
    houseRules?: HouseRuleListRelationFilter
    dutySchedules?: DutyScheduleListRelationFilter
    schedules?: ScheduleListRelationFilter
    projectMembers?: ProjectMemberListRelationFilter
    projectDiaries?: ProjectDiaryListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DiaryWhereInput = {
    AND?: DiaryWhereInput | DiaryWhereInput[]
    OR?: DiaryWhereInput[]
    NOT?: DiaryWhereInput | DiaryWhereInput[]
    id?: StringFilter<"Diary"> | string
    title?: StringFilter<"Diary"> | string
    activity_description?: StringFilter<"Diary"> | string
    project_event?: StringFilter<"Diary"> | string
    category?: StringFilter<"Diary"> | string
    date?: StringFilter<"Diary"> | string
    created_at?: DateTimeFilter<"Diary"> | Date | string
    updated_at?: DateTimeFilter<"Diary"> | Date | string
    created_by?: StringFilter<"Diary"> | string
    schedule_id?: StringNullableFilter<"Diary"> | string | null
    creator?: XOR<UserRelationFilter, UserWhereInput>
    schedule?: XOR<ScheduleNullableRelationFilter, ScheduleWhereInput> | null
  }

  export type DiaryOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    activity_description?: SortOrder
    project_event?: SortOrder
    category?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    schedule_id?: SortOrderInput | SortOrder
    creator?: UserOrderByWithRelationInput
    schedule?: ScheduleOrderByWithRelationInput
  }

  export type DiaryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DiaryWhereInput | DiaryWhereInput[]
    OR?: DiaryWhereInput[]
    NOT?: DiaryWhereInput | DiaryWhereInput[]
    title?: StringFilter<"Diary"> | string
    activity_description?: StringFilter<"Diary"> | string
    project_event?: StringFilter<"Diary"> | string
    category?: StringFilter<"Diary"> | string
    date?: StringFilter<"Diary"> | string
    created_at?: DateTimeFilter<"Diary"> | Date | string
    updated_at?: DateTimeFilter<"Diary"> | Date | string
    created_by?: StringFilter<"Diary"> | string
    schedule_id?: StringNullableFilter<"Diary"> | string | null
    creator?: XOR<UserRelationFilter, UserWhereInput>
    schedule?: XOR<ScheduleNullableRelationFilter, ScheduleWhereInput> | null
  }, "id">

  export type DiaryOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    activity_description?: SortOrder
    project_event?: SortOrder
    category?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    schedule_id?: SortOrderInput | SortOrder
    _count?: DiaryCountOrderByAggregateInput
    _max?: DiaryMaxOrderByAggregateInput
    _min?: DiaryMinOrderByAggregateInput
  }

  export type DiaryScalarWhereWithAggregatesInput = {
    AND?: DiaryScalarWhereWithAggregatesInput | DiaryScalarWhereWithAggregatesInput[]
    OR?: DiaryScalarWhereWithAggregatesInput[]
    NOT?: DiaryScalarWhereWithAggregatesInput | DiaryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Diary"> | string
    title?: StringWithAggregatesFilter<"Diary"> | string
    activity_description?: StringWithAggregatesFilter<"Diary"> | string
    project_event?: StringWithAggregatesFilter<"Diary"> | string
    category?: StringWithAggregatesFilter<"Diary"> | string
    date?: StringWithAggregatesFilter<"Diary"> | string
    created_at?: DateTimeWithAggregatesFilter<"Diary"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Diary"> | Date | string
    created_by?: StringWithAggregatesFilter<"Diary"> | string
    schedule_id?: StringNullableWithAggregatesFilter<"Diary"> | string | null
  }

  export type ActivityLogWhereInput = {
    AND?: ActivityLogWhereInput | ActivityLogWhereInput[]
    OR?: ActivityLogWhereInput[]
    NOT?: ActivityLogWhereInput | ActivityLogWhereInput[]
    id?: StringFilter<"ActivityLog"> | string
    action?: StringFilter<"ActivityLog"> | string
    diary_title?: StringNullableFilter<"ActivityLog"> | string | null
    category?: StringNullableFilter<"ActivityLog"> | string | null
    timestamp?: DateTimeFilter<"ActivityLog"> | Date | string
    user_id?: StringFilter<"ActivityLog"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ActivityLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    diary_title?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    user_id?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActivityLogWhereInput | ActivityLogWhereInput[]
    OR?: ActivityLogWhereInput[]
    NOT?: ActivityLogWhereInput | ActivityLogWhereInput[]
    action?: StringFilter<"ActivityLog"> | string
    diary_title?: StringNullableFilter<"ActivityLog"> | string | null
    category?: StringNullableFilter<"ActivityLog"> | string | null
    timestamp?: DateTimeFilter<"ActivityLog"> | Date | string
    user_id?: StringFilter<"ActivityLog"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ActivityLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    diary_title?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    user_id?: SortOrder
    _count?: ActivityLogCountOrderByAggregateInput
    _max?: ActivityLogMaxOrderByAggregateInput
    _min?: ActivityLogMinOrderByAggregateInput
  }

  export type ActivityLogScalarWhereWithAggregatesInput = {
    AND?: ActivityLogScalarWhereWithAggregatesInput | ActivityLogScalarWhereWithAggregatesInput[]
    OR?: ActivityLogScalarWhereWithAggregatesInput[]
    NOT?: ActivityLogScalarWhereWithAggregatesInput | ActivityLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActivityLog"> | string
    action?: StringWithAggregatesFilter<"ActivityLog"> | string
    diary_title?: StringNullableWithAggregatesFilter<"ActivityLog"> | string | null
    category?: StringNullableWithAggregatesFilter<"ActivityLog"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"ActivityLog"> | Date | string
    user_id?: StringWithAggregatesFilter<"ActivityLog"> | string
  }

  export type HouseRuleWhereInput = {
    AND?: HouseRuleWhereInput | HouseRuleWhereInput[]
    OR?: HouseRuleWhereInput[]
    NOT?: HouseRuleWhereInput | HouseRuleWhereInput[]
    id?: StringFilter<"HouseRule"> | string
    title?: StringFilter<"HouseRule"> | string
    content?: StringFilter<"HouseRule"> | string
    created_by?: StringFilter<"HouseRule"> | string
    created_at?: DateTimeFilter<"HouseRule"> | Date | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type HouseRuleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    creator?: UserOrderByWithRelationInput
  }

  export type HouseRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HouseRuleWhereInput | HouseRuleWhereInput[]
    OR?: HouseRuleWhereInput[]
    NOT?: HouseRuleWhereInput | HouseRuleWhereInput[]
    title?: StringFilter<"HouseRule"> | string
    content?: StringFilter<"HouseRule"> | string
    created_by?: StringFilter<"HouseRule"> | string
    created_at?: DateTimeFilter<"HouseRule"> | Date | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type HouseRuleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    _count?: HouseRuleCountOrderByAggregateInput
    _max?: HouseRuleMaxOrderByAggregateInput
    _min?: HouseRuleMinOrderByAggregateInput
  }

  export type HouseRuleScalarWhereWithAggregatesInput = {
    AND?: HouseRuleScalarWhereWithAggregatesInput | HouseRuleScalarWhereWithAggregatesInput[]
    OR?: HouseRuleScalarWhereWithAggregatesInput[]
    NOT?: HouseRuleScalarWhereWithAggregatesInput | HouseRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HouseRule"> | string
    title?: StringWithAggregatesFilter<"HouseRule"> | string
    content?: StringWithAggregatesFilter<"HouseRule"> | string
    created_by?: StringWithAggregatesFilter<"HouseRule"> | string
    created_at?: DateTimeWithAggregatesFilter<"HouseRule"> | Date | string
  }

  export type DutyScheduleWhereInput = {
    AND?: DutyScheduleWhereInput | DutyScheduleWhereInput[]
    OR?: DutyScheduleWhereInput[]
    NOT?: DutyScheduleWhereInput | DutyScheduleWhereInput[]
    id?: StringFilter<"DutySchedule"> | string
    day?: StringFilter<"DutySchedule"> | string
    member_name?: StringFilter<"DutySchedule"> | string
    created_by?: StringFilter<"DutySchedule"> | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type DutyScheduleOrderByWithRelationInput = {
    id?: SortOrder
    day?: SortOrder
    member_name?: SortOrder
    created_by?: SortOrder
    creator?: UserOrderByWithRelationInput
  }

  export type DutyScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DutyScheduleWhereInput | DutyScheduleWhereInput[]
    OR?: DutyScheduleWhereInput[]
    NOT?: DutyScheduleWhereInput | DutyScheduleWhereInput[]
    day?: StringFilter<"DutySchedule"> | string
    member_name?: StringFilter<"DutySchedule"> | string
    created_by?: StringFilter<"DutySchedule"> | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type DutyScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    day?: SortOrder
    member_name?: SortOrder
    created_by?: SortOrder
    _count?: DutyScheduleCountOrderByAggregateInput
    _max?: DutyScheduleMaxOrderByAggregateInput
    _min?: DutyScheduleMinOrderByAggregateInput
  }

  export type DutyScheduleScalarWhereWithAggregatesInput = {
    AND?: DutyScheduleScalarWhereWithAggregatesInput | DutyScheduleScalarWhereWithAggregatesInput[]
    OR?: DutyScheduleScalarWhereWithAggregatesInput[]
    NOT?: DutyScheduleScalarWhereWithAggregatesInput | DutyScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DutySchedule"> | string
    day?: StringWithAggregatesFilter<"DutySchedule"> | string
    member_name?: StringWithAggregatesFilter<"DutySchedule"> | string
    created_by?: StringWithAggregatesFilter<"DutySchedule"> | string
  }

  export type ScheduleWhereInput = {
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    id?: StringFilter<"Schedule"> | string
    title?: StringFilter<"Schedule"> | string
    description?: StringNullableFilter<"Schedule"> | string | null
    category?: StringFilter<"Schedule"> | string
    start_date?: StringFilter<"Schedule"> | string
    end_date?: StringFilter<"Schedule"> | string
    created_by?: StringFilter<"Schedule"> | string
    created_at?: DateTimeFilter<"Schedule"> | Date | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
    diaries?: DiaryListRelationFilter
  }

  export type ScheduleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    creator?: UserOrderByWithRelationInput
    diaries?: DiaryOrderByRelationAggregateInput
  }

  export type ScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    title?: StringFilter<"Schedule"> | string
    description?: StringNullableFilter<"Schedule"> | string | null
    category?: StringFilter<"Schedule"> | string
    start_date?: StringFilter<"Schedule"> | string
    end_date?: StringFilter<"Schedule"> | string
    created_by?: StringFilter<"Schedule"> | string
    created_at?: DateTimeFilter<"Schedule"> | Date | string
    creator?: XOR<UserRelationFilter, UserWhereInput>
    diaries?: DiaryListRelationFilter
  }, "id">

  export type ScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    _count?: ScheduleCountOrderByAggregateInput
    _max?: ScheduleMaxOrderByAggregateInput
    _min?: ScheduleMinOrderByAggregateInput
  }

  export type ScheduleScalarWhereWithAggregatesInput = {
    AND?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    OR?: ScheduleScalarWhereWithAggregatesInput[]
    NOT?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Schedule"> | string
    title?: StringWithAggregatesFilter<"Schedule"> | string
    description?: StringNullableWithAggregatesFilter<"Schedule"> | string | null
    category?: StringWithAggregatesFilter<"Schedule"> | string
    start_date?: StringWithAggregatesFilter<"Schedule"> | string
    end_date?: StringWithAggregatesFilter<"Schedule"> | string
    created_by?: StringWithAggregatesFilter<"Schedule"> | string
    created_at?: DateTimeWithAggregatesFilter<"Schedule"> | Date | string
  }

  export type ScheduleCategoryWhereInput = {
    AND?: ScheduleCategoryWhereInput | ScheduleCategoryWhereInput[]
    OR?: ScheduleCategoryWhereInput[]
    NOT?: ScheduleCategoryWhereInput | ScheduleCategoryWhereInput[]
    id?: StringFilter<"ScheduleCategory"> | string
    name?: StringFilter<"ScheduleCategory"> | string
    color?: StringFilter<"ScheduleCategory"> | string
    created_at?: DateTimeFilter<"ScheduleCategory"> | Date | string
  }

  export type ScheduleCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    created_at?: SortOrder
  }

  export type ScheduleCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ScheduleCategoryWhereInput | ScheduleCategoryWhereInput[]
    OR?: ScheduleCategoryWhereInput[]
    NOT?: ScheduleCategoryWhereInput | ScheduleCategoryWhereInput[]
    color?: StringFilter<"ScheduleCategory"> | string
    created_at?: DateTimeFilter<"ScheduleCategory"> | Date | string
  }, "id" | "name">

  export type ScheduleCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    created_at?: SortOrder
    _count?: ScheduleCategoryCountOrderByAggregateInput
    _max?: ScheduleCategoryMaxOrderByAggregateInput
    _min?: ScheduleCategoryMinOrderByAggregateInput
  }

  export type ScheduleCategoryScalarWhereWithAggregatesInput = {
    AND?: ScheduleCategoryScalarWhereWithAggregatesInput | ScheduleCategoryScalarWhereWithAggregatesInput[]
    OR?: ScheduleCategoryScalarWhereWithAggregatesInput[]
    NOT?: ScheduleCategoryScalarWhereWithAggregatesInput | ScheduleCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScheduleCategory"> | string
    name?: StringWithAggregatesFilter<"ScheduleCategory"> | string
    color?: StringWithAggregatesFilter<"ScheduleCategory"> | string
    created_at?: DateTimeWithAggregatesFilter<"ScheduleCategory"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    project_name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    start_date?: StringFilter<"Project"> | string
    end_date?: StringFilter<"Project"> | string
    project_status?: StringFilter<"Project"> | string
    created_at?: DateTimeFilter<"Project"> | Date | string
    updated_at?: DateTimeFilter<"Project"> | Date | string
    members?: ProjectMemberListRelationFilter
    diaries?: ProjectDiaryListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    project_name?: SortOrder
    description?: SortOrderInput | SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    project_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    members?: ProjectMemberOrderByRelationAggregateInput
    diaries?: ProjectDiaryOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    project_name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    start_date?: StringFilter<"Project"> | string
    end_date?: StringFilter<"Project"> | string
    project_status?: StringFilter<"Project"> | string
    created_at?: DateTimeFilter<"Project"> | Date | string
    updated_at?: DateTimeFilter<"Project"> | Date | string
    members?: ProjectMemberListRelationFilter
    diaries?: ProjectDiaryListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    project_name?: SortOrder
    description?: SortOrderInput | SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    project_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    project_name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    start_date?: StringWithAggregatesFilter<"Project"> | string
    end_date?: StringWithAggregatesFilter<"Project"> | string
    project_status?: StringWithAggregatesFilter<"Project"> | string
    created_at?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ProjectMemberWhereInput = {
    AND?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    OR?: ProjectMemberWhereInput[]
    NOT?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    id?: StringFilter<"ProjectMember"> | string
    project_id?: StringFilter<"ProjectMember"> | string
    user_id?: StringFilter<"ProjectMember"> | string
    role?: StringFilter<"ProjectMember"> | string
    created_at?: DateTimeFilter<"ProjectMember"> | Date | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ProjectMemberOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    project?: ProjectOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ProjectMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    project_id_user_id?: ProjectMemberProject_idUser_idCompoundUniqueInput
    AND?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    OR?: ProjectMemberWhereInput[]
    NOT?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    project_id?: StringFilter<"ProjectMember"> | string
    user_id?: StringFilter<"ProjectMember"> | string
    role?: StringFilter<"ProjectMember"> | string
    created_at?: DateTimeFilter<"ProjectMember"> | Date | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "project_id_user_id">

  export type ProjectMemberOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    _count?: ProjectMemberCountOrderByAggregateInput
    _max?: ProjectMemberMaxOrderByAggregateInput
    _min?: ProjectMemberMinOrderByAggregateInput
  }

  export type ProjectMemberScalarWhereWithAggregatesInput = {
    AND?: ProjectMemberScalarWhereWithAggregatesInput | ProjectMemberScalarWhereWithAggregatesInput[]
    OR?: ProjectMemberScalarWhereWithAggregatesInput[]
    NOT?: ProjectMemberScalarWhereWithAggregatesInput | ProjectMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectMember"> | string
    project_id?: StringWithAggregatesFilter<"ProjectMember"> | string
    user_id?: StringWithAggregatesFilter<"ProjectMember"> | string
    role?: StringWithAggregatesFilter<"ProjectMember"> | string
    created_at?: DateTimeWithAggregatesFilter<"ProjectMember"> | Date | string
  }

  export type ProjectDiaryWhereInput = {
    AND?: ProjectDiaryWhereInput | ProjectDiaryWhereInput[]
    OR?: ProjectDiaryWhereInput[]
    NOT?: ProjectDiaryWhereInput | ProjectDiaryWhereInput[]
    id?: StringFilter<"ProjectDiary"> | string
    project_id?: StringFilter<"ProjectDiary"> | string
    diary_title?: StringFilter<"ProjectDiary"> | string
    activity_description?: StringFilter<"ProjectDiary"> | string
    work_progress?: IntFilter<"ProjectDiary"> | number
    created_by?: StringFilter<"ProjectDiary"> | string
    created_at?: DateTimeFilter<"ProjectDiary"> | Date | string
    updated_at?: DateTimeFilter<"ProjectDiary"> | Date | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ProjectDiaryOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    diary_title?: SortOrder
    activity_description?: SortOrder
    work_progress?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    project?: ProjectOrderByWithRelationInput
    creator?: UserOrderByWithRelationInput
  }

  export type ProjectDiaryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectDiaryWhereInput | ProjectDiaryWhereInput[]
    OR?: ProjectDiaryWhereInput[]
    NOT?: ProjectDiaryWhereInput | ProjectDiaryWhereInput[]
    project_id?: StringFilter<"ProjectDiary"> | string
    diary_title?: StringFilter<"ProjectDiary"> | string
    activity_description?: StringFilter<"ProjectDiary"> | string
    work_progress?: IntFilter<"ProjectDiary"> | number
    created_by?: StringFilter<"ProjectDiary"> | string
    created_at?: DateTimeFilter<"ProjectDiary"> | Date | string
    updated_at?: DateTimeFilter<"ProjectDiary"> | Date | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ProjectDiaryOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    diary_title?: SortOrder
    activity_description?: SortOrder
    work_progress?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ProjectDiaryCountOrderByAggregateInput
    _avg?: ProjectDiaryAvgOrderByAggregateInput
    _max?: ProjectDiaryMaxOrderByAggregateInput
    _min?: ProjectDiaryMinOrderByAggregateInput
    _sum?: ProjectDiarySumOrderByAggregateInput
  }

  export type ProjectDiaryScalarWhereWithAggregatesInput = {
    AND?: ProjectDiaryScalarWhereWithAggregatesInput | ProjectDiaryScalarWhereWithAggregatesInput[]
    OR?: ProjectDiaryScalarWhereWithAggregatesInput[]
    NOT?: ProjectDiaryScalarWhereWithAggregatesInput | ProjectDiaryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectDiary"> | string
    project_id?: StringWithAggregatesFilter<"ProjectDiary"> | string
    diary_title?: StringWithAggregatesFilter<"ProjectDiary"> | string
    activity_description?: StringWithAggregatesFilter<"ProjectDiary"> | string
    work_progress?: IntWithAggregatesFilter<"ProjectDiary"> | number
    created_by?: StringWithAggregatesFilter<"ProjectDiary"> | string
    created_at?: DateTimeWithAggregatesFilter<"ProjectDiary"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ProjectDiary"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryCreateInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    creator: UserCreateNestedOneWithoutDiariesInput
    schedule?: ScheduleCreateNestedOneWithoutDiariesInput
  }

  export type DiaryUncheckedCreateInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
    schedule_id?: string | null
  }

  export type DiaryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutDiariesNestedInput
    schedule?: ScheduleUpdateOneWithoutDiariesNestedInput
  }

  export type DiaryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
    schedule_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DiaryCreateManyInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
    schedule_id?: string | null
  }

  export type DiaryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
    schedule_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActivityLogCreateInput = {
    id?: string
    action: string
    diary_title?: string | null
    category?: string | null
    timestamp?: Date | string
    user: UserCreateNestedOneWithoutActivitiesInput
  }

  export type ActivityLogUncheckedCreateInput = {
    id?: string
    action: string
    diary_title?: string | null
    category?: string | null
    timestamp?: Date | string
    user_id: string
  }

  export type ActivityLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type ActivityLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ActivityLogCreateManyInput = {
    id?: string
    action: string
    diary_title?: string | null
    category?: string | null
    timestamp?: Date | string
    user_id: string
  }

  export type ActivityLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type HouseRuleCreateInput = {
    id?: string
    title: string
    content: string
    created_at?: Date | string
    creator: UserCreateNestedOneWithoutHouseRulesInput
  }

  export type HouseRuleUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    created_by: string
    created_at?: Date | string
  }

  export type HouseRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutHouseRulesNestedInput
  }

  export type HouseRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HouseRuleCreateManyInput = {
    id?: string
    title: string
    content: string
    created_by: string
    created_at?: Date | string
  }

  export type HouseRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HouseRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DutyScheduleCreateInput = {
    id?: string
    day: string
    member_name: string
    creator: UserCreateNestedOneWithoutDutySchedulesInput
  }

  export type DutyScheduleUncheckedCreateInput = {
    id?: string
    day: string
    member_name: string
    created_by: string
  }

  export type DutyScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
    creator?: UserUpdateOneRequiredWithoutDutySchedulesNestedInput
  }

  export type DutyScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
  }

  export type DutyScheduleCreateManyInput = {
    id?: string
    day: string
    member_name: string
    created_by: string
  }

  export type DutyScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
  }

  export type DutyScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleCreateInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_at?: Date | string
    creator: UserCreateNestedOneWithoutSchedulesInput
    diaries?: DiaryCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_by: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutSchedulesNestedInput
    diaries?: DiaryUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_by: string
    created_at?: Date | string
  }

  export type ScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleCategoryCreateInput = {
    id?: string
    name: string
    color?: string
    created_at?: Date | string
  }

  export type ScheduleCategoryUncheckedCreateInput = {
    id?: string
    name: string
    color?: string
    created_at?: Date | string
  }

  export type ScheduleCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleCategoryCreateManyInput = {
    id?: string
    name: string
    color?: string
    created_at?: Date | string
  }

  export type ScheduleCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    diaries?: ProjectDiaryCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    diaries?: ProjectDiaryUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    diaries?: ProjectDiaryUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    diaries?: ProjectDiaryUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberCreateInput = {
    id?: string
    role: string
    created_at?: Date | string
    project: ProjectCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutProjectMembersInput
  }

  export type ProjectMemberUncheckedCreateInput = {
    id?: string
    project_id: string
    user_id: string
    role: string
    created_at?: Date | string
  }

  export type ProjectMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutProjectMembersNestedInput
  }

  export type ProjectMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberCreateManyInput = {
    id?: string
    project_id: string
    user_id: string
    role: string
    created_at?: Date | string
  }

  export type ProjectMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryCreateInput = {
    id?: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_at?: Date | string
    updated_at?: Date | string
    project: ProjectCreateNestedOneWithoutDiariesInput
    creator: UserCreateNestedOneWithoutProjectDiariesInput
  }

  export type ProjectDiaryUncheckedCreateInput = {
    id?: string
    project_id: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_by: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectDiaryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDiariesNestedInput
    creator?: UserUpdateOneRequiredWithoutProjectDiariesNestedInput
  }

  export type ProjectDiaryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryCreateManyInput = {
    id?: string
    project_id: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_by: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectDiaryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DiaryListRelationFilter = {
    every?: DiaryWhereInput
    some?: DiaryWhereInput
    none?: DiaryWhereInput
  }

  export type ActivityLogListRelationFilter = {
    every?: ActivityLogWhereInput
    some?: ActivityLogWhereInput
    none?: ActivityLogWhereInput
  }

  export type HouseRuleListRelationFilter = {
    every?: HouseRuleWhereInput
    some?: HouseRuleWhereInput
    none?: HouseRuleWhereInput
  }

  export type DutyScheduleListRelationFilter = {
    every?: DutyScheduleWhereInput
    some?: DutyScheduleWhereInput
    none?: DutyScheduleWhereInput
  }

  export type ScheduleListRelationFilter = {
    every?: ScheduleWhereInput
    some?: ScheduleWhereInput
    none?: ScheduleWhereInput
  }

  export type ProjectMemberListRelationFilter = {
    every?: ProjectMemberWhereInput
    some?: ProjectMemberWhereInput
    none?: ProjectMemberWhereInput
  }

  export type ProjectDiaryListRelationFilter = {
    every?: ProjectDiaryWhereInput
    some?: ProjectDiaryWhereInput
    none?: ProjectDiaryWhereInput
  }

  export type DiaryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActivityLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HouseRuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DutyScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectDiaryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ScheduleNullableRelationFilter = {
    is?: ScheduleWhereInput | null
    isNot?: ScheduleWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DiaryCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    activity_description?: SortOrder
    project_event?: SortOrder
    category?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    schedule_id?: SortOrder
  }

  export type DiaryMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    activity_description?: SortOrder
    project_event?: SortOrder
    category?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    schedule_id?: SortOrder
  }

  export type DiaryMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    activity_description?: SortOrder
    project_event?: SortOrder
    category?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    schedule_id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ActivityLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    diary_title?: SortOrder
    category?: SortOrder
    timestamp?: SortOrder
    user_id?: SortOrder
  }

  export type ActivityLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    diary_title?: SortOrder
    category?: SortOrder
    timestamp?: SortOrder
    user_id?: SortOrder
  }

  export type ActivityLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    diary_title?: SortOrder
    category?: SortOrder
    timestamp?: SortOrder
    user_id?: SortOrder
  }

  export type HouseRuleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type HouseRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type HouseRuleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type DutyScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    day?: SortOrder
    member_name?: SortOrder
    created_by?: SortOrder
  }

  export type DutyScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    day?: SortOrder
    member_name?: SortOrder
    created_by?: SortOrder
  }

  export type DutyScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    day?: SortOrder
    member_name?: SortOrder
    created_by?: SortOrder
  }

  export type ScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type ScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type ScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type ScheduleCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    created_at?: SortOrder
  }

  export type ScheduleCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    created_at?: SortOrder
  }

  export type ScheduleCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    created_at?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    project_name?: SortOrder
    description?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    project_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    project_name?: SortOrder
    description?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    project_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    project_name?: SortOrder
    description?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    project_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectMemberProject_idUser_idCompoundUniqueInput = {
    project_id: string
    user_id: string
  }

  export type ProjectMemberCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type ProjectMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type ProjectMemberMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProjectDiaryCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    diary_title?: SortOrder
    activity_description?: SortOrder
    work_progress?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectDiaryAvgOrderByAggregateInput = {
    work_progress?: SortOrder
  }

  export type ProjectDiaryMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    diary_title?: SortOrder
    activity_description?: SortOrder
    work_progress?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectDiaryMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    diary_title?: SortOrder
    activity_description?: SortOrder
    work_progress?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectDiarySumOrderByAggregateInput = {
    work_progress?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DiaryCreateNestedManyWithoutCreatorInput = {
    create?: XOR<DiaryCreateWithoutCreatorInput, DiaryUncheckedCreateWithoutCreatorInput> | DiaryCreateWithoutCreatorInput[] | DiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutCreatorInput | DiaryCreateOrConnectWithoutCreatorInput[]
    createMany?: DiaryCreateManyCreatorInputEnvelope
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
  }

  export type ActivityLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
  }

  export type HouseRuleCreateNestedManyWithoutCreatorInput = {
    create?: XOR<HouseRuleCreateWithoutCreatorInput, HouseRuleUncheckedCreateWithoutCreatorInput> | HouseRuleCreateWithoutCreatorInput[] | HouseRuleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: HouseRuleCreateOrConnectWithoutCreatorInput | HouseRuleCreateOrConnectWithoutCreatorInput[]
    createMany?: HouseRuleCreateManyCreatorInputEnvelope
    connect?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
  }

  export type DutyScheduleCreateNestedManyWithoutCreatorInput = {
    create?: XOR<DutyScheduleCreateWithoutCreatorInput, DutyScheduleUncheckedCreateWithoutCreatorInput> | DutyScheduleCreateWithoutCreatorInput[] | DutyScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DutyScheduleCreateOrConnectWithoutCreatorInput | DutyScheduleCreateOrConnectWithoutCreatorInput[]
    createMany?: DutyScheduleCreateManyCreatorInputEnvelope
    connect?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
  }

  export type ScheduleCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ScheduleCreateWithoutCreatorInput, ScheduleUncheckedCreateWithoutCreatorInput> | ScheduleCreateWithoutCreatorInput[] | ScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutCreatorInput | ScheduleCreateOrConnectWithoutCreatorInput[]
    createMany?: ScheduleCreateManyCreatorInputEnvelope
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
  }

  export type ProjectMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type ProjectDiaryCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ProjectDiaryCreateWithoutCreatorInput, ProjectDiaryUncheckedCreateWithoutCreatorInput> | ProjectDiaryCreateWithoutCreatorInput[] | ProjectDiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutCreatorInput | ProjectDiaryCreateOrConnectWithoutCreatorInput[]
    createMany?: ProjectDiaryCreateManyCreatorInputEnvelope
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
  }

  export type DiaryUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<DiaryCreateWithoutCreatorInput, DiaryUncheckedCreateWithoutCreatorInput> | DiaryCreateWithoutCreatorInput[] | DiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutCreatorInput | DiaryCreateOrConnectWithoutCreatorInput[]
    createMany?: DiaryCreateManyCreatorInputEnvelope
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
  }

  export type ActivityLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
  }

  export type HouseRuleUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<HouseRuleCreateWithoutCreatorInput, HouseRuleUncheckedCreateWithoutCreatorInput> | HouseRuleCreateWithoutCreatorInput[] | HouseRuleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: HouseRuleCreateOrConnectWithoutCreatorInput | HouseRuleCreateOrConnectWithoutCreatorInput[]
    createMany?: HouseRuleCreateManyCreatorInputEnvelope
    connect?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
  }

  export type DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<DutyScheduleCreateWithoutCreatorInput, DutyScheduleUncheckedCreateWithoutCreatorInput> | DutyScheduleCreateWithoutCreatorInput[] | DutyScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DutyScheduleCreateOrConnectWithoutCreatorInput | DutyScheduleCreateOrConnectWithoutCreatorInput[]
    createMany?: DutyScheduleCreateManyCreatorInputEnvelope
    connect?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
  }

  export type ScheduleUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ScheduleCreateWithoutCreatorInput, ScheduleUncheckedCreateWithoutCreatorInput> | ScheduleCreateWithoutCreatorInput[] | ScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutCreatorInput | ScheduleCreateOrConnectWithoutCreatorInput[]
    createMany?: ScheduleCreateManyCreatorInputEnvelope
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
  }

  export type ProjectMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ProjectDiaryCreateWithoutCreatorInput, ProjectDiaryUncheckedCreateWithoutCreatorInput> | ProjectDiaryCreateWithoutCreatorInput[] | ProjectDiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutCreatorInput | ProjectDiaryCreateOrConnectWithoutCreatorInput[]
    createMany?: ProjectDiaryCreateManyCreatorInputEnvelope
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DiaryUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<DiaryCreateWithoutCreatorInput, DiaryUncheckedCreateWithoutCreatorInput> | DiaryCreateWithoutCreatorInput[] | DiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutCreatorInput | DiaryCreateOrConnectWithoutCreatorInput[]
    upsert?: DiaryUpsertWithWhereUniqueWithoutCreatorInput | DiaryUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: DiaryCreateManyCreatorInputEnvelope
    set?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    disconnect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    delete?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    update?: DiaryUpdateWithWhereUniqueWithoutCreatorInput | DiaryUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: DiaryUpdateManyWithWhereWithoutCreatorInput | DiaryUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: DiaryScalarWhereInput | DiaryScalarWhereInput[]
  }

  export type ActivityLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    upsert?: ActivityLogUpsertWithWhereUniqueWithoutUserInput | ActivityLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    set?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    disconnect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    delete?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    update?: ActivityLogUpdateWithWhereUniqueWithoutUserInput | ActivityLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActivityLogUpdateManyWithWhereWithoutUserInput | ActivityLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
  }

  export type HouseRuleUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<HouseRuleCreateWithoutCreatorInput, HouseRuleUncheckedCreateWithoutCreatorInput> | HouseRuleCreateWithoutCreatorInput[] | HouseRuleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: HouseRuleCreateOrConnectWithoutCreatorInput | HouseRuleCreateOrConnectWithoutCreatorInput[]
    upsert?: HouseRuleUpsertWithWhereUniqueWithoutCreatorInput | HouseRuleUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: HouseRuleCreateManyCreatorInputEnvelope
    set?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    disconnect?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    delete?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    connect?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    update?: HouseRuleUpdateWithWhereUniqueWithoutCreatorInput | HouseRuleUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: HouseRuleUpdateManyWithWhereWithoutCreatorInput | HouseRuleUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: HouseRuleScalarWhereInput | HouseRuleScalarWhereInput[]
  }

  export type DutyScheduleUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<DutyScheduleCreateWithoutCreatorInput, DutyScheduleUncheckedCreateWithoutCreatorInput> | DutyScheduleCreateWithoutCreatorInput[] | DutyScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DutyScheduleCreateOrConnectWithoutCreatorInput | DutyScheduleCreateOrConnectWithoutCreatorInput[]
    upsert?: DutyScheduleUpsertWithWhereUniqueWithoutCreatorInput | DutyScheduleUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: DutyScheduleCreateManyCreatorInputEnvelope
    set?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    disconnect?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    delete?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    connect?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    update?: DutyScheduleUpdateWithWhereUniqueWithoutCreatorInput | DutyScheduleUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: DutyScheduleUpdateManyWithWhereWithoutCreatorInput | DutyScheduleUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: DutyScheduleScalarWhereInput | DutyScheduleScalarWhereInput[]
  }

  export type ScheduleUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ScheduleCreateWithoutCreatorInput, ScheduleUncheckedCreateWithoutCreatorInput> | ScheduleCreateWithoutCreatorInput[] | ScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutCreatorInput | ScheduleCreateOrConnectWithoutCreatorInput[]
    upsert?: ScheduleUpsertWithWhereUniqueWithoutCreatorInput | ScheduleUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ScheduleCreateManyCreatorInputEnvelope
    set?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    disconnect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    delete?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    update?: ScheduleUpdateWithWhereUniqueWithoutCreatorInput | ScheduleUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ScheduleUpdateManyWithWhereWithoutCreatorInput | ScheduleUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
  }

  export type ProjectMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutUserInput | ProjectMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutUserInput | ProjectMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutUserInput | ProjectMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type ProjectDiaryUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ProjectDiaryCreateWithoutCreatorInput, ProjectDiaryUncheckedCreateWithoutCreatorInput> | ProjectDiaryCreateWithoutCreatorInput[] | ProjectDiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutCreatorInput | ProjectDiaryCreateOrConnectWithoutCreatorInput[]
    upsert?: ProjectDiaryUpsertWithWhereUniqueWithoutCreatorInput | ProjectDiaryUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ProjectDiaryCreateManyCreatorInputEnvelope
    set?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    disconnect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    delete?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    update?: ProjectDiaryUpdateWithWhereUniqueWithoutCreatorInput | ProjectDiaryUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ProjectDiaryUpdateManyWithWhereWithoutCreatorInput | ProjectDiaryUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ProjectDiaryScalarWhereInput | ProjectDiaryScalarWhereInput[]
  }

  export type DiaryUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<DiaryCreateWithoutCreatorInput, DiaryUncheckedCreateWithoutCreatorInput> | DiaryCreateWithoutCreatorInput[] | DiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutCreatorInput | DiaryCreateOrConnectWithoutCreatorInput[]
    upsert?: DiaryUpsertWithWhereUniqueWithoutCreatorInput | DiaryUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: DiaryCreateManyCreatorInputEnvelope
    set?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    disconnect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    delete?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    update?: DiaryUpdateWithWhereUniqueWithoutCreatorInput | DiaryUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: DiaryUpdateManyWithWhereWithoutCreatorInput | DiaryUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: DiaryScalarWhereInput | DiaryScalarWhereInput[]
  }

  export type ActivityLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    upsert?: ActivityLogUpsertWithWhereUniqueWithoutUserInput | ActivityLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    set?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    disconnect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    delete?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    update?: ActivityLogUpdateWithWhereUniqueWithoutUserInput | ActivityLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActivityLogUpdateManyWithWhereWithoutUserInput | ActivityLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
  }

  export type HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<HouseRuleCreateWithoutCreatorInput, HouseRuleUncheckedCreateWithoutCreatorInput> | HouseRuleCreateWithoutCreatorInput[] | HouseRuleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: HouseRuleCreateOrConnectWithoutCreatorInput | HouseRuleCreateOrConnectWithoutCreatorInput[]
    upsert?: HouseRuleUpsertWithWhereUniqueWithoutCreatorInput | HouseRuleUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: HouseRuleCreateManyCreatorInputEnvelope
    set?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    disconnect?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    delete?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    connect?: HouseRuleWhereUniqueInput | HouseRuleWhereUniqueInput[]
    update?: HouseRuleUpdateWithWhereUniqueWithoutCreatorInput | HouseRuleUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: HouseRuleUpdateManyWithWhereWithoutCreatorInput | HouseRuleUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: HouseRuleScalarWhereInput | HouseRuleScalarWhereInput[]
  }

  export type DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<DutyScheduleCreateWithoutCreatorInput, DutyScheduleUncheckedCreateWithoutCreatorInput> | DutyScheduleCreateWithoutCreatorInput[] | DutyScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: DutyScheduleCreateOrConnectWithoutCreatorInput | DutyScheduleCreateOrConnectWithoutCreatorInput[]
    upsert?: DutyScheduleUpsertWithWhereUniqueWithoutCreatorInput | DutyScheduleUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: DutyScheduleCreateManyCreatorInputEnvelope
    set?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    disconnect?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    delete?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    connect?: DutyScheduleWhereUniqueInput | DutyScheduleWhereUniqueInput[]
    update?: DutyScheduleUpdateWithWhereUniqueWithoutCreatorInput | DutyScheduleUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: DutyScheduleUpdateManyWithWhereWithoutCreatorInput | DutyScheduleUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: DutyScheduleScalarWhereInput | DutyScheduleScalarWhereInput[]
  }

  export type ScheduleUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ScheduleCreateWithoutCreatorInput, ScheduleUncheckedCreateWithoutCreatorInput> | ScheduleCreateWithoutCreatorInput[] | ScheduleUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutCreatorInput | ScheduleCreateOrConnectWithoutCreatorInput[]
    upsert?: ScheduleUpsertWithWhereUniqueWithoutCreatorInput | ScheduleUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ScheduleCreateManyCreatorInputEnvelope
    set?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    disconnect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    delete?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    update?: ScheduleUpdateWithWhereUniqueWithoutCreatorInput | ScheduleUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ScheduleUpdateManyWithWhereWithoutCreatorInput | ScheduleUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
  }

  export type ProjectMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutUserInput | ProjectMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutUserInput | ProjectMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutUserInput | ProjectMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ProjectDiaryCreateWithoutCreatorInput, ProjectDiaryUncheckedCreateWithoutCreatorInput> | ProjectDiaryCreateWithoutCreatorInput[] | ProjectDiaryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutCreatorInput | ProjectDiaryCreateOrConnectWithoutCreatorInput[]
    upsert?: ProjectDiaryUpsertWithWhereUniqueWithoutCreatorInput | ProjectDiaryUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ProjectDiaryCreateManyCreatorInputEnvelope
    set?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    disconnect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    delete?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    update?: ProjectDiaryUpdateWithWhereUniqueWithoutCreatorInput | ProjectDiaryUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ProjectDiaryUpdateManyWithWhereWithoutCreatorInput | ProjectDiaryUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ProjectDiaryScalarWhereInput | ProjectDiaryScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutDiariesInput = {
    create?: XOR<UserCreateWithoutDiariesInput, UserUncheckedCreateWithoutDiariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDiariesInput
    connect?: UserWhereUniqueInput
  }

  export type ScheduleCreateNestedOneWithoutDiariesInput = {
    create?: XOR<ScheduleCreateWithoutDiariesInput, ScheduleUncheckedCreateWithoutDiariesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutDiariesInput
    connect?: ScheduleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDiariesNestedInput = {
    create?: XOR<UserCreateWithoutDiariesInput, UserUncheckedCreateWithoutDiariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDiariesInput
    upsert?: UserUpsertWithoutDiariesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDiariesInput, UserUpdateWithoutDiariesInput>, UserUncheckedUpdateWithoutDiariesInput>
  }

  export type ScheduleUpdateOneWithoutDiariesNestedInput = {
    create?: XOR<ScheduleCreateWithoutDiariesInput, ScheduleUncheckedCreateWithoutDiariesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutDiariesInput
    upsert?: ScheduleUpsertWithoutDiariesInput
    disconnect?: ScheduleWhereInput | boolean
    delete?: ScheduleWhereInput | boolean
    connect?: ScheduleWhereUniqueInput
    update?: XOR<XOR<ScheduleUpdateToOneWithWhereWithoutDiariesInput, ScheduleUpdateWithoutDiariesInput>, ScheduleUncheckedUpdateWithoutDiariesInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivitiesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivitiesInput
    upsert?: UserUpsertWithoutActivitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivitiesInput, UserUpdateWithoutActivitiesInput>, UserUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserCreateNestedOneWithoutHouseRulesInput = {
    create?: XOR<UserCreateWithoutHouseRulesInput, UserUncheckedCreateWithoutHouseRulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHouseRulesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutHouseRulesNestedInput = {
    create?: XOR<UserCreateWithoutHouseRulesInput, UserUncheckedCreateWithoutHouseRulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHouseRulesInput
    upsert?: UserUpsertWithoutHouseRulesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutHouseRulesInput, UserUpdateWithoutHouseRulesInput>, UserUncheckedUpdateWithoutHouseRulesInput>
  }

  export type UserCreateNestedOneWithoutDutySchedulesInput = {
    create?: XOR<UserCreateWithoutDutySchedulesInput, UserUncheckedCreateWithoutDutySchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDutySchedulesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDutySchedulesNestedInput = {
    create?: XOR<UserCreateWithoutDutySchedulesInput, UserUncheckedCreateWithoutDutySchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDutySchedulesInput
    upsert?: UserUpsertWithoutDutySchedulesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDutySchedulesInput, UserUpdateWithoutDutySchedulesInput>, UserUncheckedUpdateWithoutDutySchedulesInput>
  }

  export type UserCreateNestedOneWithoutSchedulesInput = {
    create?: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSchedulesInput
    connect?: UserWhereUniqueInput
  }

  export type DiaryCreateNestedManyWithoutScheduleInput = {
    create?: XOR<DiaryCreateWithoutScheduleInput, DiaryUncheckedCreateWithoutScheduleInput> | DiaryCreateWithoutScheduleInput[] | DiaryUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutScheduleInput | DiaryCreateOrConnectWithoutScheduleInput[]
    createMany?: DiaryCreateManyScheduleInputEnvelope
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
  }

  export type DiaryUncheckedCreateNestedManyWithoutScheduleInput = {
    create?: XOR<DiaryCreateWithoutScheduleInput, DiaryUncheckedCreateWithoutScheduleInput> | DiaryCreateWithoutScheduleInput[] | DiaryUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutScheduleInput | DiaryCreateOrConnectWithoutScheduleInput[]
    createMany?: DiaryCreateManyScheduleInputEnvelope
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutSchedulesNestedInput = {
    create?: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSchedulesInput
    upsert?: UserUpsertWithoutSchedulesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSchedulesInput, UserUpdateWithoutSchedulesInput>, UserUncheckedUpdateWithoutSchedulesInput>
  }

  export type DiaryUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<DiaryCreateWithoutScheduleInput, DiaryUncheckedCreateWithoutScheduleInput> | DiaryCreateWithoutScheduleInput[] | DiaryUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutScheduleInput | DiaryCreateOrConnectWithoutScheduleInput[]
    upsert?: DiaryUpsertWithWhereUniqueWithoutScheduleInput | DiaryUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: DiaryCreateManyScheduleInputEnvelope
    set?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    disconnect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    delete?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    update?: DiaryUpdateWithWhereUniqueWithoutScheduleInput | DiaryUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: DiaryUpdateManyWithWhereWithoutScheduleInput | DiaryUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: DiaryScalarWhereInput | DiaryScalarWhereInput[]
  }

  export type DiaryUncheckedUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<DiaryCreateWithoutScheduleInput, DiaryUncheckedCreateWithoutScheduleInput> | DiaryCreateWithoutScheduleInput[] | DiaryUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DiaryCreateOrConnectWithoutScheduleInput | DiaryCreateOrConnectWithoutScheduleInput[]
    upsert?: DiaryUpsertWithWhereUniqueWithoutScheduleInput | DiaryUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: DiaryCreateManyScheduleInputEnvelope
    set?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    disconnect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    delete?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    connect?: DiaryWhereUniqueInput | DiaryWhereUniqueInput[]
    update?: DiaryUpdateWithWhereUniqueWithoutScheduleInput | DiaryUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: DiaryUpdateManyWithWhereWithoutScheduleInput | DiaryUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: DiaryScalarWhereInput | DiaryScalarWhereInput[]
  }

  export type ProjectMemberCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type ProjectDiaryCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectDiaryCreateWithoutProjectInput, ProjectDiaryUncheckedCreateWithoutProjectInput> | ProjectDiaryCreateWithoutProjectInput[] | ProjectDiaryUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutProjectInput | ProjectDiaryCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectDiaryCreateManyProjectInputEnvelope
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
  }

  export type ProjectMemberUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type ProjectDiaryUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectDiaryCreateWithoutProjectInput, ProjectDiaryUncheckedCreateWithoutProjectInput> | ProjectDiaryCreateWithoutProjectInput[] | ProjectDiaryUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutProjectInput | ProjectDiaryCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectDiaryCreateManyProjectInputEnvelope
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
  }

  export type ProjectMemberUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutProjectInput | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutProjectInput | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutProjectInput | ProjectMemberUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type ProjectDiaryUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectDiaryCreateWithoutProjectInput, ProjectDiaryUncheckedCreateWithoutProjectInput> | ProjectDiaryCreateWithoutProjectInput[] | ProjectDiaryUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutProjectInput | ProjectDiaryCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectDiaryUpsertWithWhereUniqueWithoutProjectInput | ProjectDiaryUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectDiaryCreateManyProjectInputEnvelope
    set?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    disconnect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    delete?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    update?: ProjectDiaryUpdateWithWhereUniqueWithoutProjectInput | ProjectDiaryUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectDiaryUpdateManyWithWhereWithoutProjectInput | ProjectDiaryUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectDiaryScalarWhereInput | ProjectDiaryScalarWhereInput[]
  }

  export type ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutProjectInput | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutProjectInput | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutProjectInput | ProjectMemberUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type ProjectDiaryUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectDiaryCreateWithoutProjectInput, ProjectDiaryUncheckedCreateWithoutProjectInput> | ProjectDiaryCreateWithoutProjectInput[] | ProjectDiaryUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectDiaryCreateOrConnectWithoutProjectInput | ProjectDiaryCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectDiaryUpsertWithWhereUniqueWithoutProjectInput | ProjectDiaryUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectDiaryCreateManyProjectInputEnvelope
    set?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    disconnect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    delete?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    connect?: ProjectDiaryWhereUniqueInput | ProjectDiaryWhereUniqueInput[]
    update?: ProjectDiaryUpdateWithWhereUniqueWithoutProjectInput | ProjectDiaryUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectDiaryUpdateManyWithWhereWithoutProjectInput | ProjectDiaryUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectDiaryScalarWhereInput | ProjectDiaryScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutMembersInput = {
    create?: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMembersInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProjectMembersInput = {
    create?: XOR<UserCreateWithoutProjectMembersInput, UserUncheckedCreateWithoutProjectMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectMembersInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMembersInput
    upsert?: ProjectUpsertWithoutMembersInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutMembersInput, ProjectUpdateWithoutMembersInput>, ProjectUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutProjectMembersNestedInput = {
    create?: XOR<UserCreateWithoutProjectMembersInput, UserUncheckedCreateWithoutProjectMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectMembersInput
    upsert?: UserUpsertWithoutProjectMembersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectMembersInput, UserUpdateWithoutProjectMembersInput>, UserUncheckedUpdateWithoutProjectMembersInput>
  }

  export type ProjectCreateNestedOneWithoutDiariesInput = {
    create?: XOR<ProjectCreateWithoutDiariesInput, ProjectUncheckedCreateWithoutDiariesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDiariesInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProjectDiariesInput = {
    create?: XOR<UserCreateWithoutProjectDiariesInput, UserUncheckedCreateWithoutProjectDiariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectDiariesInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutDiariesNestedInput = {
    create?: XOR<ProjectCreateWithoutDiariesInput, ProjectUncheckedCreateWithoutDiariesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDiariesInput
    upsert?: ProjectUpsertWithoutDiariesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutDiariesInput, ProjectUpdateWithoutDiariesInput>, ProjectUncheckedUpdateWithoutDiariesInput>
  }

  export type UserUpdateOneRequiredWithoutProjectDiariesNestedInput = {
    create?: XOR<UserCreateWithoutProjectDiariesInput, UserUncheckedCreateWithoutProjectDiariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectDiariesInput
    upsert?: UserUpsertWithoutProjectDiariesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectDiariesInput, UserUpdateWithoutProjectDiariesInput>, UserUncheckedUpdateWithoutProjectDiariesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DiaryCreateWithoutCreatorInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    schedule?: ScheduleCreateNestedOneWithoutDiariesInput
  }

  export type DiaryUncheckedCreateWithoutCreatorInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    schedule_id?: string | null
  }

  export type DiaryCreateOrConnectWithoutCreatorInput = {
    where: DiaryWhereUniqueInput
    create: XOR<DiaryCreateWithoutCreatorInput, DiaryUncheckedCreateWithoutCreatorInput>
  }

  export type DiaryCreateManyCreatorInputEnvelope = {
    data: DiaryCreateManyCreatorInput | DiaryCreateManyCreatorInput[]
  }

  export type ActivityLogCreateWithoutUserInput = {
    id?: string
    action: string
    diary_title?: string | null
    category?: string | null
    timestamp?: Date | string
  }

  export type ActivityLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    diary_title?: string | null
    category?: string | null
    timestamp?: Date | string
  }

  export type ActivityLogCreateOrConnectWithoutUserInput = {
    where: ActivityLogWhereUniqueInput
    create: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput>
  }

  export type ActivityLogCreateManyUserInputEnvelope = {
    data: ActivityLogCreateManyUserInput | ActivityLogCreateManyUserInput[]
  }

  export type HouseRuleCreateWithoutCreatorInput = {
    id?: string
    title: string
    content: string
    created_at?: Date | string
  }

  export type HouseRuleUncheckedCreateWithoutCreatorInput = {
    id?: string
    title: string
    content: string
    created_at?: Date | string
  }

  export type HouseRuleCreateOrConnectWithoutCreatorInput = {
    where: HouseRuleWhereUniqueInput
    create: XOR<HouseRuleCreateWithoutCreatorInput, HouseRuleUncheckedCreateWithoutCreatorInput>
  }

  export type HouseRuleCreateManyCreatorInputEnvelope = {
    data: HouseRuleCreateManyCreatorInput | HouseRuleCreateManyCreatorInput[]
  }

  export type DutyScheduleCreateWithoutCreatorInput = {
    id?: string
    day: string
    member_name: string
  }

  export type DutyScheduleUncheckedCreateWithoutCreatorInput = {
    id?: string
    day: string
    member_name: string
  }

  export type DutyScheduleCreateOrConnectWithoutCreatorInput = {
    where: DutyScheduleWhereUniqueInput
    create: XOR<DutyScheduleCreateWithoutCreatorInput, DutyScheduleUncheckedCreateWithoutCreatorInput>
  }

  export type DutyScheduleCreateManyCreatorInputEnvelope = {
    data: DutyScheduleCreateManyCreatorInput | DutyScheduleCreateManyCreatorInput[]
  }

  export type ScheduleCreateWithoutCreatorInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateWithoutCreatorInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleCreateOrConnectWithoutCreatorInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutCreatorInput, ScheduleUncheckedCreateWithoutCreatorInput>
  }

  export type ScheduleCreateManyCreatorInputEnvelope = {
    data: ScheduleCreateManyCreatorInput | ScheduleCreateManyCreatorInput[]
  }

  export type ProjectMemberCreateWithoutUserInput = {
    id?: string
    role: string
    created_at?: Date | string
    project: ProjectCreateNestedOneWithoutMembersInput
  }

  export type ProjectMemberUncheckedCreateWithoutUserInput = {
    id?: string
    project_id: string
    role: string
    created_at?: Date | string
  }

  export type ProjectMemberCreateOrConnectWithoutUserInput = {
    where: ProjectMemberWhereUniqueInput
    create: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput>
  }

  export type ProjectMemberCreateManyUserInputEnvelope = {
    data: ProjectMemberCreateManyUserInput | ProjectMemberCreateManyUserInput[]
  }

  export type ProjectDiaryCreateWithoutCreatorInput = {
    id?: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_at?: Date | string
    updated_at?: Date | string
    project: ProjectCreateNestedOneWithoutDiariesInput
  }

  export type ProjectDiaryUncheckedCreateWithoutCreatorInput = {
    id?: string
    project_id: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectDiaryCreateOrConnectWithoutCreatorInput = {
    where: ProjectDiaryWhereUniqueInput
    create: XOR<ProjectDiaryCreateWithoutCreatorInput, ProjectDiaryUncheckedCreateWithoutCreatorInput>
  }

  export type ProjectDiaryCreateManyCreatorInputEnvelope = {
    data: ProjectDiaryCreateManyCreatorInput | ProjectDiaryCreateManyCreatorInput[]
  }

  export type DiaryUpsertWithWhereUniqueWithoutCreatorInput = {
    where: DiaryWhereUniqueInput
    update: XOR<DiaryUpdateWithoutCreatorInput, DiaryUncheckedUpdateWithoutCreatorInput>
    create: XOR<DiaryCreateWithoutCreatorInput, DiaryUncheckedCreateWithoutCreatorInput>
  }

  export type DiaryUpdateWithWhereUniqueWithoutCreatorInput = {
    where: DiaryWhereUniqueInput
    data: XOR<DiaryUpdateWithoutCreatorInput, DiaryUncheckedUpdateWithoutCreatorInput>
  }

  export type DiaryUpdateManyWithWhereWithoutCreatorInput = {
    where: DiaryScalarWhereInput
    data: XOR<DiaryUpdateManyMutationInput, DiaryUncheckedUpdateManyWithoutCreatorInput>
  }

  export type DiaryScalarWhereInput = {
    AND?: DiaryScalarWhereInput | DiaryScalarWhereInput[]
    OR?: DiaryScalarWhereInput[]
    NOT?: DiaryScalarWhereInput | DiaryScalarWhereInput[]
    id?: StringFilter<"Diary"> | string
    title?: StringFilter<"Diary"> | string
    activity_description?: StringFilter<"Diary"> | string
    project_event?: StringFilter<"Diary"> | string
    category?: StringFilter<"Diary"> | string
    date?: StringFilter<"Diary"> | string
    created_at?: DateTimeFilter<"Diary"> | Date | string
    updated_at?: DateTimeFilter<"Diary"> | Date | string
    created_by?: StringFilter<"Diary"> | string
    schedule_id?: StringNullableFilter<"Diary"> | string | null
  }

  export type ActivityLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ActivityLogWhereUniqueInput
    update: XOR<ActivityLogUpdateWithoutUserInput, ActivityLogUncheckedUpdateWithoutUserInput>
    create: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput>
  }

  export type ActivityLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ActivityLogWhereUniqueInput
    data: XOR<ActivityLogUpdateWithoutUserInput, ActivityLogUncheckedUpdateWithoutUserInput>
  }

  export type ActivityLogUpdateManyWithWhereWithoutUserInput = {
    where: ActivityLogScalarWhereInput
    data: XOR<ActivityLogUpdateManyMutationInput, ActivityLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ActivityLogScalarWhereInput = {
    AND?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
    OR?: ActivityLogScalarWhereInput[]
    NOT?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
    id?: StringFilter<"ActivityLog"> | string
    action?: StringFilter<"ActivityLog"> | string
    diary_title?: StringNullableFilter<"ActivityLog"> | string | null
    category?: StringNullableFilter<"ActivityLog"> | string | null
    timestamp?: DateTimeFilter<"ActivityLog"> | Date | string
    user_id?: StringFilter<"ActivityLog"> | string
  }

  export type HouseRuleUpsertWithWhereUniqueWithoutCreatorInput = {
    where: HouseRuleWhereUniqueInput
    update: XOR<HouseRuleUpdateWithoutCreatorInput, HouseRuleUncheckedUpdateWithoutCreatorInput>
    create: XOR<HouseRuleCreateWithoutCreatorInput, HouseRuleUncheckedCreateWithoutCreatorInput>
  }

  export type HouseRuleUpdateWithWhereUniqueWithoutCreatorInput = {
    where: HouseRuleWhereUniqueInput
    data: XOR<HouseRuleUpdateWithoutCreatorInput, HouseRuleUncheckedUpdateWithoutCreatorInput>
  }

  export type HouseRuleUpdateManyWithWhereWithoutCreatorInput = {
    where: HouseRuleScalarWhereInput
    data: XOR<HouseRuleUpdateManyMutationInput, HouseRuleUncheckedUpdateManyWithoutCreatorInput>
  }

  export type HouseRuleScalarWhereInput = {
    AND?: HouseRuleScalarWhereInput | HouseRuleScalarWhereInput[]
    OR?: HouseRuleScalarWhereInput[]
    NOT?: HouseRuleScalarWhereInput | HouseRuleScalarWhereInput[]
    id?: StringFilter<"HouseRule"> | string
    title?: StringFilter<"HouseRule"> | string
    content?: StringFilter<"HouseRule"> | string
    created_by?: StringFilter<"HouseRule"> | string
    created_at?: DateTimeFilter<"HouseRule"> | Date | string
  }

  export type DutyScheduleUpsertWithWhereUniqueWithoutCreatorInput = {
    where: DutyScheduleWhereUniqueInput
    update: XOR<DutyScheduleUpdateWithoutCreatorInput, DutyScheduleUncheckedUpdateWithoutCreatorInput>
    create: XOR<DutyScheduleCreateWithoutCreatorInput, DutyScheduleUncheckedCreateWithoutCreatorInput>
  }

  export type DutyScheduleUpdateWithWhereUniqueWithoutCreatorInput = {
    where: DutyScheduleWhereUniqueInput
    data: XOR<DutyScheduleUpdateWithoutCreatorInput, DutyScheduleUncheckedUpdateWithoutCreatorInput>
  }

  export type DutyScheduleUpdateManyWithWhereWithoutCreatorInput = {
    where: DutyScheduleScalarWhereInput
    data: XOR<DutyScheduleUpdateManyMutationInput, DutyScheduleUncheckedUpdateManyWithoutCreatorInput>
  }

  export type DutyScheduleScalarWhereInput = {
    AND?: DutyScheduleScalarWhereInput | DutyScheduleScalarWhereInput[]
    OR?: DutyScheduleScalarWhereInput[]
    NOT?: DutyScheduleScalarWhereInput | DutyScheduleScalarWhereInput[]
    id?: StringFilter<"DutySchedule"> | string
    day?: StringFilter<"DutySchedule"> | string
    member_name?: StringFilter<"DutySchedule"> | string
    created_by?: StringFilter<"DutySchedule"> | string
  }

  export type ScheduleUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ScheduleWhereUniqueInput
    update: XOR<ScheduleUpdateWithoutCreatorInput, ScheduleUncheckedUpdateWithoutCreatorInput>
    create: XOR<ScheduleCreateWithoutCreatorInput, ScheduleUncheckedCreateWithoutCreatorInput>
  }

  export type ScheduleUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ScheduleWhereUniqueInput
    data: XOR<ScheduleUpdateWithoutCreatorInput, ScheduleUncheckedUpdateWithoutCreatorInput>
  }

  export type ScheduleUpdateManyWithWhereWithoutCreatorInput = {
    where: ScheduleScalarWhereInput
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyWithoutCreatorInput>
  }

  export type ScheduleScalarWhereInput = {
    AND?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
    OR?: ScheduleScalarWhereInput[]
    NOT?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
    id?: StringFilter<"Schedule"> | string
    title?: StringFilter<"Schedule"> | string
    description?: StringNullableFilter<"Schedule"> | string | null
    category?: StringFilter<"Schedule"> | string
    start_date?: StringFilter<"Schedule"> | string
    end_date?: StringFilter<"Schedule"> | string
    created_by?: StringFilter<"Schedule"> | string
    created_at?: DateTimeFilter<"Schedule"> | Date | string
  }

  export type ProjectMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectMemberWhereUniqueInput
    update: XOR<ProjectMemberUpdateWithoutUserInput, ProjectMemberUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput>
  }

  export type ProjectMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectMemberWhereUniqueInput
    data: XOR<ProjectMemberUpdateWithoutUserInput, ProjectMemberUncheckedUpdateWithoutUserInput>
  }

  export type ProjectMemberUpdateManyWithWhereWithoutUserInput = {
    where: ProjectMemberScalarWhereInput
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectMemberScalarWhereInput = {
    AND?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
    OR?: ProjectMemberScalarWhereInput[]
    NOT?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
    id?: StringFilter<"ProjectMember"> | string
    project_id?: StringFilter<"ProjectMember"> | string
    user_id?: StringFilter<"ProjectMember"> | string
    role?: StringFilter<"ProjectMember"> | string
    created_at?: DateTimeFilter<"ProjectMember"> | Date | string
  }

  export type ProjectDiaryUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ProjectDiaryWhereUniqueInput
    update: XOR<ProjectDiaryUpdateWithoutCreatorInput, ProjectDiaryUncheckedUpdateWithoutCreatorInput>
    create: XOR<ProjectDiaryCreateWithoutCreatorInput, ProjectDiaryUncheckedCreateWithoutCreatorInput>
  }

  export type ProjectDiaryUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ProjectDiaryWhereUniqueInput
    data: XOR<ProjectDiaryUpdateWithoutCreatorInput, ProjectDiaryUncheckedUpdateWithoutCreatorInput>
  }

  export type ProjectDiaryUpdateManyWithWhereWithoutCreatorInput = {
    where: ProjectDiaryScalarWhereInput
    data: XOR<ProjectDiaryUpdateManyMutationInput, ProjectDiaryUncheckedUpdateManyWithoutCreatorInput>
  }

  export type ProjectDiaryScalarWhereInput = {
    AND?: ProjectDiaryScalarWhereInput | ProjectDiaryScalarWhereInput[]
    OR?: ProjectDiaryScalarWhereInput[]
    NOT?: ProjectDiaryScalarWhereInput | ProjectDiaryScalarWhereInput[]
    id?: StringFilter<"ProjectDiary"> | string
    project_id?: StringFilter<"ProjectDiary"> | string
    diary_title?: StringFilter<"ProjectDiary"> | string
    activity_description?: StringFilter<"ProjectDiary"> | string
    work_progress?: IntFilter<"ProjectDiary"> | number
    created_by?: StringFilter<"ProjectDiary"> | string
    created_at?: DateTimeFilter<"ProjectDiary"> | Date | string
    updated_at?: DateTimeFilter<"ProjectDiary"> | Date | string
  }

  export type UserCreateWithoutDiariesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutDiariesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutDiariesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDiariesInput, UserUncheckedCreateWithoutDiariesInput>
  }

  export type ScheduleCreateWithoutDiariesInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_at?: Date | string
    creator: UserCreateNestedOneWithoutSchedulesInput
  }

  export type ScheduleUncheckedCreateWithoutDiariesInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_by: string
    created_at?: Date | string
  }

  export type ScheduleCreateOrConnectWithoutDiariesInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutDiariesInput, ScheduleUncheckedCreateWithoutDiariesInput>
  }

  export type UserUpsertWithoutDiariesInput = {
    update: XOR<UserUpdateWithoutDiariesInput, UserUncheckedUpdateWithoutDiariesInput>
    create: XOR<UserCreateWithoutDiariesInput, UserUncheckedCreateWithoutDiariesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDiariesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDiariesInput, UserUncheckedUpdateWithoutDiariesInput>
  }

  export type UserUpdateWithoutDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type ScheduleUpsertWithoutDiariesInput = {
    update: XOR<ScheduleUpdateWithoutDiariesInput, ScheduleUncheckedUpdateWithoutDiariesInput>
    create: XOR<ScheduleCreateWithoutDiariesInput, ScheduleUncheckedCreateWithoutDiariesInput>
    where?: ScheduleWhereInput
  }

  export type ScheduleUpdateToOneWithWhereWithoutDiariesInput = {
    where?: ScheduleWhereInput
    data: XOR<ScheduleUpdateWithoutDiariesInput, ScheduleUncheckedUpdateWithoutDiariesInput>
  }

  export type ScheduleUpdateWithoutDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutSchedulesNestedInput
  }

  export type ScheduleUncheckedUpdateWithoutDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutActivitiesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutActivitiesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutActivitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
  }

  export type UserUpsertWithoutActivitiesInput = {
    update: XOR<UserUpdateWithoutActivitiesInput, UserUncheckedUpdateWithoutActivitiesInput>
    create: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivitiesInput, UserUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateWithoutHouseRulesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutHouseRulesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutHouseRulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHouseRulesInput, UserUncheckedCreateWithoutHouseRulesInput>
  }

  export type UserUpsertWithoutHouseRulesInput = {
    update: XOR<UserUpdateWithoutHouseRulesInput, UserUncheckedUpdateWithoutHouseRulesInput>
    create: XOR<UserCreateWithoutHouseRulesInput, UserUncheckedCreateWithoutHouseRulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutHouseRulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutHouseRulesInput, UserUncheckedUpdateWithoutHouseRulesInput>
  }

  export type UserUpdateWithoutHouseRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutHouseRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateWithoutDutySchedulesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutDutySchedulesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutDutySchedulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDutySchedulesInput, UserUncheckedCreateWithoutDutySchedulesInput>
  }

  export type UserUpsertWithoutDutySchedulesInput = {
    update: XOR<UserUpdateWithoutDutySchedulesInput, UserUncheckedUpdateWithoutDutySchedulesInput>
    create: XOR<UserCreateWithoutDutySchedulesInput, UserUncheckedCreateWithoutDutySchedulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDutySchedulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDutySchedulesInput, UserUncheckedUpdateWithoutDutySchedulesInput>
  }

  export type UserUpdateWithoutDutySchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutDutySchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateWithoutSchedulesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutSchedulesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutSchedulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
  }

  export type DiaryCreateWithoutScheduleInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    creator: UserCreateNestedOneWithoutDiariesInput
  }

  export type DiaryUncheckedCreateWithoutScheduleInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
  }

  export type DiaryCreateOrConnectWithoutScheduleInput = {
    where: DiaryWhereUniqueInput
    create: XOR<DiaryCreateWithoutScheduleInput, DiaryUncheckedCreateWithoutScheduleInput>
  }

  export type DiaryCreateManyScheduleInputEnvelope = {
    data: DiaryCreateManyScheduleInput | DiaryCreateManyScheduleInput[]
  }

  export type UserUpsertWithoutSchedulesInput = {
    update: XOR<UserUpdateWithoutSchedulesInput, UserUncheckedUpdateWithoutSchedulesInput>
    create: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSchedulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSchedulesInput, UserUncheckedUpdateWithoutSchedulesInput>
  }

  export type UserUpdateWithoutSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type DiaryUpsertWithWhereUniqueWithoutScheduleInput = {
    where: DiaryWhereUniqueInput
    update: XOR<DiaryUpdateWithoutScheduleInput, DiaryUncheckedUpdateWithoutScheduleInput>
    create: XOR<DiaryCreateWithoutScheduleInput, DiaryUncheckedCreateWithoutScheduleInput>
  }

  export type DiaryUpdateWithWhereUniqueWithoutScheduleInput = {
    where: DiaryWhereUniqueInput
    data: XOR<DiaryUpdateWithoutScheduleInput, DiaryUncheckedUpdateWithoutScheduleInput>
  }

  export type DiaryUpdateManyWithWhereWithoutScheduleInput = {
    where: DiaryScalarWhereInput
    data: XOR<DiaryUpdateManyMutationInput, DiaryUncheckedUpdateManyWithoutScheduleInput>
  }

  export type ProjectMemberCreateWithoutProjectInput = {
    id?: string
    role: string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutProjectMembersInput
  }

  export type ProjectMemberUncheckedCreateWithoutProjectInput = {
    id?: string
    user_id: string
    role: string
    created_at?: Date | string
  }

  export type ProjectMemberCreateOrConnectWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    create: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
  }

  export type ProjectMemberCreateManyProjectInputEnvelope = {
    data: ProjectMemberCreateManyProjectInput | ProjectMemberCreateManyProjectInput[]
  }

  export type ProjectDiaryCreateWithoutProjectInput = {
    id?: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_at?: Date | string
    updated_at?: Date | string
    creator: UserCreateNestedOneWithoutProjectDiariesInput
  }

  export type ProjectDiaryUncheckedCreateWithoutProjectInput = {
    id?: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_by: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectDiaryCreateOrConnectWithoutProjectInput = {
    where: ProjectDiaryWhereUniqueInput
    create: XOR<ProjectDiaryCreateWithoutProjectInput, ProjectDiaryUncheckedCreateWithoutProjectInput>
  }

  export type ProjectDiaryCreateManyProjectInputEnvelope = {
    data: ProjectDiaryCreateManyProjectInput | ProjectDiaryCreateManyProjectInput[]
  }

  export type ProjectMemberUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    update: XOR<ProjectMemberUpdateWithoutProjectInput, ProjectMemberUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
  }

  export type ProjectMemberUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    data: XOR<ProjectMemberUpdateWithoutProjectInput, ProjectMemberUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectMemberUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectMemberScalarWhereInput
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectDiaryUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectDiaryWhereUniqueInput
    update: XOR<ProjectDiaryUpdateWithoutProjectInput, ProjectDiaryUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectDiaryCreateWithoutProjectInput, ProjectDiaryUncheckedCreateWithoutProjectInput>
  }

  export type ProjectDiaryUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectDiaryWhereUniqueInput
    data: XOR<ProjectDiaryUpdateWithoutProjectInput, ProjectDiaryUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectDiaryUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectDiaryScalarWhereInput
    data: XOR<ProjectDiaryUpdateManyMutationInput, ProjectDiaryUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectCreateWithoutMembersInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
    diaries?: ProjectDiaryCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMembersInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
    diaries?: ProjectDiaryUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMembersInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutProjectMembersInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectDiaries?: ProjectDiaryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutProjectMembersInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectDiaries?: ProjectDiaryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutProjectMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectMembersInput, UserUncheckedCreateWithoutProjectMembersInput>
  }

  export type ProjectUpsertWithoutMembersInput = {
    update: XOR<ProjectUpdateWithoutMembersInput, ProjectUncheckedUpdateWithoutMembersInput>
    create: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMembersInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMembersInput, ProjectUncheckedUpdateWithoutMembersInput>
  }

  export type ProjectUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: ProjectDiaryUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: ProjectDiaryUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutProjectMembersInput = {
    update: XOR<UserUpdateWithoutProjectMembersInput, UserUncheckedUpdateWithoutProjectMembersInput>
    create: XOR<UserCreateWithoutProjectMembersInput, UserUncheckedCreateWithoutProjectMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectMembersInput, UserUncheckedUpdateWithoutProjectMembersInput>
  }

  export type UserUpdateWithoutProjectMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectDiaries?: ProjectDiaryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectDiaries?: ProjectDiaryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type ProjectCreateWithoutDiariesInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDiariesInput = {
    id?: string
    project_name: string
    description?: string | null
    start_date: string
    end_date: string
    project_status?: string
    created_at?: Date | string
    updated_at?: Date | string
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDiariesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDiariesInput, ProjectUncheckedCreateWithoutDiariesInput>
  }

  export type UserCreateWithoutProjectDiariesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProjectDiariesInput = {
    id?: string
    username: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    diaries?: DiaryUncheckedCreateNestedManyWithoutCreatorInput
    activities?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    houseRules?: HouseRuleUncheckedCreateNestedManyWithoutCreatorInput
    dutySchedules?: DutyScheduleUncheckedCreateNestedManyWithoutCreatorInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutCreatorInput
    projectMembers?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProjectDiariesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectDiariesInput, UserUncheckedCreateWithoutProjectDiariesInput>
  }

  export type ProjectUpsertWithoutDiariesInput = {
    update: XOR<ProjectUpdateWithoutDiariesInput, ProjectUncheckedUpdateWithoutDiariesInput>
    create: XOR<ProjectCreateWithoutDiariesInput, ProjectUncheckedCreateWithoutDiariesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutDiariesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutDiariesInput, ProjectUncheckedUpdateWithoutDiariesInput>
  }

  export type ProjectUpdateWithoutDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    project_status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutProjectDiariesInput = {
    update: XOR<UserUpdateWithoutProjectDiariesInput, UserUncheckedUpdateWithoutProjectDiariesInput>
    create: XOR<UserCreateWithoutProjectDiariesInput, UserUncheckedCreateWithoutProjectDiariesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectDiariesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectDiariesInput, UserUncheckedUpdateWithoutProjectDiariesInput>
  }

  export type UserUpdateWithoutProjectDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectDiariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutCreatorNestedInput
    activities?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    houseRules?: HouseRuleUncheckedUpdateManyWithoutCreatorNestedInput
    dutySchedules?: DutyScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutCreatorNestedInput
    projectMembers?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DiaryCreateManyCreatorInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    schedule_id?: string | null
  }

  export type ActivityLogCreateManyUserInput = {
    id?: string
    action: string
    diary_title?: string | null
    category?: string | null
    timestamp?: Date | string
  }

  export type HouseRuleCreateManyCreatorInput = {
    id?: string
    title: string
    content: string
    created_at?: Date | string
  }

  export type DutyScheduleCreateManyCreatorInput = {
    id?: string
    day: string
    member_name: string
  }

  export type ScheduleCreateManyCreatorInput = {
    id?: string
    title: string
    description?: string | null
    category?: string
    start_date?: string
    end_date?: string
    created_at?: Date | string
  }

  export type ProjectMemberCreateManyUserInput = {
    id?: string
    project_id: string
    role: string
    created_at?: Date | string
  }

  export type ProjectDiaryCreateManyCreatorInput = {
    id?: string
    project_id: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DiaryUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    schedule?: ScheduleUpdateOneWithoutDiariesNestedInput
  }

  export type DiaryUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    schedule_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DiaryUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    schedule_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActivityLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diary_title?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HouseRuleUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HouseRuleUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HouseRuleUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DutyScheduleUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
  }

  export type DutyScheduleUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
  }

  export type DutyScheduleUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: StringFieldUpdateOperationsInput | string
    member_name?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diaries?: DiaryUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    start_date?: StringFieldUpdateOperationsInput | string
    end_date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMembersNestedInput
  }

  export type ProjectMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDiariesNestedInput
  }

  export type ProjectDiaryUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryCreateManyScheduleInput = {
    id?: string
    title: string
    activity_description: string
    project_event: string
    category: string
    date: string
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
  }

  export type DiaryUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutDiariesNestedInput
  }

  export type DiaryUncheckedUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
  }

  export type DiaryUncheckedUpdateManyWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    project_event?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectMemberCreateManyProjectInput = {
    id?: string
    user_id: string
    role: string
    created_at?: Date | string
  }

  export type ProjectDiaryCreateManyProjectInput = {
    id?: string
    diary_title: string
    activity_description: string
    work_progress: number
    created_by: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectMemberUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectMembersNestedInput
  }

  export type ProjectMemberUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutProjectDiariesNestedInput
  }

  export type ProjectDiaryUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectDiaryUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    diary_title?: StringFieldUpdateOperationsInput | string
    activity_description?: StringFieldUpdateOperationsInput | string
    work_progress?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScheduleCountOutputTypeDefaultArgs instead
     */
    export type ScheduleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScheduleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectCountOutputTypeDefaultArgs instead
     */
    export type ProjectCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiaryDefaultArgs instead
     */
    export type DiaryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiaryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActivityLogDefaultArgs instead
     */
    export type ActivityLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActivityLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HouseRuleDefaultArgs instead
     */
    export type HouseRuleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HouseRuleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DutyScheduleDefaultArgs instead
     */
    export type DutyScheduleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DutyScheduleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScheduleDefaultArgs instead
     */
    export type ScheduleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScheduleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScheduleCategoryDefaultArgs instead
     */
    export type ScheduleCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScheduleCategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectDefaultArgs instead
     */
    export type ProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectMemberDefaultArgs instead
     */
    export type ProjectMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectMemberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectDiaryDefaultArgs instead
     */
    export type ProjectDiaryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectDiaryDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}