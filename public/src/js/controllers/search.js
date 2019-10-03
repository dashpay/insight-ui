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

  $scope.search = function() {
    var q = $scope.q;
    $scope.badQuery = false;
    $scope.loading = true;

    if (q.length == 34) {
      Address.get({
        addrStr: q
      }, function() {
        _resetSearch();
        $location.path('address/' + q);
      });
    } else {
      Block.get({
        blockHash: q
      }, function(res) {
        if (res && res.status) {
          Transaction.get({
            txId: q
          }, function(res) {
            if (res && res.txid) {
              _resetSearch();
              $location.path('tx/' + q);
            } else {
              $scope.loading = false;
              _badQuery();
            }
          });
        } else {
          _resetSearch();
          $location.path('block/' + q);
        }
      });
    }
  };

});
