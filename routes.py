api_base = "/api"

user_base           = api_base + "/users"
user_unique         = user_base + "/<id>"
user_login          = user_base + "/login"

message_base        = api_base + "/messages"
message_direction   = message_base + "/<id_from>/<id_to>"
message_last        = message_direction + "/last"
