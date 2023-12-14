/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmDialog = ({showBox, handleConfirm, handleCancel}) => <Modal show={showBox} onHide={handleCancel}>
  <Modal.Header>
    <Modal.Title><b>Are you sure to delete this repository?</b></Modal.Title>
  </Modal.Header>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCancel}>
      No
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Yes
    </Button>
  </Modal.Footer>
  </Modal>;

ConfirmDialog.propTypes={
  showBox: PropTypes.bool,
  handleConfirm: PropTypes.func,
  handleCancel: PropTypes.func
};

export {ConfirmDialog};