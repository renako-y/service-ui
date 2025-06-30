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

import { takeEvery, call, put, select, all } from 'redux-saga/effects';

import { URLS } from 'common/urls';
import { fetch } from 'common/utils/fetch';
import { projectKeySelector } from 'controllers/project';
import { showDefaultErrorNotification } from 'controllers/notification';
import { GET_TEST_CASES } from './constants';

function* getTestCases() {
  try {
    const projectKey = yield select(projectKeySelector);

    yield call(fetch, URLS.testCase(projectKey));
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  }
}

function* watchCreateGetTestCase() {
  yield takeEvery(GET_TEST_CASES, getTestCases);
}

export function* testCaseSagas() {
  yield all([watchCreateGetTestCase()]);
}
