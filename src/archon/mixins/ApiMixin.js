const ApiMixin = {
  
  getRequests(types) {
    return _.map(types, (type) => this.getRequest(type));
  },

  getRequest(type) {
    return this.getRequestFromProps(this.props, type);
  },

  getPageRequests(types) {
    const requests = this.getRequests(types);
    const isFetching = _.some(requests, (r) => r.isFetching);
    let error = '';
    const firstError = _.find(requests, (r) => r.error);
    if (firstError) {
      error = firstError.error;
    }
    return { requests, isFetching, error };
  },

  getRequestFromProps(props, type) {
    return props[type] || {
      apiType: type,
      isFetching: false,
      statusCode: 0,
      error: '',
      opFlash: '',
      data: null,
    };
  },

};

export default ApiMixin;
