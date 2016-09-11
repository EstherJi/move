
//获取绝对位置
function getPos(obj){
	var l = 0;
	var t = 0;
	
	while(obj)
	{
		l += obj.offsetLeft;
		t += obj.offsetTop;
		obj = obj.offsetParent;	
	}
	
	return {left:l, top:t};	
}

//接口继承方法
function inherit(p){
    if(p == null)
	{
        throw TypeError();          //p is a object, but can not be null
    }
    if(Object.create){
        return Object.create(p);    //if Object.create function existed, use it directly.
    }
    var t = typeof p;
    if(t != 'object' && t != 'function')
	{
        throw TypeError();
    }

    function f() {};
    f.prototype = p;
    return new f();
}

//接口抽象方法
function abstractmenthod(){throw new Error('abstract method');}

//人物接口
function Character(){throw new Error("can't instantiate abstract class")};
Character.prototype.goDown = abstractmenthod;
Character.prototype.goLeft = abstractmenthod;
Character.prototype.goRight = abstractmenthod;
Character.prototype.goLeftDown = abstractmenthod;
Character.prototype.goRightDown = abstractmenthod;

//元素移动屏幕跟着移动对象
function FollowScreen(obj){
	//单例  只能创建一个实例
	if(typeof(FollowScreen.unique) !== 'undefined')
	{
		return FollowScreen.unique; 
	}
	this.obj = obj;
	this.bTrue = true;	
	this.offsetTop = 0;
	FollowScreen.unique = this;	
}

//元素跟随屏幕移动方法
FollowScreen.prototype.followScreen = function(offsetTop){
	var This = this;
	var oTimer = null;
	clearInterval(oTimer);
	oTimer = setTimeout(function(){
		
		This.bTrue = true;
		//当前相比上一次所走的高度
		This.offsetTop = This.obj.offsetTop - offsetTop;
		//当前的页面的滚动高度
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		//元素处于窗口正中心点的高度
		var iWin = (document.documentElement.clientHeight - This.obj.offsetHeight) / 2;
		if(getPos(This.obj).top - scrollTop >= iWin && This.offsetTop > 0)
		{
			document.documentElement.scrollTop = document.body.scrollTop = scrollTop + This.offsetTop; 
		}
		else if(getPos(This.obj).top - scrollTop <= iWin && This.offsetTop < 0)
		{
			document.documentElement.scrollTop = document.body.scrollTop = scrollTop + This.offsetTop; 
		}
		window.onscroll = function()
		{

			if(!This.bTrue)
			{
				clearInterval(oTimer);	
			}
			This.bTrue = false;
		}
	}, 30);		
}

//绵羊对象
function Sheep(id){
	this.oSheep = document.getElementById(id).getElementsByTagName('img')[0];
	this.iActionCount = 0;
	this.oTimer = null;
}
Sheep.prototype.move = function(sDirection){
	var This = this;
	var name = '';
	if(sDirection){
		name = sDirection;
	}else{
		name = 'sheepL';
	}
	this.oTimer = setInterval(function(){
		This.iActionCount++;
		This.iActionCount %= 25;
		This.oSheep.src = '../201608/images/sheep/' + name + This.iActionCount + '.png';
	}, 100);
}

//弹窗对象
function Popup(id1 , id2){
	this.oPopup = document.getElementById(id1);	
	this.oBtn = document.getElementById(id2);
	this.oClose = this.oPopup.getElementsByClassName('close')[0];
	this.oBox = document.getElementById('pop-box');	
}

//显示弹窗
Popup.prototype.showPopup = function(){
	var This = this;
	this.oPopup.style.display = 'block';
	this.oBox.style.display = 'block';
}

//隐藏弹窗
Popup.prototype.hidePopup = function(){
	var This = this;
	This.oPopup.style.display = 'none';
	This.oBox.style.display = 'none';
}

//初始化弹窗
Popup.prototype.initializePop = function(){
	var This = this;
	this.oBtn.onclick = function(){
		This.showPopup();
	}
	this.oClose.onclick = function()
	{
		This.hidePopup();
	}
}

//问号对象
function Question(id){
	this.oQuestion = document.getElementById(id);
}

