# Salesforce MCP Server - Project Analysis

**Generated:** $(date)  
**Project:** Quoting MCP Server  
**Repository:** https://github.com/jerrywang951027/QuotingMCPServer.git

---

## **What It Does**

This is a **Model Context Protocol (MCP) Server** that enables **Claude AI** to interact with **Salesforce** using natural language. It acts as a bridge between Claude and Salesforce, allowing users to:

- **Query and manipulate Salesforce data** using conversational language
- **Manage Salesforce metadata** (objects, fields, permissions)
- **Read and write Apex code** (classes and triggers)
- **Execute anonymous Apex** for custom operations
- **Search across multiple objects** using SOSL
- **Manage debug logs** for troubleshooting

## **Architecture & Implementation**

### **Core Technology Stack**
- **TypeScript** with ES2020+ features
- **MCP SDK** (`@modelcontextprotocol/sdk`) for AI integration
- **JSForce** library for Salesforce API communication
- **Node.js** runtime with stdio transport

### **Project Structure**

```
src/
├── index.ts              # Main server entry point
├── tools/                # Individual MCP tool implementations
│   ├── query.ts         # SOQL querying
│   ├── dml.ts           # Data manipulation (CRUD)
│   ├── manageObject.ts  # Custom object management
│   ├── manageField.ts   # Field management
│   ├── readApex.ts      # Apex class reading
│   ├── writeApex.ts     # Apex class writing
│   └── ...              # 10+ other specialized tools
├── types/               # TypeScript type definitions
└── utils/               # Connection and error handling utilities
```

### **Key Components**

#### **1. Connection Management** (`utils/connection.ts`)
- Supports **two authentication methods**:
  - **Username/Password + Security Token** (default)
  - **OAuth 2.0 Client Credentials Flow**
- Handles Salesforce login and session management
- Configurable instance URLs for different Salesforce environments

#### **2. Tool System** (15 specialized tools)
Each tool is a self-contained module with:
- **Tool definition** (name, description, input schema)
- **Type-safe argument interfaces**
- **Handler functions** that execute Salesforce operations
- **Comprehensive error handling**

#### **3. Core Tools Breakdown**

**Data Operations:**
- `salesforce_query_records` - SOQL queries with relationship support
- `salesforce_aggregate_query` - GROUP BY and aggregate functions
- `salesforce_dml_records` - Insert, update, delete, upsert operations
- `salesforce_search_all` - Cross-object SOSL searches

**Metadata Management:**
- `salesforce_search_objects` - Find objects by name patterns
- `salesforce_describe_object` - Get detailed object schema
- `salesforce_manage_object` - Create/update custom objects
- `salesforce_manage_field` - Create/update custom fields
- `salesforce_manage_field_permissions` - Field-level security

**Apex Development:**
- `salesforce_read_apex` - Read Apex classes with wildcard support
- `salesforce_write_apex` - Create/update Apex classes
- `salesforce_read_apex_trigger` - Read Apex triggers
- `salesforce_write_apex_trigger` - Create/update Apex triggers
- `salesforce_execute_anonymous` - Run anonymous Apex code

**Administrative:**
- `salesforce_manage_debug_logs` - Enable/disable debug logging

### **Advanced Features**

#### **Relationship Query Support**
The query tool supports complex Salesforce relationships:
- **Parent-to-child**: `Account` with `(SELECT Id, Name FROM Contacts)`
- **Child-to-parent**: `Contact` with `Account.Name`, `Account.Owner.Name`
- **Multi-level relationships** up to 5 levels deep
- **Custom relationship fields** using `__r` suffix

#### **Type Safety & Validation**
- **Comprehensive TypeScript interfaces** for all operations
- **Runtime validation** of tool arguments
- **Salesforce-specific error handling** with detailed error messages
- **Field-level error reporting** for DML operations

#### **Error Handling**
- **Salesforce-specific error formatting** with status codes
- **Field-level error details** for validation failures
- **Relationship query error guidance** with troubleshooting tips
- **Metadata operation error reporting**

### **Usage Pattern**

1. **Claude receives natural language request** (e.g., "Show me all accounts with their contacts")
2. **MCP Server translates** to appropriate Salesforce API calls
3. **JSForce executes** SOQL/SOSL queries or metadata operations
4. **Results formatted** and returned to Claude
5. **Claude presents** results in natural language to user

### **Configuration**

