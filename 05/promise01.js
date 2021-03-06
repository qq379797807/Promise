/**
 * 不出意料，又要抛出问题了。当then注册的回调函数返回的是promise的时候，从这个then之后的所有then的注册函数
 * 都应该注册在新返回的promise上。直到遇到下一个回调函数的返回值也是promise。
 * 
 * 实现思路：
 * 在handle中判断注册函数返回的是否是promise。如果是的话,则resolve这个返回的promise的值，具体代码看一下36到38行
 * 
 */
function Promise(fn){
  this.status = 'pending';
  this.value= null;
  this.callbacks = [];
  var self = this;
  function resolve(newValue){
    self.value = newValue;
    self.status = 'fulfilled';
    setTimeout(function(){
      self.callbacks.map(function(cb){
          cb(value);
        })
    },0)
  }
  fn(resolve);
}


Promise.prototype = Object.create(null);
Promise.prototype.constructor = Promise;


Promise.prototype.then = function(onFulfilled){
  var self = this;
  var promise = new Promise(function(resolve){
    function handle(value){
      var res = typeof onFulfilled === 'function'?  onFulfilled(value) : value;
      if(res instanceof Promise){
        promise = res;
        resolve(res.value);
      }else {
        resolve(res);
      }
    }
    if(self.status==='pending'){
      self.callbacks.push(handle);
    }else if(self.status ==='fulfilled'){
      handle(self.value);
    }
  })
  return promise;
}

// 使用
var p = new Promise(function(resolve){
    resolve('这是响应的数据')
})

p.then(function(response){
  console.log(response);
  return new Promise(function(resolve){
    resolve('testtest')
  })
}).then(function(response){
  console.log(response);
  return 2;  
}).then(function(response){
  console.log(response);
})

setTimeout(function(){
   p.then(function(response){
     console.log('can i invoke?');
     return new Promise(function(resolve){
        resolve('hhhhhh')
      })
   }).then(function(response){
     console.log(response);
   })
},1000)