//显示问号
Question.prototype.showQuestion = function(){
	this.oQuestion.style.display = 'block';
}

//隐藏问号
Question.prototype.hideQuestion = function(){
	this.oQuestion.style.display = 'none';
}

//动画对象
function Cartoon(id){
	this.iActionCount = 0;
	this.oCartoon = document.getElementById(id);
	this.oTimer = null;	
	this.oTimer2 = null;	
	this.oFollow = new FollowScreen(this.oCartoon);
	this.bTure = true;
}
Cartoon.prototype = inherit(Character.prototype);
Cartoon.constructor = Cartoon;

//往下方走
Cartoon.prototype.goDown = function(iTop){
	var top = iTop || 2;
	var This = this;
	clearInterval(this.oTimer);
	this.oTimer = setInterval(function(){
		This.oFollow.followScreen(This.oCartoon.offsetTop);
		This.oCartoon.style.top = This.oCartoon.offsetTop + top + 'px';
	}, 30);
}

//动画往下方走
Cartoon.prototype.startGoDown = function(){
	var This = this;
	this.oTimer2 = setInterval(function(){
		This.iActionCount++;
		This.iActionCount %= 2;
		This.oCartoon.src = 'images/cartoon/down-' + This.iActionCount + '.png';
	}, 80);
}

//往左方走
Cartoon.prototype.goLeft = function(iLeft){
	var left = iLeft || 6;
	var This = this;
	clearInterval(this.oTimer);
	this.oTimer = setInterval(function(){
		This.oCartoon.style.left = This.oCartoon.offsetLeft - left + 'px';
	}, 30);
}

//动画往左方走
Cartoon.prototype.startGoLeft = function(){
	var This = this;
	this.oTimer2 = setInterval(function(){
		This.iActionCount++;
		This.iActionCount %= 3;
		This.oCartoon.src = 'images/cartoon/left-' + This.iActionCount + '.png';
	}, 80);
}

//往右方走
Cartoon.prototype.goRight = function(iLeft){
	var left = iLeft || 6;
	var This = this;
	clearInterval(this.oTimer);
	this.oTimer = setInterval(function(){
		This.oCartoon.style.left = This.oCartoon.offsetLeft + left + 'px';
	}, 30);
}

//动画往右方走
Cartoon.prototype.startGoRight = function(){
	var This = this;
	this.oTimer2 = setInterval(function(){
		This.iActionCount++;
		This.iActionCount %= 3;
		This.oCartoon.src = 'images/cartoon/right-' + This.iActionCount + '.png';
	}, 80);
}

//往左下方走
Cartoon.prototype.goLeftDown = function(iLeft, iTop){
	var left = iLeft || 3;
	var top = iTop || 2;
	var This = this;
	clearInterval(this.oTimer);
	this.oTimer = setInterval(function(){
		This.oFollow.followScreen(This.oCartoon.offsetTop);
		This.oCartoon.style.top = This.oCartoon.offsetTop + top + 'px';
		This.oCartoon.style.left = This.oCartoon.offsetLeft - left + 'px';
	}, 30);
}

//动画往左下方走
Cartoon.prototype.startGoLeftDown = function(){
	var This = this;
	this.oTimer2 = setInterval(function(){
		This.iActionCount++;
		This.iActionCount %= 2;
		This.oCartoon.src = 'images/cartoon/down-' + This.iActionCount + '.png';
	}, 80);
}

//往右下方走
Cartoon.prototype.goRightDown = function(iLeft, iTop){
	var left = iLeft || 3;
	var top = iTop || 2;
	var This = this;
	clearInterval(this.oTimer);
	this.oTimer = setInterval(function(){
		This.oFollow.followScreen(This.oCartoon.offsetTop);
		This.oCartoon.style.top = This.oCartoon.offsetTop + top + 'px';
		This.oCartoon.style.left = This.oCartoon.offsetLeft + left + 'px';
	}, 30);
}

//动画往左下方走
Cartoon.prototype.startGoRightDown = function(){
	var This = this;
	this.oTimer2 = setInterval(function(){
		This.iActionCount++;
		This.iActionCount %= 2;
		This.oCartoon.src = 'images/cartoon/down-' + This.iActionCount + '.png';
	}, 80);
}


