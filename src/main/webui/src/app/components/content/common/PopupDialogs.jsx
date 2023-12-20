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

const ChangeLogDialog = ({showBox, handleSave, handleCancel, changelog}) => <Modal show={showBox} onHide={handleCancel}>
    <Modal.Header closeButton>
      <Modal.Title><b>Enter a summary for this change:</b></Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <textarea cols="20" rows="5" style={{height: "130px"}} {...changelog}></textarea>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
    </Modal.Footer>
  </Modal>;

ChangeLogDialog.propTypes={
  showBox: PropTypes.bool,
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
  changelog: PropTypes.object
};

const ConfirmDialog = ({showBox, title, handleConfirm, handleCancel}) => <Modal show={showBox} onHide={handleCancel}>
  <Modal.Header>
    <Modal.Title><b>{title}</b></Modal.Title>
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
  title: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func,
  handleCancel: PropTypes.func
};

export {ChangeLogDialog, ConfirmDialog};
