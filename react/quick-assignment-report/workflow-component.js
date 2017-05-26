import React, { Component } from 'react';
import WorkflowInstanceComponent from './workflow-instance-component';

const WorkflowComponent = ({WorkflowInstances, Structure, WA_ID}) => {
    const workflowInstancesArray = Object.keys(WorkflowInstances).map((key)=> {
        return <WorkflowInstanceComponent Workflow={WorkflowInstances[key]}
                                        Structure={Structure}
                                        WI_ID={key}
                                        WA_ID={key}
                                        key={`${WA_ID}-${key}`}
                                      />;
    });

    return <div className="workflow-block">
      <div className="workflow-activity">{WA_ID}</div>
      {workflowInstancesArray}
    </div>;
};

export default WorkflowComponent;
