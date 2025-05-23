"""App Constants.

Constants file needed for the static values.
"""
from enum import Enum
from http import HTTPStatus

from formsflow_api_utils.exceptions import ErrorCodeMixin


class BusinessErrorCode(ErrorCodeMixin, Enum):
    """Business error codes."""

    FORM_ID_NOT_FOUND = "The specified form ID does not exist", HTTPStatus.BAD_REQUEST
    INVALID_FORM_ID = "Invalid Form ID", HTTPStatus.BAD_REQUEST
    PERMISSION_DENIED = "Insufficient permission", HTTPStatus.FORBIDDEN
    APPLICATION_ID_NOT_FOUND = (
        "The specified application ID does not exist",
        HTTPStatus.BAD_REQUEST,
    )
    PROCESS_DEF_NOT_FOUND = "Process definition does not exist", HTTPStatus.BAD_REQUEST
    INVALID_AUTH_RESOURCE_ID = (
        "Invalid authorization resource ID",
        HTTPStatus.BAD_REQUEST,
    )
    INVALID_FORM_PROCESS_MAPPER_ID = (
        "Invalid form process mapper ID",
        HTTPStatus.BAD_REQUEST,
    )
    NO_DASHBOARD_AUTHORIZED = (
        "No Dashboard authorized Group found",
        HTTPStatus.BAD_REQUEST,
    )
    INVALID_INSIGHTS_RESPONSE = (
        "Invalid response received from insights",
        HTTPStatus.BAD_REQUEST,
    )
    INSIGHTS_NOTFOUND = (
        "Analytics is not enabled for this tenant",
        HTTPStatus.BAD_REQUEST,
    )
    INVALID_BPM_RESPONSE = "Invalid response received from bpm", HTTPStatus.BAD_REQUEST
    BPM_BASE_URL_NOT_SET = "BPM_API_URL not set environment", HTTPStatus.BAD_REQUEST
    MISSING_PAGINATION_PARAMETERS = (
        "Missing pagination parameters",
        HTTPStatus.BAD_REQUEST,
    )
    DUPLICATE_ROLE = "Duplicate role", HTTPStatus.BAD_REQUEST
    APPLICATION_CREATE_ERROR = "Cannot create application", HTTPStatus.BAD_REQUEST
    DRAFT_APPLICATION_NOT_FOUND = (
        "The specified draft application does not exist",
        HTTPStatus.BAD_REQUEST,
    )
    FILTER_NOT_FOUND = "The specified filter does not exist", HTTPStatus.BAD_REQUEST

    def __new__(cls, message, status_code):
        """Constructor."""
        obj = object.__new__(cls)
        obj._value = status_code
        obj._message = message
        return obj

    @property
    def message(self):
        """Return message."""
        return self._message

    @property
    def status_code(self):
        """Return status code."""
        return self._value
