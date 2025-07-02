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
import { CREATE_TEST_CASE_MODAL_KEY } from 'pages/inside/testCaseLibraryPage/createTestCaseModal';
import { CREATE_TEST_PLAN_MODAL_KEY } from 'pages/inside/testCaseLibraryPage/createTestPlanModal';
import { TEST_CASE_DETAILS_PAGE } from 'controllers/pages/constants';
import { urlOrganizationAndProjectSelector } from 'controllers/pages';
import { hideModalAction, showModalAction } from 'controllers/modal';
import { referenceDictionary } from 'common/utils';

// Import to ensure modal registration
import 'pages/inside/testCaseLibraryPage/createTestPlanModal/createTestPlanModal';

import { messages } from '../messages';
import { commonMessages } from '../../commonMessages';

export const MainPageEmptyState = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { organizationSlug, projectSlug } = useSelector(urlOrganizationAndProjectSelector);

  const handleCreateTestCaseModalSubmit = (formValues) => {
    // eslint-disable-next-line no-console
    console.log('Form submitted with values:', formValues);
    dispatch(hideModalAction());
    dispatch({
      type: TEST_CASE_DETAILS_PAGE,
      payload: {
        // temporary - will be replaced with actual ID generation
        testCaseSlug: 'new',
        organizationSlug,
        projectSlug,
      },
    });
  };

  const handleCreateTestPlanModalSubmit = (formValues) => {
    // eslint-disable-next-line no-console
    console.log('Test Plan form submitted with values:', formValues);
    dispatch(hideModalAction());
    // TODO: Navigate to test plan details or handle as needed
  };

  const openCreateTestCaseModal = () => {
    dispatch(
      showModalAction({
        id: CREATE_TEST_CASE_MODAL_KEY,
        data: {
          onSubmit: handleCreateTestCaseModalSubmit,
        },
        component: null,
      }),
    );
  };

  const openCreateTestPlanModal = () => {
    dispatch(
      showModalAction({
        id: CREATE_TEST_PLAN_MODAL_KEY,
        data: {
          onSubmit: handleCreateTestPlanModalSubmit,
        },
        component: null,
      }),
    );
  };

  const benefits = [
    messages.createFolder,
    messages.addTestCases,
    messages.tagTestCases,
  ].map((translation) => Parser(formatMessage(translation, {}, { ignoreTag: true })));

  return (
    <>
      <EmptyStatePage
        title={formatMessage(messages.emptyPageTitle)}
        description={Parser(formatMessage(messages.emptyPageDescription))}
        imageType="docs"
        documentationLink={referenceDictionary.rpDoc}
        buttons={[
          {
            name: formatMessage(commonMessages.createFolder),
            dataAutomationId: 'createFolderButton',
            isCompact: true,
          },
          {
            name: formatMessage(commonMessages.createTestCase),
            dataAutomationId: 'createTestCaseButton',
            isCompact: true,
            variant: 'ghost',
            handleButton: openCreateTestCaseModal,
          },
          {
            name: formatMessage(commonMessages.createTestPlan),
            dataAutomationId: 'createTestPlanButton',
            isCompact: true,
            variant: 'ghost',
            handleButton: openCreateTestPlanModal,
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
