// This file is auto-generated by @hey-api/openapi-ts

export const $ActionRequest = {
    properties: {
        name: {
            type: 'string',
            title: 'Name'
        },
        path: {
            type: 'string',
            title: 'Path'
        },
        opposite_action_id: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Opposite Action Id',
            default: ''
        },
        description: {
            type: 'string',
            title: 'Description'
        },
        is_sensor: {
            type: 'boolean',
            title: 'Is Sensor',
            default: false
        }
    },
    type: 'object',
    required: ['name', 'path', 'description'],
    title: 'ActionRequest'
} as const;

export const $ActionResponse = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        name: {
            type: 'string',
            title: 'Name'
        },
        path: {
            type: 'string',
            title: 'Path'
        },
        opposite_action_id: {
            type: 'string',
            title: 'Opposite Action Id'
        },
        description: {
            type: 'string',
            title: 'Description'
        },
        is_sensor: {
            type: 'boolean',
            title: 'Is Sensor'
        }
    },
    type: 'object',
    required: ['id', 'name', 'path', 'opposite_action_id', 'description'],
    title: 'ActionResponse'
} as const;

export const $ActionUpdateRequest = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        name: {
            type: 'string',
            title: 'Name',
            default: ''
        },
        path: {
            type: 'string',
            title: 'Path',
            default: ''
        },
        opposite_action_id: {
            type: 'string',
            title: 'Opposite Action Id',
            default: ''
        },
        description: {
            type: 'string',
            title: 'Description',
            default: ''
        },
        is_sensor: {
            type: 'boolean',
            title: 'Is Sensor'
        }
    },
    type: 'object',
    required: ['id'],
    title: 'ActionUpdateRequest'
} as const;

export const $AutomationEdgeConditionRequest = {
    properties: {
        condition_type: {
            '$ref': '#/components/schemas/ConditionType'
        },
        value_type: {
            '$ref': '#/components/schemas/ReturnValueType'
        },
        operator: {
            '$ref': '#/components/schemas/Operator'
        },
        value_number: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Value Number'
        },
        value_boolean: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Value Boolean'
        },
        is_loop: {
            type: 'boolean',
            title: 'Is Loop'
        }
    },
    type: 'object',
    required: ['condition_type', 'value_type', 'operator', 'is_loop'],
    title: 'AutomationEdgeConditionRequest'
} as const;

export const $AutomationEdgeRequest = {
    properties: {
        source: {
            '$ref': '#/components/schemas/AutomationNodeResponse'
        },
        target: {
            '$ref': '#/components/schemas/AutomationNodeResponse'
        },
        condition: {
            '$ref': '#/components/schemas/AutomationEdgeConditionRequest'
        }
    },
    type: 'object',
    required: ['source', 'target', 'condition'],
    title: 'AutomationEdgeRequest'
} as const;

export const $AutomationEdgeResponse = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        source: {
            '$ref': '#/components/schemas/AutomationNodeResponse'
        },
        target: {
            '$ref': '#/components/schemas/AutomationNodeResponse'
        },
        condition: {
            '$ref': '#/components/schemas/AutomationEdgeConditionRequest'
        }
    },
    type: 'object',
    required: ['id', 'source', 'target', 'condition'],
    title: 'AutomationEdgeResponse'
} as const;

export const $AutomationEdgeUpdateRequest = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        source: {
            '$ref': '#/components/schemas/AutomationNodeResponse'
        },
        target: {
            '$ref': '#/components/schemas/AutomationNodeResponse'
        },
        condition: {
            '$ref': '#/components/schemas/AutomationEdgeConditionRequest'
        }
    },
    type: 'object',
    required: ['id', 'source', 'target', 'condition'],
    title: 'AutomationEdgeUpdateRequest'
} as const;

