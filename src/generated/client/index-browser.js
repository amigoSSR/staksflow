
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  role: 'role',
  created_at: 'created_at'
};

exports.Prisma.DiaryScalarFieldEnum = {
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

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  diary_title: 'diary_title',
  category: 'category',
  timestamp: 'timestamp',
  user_id: 'user_id'
};

exports.Prisma.HouseRuleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  created_by: 'created_by',
  created_at: 'created_at'
};

exports.Prisma.DutyScheduleScalarFieldEnum = {
  id: 'id',
  day: 'day',
  member_name: 'member_name',
  created_by: 'created_by'
};

exports.Prisma.ScheduleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  start_date: 'start_date',
  end_date: 'end_date',
  created_by: 'created_by',
  created_at: 'created_at'
};

exports.Prisma.ScheduleCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  color: 'color',
  created_at: 'created_at'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  project_name: 'project_name',
  description: 'description',
  start_date: 'start_date',
  project_status: 'project_status',
  completed_at: 'completed_at',
  completed_by: 'completed_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ProjectMemberScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  user_id: 'user_id',
  role: 'role',
  created_at: 'created_at'
};

exports.Prisma.ProjectDiaryScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  diary_title: 'diary_title',
  activity_description: 'activity_description',
  work_progress: 'work_progress',
  created_by: 'created_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.WeeklyReportScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  user_id: 'user_id',
  report_name: 'report_name',
  report_period: 'report_period',
  file_path: 'file_path',
  generated_at: 'generated_at'
};

exports.Prisma.CombinedWeeklyReportScalarFieldEnum = {
  id: 'id',
  report_name: 'report_name',
  report_period: 'report_period',
  file_name: 'file_name',
  file_path: 'file_path',
  generated_at: 'generated_at',
  leader_count: 'leader_count',
  diary_count: 'diary_count',
  total_activities: 'total_activities'
};

exports.Prisma.ManualCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  order: 'order',
  icon: 'icon',
  access_role: 'access_role',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ManualBookScalarFieldEnum = {
  id: 'id',
  category_id: 'category_id',
  title: 'title',
  content: 'content',
  order: 'order',
  access_role: 'access_role',
  created_by: 'created_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ProjectRoadmapScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  roadmap_title: 'roadmap_title',
  description: 'description',
  start_date: 'start_date',
  deadline: 'deadline',
  progress_percentage: 'progress_percentage',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RoadmapMilestoneScalarFieldEnum = {
  id: 'id',
  roadmap_id: 'roadmap_id',
  assigned_to: 'assigned_to',
  title: 'title',
  description: 'description',
  start_date: 'start_date',
  deadline: 'deadline',
  progress_percentage: 'progress_percentage',
  status: 'status',
  activity_note: 'activity_note',
  order: 'order',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RoadmapProgressLogScalarFieldEnum = {
  id: 'id',
  roadmap_id: 'roadmap_id',
  milestone_id: 'milestone_id',
  user_id: 'user_id',
  action: 'action',
  details: 'details',
  timestamp: 'timestamp'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Diary: 'Diary',
  ActivityLog: 'ActivityLog',
  HouseRule: 'HouseRule',
  DutySchedule: 'DutySchedule',
  Schedule: 'Schedule',
  ScheduleCategory: 'ScheduleCategory',
  Project: 'Project',
  ProjectMember: 'ProjectMember',
  ProjectDiary: 'ProjectDiary',
  WeeklyReport: 'WeeklyReport',
  CombinedWeeklyReport: 'CombinedWeeklyReport',
  ManualCategory: 'ManualCategory',
  ManualBook: 'ManualBook',
  ProjectRoadmap: 'ProjectRoadmap',
  RoadmapMilestone: 'RoadmapMilestone',
  RoadmapProgressLog: 'RoadmapProgressLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
