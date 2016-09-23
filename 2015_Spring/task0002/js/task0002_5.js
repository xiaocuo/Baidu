var m={
	getElement:	function(selector){
		var element;
		if (selector.search(/\s/)!=-1) { 
			//判断组合，然后选用不同方法
			//怎么判断？为他们计数。
			var arr=selector.split(" ");
		    var eleClass,eleTag,pos=null,tagNum=0,cNum=0,idNum=0;
		    var outer,inner;
		    for (var i = 0; i < arr.length; i++) {
		    	icon = arr[i].charAt(0);
		    	id = arr[i].substring(1);
		    	switch(icon){
		    		case ".":
			    		eleClass=document.getElementsByClassName(id);
			    		cNum+=1;
			    		break;
			    	case "#":
			    	    element=document.getElementById(id);
			    	    idNum+=1;
			    	    break;
			    	default:
			    	    eleTag=document.getElementsByTagName(arr[i]);
			    	    tagNum+=1;
			    	    break;
		    	}//switch
		    }//for
		    if (tagNum==0 && idNum==1) {
		    	outer=0;
		    	inner=eleClass;
		    }else if(tagNum==1 && idNum==0){
		    	outer=eleTag;
		    	inner=eleClass;
		    }else if(cNum==0){
		    	outer=0;
		    	inner=eleTag;
		    }else{
				var newarr=new Array();
				for (var i = 0; i < arr.length; i++) {
					newarr[i]=arr[i].substring(1);
				}
				element = document.getElementsByClassName(newarr.join(" "))[0];
			   return element;
		    }//if...else
		    
		    if (outer==0) {
		    	for (var i = 0; i < inner.length; i++) {
		    	if (inner[i]===element) {
		    		pos = i;
		    		break;
		    	}
		    }
		    }else{
		    	for (var i = 0; i < outer.length; i++) {
			    	for (var j = 0; j < inner.length; j++) {
			    		if (outer[i]===inner[j]) {
			    		pos = j ;
			    		break;
			    	}
			    	if (pos!=null) {
			    		break;
			    	}
		    	}//for
		    }//for
		    }//if  
		    return inner[pos];
		}else{
			var icon = selector.charAt(0);
			var id = selector.substring(1);
			switch(icon){
			case "#" : // 可以通过id获取DOM对象，通过#标示
	            element = document.getElementById(id); 
				break;
			case "." : // 可以通过样式名称获取DOM对象
				element = document.getElementsByClassName(id)[0];
				break;
			default:  // 可以通过tagName获取DOM对象 (不知道怎么表达第一个是字母)
				element = document.getElementsByTagName(selector)[0]; 
		} //switch
		return element;
		}//else
	},//getElement

	// 给一个element绑定一个针对event事件的响应，响应函数为listener
	on: function (selector,event,listener){
		var element=m.getElement(selector);
		if(element.addEventListener){
			element.addEventListener(event,listener,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+event,listener);
		}else{
			element["on"+event]=listener;
		}
	},//on

	//移除事件
	un: function (selector,event,listener){
		var element=m.getElement(selector);
		if(element.removeEventListener){
			element.removeEventListener(event,listener,false);
		}else if(element.dettachEvent){
			element.detachEvent("on"+event,listener);
		}else{
			element["on"+event]=null;
		}
	},//un

	// 实现对click事件的绑定
	click:	function (selector,listener){
			m.on(selector,"click",listener);
	},//click

	// 实现对于按Enter键时的事件绑定
	enter:	function (element,listener){
			m.on(element,"keyup",function(){
				if (event.keyCode==13) {
					listener();
				}
			});
	},//enter

	//事件代理
	delegate: function (element,tag,eventName,listener){
	m.on(element,eventName,function(){
		var event=event ? event : window.event,
	    target = event.target || event.srcElement,
	    tagName=target.nodeName.toLowerCase();
	    if (tagName==tag) { //为什么没有这句话的话，就说target未定义呢?
	    	listener(target);
	    }
	});	
	},//delegate

	//阻止默认行为
	preventDefault: function(element,eventName){
		m.on(element,eventName,function(){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue=false;
			}
		});
	},//preventDefault

}//m对象

function each(arr, fn) {
	var array = new Array();
    for (var i = 0; i < arr.length; i++) {
    	array[i] = fn(arr[i],i);
    }
    return array;
}


//拖动
window.onload=function(){
	//自定义放置目标
	m.preventDefault(".container1","dragenter");
	m.preventDefault(".container1","dragover");
	m.preventDefault(".container2","dragenter");
	m.preventDefault(".container2","dragover");
	//确定操作
	m.on(".container1","dragenter",function(){
		dataTransfer = event.dataTransfer;
		dataTransfer.dropEffect = "move";
		dataTransfer.effectAllowed = "move";
	});
	m.on(".container2","dragenter",function(){
		dataTransfer = event.dataTransfer;
		dataTransfer.dropEffect = "move";
		dataTransfer.effectAllowed = "move";
	});
	//先让box可以被拖动,且获得被拖动的元素。
	var boxes = document.getElementsByClassName("box");
	each(boxes,function(item,index){
		item.draggable = true;
		//移动时在原容器中消失
		item.addEventListener("dragend",function(){
			var event=event ? event : window.event,
		    target = event.target || event.srcElement;
		    target.style.display = "block"; 
		},false);
		item.addEventListener("drag",function(){
			var event=event ? event : window.event,
		    target = event.target[0] || event.srcElement;
			target.style.display = "none";
			//处理被拖动的元素
			m.on(".container1","drop",function(){
				m.getElement(".container1").appendChild(target);
			});
			m.on(".container2","drop",function(){
				m.getElement(".container2").appendChild(target);
			});
		},false);
	});//each;
}
//拖倒是能拖，但是会混乱，target太多