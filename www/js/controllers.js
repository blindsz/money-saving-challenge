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

	.controller("HomeController", function ($scope, $ionicModal, ionicMaterialInk, $ionicPopup) {
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



		  	// $ionicModal.fromTemplateUrl('templates/home/add-savings.html', {
		   //      scope: $scope,
		   //      animation: 'slide-in-up'
		   //  }).then(function(modal) {
		   //      $scope.modal = modal;
		   //  });

		   //  $scope.openModal = function() {

		   //      $scope.modal.show();
		   //  };

		   //  $scope.closeModal = function() {
		   //  	$scope.modal.hide();
		   //  };
		   //  // Cleanup the modal when we're done with it
		   //  $scope.$on('$destroy', function() {
		   //      $scope.modal.remove();
		   //  });
		   //  
		   	$scope.showConfirm = function() {
				var confirmPopup = $ionicPopup.confirm({
			     	title: 'Consume Ice Cream',
			     	template: 'Are you sure you want to eat this ice cream sad sad asd asd as dasd?',
			     	buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
					    text: 'No',
					    type: 'button-default'
					  }, {
					    text: 'Yes',
					    type: 'button-positive',
					}]
			   	});

			   	confirmPopup.then(function(res) {
			     	if(res) {
			       		console.log('You are sure');
			     	} 
			     	else {
			       	console.log('You are not sure');
			     	}
			   	});
			};
	})


})();