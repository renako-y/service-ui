/*
 * Copyright 2025 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Parser from 'html-react-parser';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { NumerableBlock } from 'pages/common/numerableBlock';
import { EmptyStatePage } from 'pages/inside/common/emptyStatePage';
import { referenceDictionary } from 'common/utils';
import { projectKeySelector } from 'controllers/project';
import { fetch } from 'common/utils/fetch';
import {
  CREATE_TEST_CASE_MODAL_KEY,
  useCreateTestCase,
} from 'pages/inside/testCaseLibraryPage/createTestCaseModal';
import { showModalAction } from 'controllers/modal';
import ImportIcon from 'common/img/import-thin-inline.svg';

import { CreateTestCaseFormData } from 'pages/inside/testCaseLibraryPage/createTestCaseModal/useCreateTestCase';
import { messages } from '../messages';
import { commonMessages } from '../../commonMessages';

export const MainPageEmptyState = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const projectKey = useSelector(projectKeySelector);
  const { createTestCase, isCreateTestCaseLoading } = useCreateTestCase();

  const showCreateTestCaseModal = () => {
    dispatch(
      showModalAction({
        id: CREATE_TEST_CASE_MODAL_KEY,
        data: {
          onSubmit: ({ name, description }: CreateTestCaseFormData) => {
            createTestCase({
              name,
              description,
              testFolderId: 1234232,
              priority: undefined,
              manualScenarioType: 'STEPS',
            });
          },
        },
        component: null,
      }),
    );
  };

  const handleTempFolderCall = async () => {
    try {
      console.log('Making POST call to folder endpoint...');
      const response = await fetch(`/api/project/${projectKey}/tms/folder`, {
        method: 'post',
        data: {
          name: 'Superadmin super folder',
          description: 'Superadmin super folder',
        },
      });
      console.log('Folder response:', response);
    } catch (error) {
      console.error('Folder call failed:', error);
    }
  };

  const benefits = [
    messages.createFolder,
    messages.addTestCases,
    messages.tagTestCases,
  ].map((translation) => Parser(formatMessage(translation)));

  return (
    <>
      <EmptyStatePage
        title={formatMessage(messages.emptyPageTitle)}
        description={Parser(formatMessage(messages.emptyPageDescription))}
        imageType="docs"
        documentationLink={referenceDictionary.rpDoc}
        buttons={[
          {
            name: formatMessage(commonMessages.createTestCase),
            dataAutomationId: 'createTestCaseButton',
            isCompact: true,
            handleButton: showCreateTestCaseModal,
            isDisabled: isCreateTestCaseLoading,
          },
          {
            name: formatMessage(messages.importTestCases),
            dataAutomationId: 'importTestCaseButton',
            variant: 'ghost',
            icon: ImportIcon,
            isCompact: true,
          },
          // TEMPORARY BUTTON - will be removed
          {
            name: 'TEMP: Test Folder API',
            dataAutomationId: 'tempFolderButton',
            variant: 'danger',
            isCompact: true,
            handleButton: handleTempFolderCall,
          },
        ]}
      />
      <NumerableBlock
        items={benefits}
        title={formatMessage(messages.numerableBlockTitle)}
        fullWidth
      />
    </>
  );
};
