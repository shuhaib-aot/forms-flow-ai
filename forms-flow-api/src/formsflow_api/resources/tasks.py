"""API endpoints for managing tasks resource."""

from http import HTTPStatus

from flask import request
from flask_restx import Namespace, Resource, fields
from formsflow_api_utils.utils import (
    auth,
    cors_preflight,
    profiletime,
)

from formsflow_api.services import TaskService

API = Namespace("Tasks", description="Manages user tasks operations.")

task_outcome_request = API.model(
    "TaskOutcomeRequest",
    {
        "taskId": fields.String(description="Task ID", required=True),
        "taskName": fields.String(
            description="Task name", required=True, allow_none=True
        ),
        "transitionMapType": fields.String(
            description="Task transition map type - select/input/radio", required=True
        ),
        "taskTransitionMap": fields.Raw(
            description="Determines the next step in workflow - accepts list, dict, string",
            required=True,
        ),
    },
)

task_outcome_response = API.inherit(
    "TaskOutcomeResponse",
    task_outcome_request,
    {
        "id": fields.Integer(description="Task outcome configuration ID"),
        "createdBy": fields.String(description="Created by"),
        "tenant": fields.String(description="Tenant key"),
        "created": fields.DateTime(description="Created date"),
    },
)


@cors_preflight("POST, OPTIONS")
@API.route("/task-outcome-configuration", methods=["POST", "OPTIONS"])
class TaskOutcomeResource(Resource):
    """Resource to create task outcome configuration."""

    @staticmethod
    @auth.require
    @profiletime
    @API.expect(task_outcome_request)
    @API.doc(
        responses={
            201: ("CREATED:- Successful request.", task_outcome_response),
            400: "BAD_REQUEST:- Invalid request.",
            401: "UNAUTHORIZED:- Authorization header not provided or an invalid token passed.",
        }
    )
    def post():
        """Create task outcome configuration.

        Accepts a JSON payload containing workflow configuration details.
        The configuration includes transition rules and transition rules type for task outcomes.

        Request Body:
            dict: Required JSON payload with structure:
                {
                    "taskId": str,
                    "taskName": str,
                    "transitionMapType": str,     # "select", "radio", or "input"
                    "taskTransitionMap": dict     # Outcome-to-step mappings supporting list, dict, string
                }
        Returns:
            dict: Task outcome configuration with structure:
                {
                    "id": int,
                    "taskId": str,
                    "taskName": str,
                    "tenant": str,
                    "transitionMapType": str,  # "select", "radio", or "input"
                    "taskTransitionMap": dict,  # mapping outcomes to subsequent workflow steps
                    "created": str,
                    "createdBy": str,
                }
        """
        data = request.get_json()
        if not data:
            return {"message": "Invalid input"}, HTTPStatus.BAD_REQUEST
        response = TaskService().create_task_outcome_configuration(data)
        return response, HTTPStatus.CREATED


@cors_preflight("GET, OPTIONS")
@API.route("/task-outcome-configuration/<string:task_id>", methods=["GET", "OPTIONS"])
@API.param("task_id", "Task ID")
class TaskOutcomeByIdResource(Resource):
    """Resource to get task outcome configuration by task ID."""

    @staticmethod
    @auth.require
    @profiletime
    @API.doc(
        responses={
            200: ("OK:- Successful request.", task_outcome_response),
            400: "BAD_REQUEST:- Invalid request.",
            401: "UNAUTHORIZED:- Authorization header not provided or an invalid token passed.",
        }
    )
    def get(task_id: str):
        """Retrieves task outcome configuration by task ID.

        Fetches the complete workflow configuration for a specified task, including
        workflow routing rules (taskTransitionMap) and interface display preferences (transitionMapType),
        supporting 'select', 'radio', or 'input'

        Args:
        task_id (str): Unique identifier of the task (required)

        Returns:
            dict: Task outcome configuration with structure:
                {
                    "id": int,
                    "taskId": str,
                    "taskName": str,
                    "tenant": str,
                    "transitionMapType": str,  # "select", "radio", or "input"
                    "taskTransitionMap": dict,  # mapping outcomes to subsequent workflow steps
                    "created": str,
                    "createdBy": str,
                }
        """
        response = TaskService().get_task_outcome_configuration(task_id)
        return response, HTTPStatus.OK
