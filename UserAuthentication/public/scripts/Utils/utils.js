(function(friends){
	friends.utils.getUpcomingBirthday = function(date){
		var birthday = moment(date);
		var isAfter = birthday.year(moment().year()).isAfter(moment());
		if(!isAfter) birthday.add(1,'year');
		return birthday;
	}
})(window.friends);