import axios from "axios";

const API_BASE_URL = "/api";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const fetchData = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(`Error fetching data from ${url}:`, error.response.data);
      } else if (error.request) {
        console.error(`No response received from ${url}:`, error.request);
      } else {
        console.error(`Error during request setup for ${url}:`, error.message);
      }
      if (i < retries - 1)
        await new Promise((resolve) => setTimeout(resolve, delay * 2 ** i));
      else throw error;
    }
  }
};

const getPaginatedList = (
  endpoint,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => fetchData(`${API_BASE_URL}/${endpoint}`, { params: { page, limit } });

const getDetailsById = (endpoint, id) => {
  if (endpoint !== "tasks" && !/^0x[a-fA-F0-9]{40}$/.test(id)) {
    throw new Error(`Invalid Ethereum address format: ${id}`);
  }
  return fetchData(`${API_BASE_URL}/${endpoint}/${id}`);
};

// API Functions for Nodes
export const getNodes = (page, limit) => getPaginatedList("nodes", page, limit);
export const getNodeDetails = (nodeId) => getDetailsById("nodes", nodeId);

// API Functions for Delegators
export const getDelegators = (page, limit) =>
  getPaginatedList("delegators", page, limit);
export const getDelegatorDetails = (delegatorId) =>
  getDetailsById("delegators", delegatorId);

// API Functions for Validators
export const getValidators = (page, limit) =>
  getPaginatedList("validators", page, limit);
export const getValidatorDetails = (validatorId) =>
  getDetailsById("validators", validatorId);

// API Function for Tasks
export const getTaskDetails = (taskId) => getDetailsById("tasks", taskId);

// API Function for Rewards
export const getRewardsClaimed = () =>
  fetchData(`${API_BASE_URL}/rewards-claimed`);

// API Function for tasks-event
export const getTasksEvents = () => fetchData(`${API_BASE_URL}/tasks-event`);

// API Function for stake-tracking
export const getStakeTracking = () =>
  fetchData(`${API_BASE_URL}/stake-tracking`);

// API Function for delegator-participation
export const getDelegatorParticipation = () =>
  fetchData(`${API_BASE_URL}/delegator-participation`);
