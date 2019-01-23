'use strict';

angular.module('insight.search').controller('SearchController',
  function($scope, $routeParams, $location, $timeout, Global, Block, Transaction, Address, BlockByHeight, Search) {
  $scope.global = Global;
  $scope.loading = false;
  //to avoid eval for security reasons
  $scope.factories = {Block: Block, Transaction: Transaction, Address: Address, BlockByHeight: BlockByHeight};

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
  
  $scope.swap = function(theArray, indexA, indexB) {
      var temp = theArray[indexA];
      theArray[indexA] = theArray[indexB];
      theArray[indexB] = temp;
  };
  
  $scope.defineSearchType = function(searchString) {
    var searchArray = [
      {factory: 'Block', object: 'blockHash', path: 'block/'}, 
      {factory: 'Transaction', object:'txId', path: 'tx/'}, 
      {factory: 'Address', object: 'addrStr', path: 'address/'}, 
      {factory: 'BlockByHeight', object: 'blockHeight', path: 'block/'}
    ];
    if (searchString.length == 64) {
      if (!searchString.match(/^00/)) {
        $scope.swap(searchArray, 0, 1);
      }
    } else if (searchString.length == 38 || searchString.length === 34) {
      $scope.swap(searchArray, 0, 2);
    }
    if (isFinite(searchString)) {
      $scope.swap(searchArray, 0, 3);
    }
    return searchArray
  }
  
  $scope.traverseSearch = function(searchTypeArray, q) {
    if (searchTypeArray.length) {
      var searchTypeObj = {};
      searchTypeObj[searchTypeArray[0].object] = q;
      var path = searchTypeArray[0].path;
      $scope.factories[searchTypeArray[0].factory].get(
        searchTypeObj
      , function() {
        $scope.searchFound = true;
        _resetSearch();
        $location.path(path + q);
      }, function() {
        $scope.traverseSearch(searchTypeArray.slice(1), q);
      });
    } else {
      $scope.loading = false;
      _badQuery();
    }
  }

  $scope.search = function() {
    var q = $scope.q;
    $scope.badQuery = false;
    $scope.loading = true;

    Search.get({
      searchstr: q
    }, function(res) {
      $scope.traverseSearch(res.data, q);
    }, function() { 
      //not found, allow backward compatibilty if search route not available on API 
      var searchTypeArray = $scope.defineSearchType(q);
      $scope.traverseSearch(searchTypeArray, q);
    });
  };

});
