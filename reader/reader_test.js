var observeReader = require("./reader");
var QUnit = require('steal-qunit');
var ObserveInfo = require('can-observe-info');

QUnit.module('can-observe-info/reader');



test("can.Compute.read can read a promise (#179)", function(){
	var data = {
		promise: new Promise(function(resolve){
			setTimeout(function(){
				resolve("Something");
			},2);
		})
	};
	var calls = 0;
	var c = new ObserveInfo(function(){
		return observeReader.read(data,observeReader.reads("promise.value")).value;
	}, null, {
		updater: function(newVal, oldVal){
			calls++;
			equal(calls, 1, "only one call");
			equal(newVal, "Something", "new value");
			equal(oldVal, undefined, "oldVal");
			start();
		}
	});
	c.getValueAndBind();

	stop();

});

test('can.compute.reads', function(){
	deepEqual( observeReader.reads("@foo"),
		[{key: "foo", at: true}]);

	deepEqual( observeReader.reads("@foo.bar"),
		[{key: "foo", at: true}, {key: "bar", at: false}]);

	deepEqual( observeReader.reads("@foo\\.bar"),
		[{key: "foo.bar", at: true}]);

	deepEqual( observeReader.reads("foo.bar@zed"),
		[{key: "foo", at: false},{key: "bar", at: false},{key: "zed", at: true}]);

});
