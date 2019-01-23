'use strict';

angular.module('insight.search')
  .factory('Search',
    function($resource) {
    return $resource(window.apiPrefix + '/search/:searchstr', {
      searchstr: '@searchstr'
    }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data;
          },
          responseError: function (res) {
            if (res.status === 404) {
              return res;
            }
          }
        }
      }
    });
  });
