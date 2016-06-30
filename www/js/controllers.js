(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("MenuController", function ($scope, $ionicPopover) {

	    $ionicPopover.fromTemplateUrl("templates/main/popover.html", {
			scope: $scope
		}).then(function (popover) {
			$scope.popover = popover;
		});

	    $scope.closePopover = function () {
	        $scope.popover.hide();
	    };

	    //Cleanup the popover when we're done with it!
	    $scope.$on('$destroy', function () {
	        $scope.popover.remove();
	    });
	})

	.controller("HomeController", function ($scope, ionicMaterialInk) {
		ionicMaterialInk.displayEffect();
		var chats = [{
		    id: 0,
		    name: 'Ben Sparrow',
		    lastText: 'You on your way?',
		    face: 'img/ben.png'
		  }, {
		    id: 1,
		    name: 'Max Lynx',
		    lastText: 'Hey, it\'s me',
		    face: 'img/max.png'
		  }, {
		    id: 2,
		    name: 'Adam Bradleyson',
		    lastText: 'I should buy a boat',
		    face: 'img/adam.jpg'
		  }, {
		    id: 3,
		    name: 'Perry Governor',
		    lastText: 'Look at my mukluks!',
		    face: 'img/perry.png'
		  }, {
		    id: 4,
		    name: 'Mike Harrington',
		    lastText: 'This is wicked good ice cream.',
		    face: 'img/mike.png'
		  }];

		  $scope.items = chats;

	})


})();