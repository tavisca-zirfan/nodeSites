window.friends.utils.Filter = new (function() {
    this.createFilter=function(filters,pgNo) {
        var filter = {
            filterProperties: filters,
            pageNo:pgNo
        }
        return filter;
    }
})();

function Filter(name,value) {
    this.name = name;
    this.value = value;
}