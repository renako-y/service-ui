import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { hideModalAction } from 'controllers/modal';
import {
  NOTIFICATION_TYPES,
  showDefaultErrorNotification,
  showNotification,
} from 'controllers/notification';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { projectKeySelector } from 'controllers/project';
import { TestCasePriority } from 'pages/inside/common/priorityIcon/types';

export interface TestStep {
  instructions: string;
  expectedResult: string;
  attachments?: string[];
}

export interface CreateTestCaseFormData {
  name: string;
  description?: string;
  linkToRequirements?: string;
  executionEstimationTime?: number;
  manualScenarioType: 'STEPS' | 'TEXT';
  preconditions?: string;
  tags?: string[];
}

export interface CreateTestCasePayload {
  name: string;
  testFolderId: number;
  priority: TestCasePriority;
  description?: string;
  linkToRequirements?: string;
  testCaseVersion?: {
    versionName: string;
    comment: string;
    executionEstimationTime?: number;
    manualScenario: {
      type: 'STEPS' | 'TEXT';
      preconditions?: string;
    };
  };
  tags?: { value: string; attributeId: number }[];
}

export const useCreateTestCase = () => {
  const [isCreateTestCaseLoading, setIsCreateTestCaseLoading] = useState(false);
  const dispatch = useDispatch();
  const projectKey = useSelector(projectKeySelector);

  const createTestCase = async (
    payload: CreateTestCaseFormData & { testFolderId: number; priority?: string },
  ) => {
    try {
      setIsCreateTestCaseLoading(true);

      await fetch(URLS.testCase(projectKey), {
        method: 'post',
        data: payload,
      });

      dispatch(hideModalAction());
      dispatch(
        showNotification({
          message: undefined,
          messageId: 'TestCaseLibraryPage.testCaseCreatedSuccess',
          type: NOTIFICATION_TYPES.SUCCESS,
          values: undefined,
        }),
      );
    } catch (error) {
      dispatch(showDefaultErrorNotification(error));
    } finally {
      setIsCreateTestCaseLoading(false);
    }
  };

  return {
    isCreateTestCaseLoading,
    createTestCase,
  };
};