//向A区走
Cartoon.prototype.goToFirstDistinct = function(oBtn){
	var This = this;
	this.startGoLeftDown();
	this.goLeftDown();
	var oTimer = null;
	oTimer = setInterval(function(){
		function restore()
		{
			clearInterval(This.oTimer);	
			clearInterval(This.oTimer2);
			clearInterval(oTimer);
			This.iActionCount = 0;
		}
		if(getPos(This.oCartoon).top >= 868 + 142)
		{
			restore();
			This.startGoRight();
			This.goRight();	
			oTimer = setInterval(function(){
				if(This.oCartoon.offsetLeft >= 266)
				{
					restore();
						This.startGoRight();
						This.goRight();
						oTimer = setInterval(function(){
							if(This.oCartoon.offsetLeft >= 515){
								restore();
								This.goToSecondDistinct();
							}
						}, 30);
				}
			},30);
		}
	},30);
}

//从B区出发
Cartoon.prototype.goToSecondDistinct = function(){
	var This = this;
	this.startGoRight();
	this.goRight();
	var oTimer = null;
	oTimer = setInterval(function(){
		function restore()
		{
			clearInterval(This.oTimer);	
			clearInterval(This.oTimer2);
			clearInterval(oTimer);
			This.iActionCount = 0;
		}
		if(This.oCartoon.offsetLeft >= 1080){
			restore();
			This.startGoRight();
			This.goRight();
			oTimer = setInterval(function(){
				if(This.oCartoon.offsetLeft >= 1200){
					restore();
					This.startGoDown();
					This.goDown();
					oTimer = setInterval(function(){
						if(getPos(This.oCartoon).top >= 1010 + 280){
							restore();
								This.startGoLeftDown();
								This.goLeftDown();
								oTimer = setInterval(function(){
									if(getPos(This.oCartoon).top >= 1010 + 360){
										restore();
										This.startGoLeft();
										This.goLeft();
										oTimer = setInterval(function(){
											if(This.oCartoon.offsetLeft <= 670){
												restore();
												This.goToThirdDistinct();
											}
										},30);
									}
								},30);
						}
					},30);
				}
			},30);
		}
	},30);
}

//从C区出发
Cartoon.prototype.goToThirdDistinct = function(){
	var This = this;
	this.startGoLeft();
	this.goLeft();
	var oTimer = null;
	oTimer = setInterval(function(){
		function restore()
		{
			clearInterval(This.oTimer);	
			clearInterval(This.oTimer2);
			clearInterval(oTimer);
			This.iActionCount = 0;
		}
		if(This.oCartoon.offsetLeft <= 340){
			restore();
			This.startGoLeft();
			This.goLeft();
			oTimer = setInterval(function(){
				if(This.oCartoon.offsetLeft <= 180){
					restore();
					This.startGoDown();
					This.goDown();
					oTimer = setInterval(function(){
						if(getPos(This.oCartoon).top >= 1370 + 300){
							restore();
							This.startGoRightDown();
							This.goRightDown();
							oTimer = setInterval(function(){
								if(This.oCartoon.offsetLeft >= 280){
									restore();
									This.startGoRight();
									This.goRight();
									oTimer = setInterval(function(){
										if(This.oCartoon.offsetLeft >= 630){
											restore();		
											This.startGoRight();
											This.goRight();
											oTimer = setInterval(function(){
												if(This.oCartoon.offsetLeft >= 1120){
													restore();
												}
											},30);
										}
									},30);
								}
							},30);
						}
					},30);
				}
			},30);
		}
	},30);
}

//控制对象
function Control(){
	this.oStart = document.getElementById('start');
	this.oTimer = null;
}

//初始化所有对象，方法
Control.prototype.start = function(){
	var This = this;
    This.oStart.disabled = false;
    //satrt
    This.oStart.onclick = function(){
   		oCartoon.goToFirstDistinct(this);
    }
}


//动画对象
var oCartoon = new Cartoon('cartoon');

//创建控制对象
var oControl = new Control();
//初始化所有对象，方法
oControl.start();

