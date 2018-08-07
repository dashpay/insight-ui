'use strict';

angular.module('insight.transactions').controller('transactionsController',
function($scope, $rootScope, $routeParams, $location, Global, Transaction, TransactionsByBlock, TransactionsByAddress) {
  $scope.global = Global;
  $scope.loading = false;
  $scope.loadedBy = null;

  var pageNum = 0;
  var pagesTotal = 1;
  var COIN = 100000000;

  var _aggregateItems = function(items) {
    if (!items) return [];

    var l = items.length;

    var ret = [];
    var tmp = {};
    var u = 0;

    for(var i=0; i < l; i++) {

      var notAddr = false;
      // non standard input
      if (items[i].scriptSig && !items[i].addr) {
        items[i].addr = 'Unparsed address [' + u++ + ']';
        items[i].notAddr = true;
        notAddr = true;
      }

      // non standard output
      if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
        items[i].scriptPubKey.addresses = ['Unparsed address [' + u++ + ']'];
        items[i].notAddr = true;
        notAddr = true;
      }

      // multiple addr at output
      if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
        items[i].addr = items[i].scriptPubKey.addresses.join(',');
        ret.push(items[i]);
        continue;
      }

      var addr = items[i].addr || (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

      if (!tmp[addr]) {
        tmp[addr] = {};
        tmp[addr].valueSat = 0;
        tmp[addr].count = 0;
        tmp[addr].addr = addr;
        tmp[addr].items = [];
      }
      tmp[addr].isSpent = items[i].spentTxId;

      tmp[addr].doubleSpentTxID = tmp[addr].doubleSpentTxID   || items[i].doubleSpentTxID;
      tmp[addr].doubleSpentIndex = tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
      tmp[addr].dbError = tmp[addr].dbError || items[i].dbError;
      tmp[addr].valueSat += Math.round(items[i].value * COIN);
      tmp[addr].items.push(items[i]);
      tmp[addr].notAddr = notAddr;

      if (items[i].unconfirmedInput)
        tmp[addr].unconfirmedInput = true;

      tmp[addr].count++;
    }

    angular.forEach(tmp, function(v) {
      v.value    = v.value || parseInt(v.valueSat) / COIN;
      ret.push(v);
    });
    return ret;
  };

  var _processTX = function(tx) {
    tx.vinSimple = _aggregateItems(tx.vin);
    tx.voutSimple = _aggregateItems(tx.vout);
  };

  var _paginate = function(data) {
    $scope.loading = false;

    pagesTotal = data.pagesTotal;
    pageNum += 1;

    data.txs.forEach(function(tx) {
      _processTX(tx);
      $scope.txs.push(tx);
    });
  };

  var _byBlock = function() {
    TransactionsByBlock.get({
      block: $routeParams.blockHash,
      pageNum: pageNum
    }, function(data) {
      _paginate(data);
    });
  };

  var _byAddress = function () {
    TransactionsByAddress.get({
      address: $routeParams.addrStr,
      pageNum: pageNum
    }, function(data) {
      _paginate(data);
    });
  };

  var _findTx = function(txid) {
    Transaction.get({
      txId: txid
    }, function(tx) {
      $rootScope.titleDetail = tx.txid.substring(0,7) + '...';
      $rootScope.flashMessage = null;
      $scope.tx = tx;
      _processTX(tx);
      $scope.txs.unshift(tx);
    }, function(e) {
      if (e.status === 400) {
        $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
      }
      else if (e.status === 503) {
        $rootScope.flashMessage = 'Backend Error. ' + e.data;
      }
      else {
        $rootScope.flashMessage = 'Transaction Not Found';
      }

      $location.path('/');
    });
  };

  $scope.findThis = function() {
    _findTx($routeParams.txId);
  };

  //Initial load
  $scope.load = function(from) {
    $scope.loadedBy = from;
    $scope.loadMore();
  };

  //Load more transactions for pagination
  $scope.loadMore = function() {
    if (pageNum < pagesTotal && !$scope.loading) {
      $scope.loading = true;

      if ($scope.loadedBy === 'address') {
        _byAddress();
      }
      else {
        _byBlock();
      }
    }
  };

  // Highlighted txout
  if ($routeParams.v_type == '>' || $routeParams.v_type == '<') {
    $scope.from_vin = $routeParams.v_type == '<' ? true : false;
    $scope.from_vout = $routeParams.v_type == '>' ? true : false;
    $scope.v_index = parseInt($routeParams.v_index);
    $scope.itemsExpanded = true;
  }
  
  //Init without txs
  $scope.txs = [];

  $scope.$on('tx', function(event, txid) {
    _findTx(txid);
  });

});

