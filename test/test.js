console.log(Object.prototype.toString.call(function(){return 89;}));
function XX() {
  this.age = 23;
  this.name = 'eee';
  return (new Boolean());
}

XX.prototype.get = function () {
  return this.age;
}
XX.prototype.look = function () {
  return this.name;
}

var k = new XX();
console.log(k);