(function () {
	angular.module("money-saving-challenge.filters", [])
	.filter('ordinal', function () {
		return function(input) {
	    	var s=["th","st","nd","rd"],
	    	v=input%100;
	    	return input+(s[(v-20)%10]||s[v]||s[0]);
	  	}
	})

	.filter('dateFormat', function () {
		return function(input) {
	    	return moment(new Date(input)).format("H:mm");
	  	}
	})

})();