angular.module('insight.transactions').controller('SendRawTransactionController',
  function($scope, $http) {
  $scope.transaction = '';
  $scope.status = 'ready';  // ready|loading|sent|error
  $scope.txid = '';
  $scope.error = null;

  $scope.formValid = function() {
    return !!$scope.transaction;
  };
  $scope.send = function() {
    var postData = {
      rawtx: $scope.transaction
    };
    $scope.status = 'loading';
    $http.post(window.apiPrefix + '/tx/send', postData)
      .success(function(data, status, headers, config) {
        if(typeof(data.txid) != 'string') {
          // API returned 200 but the format is not known
          $scope.status = 'error';
          $scope.error = 'The transaction was sent but no transaction id was got back';
          return;
        }

        $scope.status = 'sent';
        $scope.txid = data.txid;
      })
      .error(function(data, status, headers, config) {
        $scope.status = 'error';
        if(data) {
          $scope.error = data;
        } else {
          $scope.error = "No error message given (connection error?)"
        }
      });
  };
});

angular.module('insight.transactions').controller('TreeTransactionsController',
    function($scope, $rootScope, $routeParams, $location, Global, Transaction, TransactionsByBlock, TransactionsByAddress, $http) {
      //nice to test with
      //insight/tx/61fb1190e1c2fe8474e743c92985dea9c0cf9db559a2e6a5e2423a9af1eba5ea
      $scope.transactionData = [];
      $scope.rendererScope = [];
      $scope.rendererScope.treeData = null;
      $scope.rendererScope.heights = [];
      $scope.rendererScope.lastK = null;
      $scope.rendererScope.clicked = false;
      $scope.rendererScope.disableZoom = false;
      $scope.status = 'ready'; // ready|loading|sent|error
      $scope.txid = '';
      $scope.error = null;

      $scope.radius = function(d) {
        return Math.min(40, Math.max(20 * (d.value / $scope.rendererScope.root.value), 5.0));
      }

      $scope.collapse = function(d) {
        if (d.children) {
          d._children = d.children
          d._children.forEach($scope.collapse)
          d.children = null
        }
      }

      $scope.diagonal = function(s, d) {
        path = 'M ' + s.y + ' ' + s.x + ' C ' + (s.y + d.y) / 2 + ' ' + s.x + ', ' + (s.y + d.y) / 2 + ' ' + d.x + ', ' + d.y + ' ' + d.x;
        return path
      }

      var httpPort = '';
      if (window.location.port) {
        httpPort = ':' + window.location.port;
      }
      $scope.rendererScope.httpLocation = window.location.protocol + '//' + window.location.hostname + httpPort + '/' + window.location.pathname.split("/")[1];

      $scope.$on('transactions', function(event, arg) {
        $scope.receiver = 'TreeTransactionsController got your ' + arg;
      });

      //recursively find an element in Json structure
      $scope.getHeightAndDepth = function(tree, height) {
        var cs = tree.children;
        var heightbak = height;
        if (typeof $scope.rendererScope.heights[height] === "undefined") {
          $scope.rendererScope.heights[height] = 0;
        }
        height++;
        var maxheight = height;
        if (typeof cs !== "undefined") {
          if (cs) {
            $scope.rendererScope.heights[heightbak] += cs.length;
            for (var i = 0, len = cs.length; i < len; i++) {
              if (typeof cs[i].children !== "undefined") {
                if (cs[i].children) {
                  tmpheight = $scope.getHeightAndDepth(cs[i], height);
                  if (tmpheight > maxheight) {
                    maxheight = tmpheight;
                  }
                }
              }
            }
            return maxheight;
          }
        }
        return height;
      }

      $scope.treeRendererUpdate = function(source) {

        //get maxdepth
        $scope.rendererScope.heights = [];
        var heightAndDepth = $scope.getHeightAndDepth($scope.rendererScope.root, 0)

        var maxdepth = Math.max.apply(null, $scope.rendererScope.heights);
        var lw = ((250 * heightAndDepth) + $scope.rendererScope.w);
        var lh = $scope.rendererScope.h + (maxdepth * 40);
        var clientWidth = parseInt(document.getElementById("svg-tree-block").clientWidth, 10);
        if (!$scope.rendererScope.originalWidth) {
          $scope.rendererScope.originalWidth = clientWidth;
        }

        var resize = function() {
          $scope.rendererScope.chart.style.width = lw + "px";
          $scope.rendererScope.chart.style.height = lh + "px";
          $scope.rendererScope.chart.setAttribute("viewBox", "0 0 " + lw + " " + lh);
        };

        if (lw < parseInt($scope.rendererScope.chart.style.width, 10)) {
          window.setTimeout(function() {
            resize();
          }, $scope.rendererScope.duration);
        } else {
          resize();
        }

        if (lw > $scope.rendererScope.originalWidth) {
          d3.selectAll("#svg-tree-block").transition().duration($scope.rendererScope.duration).style("width", (lw + 10) + "px").style("position", "relative").style("left", ((-1 * (lw - $scope.rendererScope.originalWidth)) / 2) + "px");
        } else {
          d3.selectAll("#svg-tree-block").transition().duration($scope.rendererScope.duration).style("width", $scope.rendererScope.originalWidth + "px").style("position", "relative").style("left", "0px");

        }

        $scope.rendererScope.tree = d3.tree().size([lh, lw]);

        var treeData = $scope.rendererScope.tree($scope.rendererScope.root);

        $scope.rendererScope.nodes = treeData.descendants(),
          $scope.rendererScope.links = treeData.descendants().slice(1);

        // Normalize for fixed-depth.
        $scope.rendererScope.nodes.forEach(function(d) {
          d.y = d.depth * 250
        });

        var node = $scope.rendererScope.vis.selectAll("g.node").data($scope.rendererScope.nodes, function(d) {
          return d.id || (d.id = ++$scope.rendererScope.i);
        });

        if (typeof node !== "undefined") {
          var nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
          });
          var func = function(nodeEnter) {
            nodeEnter.append("svg:circle")
              .attr("r", function(d) {
                return $scope.radius(d);
              }).on("click", function(d) {
                $scope.clickNode(d, nodeEnter);
              });
            //DASH Address
            nodeEnter.append("a")
              .attr("xlink:href", function(d) {
                return $scope.rendererScope.httpLocation + "/address/" + d.data.name;
              }).attr("target", "_insightAddress")
              .append("svg:text").attr("x", function(d) {
                if (d.data.name == null) return 0;
                return -(3 * d.data.name.length);
              }).attr("y", function(d) {
                return 13 + $scope.radius(d);
              }).text(function(d) {
                return d.data.name;
              });


          }(nodeEnter);
          //Value in DASH
          nodeEnter.append("svg:text").attr("x", function(d) {
            return -(3 * $scope.$root.currency.getConvertion(d.value).length);
          }).attr("y", function(d) {
            return -$scope.radius(d) - 10;
          }).text(function(d) {
            return $scope.$root.currency.getConvertion(d.value);
          }).attr("class", "value");

          // UPDATE
          var nodeUpdate = nodeEnter.merge(node);

          // Transition nodes to their new position.
          nodeUpdate.transition()
            .duration($scope.rendererScope.duration)
            .attr("transform", function(d) {
              return "translate(" + d.y + "," + d.x + ")";
            }).style("opacity", 1).select("circle").attr("class", function(d) {
              if (d.data.name == "origin") { return "spentTx"; }
              if (d.data.redeemed_tx == null || d.data.redeemed_tx.length == 0) {
                return "unspentTx";
              } else {
                return "spentTx";
              }
            });

          node.exit().transition()
            .duration($scope.rendererScope.duration)
            .attr("transform", function(d) {
              return "translate(" + source.y + "," + (source.x) + ")";
            })
            .style("opacity", 1e-6)
            .remove();

          // Update the links
          var link = $scope.rendererScope.vis.selectAll("path.link")
            .data($scope.rendererScope.links, function(d) {
              return d.id;
            });

          // Enter any new links at the parent's previous position.
          var linkEnter = link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {
                x: source.x0,
                y: source.y0
              };
              return $scope.diagonal(o, o);
            });
          // UPDATE
          var linkUpdate = linkEnter.merge(link);

          // Transition back to the parent element position
          linkUpdate.transition()
            .duration($scope.rendererScope.duration)
            .attr('d', function(d) {
              return $scope.diagonal(d, d.parent)
            });

          // Remove any exiting links
          var linkExit = link.exit().transition()
            .duration($scope.rendererScope.duration)
            .attr('d', function(d) {
              var o = {
                x: source.x,
                y: source.y
              }
              return $scope.diagonal(o, o)
            })
            .remove();

          // Store the old positions for transition.
          $scope.rendererScope.nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });

          node.selectAll(".value").text(function(d) {
            return $scope.$root.currency.getConvertion(d.value);
          });
        }
      }

      $scope.treeRenderer = function(el, data) {
        $scope.rendererScope.originalWidth = 0;
        $scope.rendererScope.w = 200;
        $scope.rendererScope.h = 500;
        $scope.rendererScope.i = 0;
        $scope.rendererScope.duration = 500;
        $scope.rendererScope.root = $scope.transactionData;
        $scope.rendererScope.nodeMap = [];
        $scope.rendererScope.chart = document.getElementById("chart"); //.style;

        $scope.rendererScope.tree = d3.tree().size([$scope.rendererScope.h, $scope.rendererScope.w - 100]);
        if (typeof $scope.rendererScope.chart !== "undefined") {
          while ($scope.rendererScope.chart.firstChild) {
            $scope.rendererScope.chart.removeChild($scope.rendererScope.chart.firstChild);
          }
        }
        $scope.rendererScope.nodeCount = 0;
        $scope.rendererScope.depth = 1;
        $scope.rendererScope.maxdepth = 1;

        $scope.rendererScope.svg = d3.select("#chart").append("svg");
        $scope.rendererScope.vis = $scope.rendererScope.svg.append("g").attr("transform", "translate(50, 0)").attr("id", "globalGroup");
        $scope.getTX($routeParams.txId, null);
      };
      $scope.init = function() {
        $scope.treeRenderer();
      }
      $scope.getTX = function(transaction, node) {
        $http.get(window.apiPrefix + '/tx/' + transaction)
          .then(function(response) {
            // declares a tree layout and assigns the size
            // Assigns parent, children, height, depth
            if (response.status != 200) {
              console.log(response);
            } else {
              var ntreeData = $scope.getTransactionData(response.data);
              if ($scope.rendererScope.treeData) {
                var tchild = $scope.findInTreeData($scope.rendererScope.treeData, transaction, false);
                tchild.children = ntreeData.children;
              } else {
                $scope.rendererScope.treeData = ntreeData;
              }
              var hierarchy = d3.hierarchy($scope.rendererScope.treeData, function(d) {
                return d.children;
              });

              if (node) {
                var lhierarchy = $scope.findInTreeData(hierarchy, transaction, true);
                node.children = lhierarchy.children;
                if (typeof node.children !== "undefined") {
                  for (var i = 0; i < node.children.length; ++i) { //no idea why we have to do that...
                    node.children[i].parent = node;
                  }
                }
                $scope.rendererScope.nodeCount += node.children.length;
                $scope.treeRendererUpdate(node);
              } else {
                $scope.rendererScope.root = hierarchy;
                $scope.rendererScope.root.x0 = $scope.rendererScope.h / 2;
                $scope.rendererScope.root.y0 = 0;
                // Collapse after the second level
                $scope.rendererScope.root.children.forEach($scope.collapse);
                $scope.treeRendererUpdate($scope.rendererScope.root);
              }
            }
          });
      }
      $scope.getTransactionData = function(response) {
        if (typeof response !== "undefined") {
          var transactionData = {
            "name": "origin",
            "relayed_by": "0.0.0.0",
            "relayed_flag": "/Resources/flags/blank.png",
            "tx_index": response.txid,
            "value": response.valueOut,
            "time": response.blocktime,
            "children": []
          };
          for (var i = 0; i < response.vout.length; ++i) {
            var children = {
              "value": response.vout[i].value,
              "name": response.vout[i].scriptPubKey.addresses[0]
            };
            if (response.vout[i].spentTxId) {
              children.redeemed_tx = [response.vout[i].spentTxId];
            }
            transactionData.children.push(children);
          }
          return transactionData;
        }
        return false;
      }

      //recursively find an element in Json structure
      $scope.findInTreeData = function(tree, value, data) {
        var cs = tree.children;
        if (typeof cs !== "undefined") {
          for (var i = 0, len = cs.length; i < len; i++) {
            var toComp = null;
            (data) ? toComp = cs[i].data.redeemed_tx: toComp = cs[i].redeemed_tx;
            if (value == toComp) {
              return cs[i];
            } else {
              // Find it in this tree
              if (found = $scope.findInTreeData(cs[i], value, data)) {
                return found;
              }
            }
          }
        }
        return null;
      }

      // Toggle children on click.
      $scope.clickNode = function(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
          $scope.rendererScope.nodeCount -= d._children.length;
        } else {
          if (typeof d.data.redeemed_tx !== "undefined") {
            if (d._children) {
              d.children = d._children;
              d._children = null;
            } else {
              $scope.getTX(d.data.redeemed_tx, d);
            }
          } else {
            d.children = d._children;
            d._children = null;
          }
        }
        if (d.depth > $scope.rendererScope.maxdepth) {
          $scope.rendererScope.maxdepth = d.depth;
        }
        $scope.treeRendererUpdate(d);
      }

      $scope.init();
    })
  .directive('d3Data', ['$interval', '$timeout', function($interval, $timeout) {
    function link(scope, element, attrs) {
      var format, timeoutId;

      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      function clearTransactionData(scope) {
        scope.transactionData = [];
      };

      scope.$watch(function() {
        return scope.$root.currency;
      }, function() {
        if (typeof scope.rendererScope.vis !== "undefined") {
          scope.rendererScope.vis.selectAll(".value").text(function(d) {
            return scope.$root.currency.getConvertion(d.value);
          });
        }
      }, true);

      scope.$watch(attrs.d3Data, function(value) {
        //console.log("directivewatch");
        //console.log(value);
      });
      element.on('$destroy', function() {
        //$interval.cancel(timeoutId);
      });
    }

    return {
      link: link
    };
  }]);


