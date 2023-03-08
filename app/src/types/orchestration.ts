export type OrchestrationWorkflow = {
  id: string;
  name: string;
  createdAt: Date;
};

export type OrchestrationInstance = {
  id: string;
  workflowID: string;
  createdAt: Date;
  terminatedAt: Date;
  terminated: boolean;
};