export const $AutomationNodeRequest = {
    properties: {
        smart_controller_id: {
            type: 'string',
            title: 'Smart Controller Id'
        },
        action_id: {
            type: 'string',
            title: 'Action Id'
        },
        location: {
            '$ref': '#/components/schemas/Location'
        }
    },
    type: 'object',
    required: ['smart_controller_id', 'action_id', 'location'],
    title: 'AutomationNodeRequest'
} as const;

export const $AutomationNodeResponse = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        unique_key: {
            type: 'string',
            title: 'Unique Key'
        },
        smart_controller_id: {
            type: 'string',
            title: 'Smart Controller Id'
        },
        action_id: {
            type: 'string',
            title: 'Action Id'
        },
        location: {
            '$ref': '#/components/schemas/Location'
        }
    },
    type: 'object',
    required: ['id', 'unique_key', 'smart_controller_id', 'action_id', 'location'],
    title: 'AutomationNodeResponse'
} as const;

export const $AutomationNodeUpdateRequest = {
    properties: {
        smart_controller_id: {
            type: 'string',
            title: 'Smart Controller Id'
        },
        action_id: {
            type: 'string',
            title: 'Action Id'
        },
        location: {
            '$ref': '#/components/schemas/Location'
        }
    },
    type: 'object',
    required: ['smart_controller_id', 'action_id', 'location'],
    title: 'AutomationNodeUpdateRequest'
} as const;

export const $AutomationRequest = {
    properties: {
        name: {
            type: 'string',
            title: 'Name'
        }
    },
    type: 'object',
    required: ['name'],
    title: 'AutomationRequest'
} as const;

export const $AutomationResponse = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        name: {
            type: 'string',
            title: 'Name'
        },
        inserted_at: {
            type: 'string',
            format: 'date-time',
            title: 'Inserted At'
        },
        nodes: {
            items: {
                '$ref': '#/components/schemas/AutomationNodeResponse'
            },
            type: 'array',
            title: 'Nodes'
        },
        edges: {
            items: {
                '$ref': '#/components/schemas/AutomationEdgeResponse'
            },
            type: 'array',
            title: 'Edges'
        },
        is_active: {
            type: 'boolean',
            title: 'Is Active'
        },
        viewport: {
            allOf: [
                {
                    '$ref': '#/components/schemas/GraphViewport'
                }
            ],
            default: {
                x: 0,
                y: 0,
                zoom: 0
            }
        }
    },
    type: 'object',
    required: ['id', 'name', 'inserted_at', 'nodes', 'edges', 'is_active'],
    title: 'AutomationResponse'
} as const;

export const $AutomationUpdateRequest = {
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            default: ''
        },
        is_active: {
            type: 'boolean',
            title: 'Is Active'
        },
        viewport: {
            '$ref': '#/components/schemas/GraphViewport'
        }
    },
    type: 'object',
    required: ['is_active', 'viewport'],
    title: 'AutomationUpdateRequest'
} as const;

export const $ConditionType = {
    type: 'string',
    enum: ['by_value', 'by_trigger'],
    title: 'ConditionType'
} as const;

export const $GraphViewport = {
    properties: {
        x: {
            type: 'number',
            title: 'X'
        },
        y: {
            type: 'number',
            title: 'Y'
        },
        zoom: {
            type: 'number',
            title: 'Zoom'
        }
    },
    type: 'object',
    required: ['x', 'y', 'zoom'],
    title: 'GraphViewport'
} as const;

export const $HTTPValidationError = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            type: 'array',
            title: 'Detail'
        }
    },
    type: 'object',
    title: 'HTTPValidationError'
} as const;

export const $Location = {
    properties: {
        x: {
            type: 'number',
            title: 'X'
        },
        y: {
            type: 'number',
            title: 'Y'
        }
    },
    type: 'object',
    required: ['x', 'y'],
    title: 'Location'
} as const;

export const $Operator = {
    type: 'string',
    enum: ['>', '<', '<=', '>=', '==', '!='],
    title: 'Operator'
} as const;

