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

import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { reduxForm, InjectedFormProps } from 'redux-form';
import classNames from 'classnames/bind';
import { Modal, FieldText, FieldTextFlex } from '@reportportal/ui-kit';

import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { hideModalAction, withModal } from 'controllers/modal';
import { commonValidators } from 'common/utils/validation';
import { FieldErrorHint, FieldProvider } from 'components/fields';

import { TestPlanAttributes } from './testPlanAttributes';
import { messages } from './messages';
import { commonMessages } from '../commonMessages';

import styles from './createTestPlanModal.scss';

const cx = classNames.bind(styles);

export const CREATE_TEST_PLAN_MODAL_KEY = 'createTestPlanModalKey';

interface Attribute {
  key?: string;
  value: string;
  system?: boolean;
  edited?: boolean;
  new?: boolean;
}

interface CreateTestPlanFormValues {
  name: string;
  description: string;
  attributes: Attribute[];
}

interface CreateTestPlanModalProps {
  data: {
    onSubmit: (values: CreateTestPlanFormValues) => void;
  };
}

export const CreateTestPlanModal = ({
  data: { onSubmit },
  handleSubmit,
  initialize,
}: CreateTestPlanModalProps &
  InjectedFormProps<CreateTestPlanFormValues, CreateTestPlanModalProps>) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  useEffect(() => {
    initialize({
      name: '',
      description: '',
      attributes: [],
    });
  }, [initialize]);

  const okButton = {
    children: formatMessage(COMMON_LOCALE_KEYS.CREATE),
    onClick: handleSubmit(onSubmit),
  };

  return (
    <Modal
      title={formatMessage(commonMessages.createTestPlan)}
      okButton={okButton}
      className={cx('create-test-plan-modal')}
      cancelButton={{ children: formatMessage(COMMON_LOCALE_KEYS.CANCEL) }}
      onClose={() => dispatch(hideModalAction())}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cx('create-test-plan-modal__container')}>
          <FieldProvider name="name" placeholder={formatMessage(messages.enterTestPlanName)}>
            <FieldErrorHint provideHint={false} className={cx('create-test-plan-modal__field')}>
              <FieldText
                label={formatMessage(COMMON_LOCALE_KEYS.NAME)}
                defaultWidth={false}
                isRequired
              />
            </FieldErrorHint>
          </FieldProvider>
          <FieldProvider
            name="description"
            placeholder={formatMessage(messages.addTestPlanDescription)}
          >
            <FieldErrorHint provideHint={false} className={cx('create-test-plan-modal__field')}>
              <FieldTextFlex label={formatMessage(messages.description)} value="" />
            </FieldErrorHint>
          </FieldProvider>
          <TestPlanAttributes />
        </div>
      </form>
    </Modal>
  );
};

withModal(CREATE_TEST_PLAN_MODAL_KEY)(
  reduxForm<CreateTestPlanFormValues, CreateTestPlanModalProps>({
    form: 'create-test-plan-modal-form',
    validate: ({ name }) => ({
      name: commonValidators.requiredField(name),
    }),
  })(CreateTestPlanModal),
);
