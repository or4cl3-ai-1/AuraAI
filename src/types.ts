export interface ProjectFile {
  path: string;
  filename: string;
  language: string;
  content: string;
}

export interface GeneratedProject {
  appName: string;
  tagline: string;
  architecture: {
    techStack: string[];
    databaseSchema: string;
    userFlow: string;
  };
  files: ProjectFile[];
  sandboxData: {
    views: string[];
    widgets: {
      title: string;
      type: "chart" | "stat" | "list" | "form";
      data: string; // stringified JSON array or descriptive text
    }[];
    forms: {
      formName: string;
      fields: {
        name: string;
        type: "text" | "number" | "email";
        placeholderString: string;
      }[];
    }[];
    sampleActions: {
      trigger: string;
      description: string;
    }[];
  };
  compilerNotice?: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warn" | "error" | "terminal";
  message: string;
}

export interface ProjectVersion {
  id: string;
  timestamp: string;
  description: string;
  files: ProjectFile[];
  techStack: string[];
  appName: string;
}
