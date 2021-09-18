import axios from './axiosInstance';

// POST
export const usePost = async (url, values) => {
  try {
    let response;
    if (values.token) {
      response = await axios.post(url, JSON.stringify({ ...values.formData }), {
        headers: {
          Authorization: 'Bearer ' + values.token,
        },
      });
    } else {
      response = await axios.post(url, JSON.stringify({ ...values }));
    }
    if (response.data.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return error.message;
  }
};

// GET
export const useGet = async (url, token = null) => {
  try {
    let response;
    if (token) {
      response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
    } else {
      response = await axios.get(url);
    }
    if (response.data.data) {
      return response.data;
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return error.message;
  }
};
