'use strict';

angular.module('insight.search').controller('SearchController',
  function($scope, $routeParams, $location, $timeout, Global, Block, Transaction, Address, BlockByHeight) {
  $scope.global = Global;
  $scope.loading = false;

  var _badQuery = function() {
    $scope.badQuery = true;

    $timeout(function() {
      $scope.badQuery = false;
    }, 2000);
  };

  var _resetSearch = function() {
    $scope.q = '';
    $scope.loading = false;
  };
  
  $scope.defineSearchType = function(searchString) {
    if (searchString.length == 64) {
      var block_flag = false;
      for (var i = 0; i < 2; i++) {
        if (searchString[i] == '0') {
          block_flag = true;
        } else {
          block_flag = false;
          break;
        }
      }
      if (block_flag == true) {
        return [Block, 'blockHash', 'block/'];
      } else {
        return [Transaction, 'txId', 'tx/'];
      }
    } else if (searchString.length == 38 || searchString.length === 34) {
      return [Address, 'addrStr', 'address/'];
    }
    if(isFinite(searchString)) {
      return [BlockByHeight, 'blockHeight', 'block/'];
    } else {
      return false
    }
  }

  $scope.search = function() {
    var q = $scope.q;
    var searchType = $scope.defineSearchType(q);
    $scope.badQuery = false;
    $scope.loading = true;

    if (searchType) {
      var searchTypeObj = {};
      searchTypeObj[searchType[1]] = q;
      searchType[0].get(
        searchTypeObj
      , function() {
        _resetSearch();
        $location.path(searchType[2] + q);
      }, function() {
          //not found, fail :(
          $scope.loading = false;
          _badQuery();
      });
    } else {
      $scope.loading = false;
      _badQuery();
    }
  };

});
