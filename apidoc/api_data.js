define({ "api": [
  {
    "type": "delete",
    "url": "/admin/v1/election/:id",
    "title": "Delete Election",
    "version": "0.1.0",
    "name": "DeleteElection",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Election's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/admin/v1/election.js",
    "groupTitle": "Admin",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/admin/v1/poll/:id",
    "title": "Delete Poll",
    "version": "0.1.0",
    "name": "DeletePoll",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Poll's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/admin/v1/poll.js",
    "groupTitle": "Admin",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/admin/v1/survey/:id",
    "title": "Delete Survey",
    "version": "0.1.0",
    "name": "DeleteSurvey",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Survey's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/admin/v1/survey.js",
    "groupTitle": "Admin",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SurveyNotFound",
            "description": "<p>The requested survey was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/admin/v1/user/:id",
    "title": "Delete User",
    "version": "0.1.0",
    "name": "DeleteUser",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/admin/v1/user.js",
    "groupTitle": "Admin",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/categories/v1/category",
    "title": "Create category",
    "version": "0.1.0",
    "name": "Create_Category",
    "group": "Category",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"category\": \"general\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/categories/v1/category.js",
    "groupTitle": "Category",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/categories/v1/category/:id",
    "title": "Delete category",
    "version": "0.1.0",
    "name": "Delete_Category",
    "group": "Category",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Category Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/categories/v1/category.js",
    "groupTitle": "Category",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CategoryNotFound",
            "description": "<p>The requested category was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/categories/v1/category",
    "title": "Index categories",
    "version": "0.1.0",
    "name": "Index_Category",
    "group": "Category",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n   {\n   \"id\": 1,\n   \"name\": \"general\"\n   },\n   {\n   \"id\": 2,\n   \"name\": \"sports\"\n   }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/categories/v1/category.js",
    "groupTitle": "Category",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CategoryNotFound",
            "description": "<p>The requested category was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/categories/v1/category/:id",
    "title": "Update category",
    "version": "0.1.0",
    "name": "Update_Category",
    "group": "Category",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Category Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"category\": \"general\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"name\": \"general\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/categories/v1/category.js",
    "groupTitle": "Category",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CategoryNotFound",
            "description": "<p>The requested category was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CategoryAlreadyExists",
            "description": "<p>The requested category name already exists under another id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n     error: \"Category already exists!\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/dashboard/v1/dashboard/:id",
    "title": "Show Dashboard",
    "version": "0.1.0",
    "name": "ShowDashboard",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/dashboard/v1/dashboard.js",
    "groupTitle": "Dashboard",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/feedback/v1/feedback/:id",
    "title": "Create Feedback",
    "version": "0.1.0",
    "name": "CreateFeedback",
    "group": "Feedback",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/feedback/v1/feedback.js",
    "groupTitle": "Feedback",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/import/v1/xlPoll",
    "title": "Import Polls",
    "version": "0.1.0",
    "name": "Import_Polls",
    "group": "Import",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\"createdUserId\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/import/v1/xlPoll.js",
    "groupTitle": "Import",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/polls/v1/answer",
    "title": "Answer poll",
    "version": "0.1.0",
    "name": "Answer",
    "group": "Poll",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n     \"pollId\": \"11\",\n     \"userId\": \"4\",\n     \"questionList\": [\n             {\n                 \"questionId\": \"4\",\n                 \"optionId\": \"8\"\n             },\n             {\n                 \"questionId\": \"5\",\n                 \"optionId\": \"11\"\n             }\n        ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/answer.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/poll/v1/pollList",
    "title": "List polls for Audience User",
    "version": "0.1.0",
    "name": "CreatePollList",
    "group": "Poll",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>Audience User Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lowerLimit",
            "description": "<p>Limit for number of polls.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "upperLimit",
            "description": "<p>Limit for number of polls.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "isAnswered",
            "description": "<p>is answered flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"userId\": 4,\n      \"lowerLimit\": 1,\n      \"upperLimit\": 10,\n      \"isAnswered\": 2\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n{\n\"id\": 12,\n\"start_date\": \"2015-10-23T05:22:22.000Z\",\n\"poll_id\": 4,\n\"is_boost\": 0,\n\"end_date\": \"2015-10-23T05:22:22.000Z\",\n\"user_id\": 9,\n\"poll_type_id\": 3,\n\"created_user_id\": 9,\n\"poll_name\": \"Cinema\",\n\"is_answered\": \"0\",\n\"is_active\": 1,\n\"isGeneric\": 1\n},\n{\n\"id\": 15,\n\"start_date\": \"2015-10-23T05:30:04.000Z\",\n\"poll_id\": 5,\n\"is_skipped\": 0,\n\"is_boost\": 0,\n\"end_date\": \"2015-10-23T05:30:04.000Z\",\n\"user_id\": 9,\n\"poll_type_id\": 2,\n\"created_user_id\": 6,\n\"poll_name\": \"Composer\",\n\"is_answered\": \"0\",\n\"is_active\": 1,\n\"isGeneric\": 1\n}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/pollList.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/polls/v1/poll",
    "title": "Create poll",
    "version": "0.1.0",
    "name": "Create_Poll",
    "group": "Poll",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\"pollName\": \"Best Footballer\",\n\"isBoost\": \"0\"\n\"visibilityType\": \"visible\",\n\"rewardType\": \"free\",\n\"category\": \"sports\",\n\"isGeneric\": \"0\",\n\"createdUserId\": \"1\",\n\"pollType\": \"opinion\",\n\"questionList\": [\n     {\n         \"question\": \"Who is the best striker?\",\n         \"questionType\": \"text\",\n         \"choices\": [\n             \"Messi\",\n             \"Ronaldo\",\n             \"Suarez\"\n             ]\n      },\n      {\n         \"question\": \"Who is the top goal scorer?\",\n         \"questionType\": \"text\",\n         \"choices\": [\n             \"Messi\",\n             \"Ronaldo\",\n             \"Suarez\"\n             ]\n       }\n  ],\n  \"audience\": [\n  \"9994012253\",\n  \"9944377754\",\n  \"9443797732\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/poll.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/polls/v1/poll/:id",
    "title": "Delete poll",
    "version": "0.1.0",
    "name": "Delete_Poll",
    "group": "Poll",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Poll Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/poll.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "show",
    "url": "/poll/v1/Result/:id",
    "title": "Show poll results",
    "version": "0.1.0",
    "name": "Poll_Result",
    "group": "Poll",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Poll Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"pollName\": \"Best Footballer\",\n     \"questionList\": [\n              {\n                 \"questionType\": \"text\",\n                 \"question\": \"Who is the best footballer?\",\n                 \"choices\": [\n                        {\n                          \"percentage\": \"100 %\",\n                          \"resultCount\": 1,\n                          \"choice\": \"Messi\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Ronaldo\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Ibrahimovic\"\n                        }\n                  ],\n              \"totalCount\": 1\n              },\n             {\n                  \"questionType\": \"text\",\n                  \"question\": \"Who is the top goal scorer?\",\n                  \"choices\": [\n                        {\n                          \"percentage\": \"100 %\",\n                          \"resultCount\": 1,\n                          \"choice\": \"Messi\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Ronaldo\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Lewandoski\"\n                        }\n                  ],\n                  \"totalCount\": 1\n            }\n            ],\n      \"createdUserId\": 1,\n      \"category\": \"Sports\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/result.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/polls/v1/pollList/:id",
    "title": "List polls for Created User",
    "version": "0.1.0",
    "name": "ShowPollList",
    "group": "Poll",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Created User Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n  {\n      \"visibility_type_id\": 1,\n      \"created_user_id\": 6,\n      \"poll_type_id\": 2,\n      \"id\": 1,\n      \"poll_name\": \"Best Footballer\",\n      \"start_date\": \"2015-10-23T04:39:20.000Z\",\n      \"reward_type_id\": 1,\n      \"is_boost\": 0,\n      \"is_active\": 1,\n      \"end_date\": \"2015-10-23T04:39:20.000Z\"\n  },\n  {\n      \"visibility_type_id\": 1,\n      \"created_user_id\": 6,\n      \"poll_type_id\": 2,\n      \"id\": 5,\n      \"poll_name\": \"Composer\",\n      \"start_date\": \"2015-10-23T05:30:04.000Z\",\n      \"reward_type_id\": 1,\n      \"is_boost\": 0,\n      \"is_active\": 1,\n      \"isGeneric\": 1,\n      \"end_date\": \"2015-10-23T05:30:04.000Z\"\n  },\n  {\n      \"visibility_type_id\": 1,\n      \"created_user_id\": 6,\n      \"poll_type_id\": 2,\n      \"id\": 6,\n      \"poll_name\": \"Composer\",\n      \"start_date\": \"2015-10-23T05:30:09.000Z\",\n      \"reward_type_id\": 1,\n      \"is_boost\": 0,\n      \"is_active\": 1,\n      \"isGeneric\": 1,\n      \"end_date\": \"2015-10-23T05:30:09.000Z\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/pollList.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/polls/v1/poll/:id",
    "title": "Show poll",
    "version": "0.1.0",
    "name": "Show_Poll",
    "group": "Poll",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Poll Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n   {\n   \"category\": \"Sports\",\n   \"createdUser\": \"Kennet Paul\",\n   \"visibilityType\": \"visible\",\n   \"isBoost\": 0,\n   \"pollType\": \"opinion\",\n   \"rewardType\": \"free\",\n   \"questionList\": [\n                    {\n                    \"questionType\": \"text\",\n                    \"questionId\": 9,\n                    \"question\": \"Who is the best striker?\",\n                    \"choices\": [\n                                {\n                                \"optionId\": 22,\n                                \"choice\": \"Messi\"\n                                },\n                                {\n                                \"optionId\": 23,\n                                \"choice\": \"Ronaldo\"\n                                 },\n                                {\n                                \"optionId\": 24,\n                                \"choice\": \"Suarez\"\n                                }\n                             ]\n                    },\n                    {\n                    \"questionType\": \"text\",\n                    \"questionId\": 9,\n                    \"question\": \"Who is the top goal scorer?\",\n                    \"choices\": [\n                                {\n                                \"optionId\": 25,\n                                \"choice\": \"Messi\"\n                                },\n                                {\n                                \"optionId\": 26,\n                                \"choice\": \"Ronaldo\"\n                                },\n                                {\n                                \"optionId\": 27,\n                                \"choice\": \"Suarez\"\n                                }\n                              ]\n                    }\n                  ],\n                \"pollName\": \"Best Footballer\",\n                \"createdUserId\": 2\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/poll.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/polls/v1/poll/:id",
    "title": "Update poll",
    "version": "0.1.0",
    "name": "Update_Poll",
    "group": "Poll",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"audience\": [\n      \"9994012253\",\n      \"9944377754\",\n      \"9443797732\"\n      ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/polls/v1/poll.js",
    "groupTitle": "Poll",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/search/v1/searchPoll",
    "title": "Search Polls",
    "version": "0.1.0",
    "name": "CreateSearchPoll",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>Audience User Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchString",
            "description": "<p>String to be searched for.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"userId\": 4,\n      \"searchString\": \"bes\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  HTTP/1.1 200 OK\n  [\n  {\n       \"pollId\": 653,\n       \"isGeneric\": 0,\n       \"endDate\": \"2016-03-07T06:45:07.000Z\",\n       \"isSurvey\": 0,\n       \"startDate\": \"2016-02-08T06:45:07.000Z\",\n       \"isBoost\": 0,\n       \"isAnswered\": \"0\",\n       \"createdUserName\": \"hugh jackman\",\n       \"pollName\": \"Best Shopping mall\",\n       \"isActive\": 1\n  },\n  {\n      \"pollId\": 651,\n      \"isGeneric\": 0,\n      \"endDate\": \"2016-03-01T08:51:10.000Z\",\n      \"isSurvey\": 0,\n      \"startDate\": \"2016-02-02T08:51:10.000Z\",\n      \"isBoost\": 0,\n      \"isAnswered\": \"0\",\n      \"createdUserName\": \"Kennet\",\n      \"pollName\": \"Best Comedian\",\n      \"isActive\": 1\n  },\n  {\n     \"pollId\": 650,\n     \"isGeneric\": 0,\n     \"endDate\": \"2016-03-01T08:49:15.000Z\",\n     \"isSurvey\": 0,\n     \"startDate\": \"2016-02-02T08:49:15.000Z\",\n     \"isBoost\": 0,\n     \"isAnswered\": \"0\",\n     \"createdUserName\": \"Kennet\",\n     \"pollName\": \"Best Actress\",\n     \"isActive\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/search/v1/searchPoll.js",
    "groupTitle": "Search",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/search/v1/searchSurvey",
    "title": "Search Surveys",
    "version": "0.1.0",
    "name": "CreateSearchSurvey",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchString",
            "description": "<p>String to be searched for.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"searchString\": \"bes\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  HTTP/1.1 200 OK\n  [\n  {\n       \"pollId\": 653,\n       \"isGeneric\": 0,\n       \"endDate\": \"2016-03-07T06:45:07.000Z\",\n       \"isSurvey\": 1,\n       \"startDate\": \"2016-02-08T06:45:07.000Z\",\n       \"isBoost\": 0,\n       \"isAnswered\": \"0\",\n       \"createdUserName\": \"hugh jackman\",\n       \"pollName\": \"Best Shopping mall\",\n       \"isActive\": 1\n  },\n  {\n      \"pollId\": 651,\n      \"isGeneric\": 0,\n      \"endDate\": \"2016-03-01T08:51:10.000Z\",\n      \"isSurvey\": 1,\n      \"startDate\": \"2016-02-02T08:51:10.000Z\",\n      \"isBoost\": 0,\n      \"isAnswered\": \"0\",\n      \"createdUserName\": \"Kennet\",\n      \"pollName\": \"Best Sportstar\",\n      \"isActive\": 1\n  },\n  {\n     \"pollId\": 650,\n     \"isGeneric\": 0,\n     \"endDate\": \"2016-03-01T08:49:15.000Z\",\n     \"isSurvey\": 1,\n     \"startDate\": \"2016-02-02T08:49:15.000Z\",\n     \"isBoost\": 0,\n     \"isAnswered\": \"0\",\n     \"createdUserName\": \"Kennet\",\n     \"pollName\": \"Best Model\",\n     \"isActive\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/search/v1/searchSurvey.js",
    "groupTitle": "Search",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SurveyNotFound",
            "description": "<p>The requested survey was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/search/v1/searchElection",
    "title": "Search Elections",
    "version": "0.1.0",
    "name": "searchElection",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>Audience User Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchString",
            "description": "<p>String to be searched for.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"userId\": 4,\n      \"searchString\": \"bes\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n[\n {\n   \"electionId\": 1,\n   \"electionName\": \"Shuttle master\",\n   \"startDate\": \"2016-05-01T00:00:00.000Z\",\n   \"endDate\": \"2016-05-03T00:00:00.000Z\",\n   \"nominationEndDate\": \"2016-04-16T00:00:00.000Z\",\n   \"associationName\": \"Orgware-Test\",\n   \"isVoted\": 1\n }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/search/v1/searchElection.js",
    "groupTitle": "Search",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/survey/v1/answerSurvey",
    "title": "Create Survey",
    "version": "0.1.0",
    "name": "Answer_Survey",
    "group": "Survey",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n     \"pollId\": \"11\",\n     \"name\": \"jobs\",\n     \"phone\": \"9878987678\"\n     \"questionList\": [\n             {\n                 \"question\": \"Who is the best cricketer?\",\n                 \"option\": \"Sachin\"\n             },\n             {\n                 \"question\": \"Who is the best footballer?\",\n                 \"option\": \"Messi\"\n             }\n        ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/answerSurvey.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SurveyNotFound",
            "description": "<p>The requested survey was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/survey/v1/surveyList",
    "title": "List surveys for Audience User",
    "version": "0.1.0",
    "name": "CreateSurveyList",
    "group": "Survey",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lowerLimit",
            "description": "<p>Limit for number of polls.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"lowerLimit\": 0,\n      \"upperLimit\": 10\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n{\n\"id\": 12,\n\"start_date\": \"2015-10-23T05:22:22.000Z\",\n\"poll_id\": 4,\n\"is_skipped\": 0,\n\"is_boost\": 0,\n\"end_date\": \"2015-10-23T05:22:22.000Z\",\n\"user_id\": 9,\n\"poll_type_id\": 3,\n\"created_user_id\": 9,\n\"poll_name\": \"Cinema\",\n\"is_answered\": \"0\",\n\"is_active\": 1,\n\"isGeneric\": 1\n},\n{\n\"id\": 15,\n\"start_date\": \"2015-10-23T05:30:04.000Z\",\n\"poll_id\": 5,\n\"is_skipped\": 0,\n\"is_boost\": 0,\n\"end_date\": \"2015-10-23T05:30:04.000Z\",\n\"user_id\": 9,\n\"poll_type_id\": 2,\n\"created_user_id\": 6,\n\"poll_name\": \"Composer\",\n\"is_answered\": \"0\",\n\"is_active\": 1,\n\"isGeneric\": 1\n}\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/surveyList.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/survey/v1/survey",
    "title": "Create survey",
    "version": "0.1.0",
    "name": "Create_Survey",
    "group": "Survey",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\"pollName\": \"Best Footballer\",\n\"isBoost\": \"0\"\n\"visibilityType\": \"visible\",\n\"rewardType\": \"free\",\n\"category\": \"sports\",\n\"isGeneric\": \"0\",\n\"createdUserId\": \"1\",\n\"pollType\": \"opinion\",\n\"isSurvey\": \"1\"\n\"questionList\": [\n     {\n         \"question\": \"Who is the best striker?\",\n         \"questionType\": \"text\",\n         \"choices\": [\n             \"Messi\",\n             \"Ronaldo\",\n             \"Suarez\"\n             ]\n      },\n      {\n         \"question\": \"Who is the top goal scorer?\",\n         \"questionType\": \"text\",\n         \"choices\": [\n             \"Messi\",\n             \"Ronaldo\",\n             \"Suarez\"\n             ]\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/survey.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/survey/v1/survey/:id",
    "title": "Delete Survey",
    "version": "0.1.0",
    "name": "Delete_Survey",
    "group": "Survey",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Survey Poll Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/survey.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SurveyNotFound",
            "description": "<p>The requested survey was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/survey/v1/surveyList/:id",
    "title": "List surveys for Created User",
    "version": "0.1.0",
    "name": "ShowSurveyList",
    "group": "Survey",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Created User Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n  {\n      \"visibility_type_id\": 1,\n      \"created_user_id\": 6,\n      \"poll_type_id\": 2,\n      \"id\": 1,\n      \"poll_name\": \"Best Footballer\",\n      \"start_date\": \"2015-10-23T04:39:20.000Z\",\n      \"reward_type_id\": 1,\n      \"is_boost\": 0,\n      \"is_active\": 1,\n      \"end_date\": \"2015-10-23T04:39:20.000Z\"\n  },\n  {\n      \"visibility_type_id\": 1,\n      \"created_user_id\": 6,\n      \"poll_type_id\": 2,\n      \"id\": 5,\n      \"poll_name\": \"Composer\",\n      \"start_date\": \"2015-10-23T05:30:04.000Z\",\n      \"reward_type_id\": 1,\n      \"is_boost\": 0,\n      \"is_active\": 1,\n      \"isGeneric\": 1,\n      \"end_date\": \"2015-10-23T05:30:04.000Z\"\n  },\n  {\n      \"visibility_type_id\": 1,\n      \"created_user_id\": 6,\n      \"poll_type_id\": 2,\n      \"id\": 6,\n      \"poll_name\": \"Composer\",\n      \"start_date\": \"2015-10-23T05:30:09.000Z\",\n      \"reward_type_id\": 1,\n      \"is_boost\": 0,\n      \"is_active\": 1,\n      \"isGeneric\": 1,\n      \"end_date\": \"2015-10-23T05:30:09.000Z\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/surveyList.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/survey/v1/survey/:id",
    "title": "Show survey",
    "version": "0.1.0",
    "name": "Show_Survey",
    "group": "Survey",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Poll Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n   {\n   \"category\": \"Sports\",\n   \"createdUser\": \"Kennet Paul\",\n   \"visibilityType\": \"visible\",\n   \"isBoost\": 0,\n   \"pollType\": \"opinion\",\n   \"rewardType\": \"free\",\n   \"isSurvey\": \"1\",\n   \"questionList\": [\n            {\n            \"questionType\": \"text\",\n            \"questionId\": 9,\n            \"question\": \"Who is the best striker?\",\n            \"choices\": [\n                    {\n                    \"optionId\": 22,\n                    \"choice\": \"Messi\"\n                    },\n                    {\n                    \"optionId\": 23,\n                    \"choice\": \"Ronaldo\"\n                    },\n                    {\n                    \"optionId\": 24,\n                    \"choice\": \"Suarez\"\n                    }\n                ]\n            },\n            {\n            \"questionType\": \"text\",\n            \"questionId\": 9,\n            \"question\": \"Who is the top goal scorer?\",\n            \"choices\": [\n                    {\n                    \"optionId\": 25,\n                    \"choice\": \"Messi\"\n                    },\n                    {\n                    \"optionId\": 26,\n                    \"choice\": \"Ronaldo\"\n                    },\n                    {\n                    \"optionId\": 27,\n                    \"choice\": \"Suarez\"\n                    }\n                ]\n            }\n   ],\n   \"pollName\": \"Best Footballer\",\n   \"createdUserId\": 2\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/survey.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PollNotFound",
            "description": "<p>There are no polls for the given string.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "show",
    "url": "/survey/v1/surveyResult/:id",
    "title": "Show survey results",
    "version": "0.1.0",
    "name": "Survey_Result",
    "group": "Survey",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>SurveyPoll Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"pollName\": \"Best Footballer\",\n     \"questionList\": [\n              {\n                 \"questionType\": \"text\",\n                 \"question\": \"Who is the best footballer?\",\n                 \"choices\": [\n                        {\n                          \"percentage\": \"100 %\",\n                          \"resultCount\": 1,\n                          \"choice\": \"Messi\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Ronaldo\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Ibrahimovic\"\n                        }\n                  ],\n              \"totalCount\": 1\n              },\n             {\n                  \"questionType\": \"text\",\n                  \"question\": \"Who is the top goal scorer?\",\n                  \"choices\": [\n                        {\n                          \"percentage\": \"100 %\",\n                          \"resultCount\": 1,\n                          \"choice\": \"Messi\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Ronaldo\"\n                        },\n                        {\n                          \"percentage\": \"0 %\",\n                          \"resultCount\": 0,\n                          \"choice\": \"Lewandoski\"\n                        }\n                  ],\n                  \"totalCount\": 1\n            }\n            ],\n      \"createdUserId\": 1,\n      \"category\": \"Sports\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "services/survey/v1/surveyResult.js",
    "groupTitle": "Survey",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SurveyNotFound",
            "description": "<p>The requested survey was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/v1/changeNumber",
    "title": "Change Number",
    "version": "0.1.0",
    "name": "ChangeNumber",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldNumber",
            "description": "<p>User's old phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newNumber",
            "description": "<p>User's new phone number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n     \"userId\": \"2\",\n     \"oldNumber\": \"9944377754\",\n     \"newNumber\": \"9940741304\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/changeNumber.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NumberMismatch",
            "description": "<p>The oldNumber does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyExists",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 501 Not Implemented",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/v1/user",
    "title": "Create User",
    "version": "0.1.0",
    "name": "CreateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>User's country name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>User's city name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>User's phone number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"country\": \"India\",\n      \"city\": \"Chennai\",\n      \"phone\": \"9991234567\",\n      \"name\": \"Kennet\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n      \"secretKey\": \"2b73926b3cf4f6554eb5f2eadc38be95e3b1e883b7e16d3f80fbe6b5732501007575f90ea947d988a6c63bab8216ca2dd2fcc2a0e7b604a8f8a76c3856f4fdf2\",\n      \"publicKey\": \"5ba30d56a51dea3c77bba7bddc39885d6a01879d18dbb6eb4df406d6988d8d55\",\n      \"userId\": \"67\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "users/v1/user/:id",
    "title": "Delete User",
    "version": "0.1.0",
    "name": "DeleteUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/v1/login",
    "title": "Create User",
    "version": "0.1.0",
    "name": "LoginUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>User's country name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>User's city name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>User's phone number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n      \"country\": \"India\",\n      \"city\": \"Chennai\",\n      \"phone\": \"9991234567\"\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/login.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "users/v1/logout/:id",
    "title": "Logout User",
    "version": "0.1.0",
    "name": "LogoutUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/logout.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "users/v1/user/:id",
    "title": "Show User",
    "version": "0.1.0",
    "name": "ShowUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"access_time\": \"2015-10-12T18:44:48.000Z\",\n    \"dob\": null,\n    \"country\": \"India\",\n    \"country_code\": 91,\n    \"city\": \"Chennai\",\n    \"is_verified\": 1,\n    \"secret_key\": \"35126696ab4cd2eb09ec0f65c42aa6d8fb404033175244da209e89551e4890b38c43bb5941ece6fa7ce7bc835a0e68d696b4be0346fabefccb3a4f92c90c3170\",\n    \"id\": 3,\n    \"gender\": \"male\",\n    \"email\": \"johndoe@gmail.com\",\n    \"phone\": \"9991234567\",\n    \"auth_code\": \"6425\",\n    \"auth_type_id\": 1,\n    \"created_time\": \"2015-10-12T18:44:48.000Z\",\n    \"role_id\": 1,\n    \"password\": null,\n    \"updated_time\": \"2015-10-12T19:51:41.000Z\",\n    \"name\": \"John\",\n    \"public_key\": \"144150e9404af9bb6b3fb7a480e2c122bd0af209235c6a673b7a33a62d58f293\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "users/v1/user/:id",
    "title": "Show User Timeline",
    "version": "0.1.0",
    "name": "ShowUserTimeline",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n     {\n       \"userName\": \"Kennet\",\n       \"pollId\": 648,\n       \"pollName\": \"Best Singer\",\n       \"createdUser\": \"Kennet\",\n       \"date\": \"2016-02-02T08:39:08.000Z\"\n     },\n     {\n       \"userName\": \"Kennet\",\n       \"pollId\": 649,\n       \"pollName\": \"Best Actor\",\n       \"createdUser\": \"Kennet\",\n       \"date\": \"2016-02-02T08:43:29.000Z\"\n     },\n     {\n       \"userName\": \"Kennet\",\n       \"pollId\": 650,\n       \"pollName\": \"Best Actress\",\n       \"createdUser\": \"Kennet\",\n       \"date\": \"2016-02-02T08:49:15.000Z\"\n     }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/timeline.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "users/v1/user/:id",
    "title": "Update User",
    "version": "0.1.0",
    "name": "UpdateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>User's phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>User's country name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>User's city name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"name\": \"John\"\n    \"email\": \"johndoe@gmail.com\",\n    \"phone\": \"9991234567\",\n    \"country\": \"India\",\n    \"city\":\"Chennai\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"access_time\": \"2015-10-12T18:44:48.000Z\",\n    \"dob\": null,\n    \"country\": \"India\",\n    \"country_code\": 91,\n    \"city\": \"Chennai\",\n    \"is_verified\": 1,\n    \"secret_key\": \"35126696ab4cd2eb09ec0f65c42aa6d8fb404033175244da209e89551e4890b38c43bb5941ece6fa7ce7bc835a0e68d696b4be0346fabefccb3a4f92c90c3170\",\n    \"id\": 3,\n    \"gender\": \"male\",\n    \"email\": \"johndoe@gmail.com\",\n    \"phone\": \"9991234567\",\n    \"auth_code\": \"6425\",\n    \"auth_type_id\": 1,\n    \"created_time\": \"2015-10-12T18:44:48.000Z\",\n    \"role_id\": 1,\n    \"password\": null,\n    \"updated_time\": \"2015-10-12T19:51:41.000Z\",\n    \"name\": \"John\",\n    \"public_key\": \"144150e9404af9bb6b3fb7a480e2c122bd0af209235c6a673b7a33a62d58f293\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "users/v1/verification/:id",
    "title": "Verify User",
    "version": "0.1.0",
    "name": "UserVerification",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "authCode",
            "description": "<p>Authentication code sent to mobile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"authCode\": \"6425\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/verification.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/v1/verifyNumber",
    "title": "Verify Number",
    "version": "0.1.0",
    "name": "VerifyNumber",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "authCode",
            "description": "<p>Four digit auth code.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n     \"userId\": 4,\n     \"authCode\": \"7488\",\n     \"newNumber\": \"9944377754\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/users/v1/verifyNumber.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user is unauthorised.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorised",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/nominate",
    "title": "Accept Candidate",
    "version": "0.1.0",
    "name": "AcceptCandidate",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "isActive",
            "description": "<p>is_active flag for candidate</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "candidateId",
            "description": "<p>Candidate's unique id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"isActive\": 1,\n    \"candidateId\": 3\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/nominate.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CandidateNotFound",
            "description": "<p>The requested candidate was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/invite",
    "title": "Invite Members to Association",
    "version": "0.1.0",
    "name": "AssociationInvite",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "candidateId",
            "description": "<p>Candidate's unique Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "electionId",
            "description": "<p>Election's unique Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"userId\": 3,\n   \"candidateId\": 7,\n   \"electionId\": 11\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/vote.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CandidateNotFound",
            "description": "<p>The requested candidate was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/invite",
    "title": "Invite Members to Association",
    "version": "0.1.0",
    "name": "AssociationInvite",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "associationId",
            "description": "<p>Association Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "member",
            "description": "<p>Member list consisting of their name, phone and country</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"member\": [\n       {\n         \"name\": \"Cath\",\n         \"phone\": \"9944377754\",\n         \"country\": \"India\",\n         \"city\": \"Chennai\",\n         \"code\": \"91\"\n       },\n       {\n         \"name\": \"Ken\",\n         \"phone\": \"9994012253\",\n         \"country\": \"India\",\n         \"city\": \"Chennai\",\n         \"code\": \"91\"\n       },\n       \"associationId\": 2\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/invite.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/association",
    "title": "Create Association",
    "version": "0.1.0",
    "name": "CreateAssociation",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "associationName",
            "description": "<p>Association name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "associationAdminId",
            "description": "<p>Association Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"associationName\": \"Orgware\",\n \"associationAdminId\": \"2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AssociationID\": 3\n }",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/association.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/associationList",
    "title": "List of associations for Member user",
    "version": "0.1.0",
    "name": "CreateAssociationList",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "lowerLimit",
            "description": "<p>lower bound of the range of association list.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "upperLimit",
            "description": "<p>upper bound of the range of association list.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"userId\": \"1\",\n \"lowerLimit\": 0,\n \"upperLimit\": 10\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n  {\n    \"associationAdminName\": \"Goounj Bvocal\",\n    \"associationID\": 1,\n    \"associationName\": \"Orgware Technologies\"\n  },\n  {\n    \"associationAdminName\": \"Goounj Bvocal\",\n    \"associationID\": 2,\n    \"associationName\": \"Devs\"\n  },\n  {\n    \"associationAdminName\": \"Goounj Bvocal\",\n    \"associationID\": 3,\n    \"associationName\": \"Orgware\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/associationList.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/candidate",
    "title": "Create Candidate",
    "version": "0.1.0",
    "name": "CreateCandidate",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Candidate's userId.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "electionId",
            "description": "<p>Election Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Candidate's prefered user name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nickName",
            "description": "<p>Candidate's nick name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "about",
            "description": "<p>Candidate's detail.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "manifesto",
            "description": "<p>Candidate's manifesto.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"userId\": \"2\",\n    \"electionId\": \"1\",\n    \"userName\": \"Catherine\",\n    \"nickName\": \"Kate\",\n    \"about\": \"JS developer\",\n    \"manifesto\": \"I will blah blah blah\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"candidateId\": 3\n }",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/candidate.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/candidateList/:id",
    "title": "List of candidates for an election",
    "version": "0.1.0",
    "name": "CreateCandidateList",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Election Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"candidateCount\": 2,\n     \"candidates\": [\n               {\n                  \"nickName\": \"Kate\",\n                  \"candidateId\": 2,\n                  \"name\": \"Catherine\",\n                  \"about\": \"JS developer\",\n                  \"manifesto\": \"I will blah blah blah\"\n                },\n                {\n                  \"nickName\": \"Sam\",\n                  \"candidateId\": 3,\n                  \"name\": \"Samuel\",\n                  \"about\": \"Process Designer\",\n                  \"manifesto\": \"I will blah blah blah\"\n                }\n         ]\n }",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"candidateCount\": 0,\n    \"message\": \"There are no candidates for this election yet.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/candidateList.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/election",
    "title": "Create Election",
    "version": "0.1.0",
    "name": "CreateElection",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "electionName",
            "description": "<p>Name of the election.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start date of election.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>End date of election.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vigilanceUserName",
            "description": "<p>Name of the vigilance user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nominationEndDate",
            "description": "<p>End date for nominations.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "associationId",
            "description": "<p>Association's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "associationAdminId",
            "description": "<p>Admin user's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "members",
            "description": "<p>list of members of the association who can vote for the election.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"electionName\": \"Orgware\",\n    \"startDate\": \"Jan 18 2016\",\n    \"endDate\": \"Jan 20 2016\",\n    \"vigilanceUserName\": \"Kennet\",\n    \"nominationEndDate\": \"Jan 16 2016\",\n    \"associationId\": \"1\",\n    \"associationAdminId\": \"1\",\n    \"members\": [\n       \"Catherine\", \"Victoria\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"electionId\": 3\n }",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/election.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/electionList",
    "title": "List of elections for user",
    "version": "0.1.0",
    "name": "CreateElectionList",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "lowerLimit",
            "description": "<p>lower bound of the range of election list.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "upperLimit",
            "description": "<p>upper bound of the range of election list.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "isVoted",
            "description": "<p>either 0, 1 or 2</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"userId\": \"1\",\n \"lowerLimit\": 0,\n \"upperLimit\": 10,\n \"isVoted\": \"2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n     {\n         \"electionId\": 2,\n         \"electionName\": \"Orgware\",\n         \"endDate\": \"1/20/2016, 12:00:00 AM\",\n         \"startDate\": \"1/18/2016, 12:00:00 AM\",\n         \"isVoted\": 1,\n         \"nominationEndDate\": \"1/16/2016, 12:00:00 AM\",\n         \"associationName\": \"Orgware\"\n     },\n     {\n         \"electionId\": 4,\n         \"electionName\": \"Scrum master\",\n         \"endDate\": \"1/30/2016, 12:00:00 AM\",\n         \"startDate\": \"1/27/2016, 12:00:00 AM\",\n         \"isVoted\": 1,\n         \"nominationEndDate\": \"1/21/2016, 12:00:00 AM\",\n         \"associationName\": \"Orgware\"\n     }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/electionList.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/vote/v1/association/:id",
    "title": "Delete Association",
    "version": "0.1.0",
    "name": "DeleteAssociation",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "associationId",
            "description": "<p>Association Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/association.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/vote/v1/candidate/:id",
    "title": "Delete Candidate",
    "version": "0.1.0",
    "name": "DeleteCandidate",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Candidate's userId.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/candidate.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CandidateNotFound",
            "description": "<p>The requested candidate was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/electionListByAssociation/:id",
    "title": "Election List by Association",
    "version": "0.1.0",
    "name": "ElectionListByAssociation",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Association Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n[\n     {\n         \"electionId\": 2,\n         \"electionName\": \"Orgware\",\n         \"endDate\": \"1/20/2016, 12:00:00 AM\",\n         \"startDate\": \"1/18/2016, 12:00:00 AM\",\n         \"isVoted\": 1,\n         \"nominationEndDate\": \"1/16/2016, 12:00:00 AM\",\n         \"associationName\": \"Orgware\"\n     },\n     {\n         \"electionId\": 4,\n         \"electionName\": \"Scrum master\",\n         \"endDate\": \"1/30/2016, 12:00:00 AM\",\n         \"startDate\": \"1/27/2016, 12:00:00 AM\",\n         \"isVoted\": 1,\n         \"nominationEndDate\": \"1/21/2016, 12:00:00 AM\",\n         \"associationName\": \"Orgware\"\n     }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/electionListByAssociation.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/electionList/:id",
    "title": "Election List for the created user",
    "version": "0.1.0",
    "name": "ElectionListForCreatedUser",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n {\n   \"vigilanceUserId\": 3,\n   \"electionName\": \"Shuttle master\",\n   \"nominationEndDate\": \"2016-04-15T18:30:00.000Z\",\n   \"createdDate\": \"2016-04-13T08:44:25.000Z\",\n   \"votesForThisElection\": 0,\n   \"associationId\": 2,\n   \"endDate\": \"2016-05-02T18:30:00.000Z\",\n   \"noOfElections\": 3,\n   \"electionId\": 4,\n   \"vigilanceUser\": \"Cath\",\n   \"associationName\": \"devs\",\n   \"startDate\": \"2016-04-30T18:30:00.000Z\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/electionList.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/association",
    "title": "Index Association",
    "version": "0.1.0",
    "name": "IndexAssociation",
    "group": "Vote",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n  {\n    \"name\": \"Orgware Technologies\",\n    \"is_active\": 1\n  },\n  {\n    \"name\": \"Devs\",\n    \"is_active\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/association.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/requestOtp",
    "title": "Request OTP for a user",
    "version": "0.1.0",
    "name": "RequestOtp",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"userId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/requestOtp.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/association/:id",
    "title": "Show Association",
    "version": "0.1.0",
    "name": "ShowAssociation",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "associationId",
            "description": "<p>Association Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n   \"memberTotal\": 1,\n   \"name\": \"Orgware Technologies\",\n   \"associationAdminId\": 1,\n   \"associationAdminName\": \"Goounj Bvocal\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/association.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/associationList/:id",
    "title": "List of associations for Admin user",
    "version": "0.1.0",
    "name": "ShowAssociationList",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"associations\": [\n            \"Orgware Technologies\",\n            \"Devs\",\n            \"Orgware\"\n          ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/associationList.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/invite/:id",
    "title": "Show Members of Association",
    "version": "0.1.0",
    "name": "ShowAssociationMembers",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Association Id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n[\n    {\n      \"email\": \"admin@bvocal.in\",\n      \"id\": 1,\n      \"phone\": \"1234567890\",\n      \"country\": \"India\",\n      \"name\": \"Goounj Bvocal\",\n      \"is_active\": 1\n    },\n    {\n      \"email\": \"\",\n      \"id\": 6,\n      \"phone\": \"9095914543\",\n      \"country\": \"India\",\n      \"name\": \"Nanda\",\n      \"is_active\": 1\n    },\n    {\n      \"email\": \"\",\n      \"id\": 7,\n      \"phone\": \"7339447457\",\n      \"country\": \"India\",\n      \"name\": \"Kate\",\n      \"is_active\": 1\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/invite.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/candidate/:id",
    "title": "Show Candidate",
    "version": "0.1.0",
    "name": "ShowCandidate",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Candidate's userId.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"nick_name\": \"Kate\",\n  \"manifesto\": \"I will blah blah blah\",\n  \"id\": 1,\n  \"is_accepted\": 0,\n  \"election_id\": 1,\n  \"user_id\": 2,\n  \"about\": \"JS developer\",\n  \"name\": \"Katie\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/candidate.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CandidateNotFound",
            "description": "<p>The requested candidate was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/election/:id",
    "title": "Show Election",
    "version": "0.1.0",
    "name": "ShowElection",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Election Id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"created_date\": \"2016-02-10T06:41:25.000Z\",\n  \"vigilance_user_id\": 4,\n  \"id\": 3,\n  \"nomination_end_date\": \"2016-01-15T18:30:00.000Z\",\n  \"start_date\": \"2016-01-17T18:30:00.000Z\",\n  \"end_date\": \"2016-01-19T18:30:00.000Z\",\n  \"name\": \"Orgware HR\",\n  \"association_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/election.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/vote/v1/association/:id",
    "title": "Update Association",
    "version": "0.1.0",
    "name": "UpdateAssociation",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "associationName",
            "description": "<p>Association name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"associationName\": \"Orgware Technologies\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\": \"Orgware Technologies\",\n  \"admin_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/association.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/vote/v1/invite/:id",
    "title": "Update Members of Association",
    "version": "0.1.0",
    "name": "UpdateAssociationMember",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Association Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "isActive",
            "description": "<p>is_active flag of the association member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"userId\": 3,\n \"isActive\": 0\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/invite.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AssociationNotFound",
            "description": "<p>The requested association was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/vote/v1/candidate/:id",
    "title": "Update Candidate",
    "version": "0.1.0",
    "name": "UpdateCandidate",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Candidate's userId.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Candidate's prefered user name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nickName",
            "description": "<p>Candidate's nick name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "about",
            "description": "<p>Candidate's detail.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "manifesto",
            "description": "<p>Candidate's manifesto.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"electionId\": 1,\n    \"nickName\": \"Katie\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"nick_name\": \"Kate\",\n  \"manifesto\": \"I will blah blah blah\",\n  \"id\": 1,\n  \"is_accepted\": 0,\n  \"election_id\": 1,\n  \"user_id\": 2,\n  \"about\": \"JS developer\",\n  \"name\": \"Katie\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/candidate.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CandidateNotFound",
            "description": "<p>The requested candidate was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/vote/v1/election/:id",
    "title": "Update Election",
    "version": "0.1.0",
    "name": "UpdateElection",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Election Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "electionName",
            "description": "<p>Name of the election.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start date of election.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>End date of election.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vigilanceUserName",
            "description": "<p>Name of the vigilance user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nominationEndDate",
            "description": "<p>End date for nominations.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "members",
            "description": "<p>list of members of the association who can vote for the election.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"electionName\": \"Orgware HR\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"created_date\": \"2016-02-10T06:41:25.000Z\",\n  \"vigilance_user_id\": 4,\n  \"id\": 3,\n  \"nomination_end_date\": \"2016-01-15T18:30:00.000Z\",\n  \"start_date\": \"2016-01-17T18:30:00.000Z\",\n  \"end_date\": \"2016-01-19T18:30:00.000Z\",\n  \"name\": \"Orgware HR\",\n  \"association_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/election.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/vote/v1/verifyOtp",
    "title": "Verify OTP for a user",
    "version": "0.1.0",
    "name": "VerifyOtp",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User's unique Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "authCode",
            "description": "<p>OTP for authentication</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"userId\": 1,\n    \"authCOde\": 2345\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/verifyOtp.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The requested user was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorised",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/vote/v1/voteResult/:id",
    "title": "Show vote results",
    "version": "0.1.0",
    "name": "VoteResult",
    "group": "Vote",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "electionId",
            "description": "<p>Election's unique Id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n[\n {\n   \"votes\": 2,\n   \"candidate\": \"Catherine \",\n   \"candidateId\": 1,\n   \"percentage\": \"100 %\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "services/vote/v1/voteResult.js",
    "groupTitle": "Vote",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Database could not be reached.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElectionNotFound",
            "description": "<p>The requested election was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Requested Action Failed. Database could not be reached.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    }
  }
] });
