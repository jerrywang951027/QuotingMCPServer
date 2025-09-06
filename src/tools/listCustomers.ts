import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const LIST_CUSTOMERS: Tool = {
  name: "salesforce_list_customers",
  description: `Invoke a custom Salesforce REST endpoint to list customer accounts for a specific user.
  
This tool calls the Vlocity CMT integration procedure endpoint to retrieve a list of customer accounts
associated with a given user ID.

Examples:
1. List customers for a specific user:
   {
     "userId": "005000000000000AAA"
   }

2. List customers for current user:
   {
     "userId": "current"
   }

Notes:
- The userId parameter can be a specific Salesforce user ID or "current" for the authenticated user
- Returns a list of Account records with their details
- Uses the custom REST endpoint: /services/apexrest/vlocity_cmt/v1/integrationprocedure/JW_ListMyCustomers
- Requires appropriate permissions to access the custom REST endpoint`,
  inputSchema: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "Salesforce user ID to list customers for, or 'current' for the authenticated user"
      }
    },
    required: ["userId"]
  }
};

export interface ListCustomersArgs {
  userId: string;
}

/**
 * Handles listing customers using the custom Salesforce REST endpoint
 * @param conn Active Salesforce connection
 * @param args Arguments for listing customers
 * @returns Tool response with customer account information
 */
export async function handleListCustomers(conn: any, args: ListCustomersArgs) {
  const { userId } = args;

  try {
    console.error(`Listing customers for user: ${userId}`);

    // Get the instance URL from the connection
    const instanceUrl = conn.instanceUrl;
    if (!instanceUrl) {
      throw new Error('Unable to determine Salesforce instance URL');
    }

    // Construct the REST endpoint URL
    const endpointUrl = `${instanceUrl}/services/apexrest/vlocity_cmt/v1/integrationprocedure/JW_ListMyCustomers`;
    
    // Prepare the request body
    const requestBody = {
      userId: userId === 'current' ? conn.userInfo?.id : userId
    };

    // Make the REST API call
    const response = await conn.request({
      method: 'POST',
      url: endpointUrl,
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Handle the response
    if (!response) {
      return {
        content: [{
          type: "text",
          text: "No response received from the REST endpoint"
        }],
        isError: true,
      };
    }

    // Format the response
    let responseText = `# Customer Accounts for User: ${userId}\n\n`;
    
    if (Array.isArray(response)) {
      responseText += `Found ${response.length} customer accounts:\n\n`;
      
      response.forEach((account: any, index: number) => {
        responseText += `## Account ${index + 1}\n`;
        responseText += `- **Name:** ${account.Name || 'N/A'}\n`;
        responseText += `- **Id:** ${account.Id || 'N/A'}\n`;
        responseText += `- **Type:** ${account.Type || 'N/A'}\n`;
        responseText += `- **Industry:** ${account.Industry || 'N/A'}\n`;
        responseText += `- **Phone:** ${account.Phone || 'N/A'}\n`;
        responseText += `- **Website:** ${account.Website || 'N/A'}\n`;
        responseText += `- **Billing Address:** ${account.BillingAddress ? 
          `${account.BillingAddress.street || ''}, ${account.BillingAddress.city || ''}, ${account.BillingAddress.state || ''} ${account.BillingAddress.postalCode || ''}` : 'N/A'}\n`;
        
        // Add any additional fields that might be present
        const additionalFields = Object.keys(account).filter(key => 
          !['Name', 'Id', 'Type', 'Industry', 'Phone', 'Website', 'BillingAddress'].includes(key)
        );
        
        if (additionalFields.length > 0) {
          responseText += `- **Additional Fields:**\n`;
          additionalFields.forEach(field => {
            responseText += `  - ${field}: ${account[field] || 'N/A'}\n`;
          });
        }
        
        responseText += '\n';
      });
    } else if (typeof response === 'object') {
      // Single account object
      responseText += `Found 1 customer account:\n\n`;
      responseText += `## Account Details\n`;
      responseText += `- **Name:** ${response.Name || 'N/A'}\n`;
      responseText += `- **Id:** ${response.Id || 'N/A'}\n`;
      responseText += `- **Type:** ${response.Type || 'N/A'}\n`;
      responseText += `- **Industry:** ${response.Industry || 'N/A'}\n`;
      responseText += `- **Phone:** ${response.Phone || 'N/A'}\n`;
      responseText += `- **Website:** ${response.Website || 'N/A'}\n`;
      responseText += `- **Billing Address:** ${response.BillingAddress ? 
        `${response.BillingAddress.street || ''}, ${response.BillingAddress.city || ''}, ${response.BillingAddress.state || ''} ${response.BillingAddress.postalCode || ''}` : 'N/A'}\n`;
    } else {
      responseText += `Response format: ${typeof response}\n`;
      responseText += `Raw response: ${JSON.stringify(response, null, 2)}`;
    }

    return {
      content: [{
        type: "text",
        text: responseText
      }],
      isError: false,
    };

  } catch (error) {
    console.error('Error listing customers:', error);
    
    let errorMessage = `Error listing customers: ${error instanceof Error ? error.message : String(error)}`;
    
    // Add specific error handling for common issues
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        errorMessage += '\n\nThe REST endpoint was not found. Please verify that the Vlocity CMT integration procedure is properly deployed.';
      } else if (error.message.includes('403')) {
        errorMessage += '\n\nAccess denied. Please check that you have the necessary permissions to access this REST endpoint.';
      } else if (error.message.includes('401')) {
        errorMessage += '\n\nAuthentication failed. Please check your Salesforce connection credentials.';
      } else if (error.message.includes('INVALID_USER_ID')) {
        errorMessage += '\n\nThe provided user ID is invalid. Please check the user ID format.';
      }
    }

    return {
      content: [{
        type: "text",
        text: errorMessage
      }],
      isError: true,
    };
  }
}