The server is configured via environment variables or Claude Desktop config:

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@tsmztech/mcp-server-salesforce"],
      "env": {
        "SALESFORCE_CONNECTION_TYPE": "User_Password",
        "SALESFORCE_USERNAME": "user@example.com",
        "SALESFORCE_PASSWORD": "password",
        "SALESFORCE_TOKEN": "security_token"
      }
    }
  }
}
```

## **Key Strengths**

1. **Comprehensive Coverage** - Handles data, metadata, and code management
2. **Type Safety** - Full TypeScript implementation with proper interfaces
3. **Error Handling** - Detailed, actionable error messages
4. **Flexible Authentication** - Multiple auth methods for different scenarios
5. **Relationship Support** - Advanced SOQL relationship querying
6. **Production Ready** - Proper error handling, logging, and validation

## **Package Information**

- **Name:** @tsmztech/mcp-server-salesforce
- **Version:** 0.0.3
- **Description:** A Salesforce connector MCP Server
- **License:** MIT
- **Author:** tsmztech

## **Dependencies**

### **Production Dependencies**
- `@modelcontextprotocol/sdk`: 1.17.4
- `dotenv`: ^17.2.1
- `jsforce`: ^3.10.3

### **Development Dependencies**
- `@types/node`: ^24.3.0
- `typescript`: ^5.7.2
- `shx`: ^0.4.0

## **Available Tools (15 Total)**

1. **salesforce_search_objects** - Search for standard and custom objects
2. **salesforce_describe_object** - Get detailed object schema information
3. **salesforce_query_records** - Query records with relationship support
4. **salesforce_aggregate_query** - Execute aggregate queries with GROUP BY
5. **salesforce_dml_records** - Perform data operations (insert, update, delete, upsert)
6. **salesforce_manage_object** - Create and modify custom objects
7. **salesforce_manage_field** - Manage object fields
8. **salesforce_manage_field_permissions** - Manage Field Level Security
9. **salesforce_search_all** - Search across multiple objects using SOSL
10. **salesforce_read_apex** - Read Apex classes
11. **salesforce_write_apex** - Create and update Apex classes
12. **salesforce_read_apex_trigger** - Read Apex triggers
13. **salesforce_write_apex_trigger** - Create and update Apex triggers
14. **salesforce_execute_anonymous** - Execute anonymous Apex code
15. **salesforce_manage_debug_logs** - Manage debug logs for Salesforce users

## **Example Usage Scenarios**

### **Data Querying**
```
"Find all Accounts with their related Contacts"
"Show me high-priority Cases with their related Contacts"
"Get all Opportunities over $100k"
```

### **Metadata Management**
```
"Create a Customer Feedback object"
"Add a Rating field to the Feedback object"
"Grant System Administrator access to Custom_Field__c on Account"
```

### **Apex Development**
```
"Show me all Apex classes with 'Controller' in the name"
"Create a new Apex utility class for handling date operations"
"Update the LeadConverter class to add a new method"
```

### **Administrative Tasks**
```
"Enable debug logs for user@example.com"
"Retrieve recent logs for an admin user"
"Execute Apex code to calculate account metrics"
```

## **Technical Implementation Details**

### **Connection Types**
1. **Username/Password Authentication (Default)**
   - Requires: username, password, security token
   - Login URL: configurable (default: https://login.salesforce.com)

2. **OAuth 2.0 Client Credentials Flow**
   - Requires: client ID, client secret, instance URL
   - Token endpoint: `<instance_url>/services/oauth2/token`

### **Error Handling Strategy**
- **Salesforce-specific error formatting** with status codes
- **Field-level error details** for validation failures
- **Relationship query error guidance** with troubleshooting tips
- **Metadata operation error reporting**

### **Type Safety**
- **Comprehensive TypeScript interfaces** for all operations
- **Runtime validation** of tool arguments
- **Salesforce-specific error handling** with detailed error messages

## **Conclusion**

This Salesforce MCP Server is a sophisticated, production-ready tool that enables AI-powered interaction with Salesforce through natural language. It's particularly well-suited for developers, administrators, and power users who want to leverage Claude's capabilities to work with their Salesforce data and metadata more efficiently than traditional point-and-click interfaces.

The project demonstrates excellent software engineering practices with comprehensive type safety, error handling, and modular architecture. It provides a complete solution for AI-powered Salesforce interaction covering data operations, metadata management, and Apex development.
