import useUsersAPI from "./users";
import useDepartmentsAPI from "./departments";
import useDepartmentUsersAPI from "./departmentUsers";
import useInvitationsAPI from "./invitations";
import useDevicesAPI from "./devices";
import useSessionsAPI from "./sessions";
import useMediaAPI from "./media";
import useSessionSharesAPI from "./sessionShares";
import usePublicAPI from "./public";
import useCommentsAPI from "./comments";
import useAnnotationsAPI from "./annotations";
import useIpropsAPI from "./iprops";
import useSessionReportAPI from "./sessionReport";
import useSessionReportMediaAPI from "./sessionReportMedia";

export default {
  users: useUsersAPI(),
  departments: useDepartmentsAPI(),
  department_users: useDepartmentUsersAPI(),
  invitations: useInvitationsAPI(),
  devices: useDevicesAPI(),
  sessions: useSessionsAPI(),
  media: useMediaAPI(),
  session_shares: useSessionSharesAPI(),
  public: usePublicAPI(),
  comments: useCommentsAPI(),
  annotations: useAnnotationsAPI(),
  iprops: useIpropsAPI(),
  session_report: useSessionReportAPI(),
  session_report_media: useSessionReportMediaAPI(),
};
