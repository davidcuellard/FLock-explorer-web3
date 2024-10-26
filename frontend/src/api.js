import axios from "axios";

const API_BASE_URL = "/api";

// Fetch paginated list of nodes
export const getNodes = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nodes`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nodes:", error);
    throw error;
  }
};

// Fetch detailed information for a specific node by ID
export const getNodeDetails = async (nodeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nodes/${nodeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching node details:", error);
    throw error;
  }
};

// Fetch paginated list of delegators
export const getDelegators = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delegators`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching delegators:", error);
    throw error;
  }
};

// Fetch detailed information for a specific delegator by ID
export const getDelegatorDetails = async (delegatorId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/delegators/${delegatorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching delegator details:", error);
    throw error;
  }
};

// Fetch paginated list of validators
export const getValidators = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/validators`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching validators:", error);
    throw error;
  }
};

// Fetch detailed information for a specific validator by ID
export const getValidatorDetails = async (validatorId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/validators/${validatorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching validator details:", error);
    throw error;
  }
};
