"""This manages form logs  Schema."""

from marshmallow import EXCLUDE, Schema, fields

class FormLogsRequestSchema(Schema):
    """This is request schema for formlogs."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exlude."""

        unkown: EXCLUDE

    id = fields.Str(data_key="id", required=False)
    form_id = fields.Str(data_key="formId", required=False)
    form_name = fields.Str(data_key="formName", required=False)
    mapper_id = fields.Str(data_key="mapperId", required=False)
    process_key = fields.Str(data_key="processKey", required=False)
    status = fields.Str(data_key="status", required=False)
    created_by = fields.Str(data_key="modifiedBy", required=False)
    created = fields.Str(data_key="modifedDate", required=False)


