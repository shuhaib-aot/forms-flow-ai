"""Test suite for Filter API endpoint."""

from formsflow_api_utils.utils import (
    CREATE_FILTERS,
    MANAGE_ALL_FILTERS,
    VIEW_FILTERS,
    get_token,
)

from tests.utilities.base_test import get_filter_payload


def test_create_filter(app, client, session, jwt):
    """Test create filter with valid payload."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Test Task"


def test_get_user_filters(app, client, session, jwt):
    """Test - Get filters based on user role."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    # Create filter for clerk role
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(name="Clerk Task", roles=["clerk"]),
    )
    assert response.status_code == 201
    # Create filter for reviewer role
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(name="Reviewer Task", roles=["formsflow-reviewer"]),
    )
    assert response.status_code == 201
    # Test '/filter/user' endpoint with reviewer token
    # Since reviewer created both filters response will include both.
    token = get_token(jwt, role=VIEW_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.get("/filter/user", headers=headers)
    assert response.status_code == 200
    assert len(response.json.get("filters")) == 2
    assert response.json.get("filters")[0].get("name") == "Clerk Task"
    assert response.json.get("filters")[1].get("name") == "Reviewer Task"


def test_filter_update(app, client, session, jwt):
    """Test filter update with valid payload."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(name="Clerk Task", roles=["clerk"]),
    )
    assert response.status_code == 201
    filter_id = response.json.get("id")
    payload = {"description": "Clerk Task"}
    response = client.put(f"/filter/{filter_id}", headers=headers, json=payload)
    assert response.status_code == 200
    assert response.json.get("description") == "Clerk Task"


def test_filter_delete(app, client, session, jwt):
    """Test filter delete."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    filter_id = response.json.get("id")
    token = get_token(jwt, role=MANAGE_ALL_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.delete(f"/filter/{filter_id}", headers=headers)
    assert response.status_code == 200
    assert response.json == "Deleted"
    response = client.get(f"/filter/{filter_id}", headers=headers)
    assert response.status_code == 400


def test_create_filter_current_user_task(app, client, session, jwt):
    """Test create filter for current user's tasks."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    filter_payload = get_filter_payload(name="My Tasks")
    filter_payload.update({"isMyTasksEnabled": True})
    response = client.post("/filter", headers=headers, json=filter_payload)
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "My Tasks"
    assert (
        response.json.get("criteria", {}).get("assigneeExpression")
        == "${ currentUser() }"
    )


def test_create_filter_current_user_group_task(app, client, session, jwt):
    """Test create filter based on the roles of the currently logged-in user."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    filter_payload = get_filter_payload(name="My Group Tasks")
    filter_payload.update({"isTasksForCurrentUserGroupsEnabled": True})
    response = client.post("/filter", headers=headers, json=filter_payload)
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "My Group Tasks"
    assert (
        response.json.get("criteria", {}).get("candidateGroupsExpression")
        == "${currentUserGroups()}"
    )


def test_get_user_filters_by_order(app, client, session, jwt):
    """Test - Get filters based on user role and based on the order."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    # Create filter for clerk role and giving display order 2
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(name="Clerk Task", order=2, roles=["clerk"]),
    )
    assert response.status_code == 201
    # Create filter for reviewer role and giving display order 1
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(
            name="Reviewer Task", order=1, roles=["formsflow-reviewer"]
        ),
    )
    assert response.status_code == 201
    # Test '/filter/user' endpoint with reviewer token
    # Since reviewer created both filters response will include both.
    token = get_token(jwt, role=VIEW_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.get("/filter/user", headers=headers)
    assert response.status_code == 200
    assert len(response.json.get("filters")) == 2
    assert response.json.get("filters")[0].get("name") == "Reviewer Task"
    assert response.json.get("filters")[1].get("name") == "Clerk Task"


def test_attribute_filter(app, client, session, jwt):
    """Test attribute filter with valid payload."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    # Create task filter
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(name="Task filter1", roles=["formsflow-reviewer"]),
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Task filter1"
    assert response.json.get("filterType") == "TASK"
    assert response.json.get("parentFilterId") is None

    parent_filter_id = response.json.get("id")
    # Create attribute filter for the task filter
    response = client.post(
        "/filter",
        headers=headers,
        json=get_filter_payload(
            name="Attribute filter1",
            roles=["formsflow-reviewer"],
            parent_filter_id=parent_filter_id,
            filter_type="ATTRIBUTE",
        ),
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Attribute filter1"
    assert response.json.get("filterType") == "ATTRIBUTE"

    token = get_token(jwt, role=VIEW_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    # Get task filters for the user
    response = client.get("/filter/user", headers=headers)
    assert response.status_code == 200
    assert len(response.json.get("filters")) == 1
    assert response.json.get("filters")[0].get("name") == "Task filter1"

    # Get filter by id
    response = client.get(f"/filter/{parent_filter_id}", headers=headers)
    assert response.status_code == 200
    assert response.json.get("name") == "Task filter1"
    assert response.json.get("attributeFilters")


def test_filter_preference_create(app, client, session, jwt):
    """Test create filter with valid payload."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Test Task"
    first_filter_id = response.json.get("id")

    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Test Task"
    second_filter_id = response.json.get("id")

    payload = [
        {"filterId": first_filter_id, "sortOrder": 2},
        {"filterId": second_filter_id, "sortOrder": 1},
    ]

    response = client.post("/filter/filter-preference", headers=headers, json=payload)
    assert response.status_code == 201
    assert response.json()[0].get("filterId") == second_filter_id


def test_filter_preference_list(app, client, session, jwt):
    """Test create filter with valid payload."""
    token = get_token(jwt, role=CREATE_FILTERS, username="reviewer")
    headers = {"Authorization": f"Bearer {token}", "content-type": "application/json"}
    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Test Task"
    first_filter_id = response.json.get("id")

    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Test Task"
    second_filter_id = response.json.get("id")

    response = client.post(
        "/filter", headers=headers, json=get_filter_payload(roles=["clerk"])
    )
    assert response.status_code == 201
    assert response.json.get("id") is not None
    assert response.json.get("name") == "Test Task"
    third_filter_id = response.json.get("id")

    payload = [
        {"filterId": first_filter_id, "sortOrder": 2, "hide": True},
        {"filterId": second_filter_id, "sortOrder": 1},
    ]

    response = client.post("/filter/filter-preference", headers=headers, json=payload)
    assert response.status_code == 201
    assert response.json()[0].get("filterId") == second_filter_id

    response = client.post("/filter/user", headers=headers, json=payload)
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[2].get("id") == third_filter_id