export const $ReturnValueType = {
    type: 'string',
    enum: ['boolean', 'number'],
    title: 'ReturnValueType'
} as const;

export const $SmartControllerRequest = {
    properties: {
        name: {
            type: 'string',
            title: 'Name'
        },
        address: {
            type: 'string',
            title: 'Address'
        },
        actions: {
            items: {
                type: 'string'
            },
            type: 'array',
            title: 'Actions'
        }
    },
    type: 'object',
    required: ['name', 'address', 'actions'],
    title: 'SmartControllerRequest'
} as const;

export const $SmartControllerResponse = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        name: {
            type: 'string',
            title: 'Name'
        },
        address: {
            type: 'string',
            title: 'Address'
        },
        actions: {
            items: {
                '$ref': '#/components/schemas/ActionResponse'
            },
            type: 'array',
            title: 'Actions'
        }
    },
    type: 'object',
    required: ['id', 'name', 'address', 'actions'],
    title: 'SmartControllerResponse'
} as const;

export const $SmartControllerUpdateRequest = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        name: {
            type: 'string',
            title: 'Name',
            default: ''
        },
        address: {
            type: 'string',
            title: 'Address',
            default: ''
        },
        actions: {
            anyOf: [
                {
                    items: {
                        type: 'string'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Actions'
        }
    },
    type: 'object',
    required: ['id'],
    title: 'SmartControllerUpdateRequest'
} as const;

export const $TaskRequest = {
    properties: {
        type: {
            '$ref': '#/components/schemas/TaskType'
        },
        action_id: {
            type: 'string',
            title: 'Action Id'
        },
        smart_controller_id: {
            type: 'string',
            title: 'Smart Controller Id'
        },
        minute: {
            type: 'integer',
            title: 'Minute'
        },
        hour: {
            type: 'integer',
            title: 'Hour'
        },
        week_day: {
            type: 'integer',
            title: 'Week Day'
        },
        month_day: {
            type: 'integer',
            title: 'Month Day'
        }
    },
    type: 'object',
    required: ['type', 'action_id', 'smart_controller_id', 'minute', 'hour', 'week_day', 'month_day'],
    title: 'TaskRequest'
} as const;

export const $TaskResponse = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        type: {
            '$ref': '#/components/schemas/TaskType'
        },
        action: {
            '$ref': '#/components/schemas/ActionResponse'
        },
        smart_controller: {
            '$ref': '#/components/schemas/SmartControllerResponse'
        },
        minute: {
            type: 'integer',
            title: 'Minute'
        },
        hour: {
            type: 'integer',
            title: 'Hour'
        },
        week_day: {
            type: 'integer',
            title: 'Week Day'
        },
        month_day: {
            type: 'integer',
            title: 'Month Day'
        }
    },
    type: 'object',
    required: ['id', 'type', 'action', 'smart_controller', 'minute', 'hour', 'week_day', 'month_day'],
    title: 'TaskResponse'
} as const;

export const $TaskType = {
    type: 'string',
    enum: ['daily', 'weekly', 'monthly'],
    title: 'TaskType'
} as const;

export const $TaskUpdateRequest = {
    properties: {
        id: {
            type: 'string',
            title: 'Id'
        },
        type: {
            anyOf: [
                {
                    '$ref': '#/components/schemas/TaskType'
                },
                {
                    type: 'null'
                }
            ]
        },
        action: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Action'
        },
        minute: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Minute'
        },
        hour: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Hour'
        },
        week_day: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Week Day'
        },
        month_day: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Month Day'
        }
    },
    type: 'object',
    required: ['id'],
    title: 'TaskUpdateRequest'
} as const;

export const $ValidationError = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            type: 'array',
            title: 'Location'
        },
        msg: {
            type: 'string',
            title: 'Message'
        },
        type: {
            type: 'string',
            title: 'Error Type'
        }
    },
    type: 'object',
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError'
} as const;